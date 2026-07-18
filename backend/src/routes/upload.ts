import { Router, Response } from "express"
import path from "path"
import fs from "fs"
import { authMiddleware, AuthRequest } from "../middleware/auth"

const router = Router()
router.use(authMiddleware)

const UPLOAD_DIR = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "public",
  "avatars",
)

router.post("/", async (req: AuthRequest, res: Response) => {
  const contentType = req.headers["content-type"]
  if (!contentType?.startsWith("image/")) {
    res.status(400).json({ error: "Only image files are allowed" })
    return
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }

  const ext = contentType.split("/").pop() || "png"
  const filename = `${req.userId}-${Date.now()}.${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  const buffer = Buffer.concat(chunks)

  if (buffer.length > 5 * 1024 * 1024) {
    res.status(400).json({ error: "File too large. Max 5MB." })
    return
  }

  fs.writeFileSync(filepath, buffer)

  const url = `/avatars/${filename}`
  res.json({ url })
})

export default router
