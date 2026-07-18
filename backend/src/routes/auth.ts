import { Router, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { getDb } from "../db"
import { signupSchema, signinSchema } from "../validation"

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || "sticker-store-dev-secret-key"

router.post("/signup", async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "Invalid input"
    res.status(400).json({ error: first })
    return
  }

  const { email, password, name } = parsed.data
  const db = getDb()

  const existing = db
    .query("SELECT id FROM users WHERE email = ?")
    .get(email) as { id: string } | undefined

  if (existing) {
    res.status(409).json({ error: "Email already registered" })
    return
  }

  const hashedPassword = await Bun.password.hash(password)
  const id = crypto.randomUUID()

  db.run(
    "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
    [id, name, email, hashedPassword],
  )

  const token = jwt.sign({ userId: id, email, name }, JWT_SECRET, {
    expiresIn: "7d",
  })

  res.status(201).json({ token, user: { id, name, email } })
})

router.post("/signin", async (req: Request, res: Response) => {
  const parsed = signinSchema.safeParse(req.body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "Invalid input"
    res.status(400).json({ error: first })
    return
  }

  const { email, password } = parsed.data
  const db = getDb()

  const user = db
    .query("SELECT * FROM users WHERE email = ?")
    .get(email) as
    | { id: string; name: string; email: string; password: string }
    | undefined

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" })
    return
  }

  const valid = await Bun.password.verify(password, user.password)
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" })
    return
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" },
  )

  res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
})

export default router
