import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useAuthContext } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { ROLES } from '../config/constants.js';

export default function SignUpPage() {
  const { isAuthenticated, role } = useAuthContext();

  if (isAuthenticated && role) {
    if (role === ROLES.ADMIN) return <Navigate to="/admin/dashboard" replace />;
    if (role === ROLES.FACULTY) return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create CampusFlow Account</h1>
          <p className="text-sm text-slate-500 mt-1">Sign up to access your college ERP dashboard</p>
        </div>

        <div className="flex justify-center">
          <SignUp routing="path" path="/sign-up" signInUrl="/login" />
        </div>
      </div>
    </div>
  );
}
