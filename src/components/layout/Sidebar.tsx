'use client';

import {
  LayoutDashboard,
  LineChart,
  StickyNote,
  Star,
  Archive,
  Bell,
  LogOut,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type User = { name?: string; email: string };

const navItems = [
  { icon: LayoutDashboard, label: 'Goals Board', href: '/dashboard', matchPrefix: false },
  { icon: LineChart, label: 'Analytics', href: '/dashboard/progress', matchPrefix: true },
  { icon: StickyNote, label: 'Notes', href: '/dashboard/notes', matchPrefix: true },
  { icon: Star, label: 'Important', href: '/dashboard/important', matchPrefix: true },
  { icon: Archive, label: 'Archive', href: '/dashboard/archive', matchPrefix: true },
  { icon: Bell, label: 'Reminders', href: '/dashboard/reminders', matchPrefix: true },
];

function getInitials(name?: string, email?: string): string {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return email?.slice(0, 2).toUpperCase() ?? 'GE';
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser)
      .catch(() => null);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.matchPrefix) return pathname.startsWith(item.href);
    return pathname === item.href || pathname.startsWith('/dashboard/goals');
  };

  return (
    <aside className="w-64 bg-[#F5F4EF] border-r border-[#E3E1D9] flex flex-col h-screen fixed left-0 top-0 overflow-y-auto text-[#141413]">
      {/* Brand header */}
      <div className="px-5 py-5 border-b border-[#E3E1D9]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-7 h-7 bg-[#141413] text-white rounded flex items-center justify-center font-mono font-bold text-xs">
            GE
          </div>
          <div>
            <h1 className="font-bold text-xs tracking-tight text-[#141413]">GOAL ENGINE</h1>
            <p className="font-mono text-[10px] text-[#73726D]">EXECUTION SYSTEM</p>
          </div>
        </Link>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-5 pb-2">
        <p className="font-mono text-[10px] font-bold text-[#73726D] uppercase tracking-widest">
          NAVIGATION
        </p>
      </div>

      {/* Nav items */}
      <nav className="px-3 flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                active
                  ? 'bg-[#EAE8E1] text-[#141413]'
                  : 'text-[#52514D] hover:bg-[#EAE8E1]/60 hover:text-[#141413]'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute left-0 w-1 h-4 bg-[#141413] rounded-r"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon className={`w-4 h-4 ${active ? 'text-[#141413]' : 'text-[#73726D]'}`} strokeWidth={active ? 2.5 : 2} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-[#73726D]" />}
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-3 border-t border-[#E3E1D9] mt-2 bg-[#FAF9F5]/40">
        {user ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-[#EAE8E1]/60 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded bg-[#141413] text-white flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0">
                {getInitials(user.name, user.email)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#141413] truncate leading-tight">
                  {user.name || 'Workspace User'}
                </p>
                <p className="font-mono text-[10px] text-[#73726D] truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1 text-[#73726D] hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 animate-pulse">
            <div className="w-7 h-7 bg-[#E8E6DF] rounded" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-[#E8E6DF] rounded w-3/4" />
              <div className="h-2 bg-[#E8E6DF] rounded w-1/2" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
