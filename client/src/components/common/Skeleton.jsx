import React from 'react';
import { clsx } from 'clsx';

/**
 * Skeleton loader — pulsing gray placeholder matching content shape.
 */
export default function Skeleton({ className = '', width, height, rounded = 'md' }) {
  const r = { none: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' };
  return (
    <div
      className={clsx('skeleton', r[rounded], className)}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton height="20px" width="60%" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="14px" width={`${70 + i * 10}%`} />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero card skeleton */}
      <div className="card p-6">
        <div className="flex gap-6">
          <div className="flex-1 space-y-3">
            <Skeleton height="24px" width="40%" />
            <Skeleton height="16px" width="70%" />
            <Skeleton height="16px" width="55%" />
          </div>
          <div className="flex gap-4">
            <Skeleton height="80px" width="80px" rounded="full" />
            <Skeleton height="80px" width="80px" rounded="full" />
          </div>
        </div>
      </div>
      {/* Grid skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}
