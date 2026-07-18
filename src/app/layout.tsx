import type { Metadata } from "next"
import { Geist, Geist_Mono, Fredoka, Nunito } from "next/font/google"
import { ReduxProvider } from "@/lib/redux-provider"
import { ThemeProvider } from "@/lib/theme-context"
import { ToasterProvider } from "@/components/toaster-provider"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
})

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "stickerly — premium vinyl stickers",
  description:
    "Premium vinyl stickers for laptops, bottles, and everything else you love.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} ${nunito.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col">
        <ReduxProvider>
          <ThemeProvider>
            {children}
            <ToasterProvider />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
