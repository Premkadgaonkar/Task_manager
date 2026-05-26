import React from 'react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 z-50" style={{ background: '#030712' }}>
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }}
        />
      </div>

      {/* Logo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}
      >
        <FiZap className="w-8 h-8 text-white" />
      </motion.div>

      <div className="relative z-10 text-center">
        <h2 className="text-xl font-display font-bold text-gradient">NeuroFlow</h2>
        <p className="text-gray-500 text-sm mt-1">Loading your workspace…</p>
      </div>

      {/* Loading bar */}
      <div className="relative z-10 w-40 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-y-0 w-1/2 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, #7c3aed, transparent)' }}
        />
      </div>
    </div>
  );
}
