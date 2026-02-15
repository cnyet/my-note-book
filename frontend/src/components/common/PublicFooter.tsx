"use client";

import { Logo } from "@/components/common/Logo";
import { StandardFooter } from "@/components/common/StandardFooter";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export const PublicFooter = () => {
  return (
    <footer className="border-t border-white/10 py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-16">
        <div className="col-span-1 md:col-span-2">
          <Logo />
          <p className="text-slate-500 text-lg leading-relaxed mt-8 mb-10 max-w-sm">
            The world&apos;s first AI-native notebook for modern creative teams
            and engineers.
          </p>
          <div className="flex items-center gap-6 text-slate-400">
            <Twitter
              size={24}
              className="hover:text-white cursor-pointer transition-colors"
            />
            <Github
              size={24}
              className="hover:text-white cursor-pointer transition-colors"
            />
            <Linkedin
              size={24}
              className="hover:text-white cursor-pointer transition-colors"
            />
          </div>
        </div>

        <div>
          <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">
            Product
          </h4>
          <ul className="space-y-5 text-slate-500 text-[14px] font-bold">
            {[
              { name: "Home", href: "/" },
              { name: "Agents", href: "/agents" },
              { name: "Tools", href: "/tools" },
              { name: "Labs", href: "/labs" },
              { name: "Blogs", href: "/blog" },
            ].map((l) => (
              <li key={l.name}>
                <Link
                  href={l.href}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">
            Ecosystem
          </h4>
          <ul className="space-y-5 text-slate-500 text-[14px] font-bold">
            <li className="hover:text-white cursor-pointer transition-colors">
              Documentation
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Showcase
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Status
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">
            Studio
          </h4>
          <ul className="space-y-5 text-slate-500 text-[14px] font-bold">
            <li className="hover:text-white cursor-pointer transition-colors">
              Careers
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Contact
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Legal
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-20">
        <StandardFooter />
      </div>
    </footer>
  );
};
