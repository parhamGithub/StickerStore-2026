"use client"

import Link from "next/link"
import { useGetCategoriesQuery } from "@/lib/features/products-api-slice"

export default function CategoryChips({
  activeCategory,
}: {
  activeCategory?: string
}) {
  const { data: categories = [] } = useGetCategoriesQuery()

  return (
    <section className="bg-cream">
      <div className="mx-auto flex max-w-360 items-center gap-2 md:gap-3.5 overflow-x-auto px-4 pb-9 pt-5 md:px-8 lg:px-16 scrollbar-none">
        {categories.map((cat) => {
          const isActive = cat.id === "all"
            ? !activeCategory || activeCategory === "all"
            : cat.id === activeCategory
          return (
            <Link
              key={cat.id}
              href={cat.id === "all" ? "/" : `/?category=${cat.id}`}
              scroll={false}
              className={`inline-flex shrink-0 items-center justify-center rounded-full px-4 md:px-5 py-2.5 md:py-2.75 font-nunito text-[13px] md:text-[14px] font-bold no-underline transition-all ${
                isActive
                  ? "bg-foreground text-background"
                  : "border border-foreground/20 bg-card text-foreground hover:bg-foreground/5"
              }`}
            >
              {cat.label}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
