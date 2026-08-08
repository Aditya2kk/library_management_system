import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookUp, ArrowLeft } from 'lucide-react';

import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { BorrowForm } from '../components/forms/BorrowForm';

import { getMembers, getBooks, borrowBook } from '../services/api';
import { useToast } from '../context/ToastContext';

export function BorrowBook() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadFormOptions() {
      setLoading(true);
      try {
        const [membersData, booksData] = await Promise.all([
          getMembers().catch(() => []),
          getBooks(0, 100).catch(() => ({ content: [] }))
        ]);
        setMembers(membersData || []);
        setBooks(booksData.content || []);
      } catch (err) {
        addToast(err.message || 'Failed to load options', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadFormOptions();
  }, [addToast]);

  const handleBorrow = async (memberId, bookId) => {
    setSubmitting(true);
    try {
      await borrowBook(memberId, bookId);
      addToast('Book borrowed successfully.', 'success');
      navigate('/active-borrowings');
    } catch (err) {
      addToast(err.message || 'Failed to borrow book', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="mb-6">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="page-header text-center">
        <div
          className="stat-card-icon blue"
          style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: '50%' }}
        >
          <BookUp size={28} />
        </div>
        <h1 className="page-title">Issue Book to Member</h1>
        <p className="page-subtitle">Select a registered member and an available library book.</p>
      </div>

      <div className="card card-padded">
        {loading ? (
          <div>
            <Skeleton height="40px" className="mb-4" />
            <Skeleton height="40px" className="mb-4" />
            <Skeleton height="80px" />
          </div>
        ) : (
          <BorrowForm
            members={members}
            books={books}
            onSubmit={handleBorrow}
            onCancel={() => navigate(-1)}
            loading={submitting}
          />
        )}
      </div>
    </div>
  );
}
