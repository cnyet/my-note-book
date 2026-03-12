"use client";

import Link from "next/link";

interface FooterLinkProps {
  href: string;
  label: string;
  description?: string;
}

interface FooterLinksProps {
  title: string;
  links: FooterLinkProps[];
}

export function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <footer className="border-t border-white/10 pt-16 px-6 mt-20 bg-slate-950/50">
      <div className="max-w-[1400px] mx-auto">
        <h3 className="text-lg font-bold text-white mb-8">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                {link.label}
              </div>
              {link.description && (
                <div className="text-xs text-slate-500 mt-1">{link.description}</div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
