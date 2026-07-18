import { Router } from "express";
import path from "path";
import fs from "fs";
import { getDb } from "../db";
import { authMiddleware } from "../middleware/auth";
import { updateProfileSchema } from "../validation";
const router = Router();
router.use(authMiddleware);
router.get("/", (req, res) => {
    const db = getDb();
    const user = db
        .query("SELECT id, name, email, phone, location, avatar, createdAt FROM users WHERE id = ?")
        .get(req.userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const orders = db
        .query("SELECT * FROM orders WHERE user_id = ? ORDER BY createdAt DESC")
        .all(req.userId);
    const parsedOrders = orders.map((o) => ({
        ...o,
        items: JSON.parse(o.items),
    }));
    const stickersCollected = parsedOrders.reduce((sum, o) => sum +
        o.items.reduce((s, i) => s + i.quantity, 0), 0);
    const likedProductIds = db
        .query("SELECT product_id FROM likes WHERE user_id = ? ORDER BY createdAt DESC")
        .all(req.userId);
    res.json({
        user,
        stats: {
            ordersPlaced: orders.length,
            stickersCollected,
            savedForLater: likedProductIds.length,
        },
        orders: parsedOrders,
        likedProductIds: likedProductIds.map((r) => r.product_id),
    });
});
router.put("/", (req, res) => {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
        const first = parsed.error.issues[0]?.message || "Invalid input";
        res.status(400).json({ error: first });
        return;
    }
    const { name, phone, location, avatar } = parsed.data;
    const fields = [];
    const values = [];
    if (name !== undefined) {
        fields.push("name = ?");
        values.push(name);
    }
    if (phone !== undefined) {
        fields.push("phone = ?");
        values.push(phone);
    }
    if (location !== undefined) {
        fields.push("location = ?");
        values.push(location);
    }
    if (avatar !== undefined) {
        fields.push("avatar = ?");
        values.push(avatar);
    }
    if (fields.length === 0) {
        res.status(400).json({ error: "Nothing to update" });
        return;
    }
    const db = getDb();
    db.run(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, [...values, req.userId]);
    const user = db
        .query("SELECT id, name, email, phone, location, avatar, createdAt FROM users WHERE id = ?")
        .get(req.userId);
    res.json(user);
});
router.delete("/", (req, res) => {
    const db = getDb();
    const userId = req.userId;
    const user = db
        .query("SELECT avatar FROM users WHERE id = ?")
        .get(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const deleteTx = db.transaction(() => {
        db.run("DELETE FROM likes WHERE user_id = ?", [userId]);
        db.run("DELETE FROM orders WHERE user_id = ?", [userId]);
        db.run("DELETE FROM users WHERE id = ?", [userId]);
    });
    deleteTx();
    if (user.avatar) {
        try {
            const filepath = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public", user.avatar);
            if (fs.existsSync(filepath))
                fs.unlinkSync(filepath);
        }
        catch { }
    }
    res.json({ message: "Account deleted" });
});
export default router;
