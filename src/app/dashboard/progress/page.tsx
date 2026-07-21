'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import type { Goal } from '@/components/goals/GoalsSection';
import type { Task } from '@/app/dashboard/goals/[id]/page';

type GoalWithTasks = Goal & { tasks: Task[] };

export default function ProgressPage() {
  const [data, setData] = useState<GoalWithTasks[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/goals', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch goals');
        const goals: Goal[] = await res.json();

        // Fetch tasks for all goals
        const goalsWithTasks = await Promise.all(
          goals.map(async (goal) => {
            const tRes = await fetch(`/api/goals/${goal.id}/tasks`, { cache: 'no-store' });
            const tasks: Task[] = tRes.ok ? await tRes.json() : [];
            return { ...goal, tasks };
          })
        );

        setData(goalsWithTasks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-500 mt-20 animate-pulse">Loading analytics...</div>;
  }

  // Calculate high-level metrics
  const totalGoals = data.length;
  const completedGoals = data.filter(g => g.status === 'COMPLETED').length;
  
  const allTasks = data.flatMap(g => g.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'COMPLETED').length;
  const taskCompletionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Analytics & Progress
        </h1>
        <p className="mt-2 text-gray-500 text-lg">See how far you&apos;ve come.</p>
      </motion.div>

      {/* Top Metrics Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <motion.div variants={item} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-24 h-24 text-purple-600" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-700">Goal Completion</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-gray-900">{completedGoals}</span>
            <span className="text-xl text-gray-400">/ {totalGoals}</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 className="w-24 h-24 text-blue-600" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-700">Tasks Finished</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-gray-900">{completedTasks}</span>
            <span className="text-xl text-gray-400">/ {totalTasks}</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24 text-green-600" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-700">Overall Velocity</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-gray-900">{taskCompletionRate}%</span>
          </div>
          {/* Simple progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${taskCompletionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" 
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Goal Breakdown */}
      <motion.div variants={container} initial="hidden" animate="show">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Project Breakdown
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map(goal => {
            const gTotalTasks = goal.tasks.length;
            const gCompletedTasks = goal.tasks.filter(t => t.status === 'COMPLETED').length;
            const gRate = gTotalTasks === 0 ? 0 : Math.round((gCompletedTasks / gTotalTasks) * 100);

            return (
              <motion.div key={goal.id} variants={item} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{goal.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    gRate === 100 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {gRate}%
                  </span>
                </div>
                
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${gRate}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className={`h-full rounded-full ${gRate === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                  />
                </div>
                
                <p className="text-sm text-gray-500">
                  {gCompletedTasks} of {gTotalTasks} tasks completed
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
