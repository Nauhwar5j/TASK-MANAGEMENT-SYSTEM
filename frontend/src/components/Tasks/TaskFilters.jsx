import React from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Select from '../UI/Select';

const TaskFilters = ({
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
}) => {
  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'All', label: 'All Priorities' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'createdAt', label: 'Creation Date' },
    { value: 'title', label: 'Title' },
  ];

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 bg-white dark:bg-dark-800 p-4 rounded-2xl border border-slate-100 dark:border-dark-700/50 shadow-sm w-full">
      {/* Search Input */}
      <div className="relative w-full lg:flex-1">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by task title or description..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-dark-900 dark:border-dark-700 dark:text-slate-100 dark:placeholder-dark-500 dark:focus:bg-dark-800"
        />
      </div>

      {/* Select Filter Options Grid */}
      <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full lg:w-auto shrink-0">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          className="!py-2 !px-3"
        />

        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          options={priorityOptions}
          className="!py-2 !px-3"
        />

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={sortOptions}
          className="!py-2 !px-3"
        />

        {/* Sort Order Toggle */}
        <button
          onClick={toggleSortOrder}
          className="flex items-center justify-center p-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 dark:bg-dark-900 dark:border-dark-700 dark:text-slate-300 dark:hover:bg-dark-800 transition-colors shrink-0"
          title={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
        >
          {sortOrder === 'asc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
