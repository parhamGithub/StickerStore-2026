export type Category =
  | "all"
  | "animals"
  | "food"
  | "space"
  | "plants"
  | "quotes"
  | "retro"
  | "new"

export interface Product {
  id: string
  name: string
  category: Category
  price: number
  material: string
  size: string
  bgColor: string
  rotation: string
  image: string
  badge?: "Bestseller" | "New"
}
