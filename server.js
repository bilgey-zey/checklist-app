import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import pool from "./db.js";

const messages = {
  en: {
    emailPasswordRequired: "Email and password required",
    userExists: "User already exists",
    invalidCredentials: "Invalid credentials",
    serverError: "Server error",
    notAuthenticated: "Not authenticated",
    deleted: "Deleted",
    userMustBeRegistered: "The user must be registered in the application to share this checklist.",
    notAllowed: "Not allowed",
    updateFailed: "Update failed",
    toggleFailed: "Toggle failed",
    shareFailed: "Share failed",
    accessDenied: "Access denied",
    allShared: "All checklists shared successfully",
    updated: "Updated",
    emailRequired: "Email required"
  },
  tr: {
    emailPasswordRequired: "E-posta ve şifre gerekli",
    userExists: "Bu kullanıcı zaten kayıtlı",
    invalidCredentials: "E-posta veya şifre hatalı",
    serverError: "Sunucu hatası",
    notAuthenticated: "Oturum açılmadı",
    deleted: "Silindi",
    userMustBeRegistered: "Bu checklisti paylaşmak için kullanıcı uygulamada kayıtlı olmalıdır.",
    notAllowed: "İzin yok",
    updateFailed: "Güncelleme başarısız",
    toggleFailed: "Durum değiştirilemedi",
    shareFailed: "Paylaşım başarısız",
    accessDenied: "Erişim reddedildi",
    allShared: "Tüm checklistler başarıyla paylaşıldı",
    updated: "Güncellendi",
    emailRequired: "E-posta gerekli"
  },
  no: {
    emailPasswordRequired: "E-post og passord er påkrevd",
    userExists: "Brukeren finnes allerede",
    invalidCredentials: "Ugyldige brukernavn eller passord",
    serverError: "Serverfeil",
    notAuthenticated: "Ikke autentisert",
    deleted: "Slettet",
    userMustBeRegistered: "Brukeren må være registrert i applikasjonen for å dele denne sjekklisten.",
    notAllowed: "Ikke tillatt",
    updateFailed: "Oppdatering feilet",
    toggleFailed: "Veksling feilet",
    shareFailed: "Deling feilet",
    accessDenied: "Ingen tilgang",
    allShared: "Alle sjekklister delt",
    updated: "Oppdatert",
    emailRequired: "E-post er påkrevd"
  }
};

function getLang(req) {
  const header = (req.headers["accept-language"] || "en").toLowerCase();
  if (header.startsWith("tr")) return "tr";
  if (header.startsWith("no") || header.startsWith("nb") || header.startsWith("nn")) {
    return "no";
  }
  return "en";
}

function msg(req, key) {
  const lang = getLang(req);
  return messages[lang][key] || messages.en[key];
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("frontend")); // frontend servis

/*
AUTH MIDDLEWARE
*/
function simpleAuth(req, res, next) {
  const userId = req.headers["user-id"];

  if (!userId) {
    return res.status(401).json({ message: msg(req, "notAuthenticated") });
  }

  req.userId = parseInt(userId);
  next();
}

/*
REGISTER
*/
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: msg(req, "emailPasswordRequired") });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: msg(req, "userExists") });
  }
});

/*
LOGIN
*/
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: msg(req, "emailPasswordRequired") });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: msg(req, "invalidCredentials") });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: msg(req, "invalidCredentials") });
    }

    res.json({ userId: user.id });
  } catch (error) {
    res.status(500).json({ message: msg(req, "serverError") });
  }
});

/*
GET USER CHECKLISTS
*/
app.get("/api/checklists", simpleAuth, async (req, res) => {
  const result = await pool.query(
    `
    SELECT DISTINCT c.*
    FROM checklists c
    LEFT JOIN shared_checklists s ON c.id = s.checklist_id
    WHERE c.owner_id = $1 OR s.user_id = $1
    ORDER BY c.id
    `,
    [req.userId]
  );

  res.json(result.rows);
});

/*
CREATE CHECKLIST
*/
app.post("/api/checklists", simpleAuth, async (req, res) => {
  const { title } = req.body;

  const result = await pool.query(
    "INSERT INTO checklists (title, owner_id) VALUES ($1, $2) RETURNING *",
    [title, req.userId]
  );

  res.json(result.rows[0]);
});

app.delete("/api/checklists/:id", simpleAuth, async (req, res) => {
  await pool.query(
    `
    DELETE FROM checklists
    WHERE id = $1
      AND (
        owner_id = $2
        OR EXISTS (
          SELECT 1 FROM shared_checklists s
          WHERE s.checklist_id = $1 AND s.user_id = $2
        )
      )
    `,
    [req.params.id, req.userId]
  );

  res.json({ message: msg(req, "deleted") });
});


/*
UPDATE CHECKLIST TITLE
*/
app.put("/api/checklists/:id", simpleAuth, async (req, res) => {
  const { title } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE checklists
      SET title = $1
      WHERE id = $2
        AND (
          owner_id = $3
          OR EXISTS (
            SELECT 1 FROM shared_checklists s
            WHERE s.checklist_id = $2 AND s.user_id = $3
          )
        )
      RETURNING *
      `,
      [title, req.params.id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ message: msg(req, "notAllowed") });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: msg(req, "updateFailed") });
  }
});

/*
TOGGLE COMPLETE
*/
app.patch("/api/checklists/:id/complete", simpleAuth, async (req, res) => {
  try {
    await pool.query(
      `
      UPDATE checklists
      SET completed = NOT completed
      WHERE id = $1
        AND (
          owner_id = $2
          OR EXISTS (
            SELECT 1 FROM shared_checklists s
            WHERE s.checklist_id = $1 AND s.user_id = $2
          )
        )
      `,
      [req.params.id, req.userId]
    );

    res.json({ message: msg(req, "updated") });
  } catch (err) {
    res.status(500).json({ message: msg(req, "toggleFailed") });
  }
});

/*
SHARE ALL USER CHECKLISTS
*/
app.post("/api/share-all", simpleAuth, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: msg(req, "emailRequired") });
  }

  try {
    // Paylaşılacak kullanıcıyı bul
    const userResult = await pool.query(
      "SELECT id FROM users WHERE TRIM(LOWER(email)) = TRIM(LOWER($1))",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        message: msg(req, "userMustBeRegistered")
      });
    }


    const targetUserId = userResult.rows[0].id;

    // Bu kullanıcının tüm checklistlerini al
    const checklists = await pool.query(
      "SELECT id FROM checklists WHERE owner_id = $1",
      [req.userId]
    );

    for (let checklist of checklists.rows) {
      await pool.query(
        "INSERT INTO shared_checklists (checklist_id, user_id) VALUES ($1, $2)",
        [checklist.id, targetUserId]
      );
    }

    res.json({ message: msg(req, "allShared") });

  } catch (err) {
    res.status(500).json({ message: msg(req, "shareFailed") });
  }
});



/* TEST SHARE ALL ROUTE 
app.post("/api/share-all", simpleAuth, async (req, res) => {
  console.log("SHARE ALL ROUTE HIT");
  res.json({ message: "Test OK" });
});
*/

app.get("/api/checklists/:id", simpleAuth, async (req, res) => {
  const checklistId = req.params.id;

  const result = await pool.query(`
    SELECT c.* FROM checklists c
    LEFT JOIN shared_checklists s ON c.id = s.checklist_id
    WHERE c.id = $1
    AND (c.owner_id = $2 OR s.user_id = $2)
  `, [checklistId, req.userId]);

  if (result.rows.length === 0) {
    return res.status(403).json({ message: msg(req, "accessDenied") });
  }

  res.json(result.rows[0]);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
