import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../UI/Input';
import Select from '../UI/Select';
import Button from '../UI/Button';
import { useToast } from '../../context/ToastContext';

const TaskFormModal = ({ isOpen, onClose, onSubmit, task = null }) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'Pending');
      setPriority(task.priority || 'Medium');
      // Format date to YYYY-MM-DD for html input
      if (task.dueDate) {
        setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }
    } else {
      // Clear fields for new task
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setPriority('Medium');
      setDueDate('');
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
    };

    const result = await onSubmit(taskData);
    setIsSubmitting(false);

    if (result.success) {
      showToast(
        task ? 'Task updated successfully' : 'Task created successfully',
        'success'
      );
      onClose();
    } else {
      showToast(result.error || 'Failed to save task', 'error');
    }
  };

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      {/* Modal Dialog */}
      <div className="bg-white dark:bg-dark-800 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-dark-700/50 overflow-hidden transform animate-slide-up duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-dark-700/50">
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 dark:hover:bg-dark-700 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-5">
          {/* Title */}
          <Input
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design UI components"
            error={errors.title}
          />

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description for this task..."
              rows={4}
              className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-dark-900 dark:border-dark-700 dark:text-slate-100 dark:placeholder-dark-500 dark:focus:bg-dark-800 ${
                errors.description ? 'border-rose-500 focus:ring-rose-500/20' : ''
              }`}
            />
            {errors.description && (
              <span className="text-xs text-rose-500 font-medium px-0.5 mt-0.5">
                {errors.description}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
            />

            {/* Priority */}
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={priorityOptions}
            />
          </div>

          {/* Due Date */}
          <Input
            type="date"
            label="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={errors.dueDate}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-dark-700/50">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
