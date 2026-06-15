import React from 'react';
import { Calendar, AlertCircle, Edit3, Trash2, Clock } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { title, description, status, priority, dueDate, _id } = task;

  const isOverdue = () => {
    if (status === 'Completed') return false;
    return new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
  };

  const getStatusStyles = (statusVal) => {
    switch (statusVal) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50';
    }
  };

  const getPriorityStyles = (priorityVal) => {
    switch (priorityVal) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50';
      case 'Medium':
        return 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-dark-900 dark:text-slate-400 dark:border-dark-700/50';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`p-6 rounded-2xl glass-card relative flex flex-col justify-between gap-5 border-t-4 transition-all duration-300 animate-slide-up ${
      isOverdue()
        ? 'border-t-rose-500 shadow-sm shadow-rose-50 dark:shadow-none'
        : status === 'Completed'
        ? 'border-t-emerald-500'
        : 'border-t-primary-500'
    }`}>
      {/* Card Header & Badges */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge */}
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getStatusStyles(status)}`}>
            {status}
          </span>
          {/* Priority Badge */}
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getPriorityStyles(priority)}`}>
            {priority} Priority
          </span>

          {/* Overdue Badge */}
          {isOverdue() && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/50">
              <AlertCircle size={12} />
              Overdue
            </span>
          )}
        </div>

        {/* Task Title */}
        <h4 className={`font-semibold text-lg leading-snug tracking-tight text-slate-800 dark:text-slate-100 ${
          status === 'Completed' ? 'line-through opacity-60' : ''
        }`}>
          {title}
        </h4>

        {/* Task Description */}
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-dark-700/30">
        {/* Due Date */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Calendar size={14} className="text-slate-400" />
          <span className={isOverdue() ? 'text-rose-500 font-semibold' : ''}>
            {formatDate(dueDate)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:text-slate-400 dark:hover:text-primary-400 dark:hover:bg-primary-950/20 rounded-xl transition-colors"
            title="Edit Task"
          >
            <Edit3 size={16} />
          </button>
          
          <button
            onClick={() => onDelete(_id)}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
