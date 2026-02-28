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


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
