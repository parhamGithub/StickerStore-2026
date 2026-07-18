import { Router } from "express";
import jwt from "jsonwebtoken";
import { getDb } from "../db";
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "sticker-store-dev-secret-key";
router.post("/signup", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        res.status(400).json({ error: "Name, email, and password are required" });
        return;
    }
    const db = getDb();
    const existing = db
        .query("SELECT id FROM users WHERE email = ?")
        .get(email);
    if (existing) {
        res.status(409).json({ error: "Email already registered" });
        return;
    }
    const hashedPassword = await Bun.password.hash(password);
    const id = crypto.randomUUID();
    db.run("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)", [id, name, email, hashedPassword]);
    const token = jwt.sign({ userId: id, email }, JWT_SECRET, {
        expiresIn: "7d",
    });
    res.status(201).json({ token, user: { id, name, email } });
});
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }
    const db = getDb();
    const user = db
        .query("SELECT * FROM users WHERE email = ?")
        .get(email);
    if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    const valid = await Bun.password.verify(password, user.password);
    if (!valid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});
export default router;
