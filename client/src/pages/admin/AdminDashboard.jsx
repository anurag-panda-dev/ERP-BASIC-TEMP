import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboard } from '../../services/dashboardService.js';
import Card, { StatCard } from '../../components/common/Card.jsx';
import { SkeletonDashboard } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn:  getAdminDashboard,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) return <SkeletonDashboard />;

  if (error) {
    return (
      <Card>
        <EmptyState title="Failed to load admin dashboard" description={error.message} />
      </Card>
    );
  }

  const stats = dashboard?.stats || dashboard || {};
  const totalStudents    = stats.totalStudents ?? stats.studentsCount ?? 0;
  const totalFaculty     = stats.totalFaculty  ?? stats.facultyCount ?? 0;
  const totalDepartments = stats.totalDepartments ?? stats.departmentCount ?? 0;
  const totalSubjects    = stats.totalSubjects ?? stats.subjectCount ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">System overview and management quick links</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={totalStudents}
          color="green"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard
          label="Faculty Members"
          value={totalFaculty}
          color="indigo"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
        />
        <StatCard
          label="Departments"
          value={totalDepartments}
          color="amber"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard
          label="Subjects"
          value={totalSubjects}
          color="slate"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">User Management</h3>
            <p className="text-xs text-slate-500">Manage Students & Faculty</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/departments')}
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Departments</h3>
            <p className="text-xs text-slate-500">Manage academic departments</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/subjects')}
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Subjects</h3>
            <p className="text-xs text-slate-500">Manage subjects & assignments</p>
          </div>
        </button>
      </div>
    </div>
  );
}
