import React, { useState, useEffect, useCallback } from 'react';
import { History, Filter, Search } from 'lucide-react';

import { SearchInput } from '../components/ui/SearchInput';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';

import { getMembers, getBorrowHistory, getActiveBorrowings } from '../services/api';
import { useToast } from '../context/ToastContext';

export function BorrowHistory() {
  const { addToast } = useToast();

  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load members list for dropdown filter
  useEffect(() => {
    async function loadMembersList() {
      try {
        const data = await getMembers();
        setMembers(data || []);
        if (data && data.length > 0) {
          setSelectedMemberId(String(data[0].id));
        }
      } catch (err) {
        addToast('Failed to load members list', 'error');
      }
    }
    loadMembersList();
  }, [addToast]);

  // Fetch history for selected member
  const fetchMemberHistory = useCallback(async (memberId) => {
    if (!memberId) return;
    setLoading(true);
    try {
      const records = await getBorrowHistory(memberId);
      setHistoryRecords(records || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch member borrow history', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (selectedMemberId) {
      fetchMemberHistory(selectedMemberId);
    }
  }, [selectedMemberId, fetchMemberHistory]);

  const filteredRecords = historyRecords.filter((rec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (rec.bookTitle && rec.bookTitle.toLowerCase().includes(q)) ||
      (rec.memberName && rec.memberName.toLowerCase().includes(q)) ||
      String(rec.id).includes(q)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Member Borrow History</h1>
            <p className="page-subtitle">Inspect historical borrow and return logs per member.</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="data-table-wrapper">
        <div className="data-table-toolbar">
          <div className="flex gap-4 items-center flex-wrap" style={{ flex: 1 }}>
            {/* Member Selector Dropdown */}
            <div className="flex items-center gap-2">
              <Filter size={16} style={{ color: 'var(--color-text-muted)' }} />
              <span className="text-sm font-semibold">Select Member:</span>
              <select
                className="form-select"
                style={{ width: 240 }}
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
              >
                <option value="" disabled>Choose a member...</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (#{m.id})
                  </option>
                ))}
              </select>
            </div>

            <SearchInput
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder="Search history records..."
            />
          </div>

          <div className="text-sm text-muted">
            Total Logs: <span className="font-semibold">{filteredRecords.length}</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Member</th>
                <th>Book Title</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={History}
                      title="No borrow history"
                      description="No borrow records found for the selected member."
                    />
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const isReturned = !!record.returnDate;
                  return (
                    <tr key={record.id}>
                      <td>#{record.id}</td>
                      <td className="font-semibold">{record.memberName || `Member #${record.memberId}`}</td>
                      <td>{record.bookTitle || `Book #${record.bookId}`}</td>
                      <td>{record.issueDate}</td>
                      <td>{record.returnDate ? record.returnDate : '—'}</td>
                      <td>
                        {isReturned ? (
                          <Badge variant="green">Returned</Badge>
                        ) : (
                          <Badge variant="blue">Active Borrow</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
