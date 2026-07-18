import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "sticker-store-dev-secret-key"

export interface AuthRequest extends Request {
  userId?: string
  userEmail?: string
  userName?: string
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid token" })
    return
  }

  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as {
      userId: string
      email: string
      name: string
    }
    req.userId = payload.userId
    req.userEmail = payload.email
    req.userName = payload.name
    next()
  } catch {
    res.status(401).json({ error: "Invalid or expired token" })
  }
}
