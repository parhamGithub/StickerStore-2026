"use client"

import { Toaster } from "react-hot-toast"

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          fontSize: "14px",
          fontFamily: "var(--font-nunito)",
        },
        success: {
          iconTheme: { primary: "var(--green)", secondary: "var(--surface)" },
        },
        error: {
          iconTheme: { primary: "var(--coral)", secondary: "var(--surface)" },
        },
      }}
    />
  )
}
