'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Goal } from '@/components/goals/GoalsSection';
import type { Task } from '@/app/dashboard/goals/[id]/page';
import { Calendar as CalendarIcon, Clock, Loader2, ArrowRight } from 'lucide-react';
import { format, isPast, isToday, isTomorrow, formatDistanceToNow } from 'date-fns';

type GoalWithTasks = Goal & { tasks: Task[] };

export default function RemindersPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<(Task & { goalName: string; goalId: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoalsAndTasks = async () => {
    try {
      const res = await fetch('/api/goals', { cache: 'no-store' });
      if (res.ok) {
        const goals: GoalWithTasks[] = await res.json();
        
        const allTasks: (Task & { goalName: string; goalId: string })[] = [];
        
        goals.forEach(g => {
          if (!g.isArchived) {
            g.tasks.forEach(t => {
              if (t.targetDate && t.status !== 'COMPLETED' && !t.isArchived) {
                allTasks.push({ ...t, goalName: g.title, goalId: g.id });
              }
            });
          }
        });

        // Sort by closest date
        allTasks.sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime());
        setTasks(allTasks);
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGoalsAndTasks();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  const getDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isPast(d) && !isToday(d)) return <span className="text-rose-500 font-semibold">Overdue ({formatDistanceToNow(d)} ago)</span>;
    if (isToday(d)) return <span className="text-amber-500 font-semibold">Today</span>;
    if (isTomorrow(d)) return <span className="text-blue-500 font-semibold">Tomorrow</span>;
    return <span className="text-gray-600 font-medium">{format(d, 'MMM d, yyyy')}</span>;
  };

  return (
    <div className="p-10 max-w-4xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-blue-500" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Reminders</h1>
        </div>
        <p className="mt-2 text-gray-500 text-lg">Upcoming tasks across all your goals.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-gray-100 border-dashed">
          <Clock className="w-12 h-12 text-blue-200 mx-auto mb-4" />
          <p className="text-gray-500 italic">No upcoming reminders. Relax!</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div 
                key={task.id} 
                variants={item} 
                layout
                onClick={() => router.push(`/dashboard/goals/${task.goalId}`)}
                className="group cursor-pointer bg-white p-5 rounded-[24px] shadow-sm border border-gray-100/60 hover:shadow-md hover:border-blue-100 transition-all flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-400">From: {task.goalName}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {getDateLabel(task.targetDate!)}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
