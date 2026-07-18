import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "@/types/product"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const STORAGE_KEY = "stickerly-cart"

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

const initialState: CartState = {
  items: typeof window === "undefined" ? [] : loadCart(),
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const existing = state.items.find(
        (item) => item.product.id === action.payload.id
      )
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ product: action.payload, quantity: 1 })
      }
      saveCart(state.items)
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      )
      saveCart(state.items)
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const { productId, quantity } = action.payload
      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => item.product.id !== productId
        )
      } else {
        const item = state.items.find(
          (item) => item.product.id === productId
        )
        if (item) item.quantity = quantity
      }
      saveCart(state.items)
    },
    clearCart(state) {
      state.items = []
      saveCart(state.items)
    },
    hydrateCart(_state, action: PayloadAction<CartItem[]>) {
      return { items: action.payload }
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart, hydrateCart } =
  cartSlice.actions

export const selectCartItems = (state: { cart: CartState }) => state.cart.items
export const selectTotalItems = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectTotalPrice = (state: { cart: CartState }) =>
  Number(
    state.cart.items
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      .toFixed(2)
  )

export default cartSlice.reducer
