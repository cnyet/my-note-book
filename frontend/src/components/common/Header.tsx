"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Agents", href: "/agents" },
  { name: "Tools", href: "/tools" },
  { name: "Labs", href: "/labs" },
  { name: "Blog", href: "/blog" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 glass-effect">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-neon p-[1px]">
            <div className="w-full h-full rounded-[7px] bg-abyss flex items-center justify-center font-bold text-primary group-hover:text-white transition-colors">
              W
            </div>
          </div>
          <span className="font-heading font-bold text-xl tracking-tight hidden sm:block">
            Work Agents
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative py-1",
                pathname === link.href ? "text-primary" : "text-text-secondary",
              )}
            >
              {link.name}
              {pathname === link.href && (
                <div className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-primary neon-glow-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth UI Placeholder */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-sm font-medium text-text-secondary hover:text-white transition-colors">
            Sign In
          </button>
          <button className="px-4 py-1.5 rounded-lg bg-primary text-abyss text-sm font-bold neon-glow-primary hover:scale-105 transition-transform">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
