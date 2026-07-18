"use client";

import Image from "next/image";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/lib/hooks";
import { addItem } from "@/lib/features/cart-slice";
import { motion, useAnimate } from "framer-motion";
import { Heart } from "lucide-react";

export default function StickerCard({
  product,
  liked = false,
  onToggleLike,
}: {
  product: Product
  liked?: boolean
  onToggleLike?: () => void
}) {
  const dispatch = useAppDispatch();
  const [scope, animate] = useAnimate();
  const initialRotation = parseFloat(product.rotation) || 0;

  const handleHoverStart = async () => {
    await animate(scope.current, { scale: 1.08 }, { duration: 0.2 });
    await animate(
      scope.current,
      {
        rotate: [
          initialRotation,
          initialRotation - 3,
          initialRotation + 3,
          initialRotation - 3,
          initialRotation + 3,
          initialRotation,
        ],
      },
      { duration: 0.3 },
    );
  };

  const handleHoverEnd = () => {
    animate(
      scope.current,
      { scale: 1, rotate: initialRotation },
      { duration: 0.2 },
    );
  };

  return (
    <motion.div
      ref={scope}
      initial={{ scale: 1, rotate: initialRotation }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className="flex w-full sm:w-72.5 shrink-0 flex-col gap-3.5 rounded-2xl border 
      border-foreground/20 bg-card p-5 shadow-card"
    >
      <div
        className="relative flex h-50.5 items-center justify-center rounded-xl"
        style={{ backgroundColor: product.bgColor }}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={240}
          height={200}
          className="h-full w-full object-contain p-3"
        />

        {product.badge && (
          <Badge
            variant="brand"
            className="absolute left-3 top-3 rounded-lg px-2.5 py-1.25 text-[11px] 
            font-bold h-auto"
          >
            {product.badge}
          </Badge>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleLike?.()
          }}
          className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center 
          justify-center rounded-full bg-white/70 backdrop-blur-sm transition-transform 
          hover:scale-110 active:scale-90"
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart
            className="h-4.5 w-4.5"
            fill={liked ? "#ef4444" : "none"}
            stroke={liked ? "#ef4444" : "#666"}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.75">
          <span className="font-fredoka text-[16px] font-semibold text-foreground">
            {product.name}
          </span>
          <span className="font-nunito text-[12.5px] text-foreground/60">
            {product.material} · {product.size}
          </span>
        </div>
        <span className="font-nunito text-[16px] font-bold text-foreground">
          ${product.price.toFixed(2)}
        </span>
      </div>

      <button
        onClick={() => dispatch(addItem(product))}
        className="flex items-center justify-center rounded-full bg-foreground py-2.75 
        cursor-pointer font-nunito text-[13.5px] font-bold text-background transition-all hover:bg-foreground/90"
      >
        + Add to cart
      </button>
    </motion.div>
  );
}
