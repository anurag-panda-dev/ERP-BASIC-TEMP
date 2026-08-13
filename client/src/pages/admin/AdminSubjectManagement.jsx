import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubjects, createSubject, updateSubject, deleteSubject, assignFaculty } from '../../services/subjectService.js';
import { getDepartments } from '../../services/departmentService.js';
import { getUsersByRole } from '../../services/userService.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Input, { Select } from '../../components/common/Input.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Modal, { ConfirmDialog } from '../../components/common/Modal.jsx';

export default function AdminSubjectManagement() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [assignSubject, setAssignSubject] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({ name: '', subjectCode: '', department: '', semester: 1 });

  const { data: subjectsRes, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => getSubjects(),
  });

  const { data: deptsRes } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
  });

  const { data: facultyRes } = useQuery({
    queryKey: ['users-faculty'],
    queryFn: () => getUsersByRole('faculty'),
  });

  const subjects = subjectsRes?.data || subjectsRes?.subjects || [];
  const departments = deptsRes?.data || deptsRes?.departments || [];
  const facultyMembers = facultyRes?.data || facultyRes?.users || [];

  const handleOpenModal = (subj = null) => {
    if (subj) {
      setEditingSubject(subj);
      setFormData({
        name: subj.name || '',
        subjectCode: subj.subjectCode || '',
        department: subj.department?._id || subj.department || '',
        semester: subj.semester || 1,
      });
    } else {
      setEditingSubject(null);
      setFormData({ name: '', subjectCode: '', department: '', semester: 1 });
    }
    setShowModal(true);
  };

  const handleOpenAssignModal = (subj) => {
    setAssignSubject(subj);
    setSelectedFaculty(subj.assignedFaculty?._id || subj.assignedFaculty || '');
    setShowAssignModal(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => editingSubject ? updateSubject(editingSubject._id, formData) : createSubject(formData),
    onSuccess: () => {
      toast.success(editingSubject ? 'Subject updated' : 'Subject created');
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setShowModal(false);
    },
    onError: (err) => toast.error(err.message || 'Operation failed'),
  });

  const assignMutation = useMutation({
    mutationFn: () => assignFaculty(assignSubject._id, selectedFaculty),
    onSuccess: () => {
      toast.success('Faculty assigned to subject');
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setShowAssignModal(false);
    },
    onError: (err) => toast.error(err.message || 'Assignment failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSubject(deleteId),
    onSuccess: () => {
      toast.success('Subject deleted');
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete'),
  });

  const columns = [
    { header: 'Code', key: 'subjectCode', render: (val) => <span className="badge badge-indigo">{val}</span> },
    { header: 'Subject Name', key: 'name', className: 'font-semibold text-slate-900' },
    { header: 'Department', key: 'department', render: (val) => val?.name || 'N/A' },
    { header: 'Semester', key: 'semester', render: (val) => `Sem ${val}` },
    { header: 'Assigned Faculty', key: 'assignedFaculty', render: (val) => val?.name || <span className="text-slate-400 text-xs">Unassigned</span> },
    {
      header: 'Actions',
      key: '_id',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenAssignModal(row)}>Assign</Button>
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>Edit</Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setDeleteId(row._id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subjects</h1>
          <p className="text-sm text-slate-500">Manage courses and faculty assignments</p>
        </div>
        <Button onClick={() => handleOpenModal()}>Add Subject</Button>
      </div>

      <Card>
        <DataTable columns={columns} data={subjects} isLoading={isLoading} />
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} isLoading={saveMutation.isPending}>
              {editingSubject ? 'Save Changes' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Subject Code" placeholder="e.g. CS201" value={formData.subjectCode} onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })} required />
          <Input label="Subject Name" placeholder="e.g. Data Structures" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Select label="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </Select>
          <Input label="Semester" type="number" min={1} max={8} value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })} required />
        </div>
      </Modal>

      {/* Faculty Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={`Assign Faculty — ${assignSubject?.name || ''}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
            <Button onClick={() => assignMutation.mutate()} isLoading={assignMutation.isPending}>
              Assign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Select Faculty Member" value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}>
            <option value="">Unassigned</option>
            {facultyMembers.map((f) => (
              <option key={f._id} value={f._id}>{f.name} ({f.email})</option>
            ))}
          </Select>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
        title="Delete Subject"
        message="Are you sure you want to delete this subject?"
      />
    </div>
  );
}
