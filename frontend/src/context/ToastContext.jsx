import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-slide-up duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-900/50 dark:text-emerald-300'
                : toast.type === 'error'
                ? 'bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-950/80 dark:border-rose-900/50 dark:text-rose-300'
                : toast.type === 'warning'
                ? 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-950/80 dark:border-amber-900/50 dark:text-amber-300'
                : 'bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-950/80 dark:border-blue-900/50 dark:text-blue-300'
            }`}
            role="alert"
          >
            {/* Icon */}
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-500" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-rose-500" />}
              {toast.type === 'warning' && <AlertTriangle size={18} className="text-amber-500" />}
              {toast.type === 'info' && <Info size={18} className="text-blue-500" />}
            </div>

            {/* Content */}
            <div className="flex-1 text-sm font-medium">{toast.message}</div>

            {/* Dismiss button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={16} className="opacity-60 hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
