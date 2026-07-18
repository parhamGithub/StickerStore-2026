import { Router } from "express";
import { getDb } from "../db";
import { authMiddleware } from "../middleware/auth";
import { toggleLikeSchema } from "../validation";
const router = Router();
router.use(authMiddleware);
router.get("/", (req, res) => {
    const db = getDb();
    const rows = db
        .query("SELECT product_id, createdAt FROM likes WHERE user_id = ? ORDER BY createdAt DESC")
        .all(req.userId);
    res.json(rows.map((r) => r.product_id));
});
router.post("/", (req, res) => {
    const parsed = toggleLikeSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid input" });
        return;
    }
    const { productId } = parsed.data;
    const db = getDb();
    const existing = db
        .query("SELECT 1 FROM likes WHERE user_id = ? AND product_id = ?")
        .get(req.userId, productId);
    if (existing) {
        db.run("DELETE FROM likes WHERE user_id = ? AND product_id = ?", [
            req.userId,
            productId,
        ]);
        res.json({ liked: false });
    }
    else {
        db.run("INSERT INTO likes (user_id, product_id) VALUES (?, ?)", [req.userId, productId]);
        res.json({ liked: true });
    }
});
export default router;
