import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass, borderClass, bgGradient }) => {
  return (
    <div className={`p-6 rounded-2xl glass-card animate-slide-up relative overflow-hidden border-l-4 ${borderClass}`}>
      {/* Background Accent Gradient */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${bgGradient} opacity-5 dark:opacity-10 rounded-bl-full pointer-events-none`} />

      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <span className="font-display font-extrabold text-3xl text-slate-800 dark:text-slate-100">
            {value}
          </span>
        </div>

        {/* Icon Bubble */}
        <div className={`p-3 rounded-xl ${colorClass} text-white shadow-sm`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
