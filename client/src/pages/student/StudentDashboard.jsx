import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { getStudentDashboard } from '../../services/dashboardService.js';
import { getNotices } from '../../services/noticeService.js';
import { getTodaysTimetable } from '../../services/timetableService.js';
import RiskDetectorCard from '../../components/student/RiskDetectorCard.jsx';
import { AttendanceChart, MarksChart } from '../../components/student/Charts.jsx';
import Card from '../../components/common/Card.jsx';
import { SkeletonDashboard } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { dbUser } = useAuthContext();
  const studentId = dbUser?._id;

  const { data: dashboard, isLoading: dashLoading, error: dashError } = useQuery({
    queryKey: ['student-dashboard', studentId],
    queryFn:  () => getStudentDashboard(studentId),
    enabled:  !!studentId,
    staleTime: 2 * 60 * 1000,
  });

  const { data: noticesRes } = useQuery({
    queryKey: ['notices'],
    queryFn:  () => getNotices({ limit: 5 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: timetableRes } = useQuery({
    queryKey: ['timetable-today'],
    queryFn:  getTodaysTimetable,
    staleTime: 30 * 60 * 1000,
  });

  if (dashLoading) return <SkeletonDashboard />;

  if (dashError) {
    return (
      <div className="card p-8">
        <EmptyState
          title="Failed to load dashboard"
          description={dashError.message || 'Please try again later.'}
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          }
        />
      </div>
    );
  }

  const riskStatus       = dashboard?.riskStatus;
  const attendanceData   = dashboard?.attendanceBySubject || [];
  const marksData        = dashboard?.marksBySubject || [];
  const overallAttendance = dashboard?.overallAttendance ?? 0;
  const overallMarks      = dashboard?.overallMarks ?? 0;

  const notices   = noticesRes?.data  || noticesRes?.notices  || [];
  const timetable = timetableRes?.data || timetableRes?.timetable || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Good {getGreeting()}, {dbUser?.name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Risk Detector Hero */}
      <RiskDetectorCard
        riskStatus={riskStatus}
        attendancePercent={overallAttendance}
        marksPercent={overallMarks}
      />

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Attendance by Subject" subtitle="Current semester">
          <AttendanceChart subjects={attendanceData} />
        </Card>
        <Card title="Marks by Subject" subtitle="Published assessments">
          <MarksChart subjects={marksData} />
        </Card>
      </div>

      {/* Bottom grid: Timetable + Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable */}
        <Card title="Today's Classes" subtitle={format(new Date(), 'EEEE')}>
          {timetable.length > 0 ? (
            <div className="space-y-2">
              {timetable.map((slot, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs font-semibold text-primary-600">{slot.startTime}</p>
                    <p className="text-[10px] text-slate-400">{slot.endTime}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {slot.subject?.name || slot.subjectName || 'Class'}
                    </p>
                    <p className="text-xs text-slate-500">{slot.room || slot.location || 'Room TBD'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No classes today"
              description="Enjoy your free day!"
            />
          )}
        </Card>

        {/* Recent Notices */}
        <Card title="Recent Notices">
          {notices.length > 0 ? (
            <div className="space-y-3">
              {notices.slice(0, 5).map((notice) => (
                <div key={notice._id} className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-medium text-slate-900">{notice.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notice.content}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    {notice.createdAt ? format(new Date(notice.createdAt), 'MMM d, yyyy') : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No notices"
              description="Check back later for announcements."
            />
          )}
        </Card>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
