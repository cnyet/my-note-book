import { Beaker, Bot, FileText, Hammer, Home } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <>
      <footer className="w-full border-t border-white/5 bg-void py-12 pb-24 md:pb-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3 className="font-heading font-bold text-lg text-primary">
              Work Agents
            </h3>
            <p className="text-sm text-text-muted">
              Modern AI Multi-Agent Orchestration Platform.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/agents" className="hover:text-primary">
                  Agents
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-primary">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/labs" className="hover:text-primary">
                  Labs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/blog" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
              Connect
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link href="#" className="hover:text-primary">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} Work Agents. Built for Geeks.
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 md:hidden glass-effect border-t border-white/10 flex items-center justify-around px-4 z-50">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-primary"
        >
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          href="/agents"
          className="flex flex-col items-center gap-1 text-text-secondary"
        >
          <Bot size={20} />
          <span className="text-[10px] font-medium">Agents</span>
        </Link>
        <Link
          href="/tools"
          className="flex flex-col items-center gap-1 text-text-secondary"
        >
          <Hammer size={20} />
          <span className="text-[10px] font-medium">Tools</span>
        </Link>
        <Link
          href="/labs"
          className="flex flex-col items-center gap-1 text-text-secondary"
        >
          <Beaker size={20} />
          <span className="text-[10px] font-medium">Labs</span>
        </Link>
        <Link
          href="/blog"
          className="flex flex-col items-center gap-1 text-text-secondary"
        >
          <FileText size={20} />
          <span className="text-[10px] font-medium">Blog</span>
        </Link>
      </nav>
    </>
  );
}
