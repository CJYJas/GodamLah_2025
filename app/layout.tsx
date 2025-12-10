import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AppointmentsProvider } from "@/contexts/appointments-context";
import { LanguageProvider } from "@/contexts/language-context"
import { RuralModeProvider } from "@/contexts/rural-mode-context"
import "./globals.css"
import SWRegister from "./sw-register"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const PWA_THEME_COLOR = "#1D4ED8"

export const metadata: Metadata = {
  title: "MyHealth - Malaysian Healthcare Services",
  description:
    "Simplify and unify your healthcare journey with appointments, transportation, medicine tracking, and medical records all in one place.",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: PWA_THEME_COLOR,
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: PWA_THEME_COLOR,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={_inter.className}>
      <body className="font-sans antialiased">
        <LanguageProvider><RuralModeProvider><AppointmentsProvider>{children}</AppointmentsProvider>
          </RuralModeProvider>
        </LanguageProvider>

        {/* ✅ MUST BE INCLUDED OR PWA WILL NEVER REGISTER */}
        <SWRegister />  

        <Analytics />
      </body>
    </html>
  )
}