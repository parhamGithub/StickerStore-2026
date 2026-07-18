"use client"

import { useEffect, type ReactNode } from "react"
import { Provider } from "react-redux"
import { store } from "./store"
import { hydrateCart } from "./features/cart-slice"

const STORAGE_KEY = "stickerly-cart"

export function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          store.dispatch(hydrateCart(parsed))
        }
      }
    } catch {}
  }, [])

  return <Provider store={store}>{children}</Provider>
}
