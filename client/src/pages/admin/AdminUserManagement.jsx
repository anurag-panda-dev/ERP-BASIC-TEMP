import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/userService.js';
import { getDepartments } from '../../services/departmentService.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Input, { Select } from '../../components/common/Input.jsx';
import DataTable, { Pagination } from '../../components/common/DataTable.jsx';
import Modal, { ConfirmDialog } from '../../components/common/Modal.jsx';
import { RoleBadge } from '../../components/common/Badge.jsx';

export default function AdminUserManagement() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    clerkId: '',
    role: 'student',
    department: '',
    semester: 1,
  });

  const { data: usersRes, isLoading } = useQuery({
    queryKey: ['users', page, roleFilter],
    queryFn: () => getUsers({ page, limit: 15, role: roleFilter || undefined }),
  });

  const { data: deptsRes } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
  });

  const users = usersRes?.data || usersRes?.users || [];
  const total = usersRes?.pagination?.total || usersRes?.total || users.length;
  const departments = deptsRes?.data || deptsRes?.departments || [];

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        clerkId: user.clerkId || '',
        role: user.role || 'student',
        department: user.department?._id || user.department || '',
        semester: user.semester || 1,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        clerkId: `clerk_${Date.now()}`,
        role: 'student',
        department: '',
        semester: 1,
      });
    }
    setShowModal(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      if (editingUser) {
        return updateUser(editingUser._id, formData);
      }
      return createUser(formData);
    },
    onSuccess: () => {
      toast.success(editingUser ? 'User updated successfully' : 'User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowModal(false);
    },
    onError: (err) => toast.error(err.message || 'Operation failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(deleteId),
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete user'),
  });

  const columns = [
    { header: 'Name', key: 'name', render: (val, row) => (
      <div>
        <p className="font-semibold text-slate-900">{val}</p>
        <p className="text-xs text-slate-500">{row.email}</p>
      </div>
    )},
    { header: 'Role', key: 'role', render: (val) => <RoleBadge role={val} /> },
    { header: 'Department', key: 'department', render: (val) => val?.name || 'N/A' },
    { header: 'Semester', key: 'semester', render: (val, row) => row.role === 'student' ? `Sem ${val}` : '-' },
    {
      header: 'Actions',
      key: '_id',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>Edit</Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setDeleteId(row._id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">Manage Students, Faculty, and Admin accounts</p>
        </div>
        <Button onClick={() => handleOpenModal()}>Add User</Button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="w-48">
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admins</option>
            </Select>
          </div>
        </div>

        <DataTable columns={columns} data={users} isLoading={isLoading} />
        <Pagination page={page} total={total} limit={15} onPageChange={setPage} />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} isLoading={saveMutation.isPending}>
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          {!editingUser && (
            <Input label="Clerk ID" value={formData.clerkId} onChange={(e) => setFormData({ ...formData, clerkId: e.target.value })} required />
          )}
          <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </Select>
          <Select label="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </Select>
          {formData.role === 'student' && (
            <Input label="Semester" type="number" min={1} max={8} value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })} />
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
        title="Delete User"
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
}
