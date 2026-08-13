import React from 'react';
import { clsx } from 'clsx';

const variants = {
  green:  'badge-green',
  yellow: 'badge-yellow',
  red:    'badge-red',
  indigo: 'badge-indigo',
  slate:  'badge-slate',
  blue:   'badge bg-blue-50 text-blue-700 ring-1 ring-blue-200',
};

/**
 * Status Badge — pill shaped with optional dot indicator.
 */
export default function Badge({ children, variant = 'slate', dot = false, className = '' }) {
  return (
    <span className={clsx(variants[variant] || variants.slate, className)}>
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full',
            variant === 'green'  && 'bg-emerald-500',
            variant === 'yellow' && 'bg-amber-500',
            variant === 'red'    && 'bg-red-500',
            variant === 'indigo' && 'bg-indigo-500',
            variant === 'slate'  && 'bg-slate-500',
          )}
        />
      )}
      {children}
    </span>
  );
}

/**
 * Risk Status Badge that maps GREEN/YELLOW/RED to the correct colors.
 */
export function RiskBadge({ status }) {
  const map = {
    GREEN:  { variant: 'green',  label: 'Good Standing' },
    YELLOW: { variant: 'yellow', label: 'Needs Improvement' },
    RED:    { variant: 'red',    label: 'At Risk' },
  };
  const config = map[status] || map.GREEN;
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}

/**
 * Role badge.
 */
export function RoleBadge({ role }) {
  const map = {
    admin:   { variant: 'indigo', label: 'Admin' },
    faculty: { variant: 'blue',   label: 'Faculty' },
    student: { variant: 'green',  label: 'Student' },
  };
  const config = map[role] || { variant: 'slate', label: role };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
