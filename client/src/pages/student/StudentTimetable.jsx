import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTimetables } from '../../services/timetableService.js';
import { useAuthContext } from '../../context/AuthContext.jsx';
import Card from '../../components/common/Card.jsx';
import { SkeletonCard } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { DAYS_OF_WEEK } from '../../config/constants.js';
import { clsx } from 'clsx';

const COLORS = ['bg-indigo-50 border-indigo-200 text-indigo-700',
                'bg-purple-50 border-purple-200 text-purple-700',
                'bg-sky-50 border-sky-200 text-sky-700',
                'bg-emerald-50 border-emerald-200 text-emerald-700',
                'bg-amber-50 border-amber-200 text-amber-700',
                'bg-rose-50 border-rose-200 text-rose-700'];

export default function StudentTimetable() {
  const { dbUser } = useAuthContext();

  const { data: res, isLoading } = useQuery({
    queryKey: ['timetables', dbUser?._id],
    queryFn:  () => getTimetables({ studentId: dbUser?._id }),
    enabled:  !!dbUser?._id,
    staleTime: 30 * 60 * 1000,
  });

  const entries = res?.data || res?.timetable || [];
  const today   = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Group by day
  const byDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = entries.filter((e) => e.dayOfWeek === day);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Timetable</h1>
        <p className="text-sm text-slate-500">Weekly class schedule</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
      ) : entries.length === 0 ? (
        <Card>
          <EmptyState
            title="No timetable found"
            description="Your weekly schedule will appear here once it has been set up by admin."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {DAYS_OF_WEEK.filter(d => byDay[d].length > 0).map((day) => (
            <Card
              key={day}
              title={day}
              className={clsx(day === today && 'ring-2 ring-primary-500')}
              action={day === today && (
                <span className="badge badge-indigo">Today</span>
              )}
            >
              <div className="flex flex-wrap gap-3">
                {byDay[day].sort((a,b) => a.startTime?.localeCompare(b.startTime)).map((slot, i) => (
                  <div
                    key={slot._id || i}
                    className={clsx(
                      'flex-1 min-w-[180px] border rounded-lg p-3',
                      COLORS[i % COLORS.length]
                    )}
                  >
                    <p className="font-semibold text-sm">
                      {slot.subject?.name || slot.subjectName || 'Class'}
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      {slot.startTime} – {slot.endTime}
                    </p>
                    {slot.room && (
                      <p className="text-xs mt-0.5 opacity-70">Room: {slot.room}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
