import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import ThemeToggle from '../UI/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/tasks':
        return 'Tasks';
      default:
        return 'Taskify';
    }
  };

  return (
    <header className="h-16 px-6 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-slate-100 dark:border-dark-700/50 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Hamburger Mobile trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-xl text-slate-600 dark:text-slate-300"
          aria-label="Open Sidebar"
        >
          <Menu size={20} />
        </button>
        
        {/* Page Title */}
        <h1 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User initials bubble */}
        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
              {user.name}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
