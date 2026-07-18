import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-foreground">
      <div className="mx-auto flex max-w-360 flex-col gap-10 md:gap-14 px-4 pb-10 pt-14 md:px-8 lg:px-16 lg:pt-18">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-0">
          <div className="flex flex-col gap-2">
            <span className="font-fredoka text-[22px] md:text-[26px] font-bold text-background">
              Get 10% off your first sheet
            </span>
            <span className="font-nunito text-[13px] md:text-[14.5px] text-background/80">
              Plus first dibs on new drops. No spam, just stickers.
            </span>
          </div>

          <div className="flex h-12 md:h-13.75 w-full lg:w-auto items-center gap-3 md:gap-6 rounded-full border border-background/20 pl-4 md:pl-5 pr-1.5 backdrop-blur-sm">
            <Input
              type="email"
              placeholder="you@email.com"
              className="w-full md:w-40 min-w-0 border-none bg-transparent font-nunito text-[13px] md:text-[14px] text-foreground shadow-none placeholder:text-background/50 focus-visible:ring-0 h-auto p-0 dark:bg-transparent"
            />
            <Button
              variant="brand"
              className="h-10 md:h-10.75 shrink-0 rounded-full px-4 md:px-5.5 text-[12.5px] md:text-[13.5px] font-bold cursor-pointer transition-all duration-300"
            >
              Subscribe
            </Button>
          </div>
        </div>

        <div className="h-px bg-background/20" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <span className="font-fredoka text-[20px] font-bold text-background">
            stickerly
          </span>

          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-7">
            {["Shop", "FAQ", "Shipping", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-nunito text-[13px] md:text-[13.5px] font-semibold text-background/80 no-underline transition-opacity hover:text-background"
              >
                {link}
              </a>
            ))}
          </div>

          <span className="font-nunito text-[12px] md:text-[13px] text-background/60">
            © 2026 stickerly co.
          </span>
        </div>
      </div>
    </footer>
  )
}
