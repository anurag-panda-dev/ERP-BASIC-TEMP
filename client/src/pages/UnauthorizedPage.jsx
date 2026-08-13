import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-4">
        <p className="text-6xl font-extrabold text-amber-500">403</p>
        <h1 className="text-2xl font-bold text-slate-900">Access Forbidden</h1>
        <p className="text-sm text-slate-500">You do not have permission to access this page.</p>
        <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
      </div>
    </div>
  );
}
