"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-3 group cursor-pointer">
    <div className="relative w-10 h-10 transition-transform duration-500 group-hover:rotate-12">
      <Image
        src="/logo.svg"
        alt="MyNoteBook Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
    <span className="font-black text-2xl tracking-tighter text-white">
      MyNoteBook
    </span>
  </Link>
);
