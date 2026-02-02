import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { ThemeToggle } from "@/components/layout/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="border-b">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
              <span className="font-bold text-lg">work-agents</span>
              <nav className="flex items-center gap-4">
                <Link href="/" className="text-sm hover:underline">Home</Link>
                <Link href="/agents" className="text-sm hover:underline">Agents</Link>
                <Link href="/tools" className="text-sm hover:underline">Tools</Link>
                <Link href="/labs" className="text-sm hover:underline">Labs</Link>
                <Link href="/blog" className="text-sm hover:underline">Blog</Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
