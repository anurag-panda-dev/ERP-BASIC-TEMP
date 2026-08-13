import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotices, createNotice, deleteNotice } from '../../services/noticeService.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Input, { Select, Textarea } from '../../components/common/Input.jsx';
import Modal, { ConfirmDialog } from '../../components/common/Modal.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { format } from 'date-fns';

export default function AdminNoticeManagement() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', audience: 'global' });

  const { data: noticesRes, isLoading } = useQuery({
    queryKey: ['admin-notices'],
    queryFn: () => getNotices({ limit: 50 }),
  });

  const notices = noticesRes?.data || noticesRes?.notices || [];

  const createMutation = useMutation({
    mutationFn: () => createNotice(form),
    onSuccess: () => {
      toast.success('Broadcast notice posted!');
      queryClient.invalidateQueries({ queryKey: ['admin-notices'] });
      setShowModal(false);
      setForm({ title: '', content: '', audience: 'global' });
    },
    onError: (err) => toast.error(err.message || 'Failed to post notice'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteNotice(deleteId),
    onSuccess: () => {
      toast.success('Notice deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-notices'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete notice'),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Broadcast Notices</h1>
          <p className="text-sm text-slate-500">Post system-wide announcements</p>
        </div>
        <Button onClick={() => setShowModal(true)}>New Notice</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="skeleton h-24 rounded-card" />)}</div>
      ) : notices.length === 0 ? (
        <Card>
          <EmptyState title="No notices published" description="Post system notices for students and faculty." />
        </Card>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice._id} className="card p-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900">{notice.title}</h3>
                  <span className="badge badge-indigo">{notice.audience}</span>
                </div>
                <p className="text-sm text-slate-600">{notice.content}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <span>Author: {notice.author?.name || 'Admin'}</span>
                  <span>·</span>
                  <span>{notice.createdAt ? format(new Date(notice.createdAt), 'MMM d, yyyy') : ''}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 shrink-0" onClick={() => setDeleteId(notice._id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Broadcast Notice"
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
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Content" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
        title="Delete Notice"
        message="Are you sure you want to delete this notice?"
      />
    </div>
  );
}
