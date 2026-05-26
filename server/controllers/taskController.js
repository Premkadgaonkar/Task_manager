const Task = require('../models/Task');

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, category, priority, sort = '-createdAt' } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort(sort);
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, deadline, category, estimatedMinutes, tags } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      deadline,
      category,
      estimatedMinutes,
      tags,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/tasks/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [total, completed, inProgress, todo, todayCompleted] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'completed' }),
      Task.countDocuments({ user: userId, status: 'in-progress' }),
      Task.countDocuments({ user: userId, status: 'todo' }),
      Task.countDocuments({
        user: userId,
        status: 'completed',
        completedAt: { $gte: startOfDay },
      }),
    ]);

    // Category breakdown
    const categoryStats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Priority breakdown
    const priorityStats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Last 7 days completion data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyData = await Task.aggregate([
      {
        $match: {
          user: userId,
          status: 'completed',
          completedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // AI Suggestions: Best working hours based on completedAt times
    const hourlyData = await Task.aggregate([
      {
        $match: { user: userId, status: 'completed', completedAt: { $ne: null } },
      },
      {
        $group: {
          _id: { $hour: '$completedAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const productivityScore =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      analytics: {
        overview: { total, completed, inProgress, todo, todayCompleted },
        productivityScore,
        categoryStats,
        priorityStats,
        weeklyData,
        bestWorkingHours: hourlyData.slice(0, 3),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI scheduling suggestions
// @route   GET /api/tasks/suggestions
// @access  Private
const getSuggestions = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get pending tasks sorted by priority + deadline
    const pendingTasks = await Task.find({
      user: userId,
      status: { $ne: 'completed' },
      deadline: { $ne: null },
    }).sort({ priority: -1, deadline: 1 });

    // Find best working hours
    const hourlyData = await Task.aggregate([
      { $match: { user: userId, status: 'completed', completedAt: { $ne: null } } },
      { $group: { _id: { $hour: '$completedAt' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

    const suggestions = pendingTasks.slice(0, 5).map((task, idx) => {
      const hourSlot = hourlyData[idx % hourlyData.length];
      const suggestedHour = hourSlot ? hourSlot._id : 9 + idx;
      const daysUntilDeadline = task.deadline
        ? Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        taskId: task._id,
        title: task.title,
        priority: task.priority,
        suggestedTime: `${suggestedHour.toString().padStart(2, '0')}:00`,
        reason:
          daysUntilDeadline !== null && daysUntilDeadline <= 1
            ? '🚨 Due very soon! Prioritize immediately.'
            : `✨ You're most productive around ${suggestedHour}:00 based on your history.`,
        urgencyScore: (priorityOrder[task.priority] || 1) + (daysUntilDeadline !== null ? Math.max(0, 10 - daysUntilDeadline) : 0),
      };
    });

    suggestions.sort((a, b) => b.urgencyScore - a.urgencyScore);

    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getAnalytics, getSuggestions };
