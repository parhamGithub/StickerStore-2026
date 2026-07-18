import { Router } from "express"
import { getDb } from "../db"

const router = Router()

router.get("/", (_req, res) => {
  const { category, q } = _req.query as { category?: string; q?: string }
  const db = getDb()

  let sql = "SELECT * FROM products WHERE 1=1"
  const params: string[] = []

  if (category && category !== "all") {
    sql += " AND category = ?"
    params.push(category)
  }

  if (q) {
    sql += " AND (LOWER(name) LIKE ? OR LOWER(category) LIKE ?)"
    params.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`)
  }

  const products = db.query(sql).all(...params)
  res.json(products)
})

router.get("/:id", (req, res) => {
  const db = getDb()
  const product = db
    .query("SELECT * FROM products WHERE id = ?1")
    .get(req.params.id)

  if (!product) {
    res.status(404).json({ error: "Product not found" })
    return
  }

  res.json(product)
})

export default router
