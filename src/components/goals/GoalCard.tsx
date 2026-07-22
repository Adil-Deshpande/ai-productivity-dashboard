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
  const isCompleted = goal.status === 'COMPLETED';
  const isImportant = goal.priority === 'HIGH';

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white border border-[#E8E6DF] rounded-xl p-5 shadow-sm flex flex-col h-full hover:border-[#141413]/30 transition-all"
    >
      {/* Header Area */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold text-[#141413] text-base leading-snug">
          {goal.title}
        </h3>
        
        {/* Status Tag */}
        <span
          className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border flex-shrink-0 uppercase tracking-wider ${
            isCompleted
              ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
              : goal.status === 'IN_PROGRESS'
              ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
              : 'bg-[#FAF9F5] text-[#73726D] border-[#E8E6DF]'
          }`}
        >
          {goal.status}
        </span>
      </div>

      {/* Meta Info Bar */}
      <div className="flex items-center justify-between mb-3 text-xs text-[#73726D]">
        <span className="font-mono text-[10px]">
          {goal.targetDate ? `DUE: ${format(new Date(goal.targetDate), 'MMM d, yyyy')}` : 'NO DEADLINE'}
        </span>

        <div className="flex items-center gap-1">
          {onTogglePriority && (
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePriority(); }} 
              className={`p-1 rounded transition-colors ${isImportant ? 'text-[#D97706] bg-[#FEF3C7]' : 'text-[#A3A199] hover:text-[#D97706] hover:bg-[#FAF9F5]'}`}
              title={isImportant ? "Remove Important" : "Mark as Important"}
            >
              <Star className="w-3.5 h-3.5" fill={isImportant ? "currentColor" : "none"} />
            </button>
          )}
          {onArchive && (
            <button
              onClick={(e) => { e.stopPropagation(); onArchive(); }}
              className="p-1 text-[#A3A199] hover:text-[#141413] hover:bg-[#FAF9F5] rounded transition-colors"
              title="Archive Goal"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-[#A3A199] hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors"
            title="Delete Goal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[#52514D] mb-6 leading-relaxed line-clamp-3 flex-1">
        {goal.description || 'No detailed description provided.'}
      </p>

      {/* Action Button */}
      <Button 
        onClick={onViewTasks}
        className={`w-full rounded-md h-9 text-xs font-semibold transition-all shadow-none ${
          isCompleted 
            ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] hover:bg-[#D1FAE5]' 
            : 'bg-[#141413] text-[#FAF9F5] hover:bg-[#2A2927] tactile-btn'
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Completed
          </>
        ) : (
          <>
            <span>View Task Tree</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </>
        )}
      </Button>
    </motion.div>
  );
}
