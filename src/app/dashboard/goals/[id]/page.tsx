'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, ArrowLeft, Calendar, Flag, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  targetDate: string | null;
  aiGenerated: boolean;
  isArchived: boolean;
  order: number;
  goalId: string;
};

export type Goal = {
  id: string;
  title: string;
  description: string | null;
};

export default function GoalTasksPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const goalRes = await fetch(`/api/goals/${id}`, { cache: 'no-store' });
      if (goalRes.ok) {
        const goalData = await goalRes.json();
        setGoal(goalData);
      }

      const tasksRes = await fetch(`/api/goals/${id}/tasks`, { cache: 'no-store' });
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to toggle status:', err);
      fetchData();
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto w-full font-mono text-xs text-[#73726D] py-20 text-center">
        FETCHING TASK TREE...
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="p-8 max-w-4xl mx-auto w-full text-center py-20">
        <p className="font-mono text-xs text-[#73726D] mb-4">GOAL NOT FOUND</p>
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-[#141413] text-[#FAF9F5] text-xs font-semibold"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto w-full pb-24">
      {/* Back button */}
      <button 
        onClick={() => { router.refresh(); router.push('/dashboard'); }} 
        className="inline-flex items-center text-xs font-semibold text-[#73726D] hover:text-[#141413] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
        Back to Dashboard
      </button>

      {/* Header Panel */}
      <div className="bg-white border border-[#E8E6DF] rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E8E6DF]">
          <div>
            <span className="font-mono text-[10px] font-bold text-[#73726D] uppercase tracking-widest block mb-1">
              EXECUTION TREE
            </span>
            <h1 className="text-2xl font-bold text-[#141413] tracking-tight">{goal.title}</h1>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-[#73726D]">{completedCount}/{tasks.length} DONE</span>
            <div className="w-24 h-2 bg-[#F2F1EC] rounded-full overflow-hidden border border-[#E8E6DF]">
              <div
                className="h-full bg-[#141413] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="font-bold text-[#141413]">{progressPct}%</span>
          </div>
        </div>

        {goal.description && (
          <p className="text-xs text-[#52514D] leading-relaxed max-w-2xl">{goal.description}</p>
        )}
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[#E8E6DF] p-8">
          <p className="font-mono text-xs text-[#73726D]">NO TASKS GENERATED FOR THIS GOAL</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task, index) => {
              const isCompleted = task.status === 'COMPLETED';
              return (
                <motion.div 
                  layout
                  key={task.id} 
                  className={`p-4 rounded-lg border transition-all flex items-start gap-3.5 ${
                    isCompleted
                      ? 'bg-[#FAF9F5] border-[#E8E6DF] opacity-75'
                      : 'bg-white border-[#E8E6DF] hover:border-[#141413]/30 shadow-sm'
                  }`}
                >
                  {/* Custom Checkbox */}
                  <button 
                    onClick={() => toggleTaskStatus(task)}
                    className={`flex-shrink-0 w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                      isCompleted 
                        ? 'bg-[#141413] border-[#141413] text-white' 
                        : 'border-[#D1CEC4] hover:border-[#141413]'
                    }`}
                  >
                    {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  
                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={`font-semibold text-sm transition-all ${
                        isCompleted ? 'text-[#73726D] line-through' : 'text-[#141413]'
                      }`}>
                        {task.title}
                      </h3>
                      
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="p-1 text-[#A3A199] hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {task.description && !isCompleted && (
                      <p className="text-xs text-[#52514D] leading-relaxed mt-1.5">{task.description}</p>
                    )}

                    <div className="flex items-center gap-3 mt-3 font-mono text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                        task.priority === 'HIGH'
                          ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5]'
                          : task.priority === 'MEDIUM'
                          ? 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                          : 'bg-[#F0FDF4] text-[#166534] border border-[#86EFAC]'
                      }`}>
                        {task.priority}
                      </span>

                      {task.targetDate && (
                        <span className="text-[#73726D] bg-[#F2F1EC] px-2 py-0.5 rounded border border-[#E8E6DF]">
                          DUE: {format(new Date(task.targetDate), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
