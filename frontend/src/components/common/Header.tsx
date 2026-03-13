"use client";

import { clearAuth, getAdminUser, isAuthenticated } from "@/lib/admin-auth";
import LinkNext from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/common/MobileNav";

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <LinkNext
    href="/"
    className="flex items-center gap-3 group cursor-pointer"
    onClick={onClick}
  >
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-80 blur-[2px]"></div>
      <div className="absolute inset-0 bg-slate-950 rounded-xl flex items-center justify-center border border-white/20">
        <div className="w-4 h-4 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-sm rotate-45 group-hover:scale-110 transition-transform"></div>
      </div>
    </div>
    <span className="font-black text-2xl tracking-tighter text-white">
      MyNoteBook
    </span>
  </LinkNext>
);

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setAuthed(isAuthenticated());
    const user = getAdminUser();
    if (user) {
      setUserName(user.username);
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
    setUserName("");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Agents", href: "/agents" },
    { name: "Tools", href: "/tools" },
    { name: "Labs", href: "/labs" },
    { name: "Blogs", href: "/blog" },
  ];

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Reduced motion preference */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <nav className="fixed top-4 left-4 right-4 z-50 px-6 py-4 flex justify-center">
        <div
          className={`w-full max-w-7xl backdrop-blur-md rounded-full px-8 py-3 flex items-center justify-between border shadow-2xl transition-all duration-500 ${
            scrolled
              ? "bg-slate-900/90 border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
              : "bg-white/5 border-white/10 shadow-2xl"
          }`}
        >
          {/* Logo - Left */}
          <Logo />

          {/* Navigation - Right */}
          <div className="hidden lg:flex items-center gap-8 font-semibold text-[14px] tracking-wide">
            {navLinks.map((link) => (
              <LinkNext
                key={link.href}
                href={link.href}
                className={`group relative py-2 px-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:rounded-lg ${
                  pathname === link.href
                    ? "text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {link.name}
                {/* Animated gradient underline */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </LinkNext>
            ))}
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </>
  );
}
