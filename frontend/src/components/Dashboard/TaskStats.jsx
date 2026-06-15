import React from 'react';
import { ClipboardList, CheckCircle2, Loader2, Clock, Percent } from 'lucide-react';
import StatCard from './StatCard';

const TaskStats = ({ stats }) => {
  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    completionPercentage,
  } = stats;

  const cardStats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ClipboardList,
      colorClass: 'bg-primary-500',
      borderClass: 'border-primary-500',
      bgGradient: 'from-primary-500 to-indigo-500',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      colorClass: 'bg-emerald-500',
      borderClass: 'border-emerald-500',
      bgGradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Loader2,
      colorClass: 'bg-blue-500',
      borderClass: 'border-blue-500',
      bgGradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock,
      colorClass: 'bg-amber-500',
      borderClass: 'border-amber-500',
      bgGradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cardStats.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div>

      {/* Completion Percentage Progress Banner */}
      <div className="p-6 rounded-2xl glass-card border border-slate-100 dark:border-dark-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 text-white rounded-xl shadow-md">
            <Percent size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              Task Completion Status
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You have completed {completedTasks} out of {totalTasks} total tasks assigned.
            </p>
          </div>
        </div>

        {/* Custom Progress Bar Indicator */}
        <div className="w-full md:w-80 flex flex-col gap-2 shrink-0">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="text-primary-600 dark:text-primary-400">{completionPercentage}%</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-dark-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
