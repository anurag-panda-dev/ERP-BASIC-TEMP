import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNotices } from '../../services/noticeService.js';
import Card from '../../components/common/Card.jsx';
import { SkeletonCard } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { format } from 'date-fns';
import { clsx } from 'clsx';

export default function StudentNotices() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn:  () => getNotices({ limit: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  const notices = res?.data || res?.notices || [];

  const audienceLabel = (a) => a === 'global' ? 'All Students' : a === 'class' ? 'Class Notice' : 'Department';
  const audienceVariant = (a) => a === 'global' ? 'badge-indigo' : a === 'class' ? 'badge-green' : 'badge-yellow';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notices</h1>
        <p className="text-sm text-slate-500">Announcements from faculty and administration</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} />)}</div>
      ) : notices.length === 0 ? (
        <Card>
          <EmptyState
            title="No notices yet"
            description="Announcements from your faculty and admin will appear here."
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice._id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 shrink-0">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-slate-900">{notice.title}</h3>
                    <span className={clsx('badge', audienceVariant(notice.audience))}>
                      {audienceLabel(notice.audience)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{notice.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>By {notice.author?.name || 'Admin'}</span>
                    <span>·</span>
                    <span>{notice.createdAt ? format(new Date(notice.createdAt), 'MMM d, yyyy h:mm a') : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
