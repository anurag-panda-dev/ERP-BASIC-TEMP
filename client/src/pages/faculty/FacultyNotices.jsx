import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotices, createNotice, deleteNotice } from '../../services/noticeService.js';
import { getSubjects } from '../../services/subjectService.js';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Input, { Select, Textarea } from '../../components/common/Input.jsx';
import Modal from '../../components/common/Modal.jsx';
import { ConfirmDialog } from '../../components/common/Modal.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { format } from 'date-fns';
import { clsx } from 'clsx';

export default function FacultyNotices() {
  const { dbUser }  = useAuthContext();
  const toast       = useToast();
  const queryClient = useQueryClient();

  const [showModal,   setShowModal]   = useState(false);
  const [deleteId,    setDeleteId]    = useState(null);
  const [form,        setForm]        = useState({ title: '', content: '', audience: 'global', targetSubject: '' });

  const { data: noticesRes, isLoading } = useQuery({
    queryKey: ['faculty-notices'],
    queryFn:  () => getNotices({ authorId: dbUser?._id }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: subjectsRes } = useQuery({
    queryKey: ['faculty-subjects'],
    queryFn:  () => getSubjects({ facultyId: dbUser?._id }),
    enabled:  !!dbUser?._id,
  });

  const notices  = noticesRes?.data  || noticesRes?.notices  || [];
  const subjects = subjectsRes?.data || subjectsRes?.subjects || [];

  const createMutation = useMutation({
    mutationFn: () => createNotice({
      ...form,
      targetSubject: form.audience === 'class' ? form.targetSubject : undefined,
    }),
    onSuccess: () => {
      toast.success('Notice posted!');
      queryClient.invalidateQueries({ queryKey: ['faculty-notices'] });
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setShowModal(false);
      setForm({ title: '', content: '', audience: 'global', targetSubject: '' });
    },
    onError: (err) => toast.error(err.message || 'Failed to post notice'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteNotice(deleteId),
    onSuccess: () => {
      toast.success('Notice deleted');
      queryClient.invalidateQueries({ queryKey: ['faculty-notices'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete'),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notices</h1>
          <p className="text-sm text-slate-500">Post announcements to your students</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Post Notice</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="skeleton h-24 rounded-card" />)}</div>
      ) : notices.length === 0 ? (
        <Card>
          <EmptyState
            title="No notices posted"
            description="Post your first notice to inform your students."
            action={<Button onClick={() => setShowModal(true)}>Post Notice</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {notices.map(notice => (
            <div key={notice._id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900">{notice.title}</h3>
                    <span className={clsx('badge', notice.audience === 'global' ? 'badge-indigo' : 'badge-green')}>
                      {notice.audience === 'global' ? 'All Students' : 'Class'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{notice.content}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {notice.createdAt ? format(new Date(notice.createdAt), 'MMM d, yyyy h:mm a') : ''}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteId(notice._id)}
                  className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Delete notice"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Post a Notice"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} isLoading={createMutation.isPending}>
              Post Notice
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Notice title"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            required
          />
          <Textarea
            label="Content"
            placeholder="Write your announcement..."
            value={form.content}
            rows={4}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            required
          />
          <Select
            label="Audience"
            value={form.audience}
            onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
          >
            <option value="global">All Students (Global)</option>
            <option value="class">Specific Class</option>
          </Select>
          {form.audience === 'class' && (
            <Select
              label="Target Class"
              value={form.targetSubject}
              onChange={e => setForm(p => ({ ...p, targetSubject: e.target.value }))}
            >
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </Select>
          )}
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
