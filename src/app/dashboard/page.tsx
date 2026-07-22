'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GoalsSection } from '@/components/goals/GoalsSection';
import { Target, CheckCircle2, Clock, Zap } from 'lucide-react';

type User = { name?: string; email: string };
type Goal = { id: string; status: string; isArchived: boolean };

function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const firstName = name?.split(' ')[0] || 'there';
  if (hour < 12) return `Good morning, ${firstName}! ☀️`;
  if (hour < 17) return `Good afternoon, ${firstName}! 👋`;
  return `Good evening, ${firstName}! 🌙`;
}

function getMotivationalSubtitle(completed: number, total: number): string {
  if (total === 0) return "Generate your first goal with AI to get started.";
  if (completed === total && total > 0) return "You've completed everything! Time to set new goals. 🚀";
  const pct = Math.round((completed / total) * 100);
  if (pct >= 75) return "Almost there! You're crushing it today.";
  if (pct >= 50) return "Halfway through — keep the momentum going!";
  return "Every goal you complete is progress. Let's get to work.";
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(setUser)
      .catch(() => router.push('/login'));
  }, [router]);

  useEffect(() => {
    fetch('/api/goals', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : []))
      .then(setGoals)
      .catch(() => []);
  }, []);

  if (!user) {
    return (
      <div className="p-10 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  const activeGoals = goals.filter((g) => !g.isArchived);
  const completedGoals = activeGoals.filter((g) => g.status === 'COMPLETED');
  const inProgressGoals = activeGoals.filter((g) => g.status === 'IN_PROGRESS');

  const stats = [
    {
      label: 'Total Goals',
      value: activeGoals.length,
      icon: Target,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
    {
      label: 'Completed',
      value: completedGoals.length,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'In Progress',
      value: inProgressGoals.length,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'Completion Rate',
      value: activeGoals.length > 0
        ? `${Math.round((completedGoals.length / activeGoals.length) * 100)}%`
        : '—',
      icon: Zap,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
          {getGreeting(user.name)}
        </h1>
        <p className="text-gray-500 text-base">
          {getMotivationalSubtitle(completedGoals.length, activeGoals.length)}
        </p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12 + i * 0.06 }}
              className={`bg-white rounded-2xl border ${stat.border} p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{stat.value}</p>
                <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 mb-6"
      >
        <h2 className="text-lg font-bold text-gray-900">Your Goals</h2>
        <div className="h-px flex-1 bg-gray-100" />
      </motion.div>

      <GoalsSection />
    </div>
  );
}
