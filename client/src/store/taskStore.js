import { create } from 'zustand';
import api from '../utils/api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  analytics: null,
  suggestions: [],
  isLoading: false,
  isAnalyticsLoading: false,
  error: null,

  fetchTasks: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/tasks${params ? `?${params}` : ''}`);
      set({ tasks: data.tasks, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      set((state) => ({ tasks: [data.task, ...state.tasks] }));
      return { success: true, task: data.task };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create task' };
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? data.task : t)),
      }));
      return { success: true, task: data.task };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update task' };
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id) }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete task' };
    }
  },

  fetchAnalytics: async () => {
    set({ isAnalyticsLoading: true });
    try {
      const { data } = await api.get('/tasks/analytics');
      set({ analytics: data.analytics, isAnalyticsLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch analytics', isAnalyticsLoading: false });
    }
  },

  fetchSuggestions: async () => {
    try {
      const { data } = await api.get('/tasks/suggestions');
      set({ suggestions: data.suggestions });
    } catch {
      set({ suggestions: [] });
    }
  },
}));

export default useTaskStore;
