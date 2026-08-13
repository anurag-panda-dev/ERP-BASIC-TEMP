import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubjects } from '../../services/subjectService.js';
import { useAuthContext } from '../../context/AuthContext.jsx';
import Card from '../../components/common/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { SkeletonCard } from '../../components/common/Skeleton.jsx';

export default function FacultyMyClasses() {
  const { dbUser } = useAuthContext();

  const { data: res, isLoading } = useQuery({
    queryKey: ['faculty-subjects'],
    queryFn:  () => getSubjects({ facultyId: dbUser?._id }),
    enabled:  !!dbUser?._id,
  });

  const subjects = res?.data || res?.subjects || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Classes</h1>
        <p className="text-sm text-slate-500">All subjects assigned to you</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : subjects.length === 0 ? (
        <Card>
          <EmptyState
            title="No classes assigned"
            description="Contact your administrator to get subjects assigned to you."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(s => (
            <div key={s._id} className="card p-5 space-y-3 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{s.name}</h3>
                  <span className="badge badge-indigo shrink-0">Sem {s.semester}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{s.subjectCode}</p>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex-1 p-2.5 rounded-lg bg-slate-50 text-center">
                  <p className="font-bold text-slate-900">{s.enrolledStudents?.length ?? 0}</p>
                  <p className="text-slate-500">Students</p>
                </div>
                <div className="flex-1 p-2.5 rounded-lg bg-slate-50 text-center">
                  <p className="font-bold text-slate-900">{s.department?.name || 'N/A'}</p>
                  <p className="text-slate-500">Department</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
