import { Router, Response } from "express"
import { getDb } from "../db"
import { authMiddleware, AuthRequest } from "../middleware/auth"

const router = Router()

router.post("/", authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb()
  const { items, total, customerAddress } = req.body as {
    items: { productId: string; name: string; price: number; quantity: number }[]
    total: number
    customerAddress?: string
  }

  if (!items?.length || total == null) {
    res.status(400).json({ error: "Missing required fields" })
    return
  }

  const result = db
    .query(
      `INSERT INTO orders (items, total, customerName, customerEmail, customerAddress, user_id)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
    )
    .run(
      JSON.stringify(items),
      total,
      req.userName!,
      req.userEmail!,
      customerAddress || "",
      req.userId!,
    )

  res.status(201).json({
    id: Number(result.lastInsertRowid),
    message: "Order placed successfully",
  })
})

router.get("/", (_req, res) => {
  const db = getDb()
  const orders = db
    .query("SELECT * FROM orders ORDER BY createdAt DESC")
    .all()
  res.json(orders)
})

export default router
