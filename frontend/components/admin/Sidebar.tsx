// frontend/components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const menuItems = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/agents', icon: '🤖', label: '智能体' },
  { href: '/admin/tools', icon: '🔧', label: '工具库' },
  { href: '/admin/labs', icon: '🧪', label: '实验室' },
  { href: '/admin/blog', icon: '📝', label: '博客管理' },
  { href: '/admin/profile', icon: '👤', label: '个人中心' },
  { href: '/admin/settings', icon: '⚙️', label: '系统设置' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-abyss border-r border-white/10 min-h-screen flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-xl font-heading font-bold text-primary">
          MyNoteBook
        </h1>
        <p className="text-xs text-text-muted mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition',
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-white/5 transition"
        >
          <span className="text-lg">←</span>
          <span>返回前台</span>
        </Link>
      </div>
    </aside>
  );
}
