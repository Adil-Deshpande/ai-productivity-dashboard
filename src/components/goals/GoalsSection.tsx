'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AIGeneratorDialog } from '@/components/goals/AIGeneratorDialog';
import { GoalCard } from '@/components/goals/GoalCard';

export type Goal = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  targetDate: string | null;
  aiGenerated: boolean;
  isArchived: boolean;
};

type TabType = 'All' | 'Completed' | 'In-Progress' | 'Pending';

export function GoalsSection() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('All');

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/goals', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
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
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleArchiveGoal = async (id: string) => {
    try {
      const res = await fetch(`/api/goals/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: true })
      });
      if (res.ok) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (error) {
      console.error('Failed to archive goal:', error);
    }
  };

  const handleTogglePriority = async (goal: Goal) => {
    try {
      const newPriority = goal.priority === 'HIGH' ? 'MEDIUM' : 'HIGH';
      const res = await fetch(`/api/goals/${goal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority })
      });
      if (res.ok) {
        setGoals((prev) => prev.map((g) => g.id === goal.id ? { ...g, priority: newPriority } : g));
      }
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const openTasksSheet = (goal: Goal) => {
    router.push(`/dashboard/goals/${goal.id}`);
  };

  const filteredGoals = goals.filter((g) => {
    if (g.isArchived) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'Completed') return g.status === 'COMPLETED';
    if (activeTab === 'In-Progress') return g.status === 'IN_PROGRESS';
    if (activeTab === 'Pending') return g.status === 'PENDING';
    return true;
  });

  const tabs: TabType[] = ['All', 'Completed', 'In-Progress', 'Pending'];

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
      {/* Top Controls Area */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        {/* Custom Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium rounded-xl transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab === 'All' ? 'All Goals' : tab}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Button 
              onClick={() => setIsAIDialogOpen(true)} 
              className="w-full sm:w-auto bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white shadow-lg shadow-purple-500/30 border-0 rounded-2xl h-12 px-6 font-semibold text-base"
            >
              <span className="mr-2 text-lg">✨</span> Generate with AI
            </Button>
          </motion.div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 animate-pulse font-medium">Loading your goals...</div>
      ) : filteredGoals.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white/50 rounded-[32px] border-2 border-dashed border-gray-200"
        >
          <p className="text-gray-500 mb-6 text-lg">No goals found for this category.</p>
          <Button onClick={() => setIsAIDialogOpen(true)} variant="outline" className="rounded-xl h-11 border-gray-300 text-gray-700 hover:bg-gray-50">
            Generate your first goal
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredGoals.map((goal) => (
              <motion.div key={goal.id} variants={item} layout>
                <GoalCard
                  goal={goal}
                  onDelete={() => handleDeleteGoal(goal.id)}
                  onArchive={() => handleArchiveGoal(goal.id)}
                  onTogglePriority={() => handleTogglePriority(goal)}
                  onViewTasks={() => openTasksSheet(goal)}
                /></motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AIGeneratorDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        onSuccess={fetchGoals}
      />
    </motion.div>
  );
}
