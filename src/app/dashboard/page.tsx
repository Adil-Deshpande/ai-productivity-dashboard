'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GoalsSection } from '@/components/goals/GoalsSection';
import { Target, CheckCircle2, Clock, Activity } from 'lucide-react';

type User = { name?: string; email: string };
type Goal = { id: string; status: string; isArchived: boolean };

function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const firstName = name?.split(' ')[0] || 'User';
  if (hour < 12) return `Good morning, ${firstName}`;
  if (hour < 17) return `Good afternoon, ${firstName}`;
  return `Good evening, ${firstName}`;
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
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-[#73726D] font-mono text-xs">
          <span>LOADING WORKSPACE...</span>
        </div>
      </div>
    );
  }

  const activeGoals = goals.filter((g) => !g.isArchived);
  const completedGoals = activeGoals.filter((g) => g.status === 'COMPLETED');
  const inProgressGoals = activeGoals.filter((g) => g.status === 'IN_PROGRESS');

  const stats = [
    {
      label: 'TOTAL GOALS',
      value: activeGoals.length,
      icon: Target,
      tag: 'ACTIVE',
    },
    {
      label: 'COMPLETED',
      value: completedGoals.length,
      icon: CheckCircle2,
      tag: '100% DONE',
    },
    {
      label: 'IN PROGRESS',
      value: inProgressGoals.length,
      icon: Clock,
      tag: 'ACTIVE TREE',
    },
    {
      label: 'COMPLETION RATE',
      value: activeGoals.length > 0
        ? `${Math.round((completedGoals.length / activeGoals.length) * 100)}%`
        : '0%',
      icon: Activity,
      tag: 'METRIC',
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 pb-6 border-b border-[#E8E6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <span className="font-mono text-[10px] font-bold text-[#73726D] uppercase tracking-widest block mb-1">
            WORKSPACE OVERVIEW
          </span>
          <h1 className="text-2xl font-bold text-[#141413] tracking-tight">
            {getGreeting(user.name)}
          </h1>
        </div>

        <div className="font-mono text-xs text-[#73726D] bg-[#F2F1EC] px-3 py-1.5 rounded border border-[#E8E6DF] self-start sm:self-auto">
          SYSTEM STATUS: ONLINE
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-[#E8E6DF] p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] font-bold text-[#73726D] tracking-wider">
                  {stat.label}
                </span>
                <Icon className="w-4 h-4 text-[#141413]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#141413] font-mono leading-none mb-1">{stat.value}</p>
                <span className="font-mono text-[9px] text-[#52514D] bg-[#FAF9F5] border border-[#E8E6DF] px-1.5 py-0.5 rounded">
                  {stat.tag}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>

      <GoalsSection />
    </div>
  );
}
