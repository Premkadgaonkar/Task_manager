import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import useAuthStore from './store/authStore';
import Sidebar from './components/Sidebar';
import PageLoader from './components/PageLoader';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import FocusMode from './pages/FocusMode';
import AISuggestions from './pages/AISuggestions';

const PrivateRoute = () => {
  const { isAuthenticated, fetchMe, token } = useAuthStore();
  const [checking, setChecking] = useState(!!token);

  useEffect(() => {
    if (token) {
      fetchMe().finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const AppLayout = () => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 lg:p-8 min-h-full"
      >
        <Outlet />
      </motion.div>
    </main>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(13, 21, 39, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/focus" element={<FocusMode />} />
            <Route path="/suggestions" element={<AISuggestions />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
