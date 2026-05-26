import React from 'react';

const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton rounded-2xl ${className}`} />
);

const SkeletonText = ({ className = '' }) => (
  <div className={`skeleton rounded-lg h-4 ${className}`} />
);

const SkeletonAvatar = ({ size = 10 }) => (
  <div className={`skeleton rounded-full w-${size} h-${size}`} />
);

const TaskSkeleton = () => (
  <div className="glass-card p-4 space-y-3">
    <div className="flex items-start gap-3">
      <div className="skeleton w-5 h-5 rounded-full mt-0.5 shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonText className="w-3/4" />
        <SkeletonText className="w-1/2 h-3" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const StatSkeleton = () => (
  <div className="glass-card p-5 space-y-3">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <SkeletonText className="w-20 h-3" />
        <div className="skeleton h-8 w-12 rounded-lg" />
      </div>
      <div className="skeleton w-10 h-10 rounded-xl" />
    </div>
  </div>
);

const ChartSkeleton = ({ height = 180 }) => (
  <div className="glass-card p-6">
    <SkeletonText className="w-32 h-3 mb-5" />
    <div className="skeleton rounded-xl" style={{ height }} />
  </div>
);

export { SkeletonCard, SkeletonText, SkeletonAvatar, TaskSkeleton, StatSkeleton, ChartSkeleton };
