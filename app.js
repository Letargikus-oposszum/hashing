import express from "express";
import cors from "cors";
import * as db from "./db/db.js";
import bcrypt from "bcrypt";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
  const users = db.getUsers();
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found!" });
  }
  res.json(user);
});

app.post("/users", async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    res.status(400).json({ message: "Invalid data" });
  }
  const salt = await bcrypt.genSalt();
  const hashedPw = await bcrypt.hash(password, salt);
  const saved = db.saveUser(email, hashedPw);

  const user = db.getUserById(saved.lastInsertRowid);

  res.json(user);
});

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
