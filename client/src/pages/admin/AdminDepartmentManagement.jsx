import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../services/departmentService.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Modal, { ConfirmDialog } from '../../components/common/Modal.jsx';

export default function AdminDepartmentManagement() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });

  const { data: deptsRes, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
  });

  const departments = deptsRes?.data || deptsRes?.departments || [];

  const handleOpenModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({ name: dept.name || '', code: dept.code || '' });
    } else {
      setEditingDept(null);
      setFormData({ name: '', code: '' });
    }
    setShowModal(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => editingDept ? updateDepartment(editingDept._id, formData) : createDepartment(formData),
    onSuccess: () => {
      toast.success(editingDept ? 'Department updated' : 'Department created');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setShowModal(false);
    },
    onError: (err) => toast.error(err.message || 'Operation failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteDepartment(deleteId),
    onSuccess: () => {
      toast.success('Department deleted');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete'),
  });

  const columns = [
    { header: 'Code', key: 'code', render: (val) => <span className="badge badge-indigo">{val}</span> },
    { header: 'Department Name', key: 'name', className: 'font-semibold text-slate-900' },
    {
      header: 'Actions',
      key: '_id',
      render: (_, row) => (
        <div className="flex gap-2">
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
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="text-sm text-slate-500">Manage academic departments</p>
        </div>
        <Button onClick={() => handleOpenModal()}>Add Department</Button>
      </div>

      <Card>
        <DataTable columns={columns} data={departments} isLoading={isLoading} />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDept ? 'Edit Department' : 'Add Department'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} isLoading={saveMutation.isPending}>
              {editingDept ? 'Save Changes' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Department Code" placeholder="e.g. CS" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
          <Input label="Department Name" placeholder="e.g. Computer Science" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
        title="Delete Department"
        message="Are you sure you want to delete this department?"
      />
    </div>
  );
}
