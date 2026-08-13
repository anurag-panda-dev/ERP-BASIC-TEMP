import React from 'react';
import { clsx } from 'clsx';

/**
 * Card container with optional title, action slot, and padding.
 */
export default function Card({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = '',
  noPadding = false,
}) {
  return (
    <div className={clsx('card', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={clsx(!noPadding && 'p-5', bodyClassName)}>{children}</div>
    </div>
  );
}

/**
 * Simple stat card: icon + label + value.
 */
export function StatCard({ icon, label, value, trend, color = 'indigo', className = '' }) {
  const colorMap = {
    indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600' },
    green:   { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    amber:   { bg: 'bg-amber-50',   text: 'text-amber-600' },
    red:     { bg: 'bg-red-50',     text: 'text-red-600' },
    slate:   { bg: 'bg-slate-100',  text: 'text-slate-600' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className={clsx('stat-card', className)}>
      <div className="flex items-start justify-between">
        <div className={clsx('p-2.5 rounded-lg', c.bg)}>
          <span className={clsx('w-5 h-5 block', c.text)}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span className={clsx('text-xs font-medium', trend >= 0 ? 'text-emerald-600' : 'text-red-500')}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 mt-3">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
