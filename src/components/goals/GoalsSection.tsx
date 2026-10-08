'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AIGeneratorDialog } from '@/components/goals/AIGeneratorDialog';
import { GoalCard } from '@/components/goals/GoalCard';
import { Plus, Cpu } from 'lucide-react';

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
  let ignore = false;

  const loadGoals = async () => {
    try {
      const res = await fetch('/api/goals', { cache: 'no-store' });

      if (res.ok) {
        const data = await res.json();

        if (!ignore) {
          setGoals(data);
        }
      }
    } catch (error) {
      if (!ignore) {
        console.error('Failed to fetch goals:', error);
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadGoals();

  return () => {
    ignore = true;
  };
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

  return (
    <div className="pb-20">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E8E6DF] shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all font-mono ${
                activeTab === tab
                  ? 'bg-[#141413] text-[#FAF9F5]'
                  : 'text-[#73726D] hover:text-[#141413] hover:bg-[#FAF9F5]'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Generate Goal CTA */}
        <button
          onClick={() => setIsAIDialogOpen(true)}
          className="w-full sm:w-auto bg-[#141413] hover:bg-[#2A2927] text-[#FAF9F5] text-xs font-semibold px-4 py-2.5 rounded-md transition-all flex items-center justify-center gap-2 shadow-sm tactile-btn"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Decompose Goal with AI</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 font-mono text-xs text-[#73726D]">
          QUERYING DATABASE GOALS...
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#E8E6DF] p-8">
          <p className="font-mono text-xs text-[#73726D] mb-4">NO GOALS FOUND IN THIS CATEGORY</p>
          <Button
            onClick={() => setIsAIDialogOpen(true)}
            variant="outline"
            className="rounded-md border-[#E8E6DF] text-xs font-semibold text-[#141413] hover:bg-[#FAF9F5]"
          >
            Create Your First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredGoals.map((goal) => (
              <motion.div key={goal.id} layout>
                <GoalCard
                  goal={goal}
                  onDelete={() => handleDeleteGoal(goal.id)}
                  onArchive={() => handleArchiveGoal(goal.id)}
                  onTogglePriority={() => handleTogglePriority(goal)}
                  onViewTasks={() => openTasksSheet(goal)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AIGeneratorDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        onSuccess={fetchGoals}
      />
    </div>
  );
}
