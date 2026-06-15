import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import ThemeToggle from '../components/UI/ThemeToggle';
import { CheckSquare, LogIn } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      showToast('Logged in successfully', 'success');
      navigate('/');
    } else {
      showToast(result.error || 'Invalid credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-50 dark:bg-dark-900 transition-colors duration-200">
      {/* Brand Visual Column (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-tr from-primary-600 via-primary-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-x-20 translate-y-20" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white shadow-lg">
            <CheckSquare size={24} />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight">Taskify</span>
        </div>

        {/* Marketing tagline */}
        <div className="relative z-10 max-w-md flex flex-col gap-3">
          <h2 className="font-display font-extrabold text-4xl leading-tight tracking-tight">
            Elevate your personal workflow.
          </h2>
          <p className="text-primary-100 text-sm leading-relaxed">
            Create tasks, track statuses, and analyze completion metrics in a fast, real-time responsive dashboard designed to maximize focus.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-primary-200/80 relative z-10">
          &copy; {new Date().getFullYear()} Taskify. Production Ready Internship Project.
        </div>
      </div>

      {/* Form Form Container Column */}
      <div className="flex flex-col justify-between p-6 sm:p-12 md:p-16 lg:p-24 relative">
        {/* Top bar with theme toggle */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2 md:hidden">
            <div className="p-2 bg-primary-600 rounded-xl text-white">
              <CheckSquare size={18} />
            </div>
            <span className="font-display font-extrabold text-lg text-slate-800 dark:text-slate-100">
              Taskify
            </span>
          </div>
          
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Centered Login Box */}
        <div className="my-auto max-w-sm w-full mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-extrabold text-2xl text-slate-800 dark:text-slate-100">
              Sign In
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              error={errors.email}
              autoComplete="email"
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              icon={LogIn}
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          {/* Redirection link */}
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Small footer for mobile viewport */}
        <div className="text-center md:hidden text-xs text-slate-400 dark:text-dark-500 mt-8">
          &copy; {new Date().getFullYear()} Taskify.
        </div>
      </div>
    </div>
  );
};

export default Login;
