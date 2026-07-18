"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  selectCartItems,
  selectTotalPrice,
  removeItem,
  updateQuantity,
  clearCart,
} from "@/lib/features/cart-slice"

export default function CartPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const totalPrice = useAppSelector(selectTotalPrice)
  const [submitting, setSubmitting] = useState(false)

  async function handleCheckout() {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please sign in to checkout")
      router.push("/signin")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
          total: totalPrice,
        }),
      })
      if (!res.ok) throw new Error("Order failed")
      const data = await res.json()
      toast.success(`Order placed! Order #${data.id}`)
      dispatch(clearCart())
    } catch {
      toast.error("Checkout failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-[960px] flex-col px-4 py-8 md:px-8 lg:px-16 lg:py-12">
      <Link
        href="/"
        className="mb-6 md:mb-8 font-nunito text-[14px] md:text-[15px] font-semibold text-brand no-underline hover:underline"
      >
        ← Back to shop
      </Link>

      <h1 className="font-fredoka text-[28px] md:text-[32px] font-bold text-foreground">
        Cart
      </h1>

      {items.length === 0 ? (
        <div className="mt-12 md:mt-16 flex flex-col items-center gap-4">
          <p className="font-nunito text-[15px] md:text-[17px] text-brand-muted">
            Your cart is empty.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-white no-underline shadow-brand hover:brightness-110"
          >
            Browse stickers
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 md:mt-8 flex flex-col gap-3 md:gap-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 rounded-2xl border border-foreground/10 bg-card p-4 md:p-5"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div
                    className="flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: item.product.bgColor }}
                  >
                    <div className="h-6 w-6 md:h-7.5 md:w-7.5 rounded-full bg-white/40" />
                  </div>

                  <div className="flex flex-1 flex-col gap-0.5 md:gap-1">
                    <span className="font-fredoka text-[15px] md:text-[16px] font-semibold text-foreground">
                      {item.product.name}
                    </span>
                    <span className="font-nunito text-[12px] md:text-[13px] text-brand-muted">
                      {item.product.material} · {item.product.size}
                    </span>
                    <span className="font-nunito text-[14px] md:text-[15px] font-bold text-brand">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-2 md:gap-3">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product.id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                      className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full border border-foreground/20 font-nunito text-[15px] md:text-[16px] text-foreground transition-colors hover:bg-foreground/5"
                    >
                      −
                    </button>
                    <span className="w-5 md:w-6 text-center font-nunito text-[14px] md:text-[15px] font-semibold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product.id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full border border-foreground/20 font-nunito text-[15px] md:text-[16px] text-foreground transition-colors hover:bg-foreground/5"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => dispatch(removeItem(item.product.id))}
                    className="font-nunito text-[12px] md:text-[13px] font-semibold text-brand-muted transition-colors hover:text-brand"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 md:mt-8 flex flex-col items-end gap-3 md:gap-4 border-t border-foreground/10 pt-5 md:pt-6">
            <div className="flex items-center gap-4 md:gap-6">
              <span className="font-nunito text-[16px] md:text-[18px] text-foreground">
                Total
              </span>
              <span className="font-fredoka text-[24px] md:text-[28px] font-bold text-foreground">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => dispatch(clearCart())}
                className="rounded-full border border-foreground/20 px-5 md:px-6 py-2.5 md:py-3 font-nunito text-[13px] md:text-[14px] font-semibold text-brand-muted transition-colors hover:bg-foreground/5"
              >
                Clear cart
              </button>
              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="rounded-full bg-brand px-6 md:px-8 py-2.5 md:py-3 font-nunito text-[14px] md:text-[15px] font-bold text-white shadow-brand transition-all hover:brightness-110 disabled:opacity-50"
              >
                {submitting ? "Placing order..." : "Checkout"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
