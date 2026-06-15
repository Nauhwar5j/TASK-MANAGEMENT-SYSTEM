import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import TaskFilters from '../components/Tasks/TaskFilters';
import TaskCard from '../components/Tasks/TaskCard';
import TaskFormModal from '../components/Tasks/TaskFormModal';
import Button from '../components/UI/Button';
import { Plus, ArrowLeft, ArrowRight, Loader2, ClipboardList } from 'lucide-react';

const Tasks = () => {
  const { showToast } = useToast();
  const {
    tasks,
    totalTasks,
    currentPage,
    totalPages,
    loading,
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
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (taskData) => {
    if (editingTask) {
      return await updateTask(editingTask._id, taskData);
    } else {
      return await createTask(taskData);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(id);
      if (result.success) {
        showToast('Task deleted successfully', 'success');
      } else {
        showToast(result.error || 'Failed to delete task', 'error');
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchTasks(page);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100">
            Task Directory
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage, filter, sort, and organize all your assigned tasks.
          </p>
        </div>
        
        <Button
          onClick={handleCreateClick}
          icon={Plus}
          className="shadow-md shadow-primary-200 dark:shadow-none shrink-0"
        >
          Add New Task
        </Button>
      </div>

      {/* Filters Bar */}
      <TaskFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Task List Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 size={36} className="text-primary-500 animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-dark-800 border border-slate-100 dark:border-dark-700/50 rounded-2xl text-center shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-dark-900 rounded-full text-slate-400 dark:text-dark-600 mb-4">
            <ClipboardList size={36} />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg mb-1">
            No Tasks Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            We couldn't find any tasks matching your queries. Create a new task or adjust your filters.
          </p>
          <Button onClick={handleCreateClick} icon={Plus} size="sm">
            Create First Task
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-white dark:bg-dark-800 p-4 border border-slate-100 dark:border-dark-700/50 rounded-2xl shadow-sm mt-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Showing page {currentPage} of {totalPages}
              </span>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  icon={ArrowLeft}
                >
                  Prev
                </Button>
                
                <div className="hidden sm:flex items-center gap-1">
                  {[...Array(totalPages).keys()].map((index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-primary-600 text-white'
                            : 'hover:bg-slate-50 text-slate-600 dark:hover:bg-dark-700 dark:text-slate-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex-row-reverse"
                >
                  <span className="flex items-center gap-1.5">
                    Next
                    <ArrowRight size={14} />
                  </span>
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          task={editingTask}
        />
      )}
    </div>
  );
};

export default Tasks;
