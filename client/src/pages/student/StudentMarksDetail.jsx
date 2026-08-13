import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { getStudentDashboard } from '../../services/dashboardService.js';
import Card from '../../components/common/Card.jsx';
import { SkeletonCard } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { clsx } from 'clsx';

export default function StudentMarksDetail() {
  const { dbUser } = useAuthContext();
  const studentId = dbUser?._id;

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['student-dashboard', studentId],
    queryFn:  () => getStudentDashboard(studentId),
    enabled:  !!studentId,
  });

  const subjects = dashboard?.marksBySubject || [];
  const overall  = dashboard?.overallMarks ?? null;

  const getStatusColor = (pct) =>
    pct >= 60 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600';
  const getBarColor = (pct) =>
    pct >= 60 ? 'bg-indigo-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marks</h1>
          <p className="text-sm text-slate-500">Assessment-wise marks and scores</p>
        </div>
        {overall !== null && (
          <div className="text-right">
            <p className={clsx('text-3xl font-bold', getStatusColor(overall))}>
              {Math.round(overall)}%
            </p>
            <p className="text-xs text-slate-500">Overall Score</p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <SkeletonCard key={i} lines={4} />)}</div>
      ) : subjects.length === 0 ? (
        <Card>
          <EmptyState
            title="No marks uploaded yet"
            description="Your faculty will upload marks after assessments are graded."
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {subjects.map((subj) => {
            const name        = subj.subject?.name || subj.subjectName || 'Subject';
            const assessments = subj.assessments || [];
            const pct         = Math.round(subj.marksPercentage ?? subj.percentage ?? 0);

            return (
              <Card
                key={subj.subject?._id || name}
                title={name}
                subtitle={subj.subject?.subjectCode || ''}
                action={
                  <span className={clsx('text-lg font-bold', getStatusColor(pct))}>
                    {pct}%
                  </span>
                }
              >
                {assessments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Assessment</th>
                          <th>Type</th>
                          <th className="text-right">Obtained</th>
                          <th className="text-right">Max</th>
                          <th className="text-right">Score</th>
                          <th>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessments.map((a) => {
                          const obtained = a.marksObtained ?? a.obtained ?? 0;
                          const maxMarks = a.maxMarks ?? a.total ?? 100;
                          const score    = maxMarks > 0 ? Math.round((obtained / maxMarks) * 100) : 0;
                          return (
                            <tr key={a._id || a.assessmentId}>
                              <td className="font-medium">{a.title || a.assessmentTitle || 'Assessment'}</td>
                              <td>
                                <span className="badge badge-slate capitalize">{a.type || 'internal'}</span>
                              </td>
                              <td className="text-right font-semibold">{obtained}</td>
                              <td className="text-right text-slate-500">{maxMarks}</td>
                              <td className={clsx('text-right font-bold', getStatusColor(score))}>
                                {score}%
                              </td>
                              <td className="min-w-[100px]">
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={clsx('h-full rounded-full', getBarColor(score))}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 py-2">No assessments published yet.</p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
