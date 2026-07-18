import { Router } from "express";
import { getDb } from "../db";
const router = Router();
router.get("/", (_req, res) => {
    const db = getDb();
    const categories = db.query("SELECT * FROM categories ORDER BY id").all();
    res.json(categories);
});
export default router;
