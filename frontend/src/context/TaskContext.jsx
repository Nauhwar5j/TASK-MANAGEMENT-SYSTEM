import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completionPercentage: 0,
    recentTasks: [],
    activityLogs: [],
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // Filters, search, sorting
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch stats helper
  const fetchDashboardStats = useCallback(async () => {
    if (!user) return;
    setStatsLoading(true);
    try {
      const res = await api.get('/tasks/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [user]);

  // Fetch tasks helper
  const fetchTasks = useCallback(async (page = 1) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/tasks', {
        params: {
          page,
          limit: 6, // 6 items per page looks excellent in a grid!
          status: statusFilter,
          priority: priorityFilter,
          search,
          sortBy,
          sortOrder,
        },
      });
      setTasks(res.data.tasks);
      setTotalTasks(res.data.total);
      setCurrentPage(res.data.page);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [user, statusFilter, priorityFilter, search, sortBy, sortOrder]);

  // Handle Fetching
  useEffect(() => {
    if (user) {
      fetchTasks(1);
      fetchDashboardStats();
    } else {
      setTasks([]);
      setTotalTasks(0);
    }
  }, [user, fetchTasks, fetchDashboardStats]);

  // Task Actions
  const createTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      // Let Socket.IO trigger list refreshes, but we also return the result
      return { success: true, task: res.data };
    } catch (error) {
      console.error('Error creating task:', error);
      const message = error.response?.data?.message || 'Failed to create task';
      return { success: false, error: message };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      return { success: true, task: res.data };
    } catch (error) {
      console.error('Error updating task:', error);
      const message = error.response?.data?.message || 'Failed to update task';
      return { success: false, error: message };
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      const message = error.response?.data?.message || 'Failed to delete task';
      return { success: false, error: message };
    }
  };

  // Socket.IO Setup
  useEffect(() => {
    if (!user) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl);

    socket.on('connect', () => {
      socket.emit('join_user', user._id);
    });

    socket.on('task_created', () => {
      fetchTasks(currentPage);
      fetchDashboardStats();
    });

    socket.on('task_updated', () => {
      fetchTasks(currentPage);
      fetchDashboardStats();
    });

    socket.on('task_deleted', () => {
      // If we delete the last task on a page, return to previous page
      const nextTasksCount = tasks.length - 1;
      const targetPage = nextTasksCount === 0 && currentPage > 1 ? currentPage - 1 : currentPage;
      fetchTasks(targetPage);
      fetchDashboardStats();
    });

    return () => {
      socket.disconnect();
    };
  }, [user, currentPage, tasks.length, fetchTasks, fetchDashboardStats]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        totalTasks,
        currentPage,
        totalPages,
        loading,
        stats,
        statsLoading,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        fetchTasks,
        fetchDashboardStats,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
