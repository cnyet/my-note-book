"use client";

import { clearAuth, getAdminUser, isAuthenticated } from "@/lib/admin-auth";
import LinkNext from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-center">
      <div className="w-full max-w-6xl backdrop-blur-md bg-white/5 rounded-full px-8 py-3 flex items-center justify-between border border-white/10 shadow-2xl">
        <Logo />

        <div className="hidden lg:flex items-center gap-8 font-semibold text-[14px] tracking-wide">
          {navLinks.map((link) => (
            <LinkNext
              key={link.href}
              href={link.href}
              className={`transition-colors duration-300 relative py-1 ${pathname === link.href ? "text-white font-black" : "text-slate-400 hover:text-white"}`}
            >
              {link.name}
            </LinkNext>
          ))}
        </div>

        <div className="hidden md:flex items-center">
          <LinkNext
            href="/admin"
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-2 border-white/20 hover:border-white/40 rounded-full text-[11px] font-black uppercase tracking-[0.15em] text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            Dashboard
          </LinkNext>
        </div>
      </div>
    </nav>
  );
}
