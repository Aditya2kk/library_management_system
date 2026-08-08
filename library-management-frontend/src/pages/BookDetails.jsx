import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, BookUp, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';

import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { BookForm } from '../components/forms/BookForm';

import { getBookById, updateBook } from '../services/api';
import { useToast } from '../context/ToastContext';

export function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadBook() {
      setLoading(true);
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (err) {
        addToast(err.message || 'Book not found', 'error');
        navigate('/books');
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [id, navigate, addToast]);

  const handleUpdateBook = async (formData) => {
    setSubmitting(true);
    try {
      const updated = await updateBook(id, formData);
      setBook(updated);
      addToast('Book updated successfully', 'success');
      setIsEditModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to update book', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton height="32px" width="200px" className="mb-6" />
        <div className="card card-padded">
          <Skeleton height="200px" />
        </div>
      </div>
    );
  }

  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <div>
      {/* Top action bar */}
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/books')}>
          Back to Books
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" icon={Edit2} onClick={() => setIsEditModalOpen(true)}>
            Edit Book
          </Button>
          <Button
            variant="primary"
            icon={BookUp}
            disabled={!isAvailable}
            onClick={() => navigate('/borrow', { state: { bookId: book.id } })}
          >
            Issue Book
          </Button>
        </div>
      </div>

      {/* Book Hero Card */}
      <div className="card card-padded">
        <div className="book-detail-hero">
          {/* Cover Illustration */}
          <div className="book-cover-placeholder">
            <BookOpen size={48} />
            <span>LibraryHub Title</span>
          </div>

          {/* Info Side */}
          <div className="book-detail-info">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="blue" showDot={false}>
                {book.category || 'General'}
              </Badge>
              {isAvailable ? (
                <Badge variant="green">Available</Badge>
              ) : (
                <Badge variant="red">Unavailable</Badge>
              )}
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>{book.title}</h1>
            <p className="text-muted text-md mb-6">by {book.author || 'Unknown Author'}</p>

            <div className="book-detail-meta">
              <div className="book-meta-item">
                <label>Book ID</label>
                <span>#{book.id}</span>
              </div>
              <div className="book-meta-item">
                <label>Available Copies</label>
                <span>{book.availableCopies}</span>
              </div>
              <div className="book-meta-item">
                <label>Category</label>
                <span>{book.category || 'General'}</span>
              </div>
            </div>

            {/* Status box */}
            <div
              className="card mt-6"
              style={{
                padding: '16px',
                backgroundColor: isAvailable ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                borderColor: isAvailable ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              {isAvailable ? (
                <CheckCircle2 size={22} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              ) : (
                <AlertCircle size={22} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
              )}
              <div>
                <div className="font-semibold text-sm">
                  {isAvailable ? 'In Stock & Ready for Checkout' : 'Currently Out of Stock'}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  {isAvailable
                    ? `There are ${book.availableCopies} copy(ies) available in the library.`
                    : 'All copies are currently borrowed. Check active borrowings for return dates.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Book Details"
      >
        <BookForm
          initialData={book}
          onSubmit={handleUpdateBook}
          onCancel={() => setIsEditModalOpen(false)}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}
