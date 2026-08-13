import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubjects } from '../../services/subjectService.js';
import { getAssessments, createAssessment, submitMarks, publishAssessment } from '../../services/assessmentService.js';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Select } from '../../components/common/Input.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Modal from '../../components/common/Modal.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { ASSESSMENT_TYPES } from '../../config/constants.js';
import { clsx } from 'clsx';

export default function FacultyEnterMarks() {
  const { dbUser }   = useAuthContext();
  const toast        = useToast();
  const queryClient  = useQueryClient();

  const [selectedSubject,    setSelectedSubject]    = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [marks,              setMarks]              = useState({});
  const [showNewModal,       setShowNewModal]       = useState(false);
  const [newAssessment,      setNewAssessment]      = useState({ title: '', type: 'internal', maxMarks: 100 });

  // Subjects
  const { data: subjectsRes } = useQuery({
    queryKey: ['faculty-subjects'],
    queryFn:  () => getSubjects({ facultyId: dbUser?._id }),
    enabled:  !!dbUser?._id,
  });
  const subjects = subjectsRes?.data || subjectsRes?.subjects || [];

  // Assessments for selected subject
  const { data: assessmentsRes, isLoading: assessmentsLoading } = useQuery({
    queryKey: ['assessments', selectedSubject],
    queryFn:  () => getAssessments({ subjectId: selectedSubject }),
    enabled:  !!selectedSubject,
  });
  const assessments = assessmentsRes?.data || assessmentsRes?.assessments || [];

  // Students in selected subject
  const subjectData = subjects.find(s => s._id === selectedSubject);
  const students    = subjectData?.enrolledStudents || [];

  // Assessment detail
  const currentAssessment = assessments.find(a => a._id === selectedAssessment);

  // Prefill marks from existing records
  React.useEffect(() => {
    if (currentAssessment?.records) {
      const filled = {};
      currentAssessment.records.forEach(r => {
        filled[r.student?._id || r.student] = r.marksObtained ?? '';
      });
      setMarks(filled);
    } else {
      setMarks({});
    }
  }, [selectedAssessment, currentAssessment]);

  // Create assessment
  const createMutation = useMutation({
    mutationFn: () => createAssessment({
      subjectId: selectedSubject,
      ...newAssessment,
    }),
    onSuccess: (data) => {
      toast.success('Assessment created!');
      queryClient.invalidateQueries({ queryKey: ['assessments', selectedSubject] });
      setSelectedAssessment(data._id || data.data?._id);
      setShowNewModal(false);
      setNewAssessment({ title: '', type: 'internal', maxMarks: 100 });
    },
    onError: (err) => toast.error(err.message || 'Failed to create assessment'),
  });

  // Submit marks
  const submitMutation = useMutation({
    mutationFn: () => {
      const records = Object.entries(marks).map(([studentId, marksObtained]) => ({
        studentId,
        marksObtained: Number(marksObtained) || 0,
      }));
      return submitMarks(selectedAssessment, records);
    },
    onSuccess: () => {
      toast.success('Marks saved!');
      queryClient.invalidateQueries({ queryKey: ['assessments', selectedSubject] });
    },
    onError: (err) => toast.error(err.message || 'Failed to save marks'),
  });

  // Publish
  const publishMutation = useMutation({
    mutationFn: () => publishAssessment(selectedAssessment),
    onSuccess: () => {
      toast.success('Assessment published to students!');
      queryClient.invalidateQueries({ queryKey: ['assessments', selectedSubject] });
    },
    onError: (err) => toast.error(err.message || 'Failed to publish'),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Enter Marks</h1>
        <p className="text-sm text-slate-500">Create assessments and upload student marks</p>
      </div>

      {/* Controls */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select label="Subject" value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setSelectedAssessment(''); }}>
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </Select>

          <Select
            label="Assessment"
            value={selectedAssessment}
            onChange={e => setSelectedAssessment(e.target.value)}
            disabled={!selectedSubject}
          >
            <option value="">Select assessment</option>
            {assessments.map(a => <option key={a._id} value={a._id}>{a.title} ({a.maxMarks} marks)</option>)}
          </Select>

          <div className="flex items-end">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowNewModal(true)}
              disabled={!selectedSubject}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              New Assessment
            </Button>
          </div>
        </div>
      </Card>

      {/* Marks grid */}
      {selectedAssessment && currentAssessment && (
        <Card
          title={currentAssessment.title}
          subtitle={`Max Marks: ${currentAssessment.maxMarks} · Type: ${currentAssessment.type}`}
          action={
            <div className="flex gap-2">
              <Button
                variant="secondary" size="sm"
                onClick={() => publishMutation.mutate()}
                isLoading={publishMutation.isPending}
              >
                Publish
              </Button>
              <Button
                size="sm"
                onClick={() => submitMutation.mutate()}
                isLoading={submitMutation.isPending}
              >
                Save Marks
              </Button>
            </div>
          }
        >
          {students.length === 0 ? (
            <EmptyState title="No students enrolled" />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th className="text-center">Marks / {currentAssessment.maxMarks}</th>
                    <th className="text-center">%</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const id  = student._id || student;
                    const val = marks[id] ?? '';
                    const pct = val !== '' && currentAssessment.maxMarks > 0
                      ? Math.round((Number(val) / currentAssessment.maxMarks) * 100)
                      : null;
                    return (
                      <tr key={id}>
                        <td className="text-slate-400 text-xs">{idx + 1}</td>
                        <td className="font-medium">{student.name || `Student ${idx + 1}`}</td>
                        <td className="text-slate-500 text-xs">{student.email || ''}</td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={currentAssessment.maxMarks}
                            className="form-input text-center w-24 mx-auto"
                            value={val}
                            placeholder="—"
                            onChange={e => setMarks(prev => ({ ...prev, [id]: e.target.value }))}
                          />
                        </td>
                        <td className="text-center">
                          {pct !== null && (
                            <span className={clsx(
                              'font-semibold',
                              pct >= 60 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600'
                            )}>
                              {pct}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* New Assessment Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Create New Assessment"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} isLoading={createMutation.isPending}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Assessment Title"
            placeholder="e.g. Midterm 1"
            value={newAssessment.title}
            onChange={e => setNewAssessment(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          <Select
            label="Type"
            value={newAssessment.type}
            onChange={e => setNewAssessment(prev => ({ ...prev, type: e.target.value }))}
          >
            {ASSESSMENT_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
          <Input
            label="Maximum Marks"
            type="number"
            min={1}
            value={newAssessment.maxMarks}
            onChange={e => setNewAssessment(prev => ({ ...prev, maxMarks: Number(e.target.value) }))}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
