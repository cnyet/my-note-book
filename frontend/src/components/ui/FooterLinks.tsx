"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

interface FooterLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface FooterCategory {
  title: string;
  links: FooterLinkProps[];
}

interface FooterLinksProps {
  title?: string;
  links?: FooterLinkProps[];
  categories?: FooterCategory[];
}

export function FooterLinks({ title, links, categories }: FooterLinksProps) {
  return (
    <footer className="w-full bg-[#0A0A0F] border-t border-white/10">
      {/* 导航链接区域 - 内容受限 */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {categories ? (
          // 分类布局：每行一个类别（标题 + 链接在同一行）
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.title} className="flex items-center flex-wrap gap-3">
                <h3 className="text-white font-bold text-base flex-shrink-0 w-24">{category.title}</h3>
                <div className="flex flex-wrap items-center gap-3">
                  {category.links.map((link) => (
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
            ))}
          </div>
        ) : (
          // 扁平布局：所有链接在一起
          <div className="flex flex-wrap justify-center gap-4">
            {links?.map((link) => (
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
        )}
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
