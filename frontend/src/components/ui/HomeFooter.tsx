"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

interface FooterColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className="font-black mb-6 text-white uppercase tracking-[0.15em] text-[11px]">
        {title}
      </h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-slate-400 hover:text-white text-[14px] font-medium transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeFooter() {
  const productLinks = [
    { label: "Features", href: "#" },
    { label: "Solutions", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Enterprise", href: "#" },
  ];

  const ecosystemLinks = [
    { label: "Integrations", href: "#" },
    { label: "Marketplace", href: "#" },
    { label: "API Docs", href: "#" },
    { label: "Community", href: "#" },
  ];

  const studioLinks = [
    { label: "Templates", href: "#" },
    { label: "Components", href: "#" },
    { label: "Examples", href: "#" },
    { label: "Tutorials", href: "#" },
  ];

  const companyLinks = [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Press", href: "#" },
  ];

  return (
    <footer className="w-full bg-[#0A0A0F] border-t border-white/10">
      {/* 内容区域，左右留白 */}
      <div className="w-full px-6 lg:px-12 py-16">
        {/* 4 列内容，居中 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Ecosystem" links={ecosystemLinks} />
          <FooterColumn title="Studio" links={studioLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        {/* 底部版权条 */}
        <div className="w-full border-t border-white/10 mt-16 pt-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} MyNoteBook. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="#" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <Link href="#" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-white text-sm transition-colors">
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
