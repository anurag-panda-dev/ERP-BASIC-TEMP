import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getSubjects } from '../../services/subjectService.js';
import { submitAttendance } from '../../services/attendanceService.js';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Select } from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import { SkeletonCard } from '../../components/common/Skeleton.jsx';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export default function FacultyTakeAttendance() {
  const { dbUser }      = useAuthContext();
  const toast           = useToast();
  const queryClient     = useQueryClient();
  const [searchParams]  = useSearchParams();

  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subjectId') || '');
  const [selectedDate,    setSelectedDate]    = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendance,      setAttendance]      = useState({}); // { studentId: 'Present' | 'Absent' }

  // Fetch faculty's assigned subjects
  const { data: subjectsRes, isLoading: subjectsLoading } = useQuery({
    queryKey: ['faculty-subjects'],
    queryFn:  () => getSubjects({ facultyId: dbUser?._id }),
    enabled:  !!dbUser?._id,
  });

  const subjects = subjectsRes?.data || subjectsRes?.subjects || [];

  // Get students enrolled in selected subject
  const selectedSubjectData = subjects.find(s => s._id === selectedSubject);
  const students = selectedSubjectData?.enrolledStudents || [];

  // Initialize attendance as all Present when subject changes
  useEffect(() => {
    if (students.length > 0) {
      const init = {};
      students.forEach(s => { init[s._id || s] = 'Present'; });
      setAttendance(init);
    }
  }, [selectedSubject]);

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s._id || s] = status; });
    setAttendance(updated);
  };

  const mutation = useMutation({
    mutationFn: () => {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
      }));
      return submitAttendance({ subjectId: selectedSubject, date: selectedDate, records });
    },
    onSuccess: () => {
      toast.success('Attendance saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['faculty-dashboard'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to save attendance');
    },
  });

  const presentCount = Object.values(attendance).filter(v => v === 'Present').length;
  const absentCount  = Object.values(attendance).filter(v => v === 'Absent').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Take Attendance</h1>
        <p className="text-sm text-slate-500">Mark students present or absent for a class session</p>
      </div>

      {/* Controls */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjectsLoading ? (
            <div className="skeleton h-10 rounded-button" />
          ) : (
            <Select
              label="Subject"
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              required
            >
              <option value="">Select a subject</option>
              {subjects.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.subjectCode})</option>
              ))}
            </Select>
          )}
          <div className="flex flex-col gap-1">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              max={format(new Date(), 'yyyy-MM-dd')}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Roster */}
      {selectedSubject && (
        <Card
          title={`Student Roster — ${students.length} Students`}
          subtitle={`${presentCount} Present · ${absentCount} Absent`}
          action={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => markAll('Present')}>
                All Present
              </Button>
              <Button variant="ghost" size="sm" onClick={() => markAll('Absent')}>
                All Absent
              </Button>
            </div>
          }
        >
          {students.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              No students enrolled in this subject yet.
            </p>
          ) : (
            <div className="space-y-1.5">
              {students.map((student, idx) => {
                const id     = student._id || student;
                const status = attendance[id] || 'Present';
                const name   = student.name  || `Student ${idx + 1}`;
                const email  = student.email || '';

                return (
                  <div
                    key={id}
                    className={clsx(
                      'flex items-center gap-4 px-4 py-3 rounded-lg border transition-all cursor-pointer',
                      status === 'Present'
                        ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-red-50 border-red-200 hover:bg-red-100'
                    )}
                    onClick={() => toggleAttendance(id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && toggleAttendance(id)}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{name}</p>
                      <p className="text-xs text-slate-500">{email}</p>
                    </div>
                    <span className={clsx(
                      'badge text-xs',
                      status === 'Present' ? 'badge-green' : 'badge-red'
                    )}>
                      {status}
                    </span>
                    <button
                      className={clsx(
                        'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                        status === 'Present'
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-red-400 bg-white text-red-400'
                      )}
                      onClick={e => { e.stopPropagation(); toggleAttendance(id); }}
                      aria-label={`Toggle ${name} attendance`}
                    >
                      {status === 'Present' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sticky save button */}
          {students.length > 0 && (
            <div className="sticky bottom-0 pt-4 mt-4 border-t border-slate-100 bg-white">
              <Button
                className="w-full"
                onClick={() => mutation.mutate()}
                isLoading={mutation.isPending}
                disabled={!selectedSubject}
              >
                Save Attendance ({presentCount} Present, {absentCount} Absent)
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
