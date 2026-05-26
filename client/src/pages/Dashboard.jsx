import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiTrendingUp, FiCheckSquare, FiClock, FiAward } from 'react-icons/fi';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const PRIORITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

const CATEGORY_COLORS = ['#00d4ff', '#7c3aed', '#ec4899', '#10b981', '#f59e0b'];

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card p-5 relative overflow-hidden"
  >
    <div
      className="absolute inset-0 opacity-5"
      style={{ background: `radial-gradient(circle at top right, ${color}, transparent)` }}
    />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
        <p className="text-3xl font-display font-bold text-white">{value}</p>
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}20`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="glass-card p-5">
    <div className="skeleton h-4 w-24 mb-3" />
    <div className="skeleton h-8 w-16" />
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs text-white">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="font-semibold" style={{ color: '#00d4ff' }}>
          {payload[0].value} tasks
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { analytics, isAnalyticsLoading, fetchAnalytics, suggestions, fetchSuggestions } = useTaskStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAnalytics();
    fetchSuggestions();
  }, []);

  const weeklyChartData = analytics?.weeklyData?.map((d) => ({
    date: new Date(d._id).toLocaleDateString('en', { weekday: 'short' }),
    tasks: d.count,
  })) || [];

  const categoryChartData = analytics?.categoryStats?.map((c) => ({
    name: c._id,
    value: c.count,
  })) || [];

  const priorityChartData = analytics?.priorityStats?.map((p) => ({
    name: p._id,
    value: p.count,
    fill: PRIORITY_COLORS[p._id] || '#888',
  })) || [];

  const score = analytics?.productivityScore || 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-white">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},{' '}
            <span className="text-gradient">{user?.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here's your productivity overview</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-gray-400 text-xs">{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isAnalyticsLoading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon={FiCheckSquare} label="Total Tasks" value={analytics?.overview?.total || 0} color="#00d4ff" delay={0} />
            <StatCard icon={FiAward} label="Completed" value={analytics?.overview?.completed || 0} color="#10b981" delay={0.1} />
            <StatCard icon={FiClock} label="In Progress" value={analytics?.overview?.inProgress || 0} color="#f59e0b" delay={0.2} />
            <StatCard icon={FiTrendingUp} label="Today Done" value={analytics?.overview?.todayCompleted || 0} color="#ec4899" delay={0.3} />
          </>
        )}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 flex flex-col items-center justify-center"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-6 font-medium">Productivity Score</p>
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <motion.circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-bold text-gradient">{score}</span>
              <span className="text-gray-500 text-xs">/ 100</span>
            </div>
          </div>
          <p className="text-white font-semibold mt-4">
            {score >= 75 ? '🔥 On Fire!' : score >= 50 ? '⚡ Good Pace' : score > 0 ? '🌱 Getting Started' : '💫 Start Completing!'}
          </p>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-5 font-medium">7-Day Completion</p>
          {weeklyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyChartData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tasks" stroke="#00d4ff" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#00d4ff', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-600 text-sm">
              Complete some tasks to see your weekly progress!
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-5 font-medium">By Category</p>
          {categoryChartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {categoryChartData.map((_, idx) => (
                      <Cell key={idx} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0d1527', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {categoryChartData.map((c, idx) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                    <span className="truncate">{c.name} ({c.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-600 text-sm">No data yet</div>
          )}
        </motion.div>

        {/* Priority Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-6"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-5 font-medium">By Priority</p>
          {priorityChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={priorityChartData} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {priorityChartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-600 text-sm">No data yet</div>
          )}
        </motion.div>

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <FiZap className="w-4 h-4 text-neon-yellow" />
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">AI Suggestions</p>
          </div>
          {suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.slice(0, 3).map((s, idx) => (
                <motion.div
                  key={s.taskId}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="p-3 rounded-xl border border-white/5"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-white text-xs font-semibold truncate">{s.title}</p>
                    <span className="text-neon-blue text-xs font-mono shrink-0">{s.suggestedTime}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{s.reason}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-gray-600 text-sm gap-2">
              <FiZap className="w-8 h-8 text-gray-700" />
              <p>Add tasks with deadlines to get smart suggestions</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
