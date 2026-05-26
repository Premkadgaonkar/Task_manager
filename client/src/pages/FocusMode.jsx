import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiRotateCcw, FiZap, FiCheck } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const MODES = [
  { label: 'Focus', duration: 25, color: '#00d4ff' },
  { label: 'Short Break', duration: 5, color: '#10b981' },
  { label: 'Long Break', duration: 15, color: '#7c3aed' },
];

const TIPS = [
  '🧠 Deep work is most effective in the first 2 hours after waking.',
  '💧 Stay hydrated — dehydration reduces cognitive performance by up to 20%.',
  '🎵 Binaural beats at 40Hz can enhance focus and concentration.',
  '📵 Silence notifications — multitasking reduces productivity by 40%.',
  '🌿 A plant on your desk can boost productivity by 15%.',
  '⏰ The human brain can focus for ~90 minutes before needing a rest.',
  '🔵 Blue light stimulates alertness — great for focus sessions.',
  '📝 Writing tasks down frees up mental RAM.',
];

export default function FocusMode() {
  const [modeIdx, setModeIdx] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(MODES[0].duration * 60);
  const [remaining, setRemaining] = useState(MODES[0].duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const intervalRef = useRef(null);
  const { user } = useAuthStore();

  const mode = MODES[modeIdx];
  const progress = (remaining / totalSeconds) * 100;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  const switchMode = useCallback((idx) => {
    stop();
    setModeIdx(idx);
    const dur = MODES[idx].duration * 60;
    setTotalSeconds(dur);
    setRemaining(dur);
  }, [stop]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (modeIdx === 0) setSessionsCompleted((s) => s + 1);
            // Auto-switch to break
            const nextIdx = modeIdx === 0 ? (sessionsCompleted % 4 === 3 ? 2 : 1) : 0;
            setTimeout(() => switchMode(nextIdx), 1000);
            const audio = new AudioContext();
            const osc = audio.createOscillator();
            osc.connect(audio.destination);
            osc.frequency.value = 880;
            osc.start();
            osc.stop(audio.currentTime + 0.3);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, modeIdx, sessionsCompleted, switchMode]);

  // Rotate tips
  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 8000);
    return () => clearInterval(t);
  }, []);

  const preferredFocusDuration = user?.preferences?.focusDuration;

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold text-white">Focus Mode</h1>
        <p className="text-gray-400 text-sm mt-1">Pomodoro Timer — Stay in the flow</p>
      </div>

      {/* Mode Selector */}
      <div className="flex rounded-xl p-1 bg-dark-800 border border-white/5 gap-1">
        {MODES.map((m, idx) => (
          <button
            key={m.label}
            onClick={() => switchMode(idx)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              modeIdx === idx ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
            style={
              modeIdx === idx
                ? { background: `${m.color}25`, border: `1px solid ${m.color}40`, color: m.color }
                : {}
            }
            id={`focus-mode-${idx}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Main Timer Circle */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-2xl"
          style={{
            background: `radial-gradient(circle, ${mode.color}, transparent)`,
            animation: isRunning ? 'pulse 2s infinite' : 'none',
          }}
        />

        <svg width="280" height="280" className="relative z-10">
          {/* Background track */}
          <circle cx="140" cy="140" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />

          {/* Progress arc */}
          <motion.circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke={mode.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            transform="rotate(-90 140 140)"
            style={{
              filter: `drop-shadow(0 0 8px ${mode.color}) drop-shadow(0 0 20px ${mode.color}50)`,
              transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
            }}
          />

          {/* Small dots around circle */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const r2 = 130;
            const x = 140 + r2 * Math.cos(angle);
            const y = 140 + r2 * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i % 5 === 0 ? 2 : 1}
                fill={i < (1 - progress / 100) * 60 ? mode.color : 'rgba(255,255,255,0.1)'}
                opacity={i % 5 === 0 ? 1 : 0.5}
              />
            );
          })}

          {/* Time display */}
          <text x="140" y="128" textAnchor="middle" className="font-mono" fill="white" fontSize="52" fontWeight="700">
            {minutes}:{seconds}
          </text>
          <text x="140" y="160" textAnchor="middle" fill={mode.color} fontSize="14" fontWeight="500">
            {mode.label}
          </text>
          <text x="140" y="178" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11">
            Session {sessionsCompleted + 1}
          </text>
        </svg>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => switchMode(modeIdx)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
          id="focus-reset-btn"
        >
          <FiRotateCcw className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRunning((p) => !p)}
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all"
          style={{
            background: `linear-gradient(135deg, ${mode.color}, ${mode.color}99)`,
            boxShadow: `0 0 30px ${mode.color}50, 0 8px 32px ${mode.color}30`,
          }}
          id="focus-play-btn"
        >
          {isRunning
            ? <FiPause className="w-8 h-8" />
            : <FiPlay className="w-8 h-8 ml-1" />}
        </motion.button>

        <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center border border-white/10 text-center">
          <FiCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-bold">{sessionsCompleted}</span>
        </div>
      </div>

      {/* Info cards */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Sessions Done', value: sessionsCompleted, icon: FiCheck, color: '#10b981' },
          { label: 'Focus Duration', value: `${mode.duration}m`, icon: FiZap, color: mode.color },
          { label: 'Next Break', value: `${sessionsCompleted % 4 === 3 ? 15 : 5}m`, icon: FiPlay, color: '#7c3aed' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
            <p className="text-2xl font-display font-bold text-white">{value}</p>
            <p className="text-gray-500 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Daily Tip */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-sm text-gray-300">{TIPS[tipIdx]}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
