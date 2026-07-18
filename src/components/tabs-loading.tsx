"use client"

import { useEffect, useState } from "react"
import { Tabs } from "@base-ui/react/tabs"
import { motion, type HTMLMotionProps } from "framer-motion"

const CATEGORIES = ["All", "Animals", "Food", "Abstract", "Nature"]

export function TabsLoading() {
  const [activeTab, setActiveTab] = useState<string>(CATEGORIES[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const idx = CATEGORIES.indexOf(prev)
        return CATEGORIES[(idx + 1) % CATEGORIES.length]
      })
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-cream">
      <div className="mx-auto flex max-w-360 flex-col gap-8 px-4 pb-16 pt-5 md:px-8 lg:px-16 lg:pb-22.5">
        <h2 className="font-fredoka text-[28px] md:text-[32px] font-bold text-foreground">
          Fresh off the sheet
        </h2>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="relative flex gap-2 md:gap-3.5 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <Tabs.Tab
                key={cat}
                value={cat}
                className="inline-flex shrink-0 items-center justify-center rounded-full px-4 md:px-5 py-2.5 md:py-2.75 font-nunito text-[13px] md:text-[14px] font-bold text-transparent bg-muted select-none"
              >
                {cat}
              </Tabs.Tab>
            ))}
            <Tabs.Indicator
              render={(props, state) => (
                <motion.span
                  {...(props as HTMLMotionProps<"span">)}
                  layoutId="tabs-loading-indicator"
                  className="absolute bottom-0 left-0 h-0.5 bg-accent rounded-full"
                  style={{
                    width: state.activeTabSize?.width ?? 0,
                    translateX: state.activeTabPosition?.left ?? 0,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            />
          </Tabs.List>
        </Tabs.Root>

        <div className="flex flex-wrap justify-center sm:justify-start gap-5 md:gap-7">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex w-full sm:w-72.5 shrink-0 flex-col gap-3.5 rounded-2xl border border-foreground/20 bg-card p-5 shadow-card"
            >
              <div className="relative flex h-50.5 items-center justify-center rounded-xl bg-muted animate-pulse" />
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.75">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-4 w-12 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-10.5 rounded-full bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
