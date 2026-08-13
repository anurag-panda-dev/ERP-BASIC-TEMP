import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getFacultyDashboard } from '../../services/dashboardService.js';
import { getTodaysTimetable } from '../../services/timetableService.js';
import { useAuthContext } from '../../context/AuthContext.jsx';
import Card, { StatCard } from '../../components/common/Card.jsx';
import { SkeletonDashboard } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { format } from 'date-fns';

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const { dbUser } = useAuthContext();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['faculty-dashboard'],
    queryFn:  getFacultyDashboard,
    staleTime: 2 * 60 * 1000,
  });

  const { data: todayRes } = useQuery({
    queryKey: ['timetable-today'],
    queryFn:  getTodaysTimetable,
    staleTime: 30 * 60 * 1000,
  });

  if (isLoading) return <SkeletonDashboard />;

  const subjects  = dashboard?.assignedSubjects  || dashboard?.subjects  || [];
  const todaySlots = todayRes?.data || todayRes?.timetable || [];
  const totalStudents = dashboard?.totalStudents ?? 0;
  const totalSubjects = subjects.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Good {getGreeting()}, {dbUser?.name?.split(' ')[0] || 'Professor'} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Assigned Subjects"
          value={totalSubjects}
          color="indigo"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
        <StatCard
          label="Total Students"
          value={totalStudents}
          color="green"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard
          label="Classes Today"
          value={todaySlots.length}
          color="amber"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/faculty/take-attendance')}
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Take Attendance</h3>
            <p className="text-sm text-slate-500 mt-0.5">Mark students present or absent</p>
          </div>
          <svg className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => navigate('/faculty/enter-marks')}
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Enter Marks</h3>
            <p className="text-sm text-slate-500 mt-0.5">Upload assessment scores</p>
          </div>
          <svg className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Today's Schedule */}
      <Card title="Today's Schedule" subtitle={format(new Date(), 'EEEE, MMMM d')}>
        {todaySlots.length > 0 ? (
          <div className="space-y-2">
            {todaySlots.map((slot, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                <div className="text-center w-20">
                  <p className="text-xs font-semibold text-primary-600">{slot.startTime}</p>
                  <p className="text-[10px] text-slate-400">{slot.endTime}</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 text-sm">{slot.subject?.name || 'Class'}</p>
                  <p className="text-xs text-slate-500">
                    {slot.subject?.subjectCode || ''} {slot.room ? `· Room ${slot.room}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/faculty/take-attendance?subjectId=${slot.subject?._id}`)}
                  className="btn-ghost text-xs"
                >
                  Take Attendance
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No classes scheduled for today" />
        )}
      </Card>

      {/* Assigned Subjects */}
      <Card title="My Subjects">
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((s) => (
              <div key={s._id} className="p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.subjectCode} · Sem {s.semester}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {s.enrolledStudents?.length ?? 0} students
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No subjects assigned" description="Contact admin to get subjects assigned to you." />
        )}
      </Card>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
