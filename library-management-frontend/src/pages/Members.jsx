import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';

import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { MemberForm } from '../components/forms/MemberForm';

import { getMembers, createMember, updateMember, deleteMember } from '../services/api';
import { useToast } from '../context/ToastContext';

export function Members() {
  const { addToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMembers();
      setMembers(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch members', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = members.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q))
    );
  });

  const handleCreateMember = async (formData) => {
    setSubmitting(true);
    try {
      await createMember(formData);
      addToast('Member registered successfully', 'success');
      setIsAddModalOpen(false);
      fetchMembers();
    } catch (err) {
      addToast(err.message || 'Failed to register member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMember = async (formData) => {
    if (!editingMember) return;
    setSubmitting(true);
    try {
      await updateMember(editingMember.id, formData);
      addToast('Member updated successfully', 'success');
      setEditingMember(null);
      fetchMembers();
    } catch (err) {
      addToast(err.message || 'Failed to update member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    setSubmitting(true);
    try {
      await deleteMember(deletingMember.id);
      addToast('Member deleted successfully', 'success');
      setDeletingMember(null);
      fetchMembers();
    } catch (err) {
      addToast(err.message || 'Failed to delete member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Members Directory</h1>
            <p className="page-subtitle">Manage library memberships and contact records.</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Member
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="data-table-wrapper">
        <div className="data-table-toolbar">
          <SearchInput
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="Search by name, email, or phone..."
          />
          <div className="text-sm text-muted">
            Total Members: <span className="font-semibold">{filteredMembers.length}</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={5} />
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={Users}
                      title="No members found"
                      description="Try adjusting your search criteria or register a new library member."
                      actionLabel="Add Member"
                      onAction={() => setIsAddModalOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} size="md" />
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            Member #{member.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>#{member.id}</td>
                    <td>
                      <div className="table-actions">
                        <Button
                          variant="ghost"
                          className="btn-icon"
                          onClick={() => setEditingMember(member)}
                          title="Edit Member"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="danger-ghost"
                          className="btn-icon"
                          onClick={() => setDeletingMember(member)}
                          title="Delete Member"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Member"
      >
        <MemberForm
          onSubmit={handleCreateMember}
          onCancel={() => setIsAddModalOpen(false)}
          loading={submitting}
        />
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        title="Edit Member Information"
      >
        <MemberForm
          initialData={editingMember}
          onSubmit={handleUpdateMember}
          onCancel={() => setEditingMember(null)}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleDeleteMember}
        title="Delete Member"
        message={`Are you sure you want to delete member "${deletingMember?.name}"?`}
        confirmText="Delete Member"
        loading={submitting}
      />
    </div>
  );
}
