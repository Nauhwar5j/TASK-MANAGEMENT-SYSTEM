const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const { emitToUser } = require('../socket');

// @desc    Get all tasks with search, filter, sort, and pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query criteria
    const query = { user: req.user._id };

    // Filter by Status
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    // Filter by Priority
    if (req.query.priority && req.query.priority !== 'All') {
      query.priority = req.query.priority;
    }

    // Search query (matches title or description case-insensitively)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    // Sorting
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Execute queries
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (!dueDate) {
      return res.status(400).json({ message: 'Due date is required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate,
    });

    // Create activity log
    await ActivityLog.create({
      user: req.user._id,
      action: 'CREATE',
      taskTitle: task.title,
      details: `Created task "${task.title}"`,
    });

    // Broadcast update via Socket.IO
    emitToUser(req.user._id, 'task_created', task);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const id = req.params.id;

    // Verify task exists and belongs to this user
    let task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Capture changes for activity log
    const changes = [];
    if (title && title !== task.title) changes.push(`title`);
    if (description !== undefined && description !== task.description) changes.push(`description`);
    if (status && status !== task.status) changes.push(`status to "${status}"`);
    if (priority && priority !== task.priority) changes.push(`priority to "${priority}"`);
    if (dueDate && new Date(dueDate).getTime() !== new Date(task.dueDate).getTime()) changes.push(`due date`);

    // Update fields
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();

    // Log Activity
    if (changes.length > 0) {
      await ActivityLog.create({
        user: req.user._id,
        action: 'UPDATE',
        taskTitle: updatedTask.title,
        details: `Updated task "${updatedTask.title}" (${changes.join(', ')})`,
      });
    }

    // Broadcast update via Socket.IO
    emitToUser(req.user._id, 'task_updated', updatedTask);

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    // Verify task exists and belongs to this user
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete the task
    await Task.deleteOne({ _id: id });

    // Create activity log
    await ActivityLog.create({
      user: req.user._id,
      action: 'DELETE',
      taskTitle: task.title,
      details: `Deleted task "${task.title}"`,
    });

    // Broadcast update via Socket.IO
    emitToUser(req.user._id, 'task_deleted', { _id: id });

    res.json({ message: 'Task deleted successfully', _id: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics and activity feed
// @route   GET /api/tasks/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count states
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ user: userId, status: 'Pending' });
    const inProgressTasks = await Task.countDocuments({ user: userId, status: 'In Progress' });

    // Calculate Completion Percentage
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Fetch recent tasks (latest updated/created)
    const recentTasks = await Task.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(5);

    // Fetch user activity logs
    const activityLogs = await ActivityLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completionPercentage,
      recentTasks,
      activityLogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
};
