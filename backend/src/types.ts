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
  badge?: string
}

export interface CategoryItem {
  id: Category
  label: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface OrderInput {
  items: OrderItem[]
  total: number
  customerName: string
  customerEmail: string
  customerAddress: string
}

export interface Order extends OrderInput {
  id: number
  createdAt: string
}
