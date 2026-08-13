import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-4">
        <p className="text-6xl font-extrabold text-primary-600">404</p>
        <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-sm text-slate-500">The page you are looking for does not exist or has been moved.</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    </div>
  );
}
