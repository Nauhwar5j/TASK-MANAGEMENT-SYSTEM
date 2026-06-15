import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  placeholder,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={inputId}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-dark-900 dark:border-dark-700 dark:text-slate-100 dark:placeholder-dark-500 dark:focus:bg-dark-800 ${
          error ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500 dark:border-rose-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-rose-500 font-medium px-0.5 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
