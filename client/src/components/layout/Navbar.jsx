import React from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { RoleBadge } from '../common/Badge.jsx';

/**
 * Top navigation bar with hamburger menu (mobile), page title, and user info.
 */
export default function Navbar({ onMenuClick, title }) {
  const { dbUser, role } = useAuthContext();

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-64 h-16 bg-white border-b border-slate-200 z-10 flex items-center px-4 lg:px-6 gap-4">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Open navigation menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      <div className="flex-1">
        {title && <h1 className="text-lg font-semibold text-slate-900">{title}</h1>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {role && <RoleBadge role={role} />}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
            {dbUser?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[140px] truncate">
            {dbUser?.name || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
