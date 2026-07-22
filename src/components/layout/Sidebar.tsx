'use client';

import {
  LayoutDashboard,
  LineChart,
  StickyNote,
  Star,
  Archive,
  Bell,
  LogOut,
  Target,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type User = { name?: string; email: string };

const navItems = [
  { icon: LayoutDashboard, label: 'My Goals', href: '/dashboard', matchPrefix: false },
  { icon: LineChart, label: 'Progress', href: '/dashboard/progress', matchPrefix: true },
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
  return email?.slice(0, 2).toUpperCase() ?? 'U';
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
    // For "My Goals", match exact /dashboard and /dashboard/goals/*
    return pathname === item.href || pathname.startsWith('/dashboard/goals');
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-100/80 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto shadow-sm">
      {/* Brand header */}
      <div className="px-6 py-6 border-b border-gray-100/80">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
            <Target className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-base leading-tight tracking-tight">Goal Engine</h1>
            <p className="text-xs text-gray-400 font-medium">AI Productivity</p>
          </div>
        </Link>
      </div>

      {/* Nav label */}
      <div className="px-6 pt-6 pb-2">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Navigation</p>
      </div>

      {/* Nav items */}
      <nav className="px-3 flex-1 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-indigo-50 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <div className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                active
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
              }`}>
                <Icon className="w-3.5 h-3.5" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className="relative z-10 flex-1">{item.label}</span>
              {active && (
                <ChevronRight className="relative z-10 w-3.5 h-3.5 text-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-4 border-t border-gray-100/80 mt-2">
        {user ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-indigo-500/20">
              {getInitials(user.name, user.email)}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Sign out"
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-xl bg-gray-100 shimmer flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-gray-100 shimmer rounded-md w-3/4" />
              <div className="h-2.5 bg-gray-100 shimmer rounded-md w-1/2" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
