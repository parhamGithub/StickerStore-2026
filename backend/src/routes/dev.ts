import { Router } from "express"
import { getDb } from "../db"

const router = Router()

router.get("/users", (_req, res) => {
  const db = getDb()
  const users = db
    .query("SELECT id, name, email, createdAt FROM users ORDER BY createdAt DESC")
    .all()
  res.json(users)
})

export default router
