import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiCheckSquare, FiTarget, FiZap, FiLogOut,
  FiMenu, FiX, FiUser
} from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
  { to: '/focus', icon: FiTarget, label: 'Focus Mode' },
  { to: '/suggestions', icon: FiZap, label: 'AI Suggestions' },
];

const SidebarContent = ({ onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}
        >
          <FiZap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-white font-display font-bold text-sm leading-none">NeuroFlow</h2>
          <p className="text-gray-500 text-xs mt-0.5">AI Productivity OS</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-gray-500 hover:text-white lg:hidden">
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            id={`nav-${label.toLowerCase().replace(' ', '-')}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div className="mt-4">
        <div className="glass-card p-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #00d4ff40, #7c3aed40)', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              {user?.name?.[0]?.toUpperCase() || <FiUser className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="nav-item w-full text-red-400 hover:text-red-300"
          id="logout-btn"
        >
          <FiLogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/5" style={{ background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(20px)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 flex items-center justify-center rounded-xl text-white"
        style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
        id="mobile-menu-btn"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60"
              style={{ backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10"
              style={{ background: '#0a0f1e', backdropFilter: 'blur(20px)' }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
