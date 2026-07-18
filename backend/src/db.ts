import { Database } from "bun:sqlite"
import path from "path"
import fs from "fs"

const DB_PATH = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "data",
  "store.db",
)

let db: Database

export function getDb(): Database {
  if (!db) {
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    db = new Database(DB_PATH)
    db.run("PRAGMA journal_mode = WAL")
    db.run("PRAGMA foreign_keys = ON")
    initSchema()
    seedIfEmpty()
  }
  return db
}

function initSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      material TEXT NOT NULL DEFAULT 'Waterproof vinyl',
      size TEXT NOT NULL DEFAULT '3in',
      bgColor TEXT NOT NULL DEFAULT '#ffc93c',
      rotation TEXT NOT NULL DEFAULT '0deg',
      image TEXT NOT NULL,
      badge TEXT
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      location TEXT,
      avatar TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT REFERENCES users(id),
      items TEXT NOT NULL,
      total REAL NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      customerAddress TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id TEXT NOT NULL REFERENCES users(id),
      product_id TEXT NOT NULL REFERENCES products(id),
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, product_id)
    )
  `)
}

function seedIfEmpty() {
  const row = db.query("SELECT COUNT(*) as count FROM products").get() as {
    count: number
  }

  if (row.count === 0) {
    const insertProduct = db.query(`
      INSERT INTO products (id, name, category, price, material, size, bgColor, rotation, image, badge)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
    `)

    const insertCategory = db.query(`
      INSERT INTO categories (id, label) VALUES (?1, ?2)
    `)

    const products = [
      { id: "star-buddy", name: "Star Buddy", category: "new", price: 3.5, material: "Waterproof vinyl", size: "3in", bgColor: "#ffc93c", rotation: "3deg", image: "/images/Stickers/Sticker Store/StickerArt.svg", badge: "Bestseller" },
      { id: "sunny", name: "Sunny", category: "quotes", price: 3.5, material: "Waterproof vinyl", size: "3in", bgColor: "#2ec4b6", rotation: "-2deg", image: "/images/Stickers/Sticker Store/StickerArt-1.svg" },
      { id: "herb", name: "Herb", category: "plants", price: 4.0, material: "Waterproof vinyl", size: "3in", bgColor: "#6bc75a", rotation: "2deg", image: "/images/Stickers/Sticker Store/StickerArt-2.svg" },
      { id: "bloom", name: "Bloom", category: "animals", price: 3.5, material: "Waterproof vinyl", size: "3in", bgColor: "#ff3d8b", rotation: "-3deg", image: "/images/Stickers/Sticker Store/StickerArt-3.svg" },
      { id: "cosmo", name: "Cosmo", category: "space", price: 4.0, material: "Waterproof vinyl", size: "3in", bgColor: "#7b5cfc", rotation: "-3deg", image: "/images/Stickers/Sticker Store/StickerArt-4.svg" },
      { id: "ember", name: "Ember", category: "retro", price: 3.5, material: "Waterproof vinyl", size: "3in", bgColor: "#ff5b39", rotation: "2deg", image: "/images/Stickers/Sticker Store/StickerArt-5.svg" },
      { id: "clover", name: "Clover", category: "plants", price: 3.5, material: "Waterproof vinyl", size: "3in", bgColor: "#ffc93c", rotation: "-2deg", image: "/images/Stickers/Sticker Store/StickerArt-6.svg" },
      { id: "misty", name: "Misty", category: "food", price: 4.0, material: "Waterproof vinyl", size: "3in", bgColor: "#2ec4b6", rotation: "3deg", image: "/images/Stickers/Sticker Store/StickerArt-7.svg" },
    ]

    const categories = [
      { id: "all", label: "All" },
      { id: "animals", label: "🐾 Animals" },
      { id: "food", label: "🍩 Food" },
      { id: "space", label: "🚀 Space" },
      { id: "plants", label: "🌵 Plants" },
      { id: "quotes", label: "💬 Quotes" },
      { id: "retro", label: "📼 Retro" },
      { id: "new", label: "✨ New" },
    ]

    const seedTx = db.transaction(() => {
      for (const p of products) {
        insertProduct.run(
          p.id, p.name, p.category, p.price,
          p.material, p.size, p.bgColor, p.rotation, p.image,
          p.badge ?? null,
        )
      }
      for (const c of categories) {
        insertCategory.run(c.id, c.label)
      }
    })
    seedTx()

    console.log("Database seeded with products and categories.")
  }
}
