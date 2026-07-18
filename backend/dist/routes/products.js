import { Router } from "express";
import { getDb } from "../db";
const router = Router();
router.get("/", (_req, res) => {
    const { category } = _req.query;
    const db = getDb();
    if (category && category !== "all") {
        const products = db
            .query("SELECT * FROM products WHERE category = ?1")
            .all(category);
        res.json(products);
    }
    else {
        const products = db.query("SELECT * FROM products").all();
        res.json(products);
    }
});
router.get("/:id", (req, res) => {
    const db = getDb();
    const product = db
        .query("SELECT * FROM products WHERE id = ?1")
        .get(req.params.id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    res.json(product);
});
export default router;
