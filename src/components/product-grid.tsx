"use client"

import { useCallback } from "react"
import { useGetProductsQuery, useGetLikedIdsQuery, useToggleLikeMutation } from "@/lib/features/products-api-slice"
import StickerCard from "./sticker-card"
import { TabsLoading } from "./tabs-loading"
import toast from "react-hot-toast"

export default function ProductGrid({
  activeCategory,
  searchQuery,
}: {
  activeCategory?: string
  searchQuery?: string
}) {
  const { data: filtered, isLoading } = useGetProductsQuery({
    category: activeCategory,
    q: searchQuery,
  })

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const { data: likedIds } = useGetLikedIdsQuery(undefined, { skip: !token })
  const [toggleLike] = useToggleLikeMutation()

  const handleToggleLike = useCallback(async (productId: string) => {
    try {
      const result = await toggleLike(productId).unwrap()
      toast.success(result.liked ? "Added to favorites" : "Removed from favorites")
    } catch {
      toast.error("Could not update favorite")
    }
  }, [toggleLike])

  return (
    <section className="bg-cream">
      <div className="mx-auto flex max-w-360 flex-col gap-8 px-4 pb-16 pt-5 md:px-8 lg:px-16 lg:pb-22.5">
        <h2 className="font-fredoka text-[28px] md:text-[32px] font-bold text-foreground">
          Fresh off the sheet
        </h2>

        {isLoading ? (
          <TabsLoading />
        ) : filtered && filtered.length > 0 ? (
          <div className="flex flex-wrap justify-center sm:justify-start gap-5 md:gap-7">
            {filtered.map((product) => (
              <StickerCard
                key={product.id}
                product={product}
                liked={likedIds?.includes(product.id) ?? false}
                onToggleLike={() => handleToggleLike(product.id)}
              />
            ))}
          </div>
        ) : (
          <p className="font-nunito text-brand-muted">
            No stickers in this category yet. Check back soon!
          </p>
        )}
      </div>
    </section>
  )
}
