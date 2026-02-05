import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Outfit } from "next/font/google"
import "./globals.css"
import Providers from "@/components/layout/Providers"
import GenesisLayout from "@/components/layout/GenesisLayout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "work-agents - AI Agent Tools Aggregation",
  description: "A geek-styled website for AI agent tools, experiments, and blog",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`bg-[#0a0a0f] ${inter.variable} ${jetbrainsMono.variable} ${outfit.variable}`}>
      <body className="font-sans">
        <Providers>
          <GenesisLayout>
            {children}
          </GenesisLayout>
        </Providers>
      </body>
    </html>
  )
}
