"use client";

import Link from "next/link";

interface FooterLinkProps {
  href: string;
  label: string;
}


interface FooterLinksProps {
  title?: string;
  links: FooterLinkProps[];
}

export function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <footer className="w-full bg-[#0A0A0F] border-t border-white/10">
      {/* 链接区域 - 内容受限 */}
      <div className="max-w-[1400px] mx-auto px-6 pt-8 pb-6">
        <div className="flex flex-col items-center gap-6">
          {/* LOGO */}
          <div className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            MyNoteBook
          </div>
          {/* AI 导航链接 */}
          <div className="flex flex-wrap justify-center gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-900/50 border border-gray-800
                           text-gray-400 text-sm rounded-lg
                           hover:border-gray-600 hover:text-gray-300
                           transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 版权条 */}
      <div className="w-full border-t border-white/10 mt-6 pt-6 pb-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <p className="text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} MyNoteBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
