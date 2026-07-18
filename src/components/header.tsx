"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { selectTotalItems } from "@/lib/features/cart-slice";
import { useHydrated } from "@/lib/use-hydrated";
import MobileSidebar from "@/components/mobile-sidebar";
import ThemeToggle from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function readUserInitials(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    const user = JSON.parse(stored);
    return user?.name ? getInitials(user.name) : null;
  } catch {
    return null;
  }
}

const navLinks = [
  { label: "Shop", href: "/" },
  { label: "Sign in", href: "/signin" },
];

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userInitials] = useState(readUserInitials);
  const hydrated = useHydrated();
  const totalItems = useAppSelector(selectTotalItems);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusSearch = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  function handleSearchSubmit() {
    const q = searchQuery.trim();
    if (q) {
      router.push(`/?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <>
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
      />
      <header className="sticky top-0 z-50 bg-cream border-b border-foreground/20">
        <div className="mx-auto flex h-18.75 max-w-360 items-center px-4 md:px-8 lg:px-16">
          <div className="flex flex-1 justify-start">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <ellipse
                  cx="8"
                  cy="8"
                  rx="7.9"
                  ry="7.9"
                  className="fill-coral"
                />
              </svg>
              <span
                className="font-fredoka text-[22px] md:text-[26px] font-bold leading-none 
                text-foreground"
              >
                stickerly
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onAnimationComplete={focusSearch}
                  className="flex w-full max-w-sm items-center gap-2"
                >
                  <div className="flex w-full items-center gap-2 rounded-xl border border-foreground/20 bg-white px-4 py-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="shrink-0 text-foreground/40"
                    >
                      <circle
                        cx="8.5"
                        cy="8.5"
                        r="6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M13 13l5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearchSubmit();
                        if (e.key === "Escape") closeSearch();
                      }}
                      placeholder="Search stickers..."
                      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/40"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.nav
                  key="nav"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="hidden md:flex items-center gap-6 lg:gap-9"
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="font-nunito text-[14px] lg:text-[15px] font-semibold text-foreground 
                      no-underline transition-opacity hover:opacity-60"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden cursor-pointer text-foreground/60 hover:text-foreground 
              transition-colors"
              aria-label="Open menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4 md:gap-5.5">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
              className="hidden md:flex cursor-pointer text-foreground/60 hover:text-foreground 
              transition-colors"
              aria-label={searchOpen ? "Close search" : "Search"}
            >
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.svg
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 5l10 10M15 5l-10 10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="search"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M13 13l5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>

            {hydrated && userInitials ? (
              <Link
                href="/profile"
                className="hidden md:flex size-8.5 rounded-full bg-purple text-white font-bold text-[13px]
                items-center justify-center border-2 border-foreground shrink-0
                no-underline"
              >
                {userInitials}
              </Link>
            ) : (
              <Link
                href="/signin"
                className="hidden md:flex cursor-pointer text-foreground/60 hover:text-foreground 
                transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 17.5s-7-4.5-7-8.5a4 4 0 018-1.5 4 4 0 018 1.5c0 4-7 8.5-7 8.5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </Link>
            )}

            <Link href="/cart" className="relative">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect
                  x="3"
                  y="6"
                  width="16"
                  height="13"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M7 6V5a4 4 0 018 0v1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              {hydrated && totalItems > 0 && (
                <span
                  className="absolute -right-2 -top-2 flex h-4 w-4 items-center 
                  justify-center rounded-full bg-brand text-[10px] font-bold text-white"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
