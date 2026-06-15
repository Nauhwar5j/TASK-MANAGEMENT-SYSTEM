import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 dark:border-dark-700 dark:bg-dark-800 dark:hover:bg-dark-700 dark:text-slate-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${className}`}
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun Icon */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ${
            theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
          }`}
        >
          <Sun size={20} className="text-amber-500" />
        </div>
        
        {/* Moon Icon */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ${
            theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
          }`}
        >
          <Moon size={20} className="text-indigo-400" />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
