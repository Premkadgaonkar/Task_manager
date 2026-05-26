import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiTrash2, FiEdit3, FiCheck, FiClock, FiFlag,
  FiFilter, FiSearch, FiX, FiCalendar
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import useTaskStore from '../store/taskStore';

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#10b981', bg: '#10b98120' },
  medium: { label: 'Medium', color: '#f59e0b', bg: '#f59e0b20' },
  high: { label: 'High', color: '#f97316', bg: '#f9731620' },
  critical: { label: 'Critical', color: '#ef4444', bg: '#ef444420' },
};

const STATUS_CONFIG = {
  todo: { label: 'To Do', color: '#6b7280' },
  'in-progress': { label: 'In Progress', color: '#00d4ff' },
  completed: { label: 'Completed', color: '#10b981' },
};

const CATEGORIES = ['Work', 'Study', 'Personal', 'Health', 'Other'];

const TaskModal = ({ task, onClose, onSave }) => {
  const [form, setForm] = useState(
    task || { title: '', description: '', priority: 'medium', status: 'todo', category: 'Work', deadline: '', estimatedMinutes: 30, tags: '' }
  );

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    onSave({
      ...form,
      deadline: form.deadline || null,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : form.tags,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-bold text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Title *</label>
            <input className="input-field" name="title" placeholder="Task title..." value={form.title} onChange={handleChange} required />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Description</label>
            <textarea className="input-field resize-none h-20" name="description" placeholder="Optional description..." value={form.description} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Priority</label>
              <select className="input-field" name="priority" value={form.priority} onChange={handleChange}>
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Status</label>
              <select className="input-field" name="status" value={form.status} onChange={handleChange}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Category</label>
              <select className="input-field" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Est. Minutes</label>
              <input className="input-field" name="estimatedMinutes" type="number" min="5" value={form.estimatedMinutes} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Deadline</label>
            <input className="input-field" name="deadline" type="datetime-local" value={form.deadline || ''} onChange={handleChange} />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Tags (comma-separated)</label>
            <input className="input-field" name="tags" placeholder="design, urgent, review..." value={typeof form.tags === 'string' ? form.tags : form.tags?.join(', ')} onChange={handleChange} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-all text-sm">
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="neon-button flex-1 text-white text-sm"
            >
              {task ? 'Update Task' : 'Create Task'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const priority = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card-hover p-4 group"
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onStatusChange(task._id, task.status === 'completed' ? 'todo' : 'completed')}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            task.status === 'completed'
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-gray-600 hover:border-emerald-400'
          }`}
          id={`task-complete-${task._id}`}
        >
          {task.status === 'completed' && <FiCheck className="w-3 h-3 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className={`text-sm font-medium flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => onEdit(task)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-neon-blue transition-all p-1"
                id={`edit-task-${task._id}`}
              >
                <FiEdit3 className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => onDelete(task._id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1"
                id={`delete-task-${task._id}`}
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-500 text-xs mb-2 truncate">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="badge text-xs" style={{ color: priority.color, background: priority.bg }}>
              <FiFlag className="w-2.5 h-2.5 mr-1" />
              {priority.label}
            </span>
            <span className="badge text-xs text-gray-400 bg-white/5">
              {task.category}
            </span>
            {task.deadline && (
              <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
                <FiCalendar className="w-3 h-3" />
                {new Date(task.deadline).toLocaleDateString()}
                {isOverdue && ' ⚠️'}
              </span>
            )}
            {task.estimatedMinutes && (
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <FiClock className="w-3 h-3" />
                {task.estimatedMinutes}m
              </span>
            )}
          </div>

          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full text-neon-blue" style={{ background: 'rgba(0,212,255,0.1)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function TasksPage() {
  const { tasks, isLoading, fetchTasks, createTask, updateTask, deleteTask } = useTaskStore();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ status: '', category: '', priority: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSave = async (data) => {
    const result = editingTask
      ? await updateTask(editingTask._id, data)
      : await createTask(data);

    if (result.success) {
      toast.success(editingTask ? 'Task updated!' : 'Task created! 🎯');
      setShowModal(false);
      setEditingTask(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    const result = await deleteTask(id);
    if (result.success) toast.success('Task deleted');
    else toast.error(result.message);
  };

  const handleStatusChange = async (id, status) => {
    const result = await updateTask(id, { status });
    if (result.success && status === 'completed') toast.success('Task completed! 🎉');
  };

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filter.status || t.status === filter.status;
    const matchCategory = !filter.category || t.category === filter.category;
    const matchPriority = !filter.priority || t.priority === filter.priority;
    return matchSearch && matchStatus && matchCategory && matchPriority;
  });

  const grouped = {
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
    completed: filteredTasks.filter((t) => t.status === 'completed'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Task Manager</h1>
          <p className="text-gray-400 text-sm mt-1">{tasks.length} tasks total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setEditingTask(null); setShowModal(true); }}
          className="neon-button text-white text-sm flex items-center gap-2"
          id="create-task-btn"
        >
          <FiPlus className="w-4 h-4" />
          New Task
        </motion.button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            className="input-field pl-9 text-sm py-2"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="task-search"
          />
        </div>
        <select className="input-field w-auto text-sm py-2" value={filter.status} onChange={(e) => setFilter((p) => ({ ...p, status: e.target.value }))}>
          <option value="">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className="input-field w-auto text-sm py-2" value={filter.category} onChange={(e) => setFilter((p) => ({ ...p, category: e.target.value }))}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-field w-auto text-sm py-2" value={filter.priority} onChange={(e) => setFilter((p) => ({ ...p, priority: e.target.value }))}>
          <option value="">All Priorities</option>
          {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Kanban Columns */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="skeleton h-6 w-24" />
              {Array(2).fill(0).map((_, j) => <div key={j} className="skeleton h-24 rounded-2xl" />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([status, taskList]) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full" style={{ background: STATUS_CONFIG[status].color }} />
                <span className="text-sm font-semibold text-gray-300">{STATUS_CONFIG[status].label}</span>
                <span className="text-xs text-gray-600 ml-auto">{taskList.length}</span>
              </div>
              <AnimatePresence mode="popLayout">
                {taskList.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-6 text-center text-gray-600 text-sm"
                    style={{ borderStyle: 'dashed' }}
                  >
                    No tasks here
                  </motion.div>
                ) : (
                  taskList.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={(t) => { setEditingTask(t); setShowModal(true); }}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <TaskModal
            task={editingTask}
            onClose={() => { setShowModal(false); setEditingTask(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
