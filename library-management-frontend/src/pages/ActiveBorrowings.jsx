import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, RotateCcw, Plus, BookUp } from 'lucide-react';

import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { SearchInput } from '../components/ui/SearchInput';

import { getActiveBorrowings, returnBook } from '../services/api';
import { useToast } from '../context/ToastContext';

export function ActiveBorrowings() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [returningRecord, setReturningRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchActiveBorrows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getActiveBorrowings();
      setBorrows(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to load active borrowings', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchActiveBorrows();
  }, [fetchActiveBorrows]);

  const filteredBorrows = borrows.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.memberName && b.memberName.toLowerCase().includes(q)) ||
      (b.bookTitle && b.bookTitle.toLowerCase().includes(q)) ||
      String(b.id).includes(q)
    );
  });

  const handleReturnBook = async () => {
    if (!returningRecord) return;
    setSubmitting(true);
    try {
      await returnBook(returningRecord.id);
      addToast('Book returned successfully.', 'success');
      setReturningRecord(null);
      fetchActiveBorrows();
    } catch (err) {
      addToast(err.message || 'Failed to return book', 'error');
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
            <h1 className="page-title">Active Borrowings</h1>
            <p className="page-subtitle">Track books currently issued to members and process returns.</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/borrow')}>
            Issue New Book
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="data-table-wrapper">
        <div className="data-table-toolbar">
          <SearchInput
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="Search active borrows..."
          />
          <div className="text-sm text-muted">
            Currently Issued: <span className="font-semibold">{filteredBorrows.length}</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Member Name</th>
                <th>Book Title</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : filteredBorrows.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={Clock}
                      title="No active borrowings"
                      description="All library books are currently returned and in stock."
                      actionLabel="Issue Book"
                      onAction={() => navigate('/borrow')}
                    />
                  </td>
                </tr>
              ) : (
                filteredBorrows.map((record) => (
                  <tr key={record.id}>
                    <td>#{record.id}</td>
                    <td className="font-semibold">{record.memberName || `Member #${record.memberId}`}</td>
                    <td>{record.bookTitle || `Book #${record.bookId}`}</td>
                    <td>{record.issueDate}</td>
                    <td>
                      <Badge variant="blue">Borrowed</Badge>
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={RotateCcw}
                        onClick={() => setReturningRecord(record)}
                      >
                        Return Book
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!returningRecord}
        onClose={() => setReturningRecord(null)}
        onConfirm={handleReturnBook}
        type="warning"
        title="Return Book Confirmation"
        message={`Are you sure you want to return "${returningRecord?.bookTitle}" borrowed by ${returningRecord?.memberName}?`}
        confirmText="Return Book"
        loading={submitting}
      />
    </div>
  );
}
