"use client";

import Link from "next/link";

interface FooterLinkProps {
  href: string;
  label: string;
}


interface FooterLinksProps {
  title: string;
  links: FooterLinkProps[];
}

export function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <footer className="border-t border-white/10 pt-16 px-6 mt-auto bg-slate-950/50">
      <div className="max-w-[1400px] mx-auto">
        <h3 className="text-lg font-bold text-white mb-8">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="text-sm font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">
                {link.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
