import { Header } from "@/components/common/Header";
import { ParticleBg } from "@/components/v-ui/ParticleBg";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "My Note Book | Modern AI Multi-Agent Orchestration",
  description:
    "A visually stunning, highly automated AI multi-agent orchestration platform for geeks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} font-body bg-transparent text-text-primary min-h-screen flex flex-col`}
      >
        <Providers>
          <ParticleBg />
          <Header />
          <main className="flex-grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
