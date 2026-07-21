'use client';

import { 
  PlayCircle, 
  LineChart, 
  StickyNote, 
  Star, 
  Archive, 
  Bell, 
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: PlayCircle, label: 'All tasks', href: '/dashboard', active: pathname === '/dashboard' || pathname.startsWith('/dashboard/goals') },
    { icon: LineChart, label: 'Progress', href: '/dashboard/progress', active: pathname.startsWith('/dashboard/progress') },
    { icon: StickyNote, label: 'Notes', href: '/dashboard/notes', active: pathname.startsWith('/dashboard/notes') },
    { icon: Star, label: 'Important', href: '/dashboard/important', active: pathname.startsWith('/dashboard/important') },
    { icon: Archive, label: 'Archive', href: '/dashboard/archive', active: pathname.startsWith('/dashboard/archive') },
    { icon: Bell, label: 'Reminders', href: '/dashboard/reminders', active: pathname.startsWith('/dashboard/reminders') },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Workspace Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">Goal Engine</h2>
            <p className="text-sm text-gray-500">Project #1 ↗</p>
          </div>
          <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="px-4 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                item.active 
                  ? 'bg-gray-100/80 text-gray-900' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Add New Button & User Profile Placeholder */}
      <div className="p-6 mt-auto border-t border-gray-50">
        <button className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white mb-6 hover:bg-gray-800 transition-colors">
          <span className="text-xl">+</span>
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
               {/* User Avatar Placeholder */}
               <div className="w-full h-full bg-gradient-to-tr from-gray-300 to-gray-100" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 truncate">Mike Cruggs</p>
              <p className="text-xs text-gray-400 truncate">mcruggsrr@gmail.com</p>
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
        </div>
      </div>
    </aside>
  );
}
