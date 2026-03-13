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
    <footer className="border-t border-white/10 pt-8 pb-12 w-full bg-[#0A0A0F]">
      <div className="max-w-[1400px] mx-auto px-6">
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
    </footer>
  );
}
