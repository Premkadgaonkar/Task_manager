import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiClock, FiTrendingUp, FiAlertTriangle, FiCalendar } from 'react-icons/fi';
import useTaskStore from '../store/taskStore';

const PRIORITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

export default function AISuggestions() {
  const { suggestions, fetchSuggestions, analytics, fetchAnalytics, isAnalyticsLoading } = useTaskStore();

  useEffect(() => {
    fetchSuggestions();
    fetchAnalytics();
  }, []);

  const bestHours = analytics?.bestWorkingHours || [];
  const score = analytics?.productivityScore || 0;

  const getHourLabel = (h) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:00 ${ampm}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <FiZap className="w-4 h-4 text-white" />
          </span>
          AI Suggestions
        </h1>
        <p className="text-gray-400 text-sm mt-1">Smart scheduling recommendations based on your workflow</p>
      </div>

      {/* Productivity Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))' }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Your Productivity Score</p>
            <p className="text-5xl font-display font-bold text-gradient">{score}</p>
            <p className="text-gray-500 text-sm mt-1">/ 100 points</p>
          </div>
          <div className="flex-1 min-w-48">
            <div className="w-full bg-white/5 rounded-full h-3 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-3 rounded-full"
                style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed)' }}
              />
            </div>
            <p className="text-sm text-gray-300">
              {score >= 75
                ? '🔥 Exceptional! You\'re in the top tier of productivity.'
                : score >= 50
                ? '⚡ Good progress! Aim for 75+ by completing more tasks.'
                : score > 0
                ? '🌱 Getting started! Completing tasks will boost your score.'
                : '💫 Create and complete tasks to build your score!'}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Working Hours */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <FiClock className="w-4 h-4 text-neon-blue" />
            <h2 className="text-sm font-semibold text-white">Your Peak Hours</h2>
          </div>

          {bestHours.length > 0 ? (
            <div className="space-y-4">
              {bestHours.map((h, idx) => (
                <motion.div
                  key={h._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: `hsl(${200 - idx * 60}, 70%, 50%)25`, border: `1px solid hsl(${200 - idx * 60}, 70%, 50%)40` }}
                  >
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-sm font-medium">{getHourLabel(h._id)}</span>
                      <span className="text-gray-400 text-xs">{h.count} tasks done</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((h.count / (bestHours[0]?.count || 1)) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                        className="h-1.5 rounded-full"
                        style={{ background: `hsl(${200 - idx * 60}, 70%, 60%)` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-36 text-gray-600 text-sm gap-2">
              <FiClock className="w-8 h-8 text-gray-700" />
              <p>Complete tasks to discover your peak hours</p>
            </div>
          )}
        </motion.div>

        {/* Task Scheduling Tips */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <FiTrendingUp className="w-4 h-4 text-neon-green" />
            <h2 className="text-sm font-semibold text-white">Scheduling Strategy</h2>
          </div>
          <div className="space-y-3">
            {[
              { icon: '🌅', title: 'Morning Block (9-11 AM)', desc: 'Tackle your highest-priority tasks when willpower is peak.', color: '#f59e0b' },
              { icon: '☕', title: 'Post-lunch Reset (2-3 PM)', desc: 'Light tasks or meetings — your energy naturally dips here.', color: '#00d4ff' },
              { icon: '🌆', title: 'Late Afternoon (4-6 PM)', desc: 'Creative work thrives in this second wind period.', color: '#7c3aed' },
              { icon: '🌙', title: 'Evening Wind-down', desc: 'Review tomorrow\'s tasks. Never start new deep work sessions.', color: '#ec4899' },
            ].map((tip, idx) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.08 }}
                className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <span className="text-xl mt-0.5">{tip.icon}</span>
                <div>
                  <p className="text-white text-xs font-semibold mb-0.5">{tip.title}</p>
                  <p className="text-gray-500 text-xs">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Task Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <FiCalendar className="w-4 h-4 text-neon-purple" />
          <h2 className="text-sm font-semibold text-white">Recommended Schedule</h2>
          {suggestions.length > 0 && (
            <span className="badge text-xs text-neon-purple ml-auto" style={{ background: 'rgba(124,58,237,0.15)' }}>
              {suggestions.length} tasks
            </span>
          )}
        </div>

        {suggestions.length > 0 ? (
          <div className="space-y-3">
            {suggestions.map((s, idx) => (
              <motion.div
                key={s.taskId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.08 }}
                className="flex items-start gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0 font-mono font-bold text-sm"
                  style={{ background: `${PRIORITY_COLORS[s.priority]}15`, border: `1px solid ${PRIORITY_COLORS[s.priority]}30`, color: PRIORITY_COLORS[s.priority] }}
                >
                  {s.suggestedTime}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white text-sm font-semibold truncate">{s.title}</h3>
                    <span className="badge text-xs flex-shrink-0" style={{ color: PRIORITY_COLORS[s.priority], background: `${PRIORITY_COLORS[s.priority]}15` }}>
                      {s.priority}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">{s.reason}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-gray-600 text-xs">Urgency</p>
                  <p className="text-white font-bold text-lg">{s.urgencyScore}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-600 gap-3">
            <FiAlertTriangle className="w-10 h-10 text-gray-700" />
            <p className="text-sm text-center">Add tasks with deadlines to receive<br />personalized scheduling suggestions</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
