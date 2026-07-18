import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const stickerItems: {
  className: string;
  src: string;
  rotate: string;
}[] = [
  {
    className: "left-3.7 top-10 w-44.475 h-44.475",
    src: "/images/Hero/Sticker-Smiley.svg",
    rotate: "12deg",
  },
  {
    className: "right-3.5 top-0 w-37.1 h-37.1",
    src: "/images/Hero/Sticker-Heart.svg",
    rotate: "-16deg",
  },
  {
    className: "right-0 bottom-0 w-31.05 h-31.05",
    src: "/images/Hero/Sticker-Star.svg",
    rotate: "8deg",
  },
  {
    className: "bottom-14 left-0 w-37.65 h-37.65",
    src: "/images/Hero/Sticker-Cloud.svg",
    rotate: "-10deg",
  },
  {
    className: "bottom-0 left-32.25 w-31.5 h-31.5",
    src: "/images/Hero/Sticker-Cactus.svg",
    rotate: "18deg",
  },
];

export default function Hero() {
  return (
    <section className="bg-cream overflow-hidden">
      <div
        className="mx-auto flex max-w-360 flex-col-reverse items-center gap-8 px-4 py-10 md:px-8 md:gap-10 
        md:py-14 lg:flex-row lg:px-16 lg:py-18"
      >
        <div className="flex w-full max-w-lg shrink-0 flex-col gap-5 md:gap-6 lg:w-140">
          <Badge
            variant="brand-outline"
            className="w-fit rounded-full px-3.5 py-2 text-[12px] md:text-[13px] font-bold 
            h-auto bg-card"
          >
            ✨ New drop every Friday
          </Badge>

          <h1
            className="font-fredoka text-[40px] leading-11 md:text-[52px] md:leading-14 
            lg:text-[64px] lg:leading-17 font-bold tracking-normal text-foreground"
          >
            Stick it.
            <br />
            Peel it.
            <br />
            Love it.
          </h1>

          <p
            className="max-w-120 font-nunito text-[15px] leading-11 md:text-[16px] 
            md:leading-6.25 lg:text-[17px] lg:leading-6.5 text-brand-muted"
          >
            Premium vinyl stickers for laptops, bottles, and everything else you
            love. Waterproof, fade-proof, and made to peel perfectly — every
            single time.
          </p>

          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/"
              className="inline-flex h-12 md:h-13.5 items-center justify-center rounded-full bg-brand p
              x-6 md:px-7 text-[14px] md:text-[15px] font-bold text-white no-underline 
              shadow-brand transition-all hover:brightness-110"
            >
              Shop Now →
            </Link>
            <Link
              href="#"
              className="inline-flex h-12 md:h-13.5 items-center justify-center text-[14px] md:text-[15px] font-bold 
              text-foreground no-underline transition-opacity hover:opacity-60"
            >
              Explore →
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-md md:max-w-lg lg:h-120 lg:w-140 aspect-square shrink-0">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[90%] lg:left-15 
            lg:top-5 lg:h-110 lg:w-110 lg:translate-x-0 lg:translate-y-0             aspect-square rounded-full bg-coral/10"
          />

          {stickerItems.map((sticker, i) => (
            <Image
              key={i}
              src={sticker.src}
              alt=""
              width={200}
              height={200}
              className={`absolute ${sticker.className}`}
              style={{ transform: `rotate(${sticker.rotate})` }}
              {...(sticker.src === "/images/Hero/Sticker-Heart.svg"
                ? { priority: true }
                : {})}
            />
          ))}

          <Badge
            variant="dark"
            className="absolute bottom-[10%] left-[35%] lg:bottom-8.25 lg:left-33 rounded-lg px-2.5 py-1.25 text-[11px]
            font-bold h-auto"
          >
            peel me →
          </Badge>
        </div>
      </div>
    </section>
  );
}
