import { Router } from "express";
import { getDb } from "../db";
const router = Router();
router.post("/", (req, res) => {
    const db = getDb();
    const { items, total, customerName, customerEmail, customerAddress } = req.body;
    if (!items?.length ||
        total == null ||
        !customerName ||
        !customerEmail ||
        !customerAddress) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    const result = db
        .query(`INSERT INTO orders (items, total, customerName, customerEmail, customerAddress)
       VALUES (?1, ?2, ?3, ?4, ?5)`)
        .run(JSON.stringify(items), total, customerName, customerEmail, customerAddress);
    res.status(201).json({
        id: Number(result.lastInsertRowid),
        message: "Order placed successfully",
    });
});
router.get("/", (_req, res) => {
    const db = getDb();
    const orders = db
        .query("SELECT * FROM orders ORDER BY createdAt DESC")
        .all();
    res.json(orders);
});
export default router;
