import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { getStudentAttendance } from '../../services/attendanceService.js';
import { getStudentDashboard } from '../../services/dashboardService.js';
import Card from '../../components/common/Card.jsx';
import { SkeletonCard } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { clsx } from 'clsx';

export default function StudentAttendanceDetail() {
  const { dbUser } = useAuthContext();
  const studentId = dbUser?._id;

  const { data: dashData, isLoading } = useQuery({
    queryKey: ['student-dashboard', studentId],
    queryFn:  () => getStudentDashboard(studentId),
    enabled:  !!studentId,
  });

  const subjects = dashData?.attendanceBySubject || [];

  const getStatusClass = (pct) =>
    pct >= 75 ? 'badge-green' : pct >= 60 ? 'badge-yellow' : 'badge-red';
  const getStatusLabel = (pct) =>
    pct >= 75 ? 'Good' : pct >= 60 ? 'Warning' : 'At Risk';
  const getBarColor = (pct) =>
    pct >= 75 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500">Subject-wise attendance breakdown</p>
        </div>
        {dashData?.overallAttendance !== undefined && (
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-900">
              {Math.round(dashData.overallAttendance)}%
            </p>
            <p className="text-xs text-slate-500">Overall Attendance</p>
          </div>
        )}
      </div>

      {/* 75% Threshold notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-card">
        <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-amber-800">
          Minimum attendance required: <strong>75%</strong>. Below 60% puts you at risk of debarment.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : subjects.length === 0 ? (
        <Card>
          <EmptyState
            title="No attendance data"
            description="Your attendance records will appear here once your faculty starts taking attendance."
          />
        </Card>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subj) => {
              const pct      = Math.round(subj.attendancePercentage ?? subj.percentage ?? 0);
              const present  = subj.present ?? subj.presentCount ?? 0;
              const total    = subj.total   ?? subj.totalClasses ?? 0;
              const absent   = total - present;
              const name     = subj.subject?.name || subj.subjectName || 'Subject';

              return (
                <div key={subj.subject?._id || name} className="card p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight">{name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {subj.subject?.subjectCode || ''}
                      </p>
                    </div>
                    <span className={clsx('badge text-xs shrink-0', getStatusClass(pct))}>
                      {getStatusLabel(pct)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Attendance</span>
                      <span className="font-semibold text-slate-900">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full transition-all duration-500', getBarColor(pct))}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {/* 75% marker */}
                    <div className="relative h-1 mt-0.5">
                      <div className="absolute top-0 w-px h-2 bg-slate-400" style={{ left: '75%' }} />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-4 text-xs">
                    <div className="flex-1 text-center p-2 rounded-lg bg-emerald-50">
                      <p className="font-bold text-emerald-700">{present}</p>
                      <p className="text-emerald-600">Present</p>
                    </div>
                    <div className="flex-1 text-center p-2 rounded-lg bg-red-50">
                      <p className="font-bold text-red-700">{absent}</p>
                      <p className="text-red-600">Absent</p>
                    </div>
                    <div className="flex-1 text-center p-2 rounded-lg bg-slate-50">
                      <p className="font-bold text-slate-700">{total}</p>
                      <p className="text-slate-500">Total</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
