import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LogOut, CheckSquare as LogoIcon, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  const handleLogout = () => {
    logout();
  };

  const activeLinkClass = "flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 rounded-xl font-medium transition-all duration-200";
  const inactiveLinkClass = "flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800/50 rounded-xl font-medium transition-all duration-200";

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-dark-800 border-r border-slate-100 dark:border-dark-700/50 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between p-6`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo / Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-xl shadow-md text-white">
                <LogoIcon size={20} />
              </div>
              <span className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
                Taskify
              </span>
            </div>
            
            {/* Mobile Close Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-lg text-slate-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* User profile brief */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-dark-900/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 font-bold flex items-center justify-center text-sm border border-primary-200/50 dark:border-primary-900/50">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Action */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-xl font-medium transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
