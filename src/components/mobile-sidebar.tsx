"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "@/lib/hooks"
import { selectTotalItems } from "@/lib/features/cart-slice"
import { useHydrated } from "@/lib/use-hydrated"
import { useGetCategoriesQuery } from "@/lib/features/products-api-slice"

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
  onOpen: () => void
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Packs", href: "#" },
  { label: "Bundles", href: "#" },
  { label: "About", href: "#" },
]

export default function MobileSidebar({ open, onClose, onOpen }: MobileSidebarProps) {
  const hydrated = useHydrated()
  const totalItems = useAppSelector(selectTotalItems)
  const { data: categories = [] } = useGetCategoriesQuery()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (open) return
      const startX = touchStartX.current
      if (startX > 30) return
      const dx = e.touches[0].clientX - startX
      if (dx > 50) {
        onOpen()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [open, onClose, onOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 flex h-dvh w-80 max-w-[85vw] flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex h-18.75 shrink-0 items-center justify-between border-b border-foreground/20 px-5">
          <Link href="/" className="flex items-center gap-2 no-underline" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <ellipse cx="8" cy="8" rx="7.9" ry="7.9" className="fill-coral" />
            </svg>
            <span className="font-fredoka text-[22px] font-bold leading-none text-foreground">
              stickerly
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-foreground/60 transition-colors hover:text-foreground"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="shrink-0 px-5 pb-2 pt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const q = searchQuery.trim()
              if (q) {
                router.push(`/?q=${encodeURIComponent(q)}`)
                onClose()
                setSearchQuery("")
              }
            }}
          >
            <div className="flex items-center gap-2 rounded-xl border border-foreground/20 bg-white px-4 py-2.5">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0 text-foreground/40">
                <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stickers..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/40"
              />
            </div>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          <p className="mb-2 px-4 font-nunito text-[11px] font-bold uppercase tracking-widest text-foreground/40">
            Menu
          </p>
          <ul className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center rounded-xl px-4 py-3 font-nunito text-[17px] font-semibold text-foreground no-underline transition-colors hover:bg-brand/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mb-2 mt-5 px-4 font-nunito text-[11px] font-bold uppercase tracking-widest text-foreground/40">
            Categories
          </p>
          <ul className="flex flex-col gap-0.5">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={cat.id === "all" ? "/" : `/?category=${cat.id}`}
                  onClick={onClose}
                  className="flex items-center rounded-xl px-4 py-2.5 font-nunito text-[15px] font-medium text-foreground/80 no-underline transition-colors hover:bg-brand/10"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0 border-t border-foreground/20 px-5 py-3">
          <Link
            href="#"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-nunito text-[15px] font-semibold text-foreground no-underline transition-colors hover:bg-brand/10"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground/60">
              <path
                d="M10 17.5s-7-4.5-7-8.5a4 4 0 018-1.5 4 4 0 018 1.5c0 4-7 8.5-7 8.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            Wishlist
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-nunito text-[15px] font-semibold text-foreground no-underline transition-colors hover:bg-brand/10"
          >
            <div className="relative text-foreground/60">
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="6" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M7 6V5a4 4 0 018 0v1" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              {hydrated && totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </div>
            Cart
          </Link>
        </div>

        <div className="shrink-0 border-t border-foreground/20 px-5 py-3.5">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { label: "FAQ", href: "#" },
              { label: "Shipping", href: "#" },
              { label: "Contact", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-nunito text-[13px] text-foreground/50 no-underline transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {hydrated && typeof window !== "undefined" && localStorage.getItem("token") && (
            <button
              onClick={() => {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                onClose()
                router.push("/")
              }}
              className="mt-3 w-full rounded-xl px-4 py-3 font-nunito text-[14px] font-semibold text-foreground/50 text-left cursor-pointer border-none hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </>
  )
}
