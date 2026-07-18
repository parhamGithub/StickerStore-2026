import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "sticker-store-dev-secret-key";
export function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Missing or invalid token" });
        return;
    }
    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET);
        req.userId = payload.userId;
        req.userEmail = payload.email;
        req.userName = payload.name;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}
