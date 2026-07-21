import { Goal } from '@/components/goals/GoalsSection';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trash2, ArrowRight, Archive, Star } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

type GoalCardProps = {
  goal: Goal;
  onViewTasks: () => void;
  onDelete: () => void;
  onArchive?: () => void;
  onTogglePriority?: () => void;
};

export function GoalCard({ goal, onViewTasks, onDelete, onArchive, onTogglePriority }: GoalCardProps) {
  // Determine color based on status/priority
  const isCompleted = goal.status === 'COMPLETED';
  const isImportant = goal.priority === 'HIGH';
  
  const ringColor = isCompleted 
    ? 'border-emerald-500' 
    : goal.status === 'IN_PROGRESS' 
      ? 'border-blue-500' 
      : 'border-rose-500';

  const dotColor = isCompleted 
    ? 'bg-emerald-500' 
    : goal.status === 'IN_PROGRESS' 
      ? 'bg-blue-500' 
      : 'bg-rose-500';

  const bgGradient = isCompleted 
    ? 'bg-gradient-to-br from-emerald-50/50 to-white border-emerald-100' 
    : goal.status === 'IN_PROGRESS'
      ? 'bg-gradient-to-br from-blue-50/50 to-white border-blue-100'
      : 'bg-gradient-to-br from-rose-50/50 to-white border-rose-100';

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      className={`rounded-[24px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border flex flex-col h-full transition-shadow hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] ${bgGradient}`}
    >
      {/* Header Area */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight pr-4">
          {goal.title}
        </h3>
        {/* Status Ring */}
        <div className={`w-5 h-5 rounded-full border-2 ${ringColor} flex items-center justify-center flex-shrink-0 mt-1 shadow-sm`}>
           <motion.div 
             initial={false}
             animate={{ scale: isCompleted ? [1, 1.5, 1] : 1 }}
             transition={{ duration: 0.3 }}
             className={`w-2 h-2 rounded-full ${dotColor}`} 
           />
        </div>
      </div>

      {/* Meta info (Target Date / AI) */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-400 bg-white/60 px-2 py-1 rounded-md shadow-sm border border-gray-50">
          {goal.targetDate ? `Due ${format(new Date(goal.targetDate), 'MMM d, yyyy')}` : 'No due date'}
        </span>
        <div className="flex items-center gap-1">
          {onTogglePriority && (
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePriority(); }} 
              className={`transition-colors p-1.5 rounded-full ${isImportant ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-500 hover:bg-amber-50/80'}`}
              title={isImportant ? "Remove Important" : "Mark as Important"}
            >
              <Star className="w-4 h-4" fill={isImportant ? "currentColor" : "none"} />
            </button>
          )}
          {onArchive && (
            <button onClick={(e) => { e.stopPropagation(); onArchive(); }} className="text-gray-300 hover:text-amber-500 transition-colors p-1.5 rounded-full hover:bg-amber-50/80">
              <Archive className="w-4 h-4" />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50/80">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-8 leading-relaxed line-clamp-3 flex-1">
        {goal.description || 'No description provided for this goal.'}
      </p>

      {/* Action Button */}
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button 
          onClick={onViewTasks}
          className={`w-full rounded-xl h-11 font-medium transition-all shadow-sm ${
            isCompleted 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-transparent' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2 text-white" />
              Completed
            </>
          ) : (
            <>
              View Tasks
              <ArrowRight className="w-4 h-4 ml-2 text-gray-400" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
