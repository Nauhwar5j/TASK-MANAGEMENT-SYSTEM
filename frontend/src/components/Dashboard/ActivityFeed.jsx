import React from 'react';
import { PlusCircle, Edit2, Trash2, LogIn, UserPlus, HelpCircle } from 'lucide-react';

const ActivityFeed = ({ logs = [] }) => {
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'Yesterday';
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getLogConfig = (action) => {
    switch (action) {
      case 'REGISTER':
        return { icon: UserPlus, colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' };
      case 'LOGIN':
        return { icon: LogIn, colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' };
      case 'CREATE':
        return { icon: PlusCircle, colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' };
      case 'UPDATE':
        return { icon: Edit2, colorClass: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' };
      case 'DELETE':
        return { icon: Trash2, colorClass: 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' };
      default:
        return { icon: HelpCircle, colorClass: 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400' };
    }
  };

  return (
    <div className="p-6 rounded-2xl glass-panel flex flex-col gap-5 h-full">
      <div>
        <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
          Activity Logs
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Real-time updates of actions on your profile and tasks.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-slate-400 dark:text-dark-500">
            No activity logs recorded yet.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[360px] pr-1">
          {logs.map((log) => {
            const config = getLogConfig(log.action);
            const Icon = config.icon;

            return (
              <div key={log._id} className="flex gap-4 items-start group">
                {/* Timeline node */}
                <div className={`p-2.5 rounded-xl ${config.colorClass} shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                  <Icon size={16} />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-0.5 border-b border-slate-100 dark:border-dark-700/30 pb-3 group-last:border-none">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {log.details}
                  </p>
                  <span className="text-xs text-slate-400 dark:text-dark-500">
                    {formatRelativeTime(log.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
