import React, { useEffect, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskStats from '../components/Dashboard/TaskStats';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import TaskCard from '../components/Tasks/TaskCard';
import TaskFormModal from '../components/Tasks/TaskFormModal';
import { Plus, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, statsLoading, fetchDashboardStats, updateTask } = useTasks();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleTaskUpdate = async (taskData) => {
    if (editingTask) {
      return await updateTask(editingTask._id, taskData);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-primary-200/50 dark:shadow-none relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl pointer-events-none translate-y-12" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-primary-100 text-sm max-w-md">
              Here is your productivity overview for today. Check your metrics, logs, and pending schedules.
            </p>
          </div>
        </div>
      </div>

      {statsLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={36} className="text-primary-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Task Stats Overview */}
          <TaskStats stats={stats} />

          {/* Detailed sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Recent Tasks List */}
            <div className="lg:col-span-2 p-6 bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-dark-700/50 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
                    Recent Tasks
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your most recently updated task schedules.
                  </p>
                </div>
                
                <Link
                  to="/tasks"
                  className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View All Tasks
                  <ArrowRight size={14} />
                </Link>
              </div>

              {stats.recentTasks.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400 dark:text-dark-500">
                  No tasks created yet. Click on "Tasks" route to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stats.recentTasks.slice(0, 4).map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditClick}
                      onDelete={() => {
                        // Deletes trigger automatic stats refreshes via Socket.IO
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Activity Logs Feed */}
            <div className="h-full">
              <ActivityFeed logs={stats.activityLogs} />
            </div>
          </div>
        </>
      )}

      {/* Editing Modal */}
      {isModalOpen && (
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleTaskUpdate}
          task={editingTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
