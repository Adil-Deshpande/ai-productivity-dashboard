'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, ArrowLeft, Calendar, Flag, AlignLeft } from 'lucide-react';
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
      // Fetch Goal
      const goalRes = await fetch(`/api/goals/${id}`, { cache: 'no-store' });
      if (goalRes.ok) {
        const goalData = await goalRes.json();
        setGoal(goalData);
      }

      // Fetch Tasks
      const tasksRes = await fetch(`/api/goals/${id}/tasks`);
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    
    // Optimistic update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to toggle status:', err);
      fetchData(); // Revert on error
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-500 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-blue-500 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="p-10 max-w-4xl mx-auto w-full text-center py-20 text-gray-500">
        Loading tasks...
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="p-10 max-w-4xl mx-auto w-full text-center py-20 text-gray-500">
        Goal not found.
        <br/>
        <Button variant="link" onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 max-w-4xl mx-auto w-full pb-24">
      {/* Header */}
      <div className="mb-10">
        <button 
          onClick={() => { router.refresh(); router.push('/dashboard'); }} 
          className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">To Do List</h1>
          <div className="text-3xl">📝</div>
        </div>
        <p className="text-lg text-gray-500">{goal.title}</p>
        {goal.description && <p className="text-sm text-gray-400 mt-2 max-w-2xl">{goal.description}</p>}
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-gray-100 border-dashed">
          <p className="text-gray-500 italic">No tasks found for this goal.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <AnimatePresence>
            {tasks.map(task => {
              const isCompleted = task.status === 'COMPLETED';
              return (
                <motion.div 
                  layout
                  variants={item}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id} 
                  className={`p-5 rounded-[24px] transition-all duration-500 flex items-start gap-4 ${
                    isCompleted ? 'bg-emerald-50/40 border-emerald-100/50 shadow-inner' : 'bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border-gray-100/60 hover:shadow-md'
                  }`}
                >
                  {/* Checkbox */}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTaskStatus(task)}
                    className={`flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                      isCompleted ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-400'
                    }`}
                  >
                    {isCompleted ? (
                      <motion.div initial={{ scale: 0.5, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' as const, stiffness: 400, damping: 15 }}>
                        <CheckCircle2 className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </motion.button>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className={`font-semibold text-lg transition-all duration-500 ${
                        isCompleted ? 'text-gray-400 line-through decoration-emerald-200' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      
                      {/* Delete button */}
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="flex-shrink-0 p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {!isCompleted && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-2 overflow-hidden"
                        >
                          {task.description && (
                            <div className="flex items-start gap-2 text-sm text-gray-500">
                              <AlignLeft className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                              <p className="leading-relaxed">{task.description}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 mt-3">
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              <Flag className="w-3 h-3" />
                              {task.priority}
                            </div>
                            
                            {task.targetDate && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                {format(new Date(task.targetDate), 'MMM d, yyyy')}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
