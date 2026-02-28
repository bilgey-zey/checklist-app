import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import pool from "./db.js";

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
    return res.status(401).json({ message: "Not authenticated" });
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
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: "User already exists" });
  }
});

/*
LOGIN
*/
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ userId: user.id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
GET USER CHECKLISTS
*/
app.get("/api/checklists", simpleAuth, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM checklists WHERE owner_id = $1",
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
    "DELETE FROM checklists WHERE id = $1 AND owner_id = $2",
    [req.params.id, req.userId]
  );

  res.json({ message: "Deleted" });
});


/*
UPDATE CHECKLIST TITLE
*/
app.put("/api/checklists/:id", simpleAuth, async (req, res) => {
  const { title } = req.body;

  try {
    const result = await pool.query(
      "UPDATE checklists SET title = $1 WHERE id = $2 AND owner_id = $3 RETURNING *",
      [title, req.params.id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/*
TOGGLE COMPLETE
*/
app.patch("/api/checklists/:id/complete", simpleAuth, async (req, res) => {
  try {
    await pool.query(
      "UPDATE checklists SET completed = NOT completed WHERE id = $1 AND owner_id = $2",
      [req.params.id, req.userId]
    );

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "Toggle failed" });
  }
});

/*
SHARE ALL USER CHECKLISTS
*/
app.post("/api/share-all", simpleAuth, async (req, res) => {
  const { email } = req.body;

  try {
    // Paylaşılacak kullanıcıyı bul
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
  return res.status(400).json({
    message: "The user must be registered in the application to share this checklist."
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

    res.json({ message: "All checklists shared successfully" });

  } catch (err) {
    res.status(500).json({ message: "Share failed" });
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
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(result.rows[0]);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});