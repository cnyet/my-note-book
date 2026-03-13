"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

interface FooterLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface FooterLinksProps {
  title?: string;
  links: FooterLinkProps[];
}

export function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <footer className="w-full bg-[#0A0A0F] border-t border-white/10">
      {/* AI 导航链接区域 - 内容受限 */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800
                         text-gray-400 text-sm rounded-lg
                         hover:border-gray-600 hover:text-gray-300
                         transition-colors duration-200"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 版权条 - 左右布局（与 HomeFooter 一致） */}
      <div className="w-full border-t border-white/10 pt-8 pb-6">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 左侧：版权文字 */}
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} MyNoteBook. All rights reserved.
            </p>
            {/* 右侧：链接 + 社交图标 */}
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-slate-400 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
              <div className="flex items-center gap-4 ml-4">
                <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" aria-label="Follow us on Twitter" />
                <Github className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" aria-label="View our GitHub" />
                <Linkedin className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" aria-label="Connect on LinkedIn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
