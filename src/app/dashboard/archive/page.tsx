'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GoalCard } from '@/components/goals/GoalCard';
import type { Goal } from '@/components/goals/GoalsSection';
import { Archive, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ArchivePage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        // Filter archived
        setGoals(data.filter((g: Goal) => g.isArchived));
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGoals();
  }, []);

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this goal?')) return;
    try {
      const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleUnarchiveGoal = async (id: string) => {
    try {
      const res = await fetch(`/api/goals/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: false })
      });
      if (res.ok) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (error) {
      console.error('Failed to unarchive goal:', error);
    }
  };

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
    <div className="p-10 max-w-7xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3">
          <Archive className="w-8 h-8 text-gray-400" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Archive</h1>
        </div>
        <p className="mt-2 text-gray-500 text-lg">Your completed and archived goals live here.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-gray-100 border-dashed">
          <Archive className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 italic">No archived goals.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {goals.map((goal) => (
              <motion.div key={goal.id} variants={item} layout>
                <div className="relative group">
                  <GoalCard
                    goal={goal}
                    onDelete={() => handleDeleteGoal(goal.id)}
                    onViewTasks={() => router.push(`/dashboard/goals/${goal.id}`)}
                  />
                  {/* Overlay button to unarchive */}
                  <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" onClick={() => handleUnarchiveGoal(goal.id)}>
                      Restore Goal
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
