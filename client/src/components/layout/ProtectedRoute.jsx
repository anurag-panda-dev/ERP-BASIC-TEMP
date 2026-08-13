import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { SkeletonDashboard } from '../common/Skeleton.jsx';

/**
 * ProtectedRoute — checks Clerk auth + backend role.
 * @param {string|string[]} roles - allowed role(s)
 */
export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, isLoading, role } = useAuthContext();

  // Still loading auth state
  if (isLoading) {
    return (
      <div className="lg:ml-64 pt-16 p-6">
        <SkeletonDashboard />
      </div>
    );
  }

  // Not signed in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to unauthorized
  if (roles) {
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (role && !allowed.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
