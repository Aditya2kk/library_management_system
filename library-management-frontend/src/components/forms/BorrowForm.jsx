import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export function BorrowForm({ members = [], books = [], onSubmit, onCancel, loading }) {
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [bookId, setBookId] = useState(books[0]?.id || '');

  const selectedBook = books.find((b) => Number(b.id) === Number(bookId));
  const isAvailable = selectedBook && selectedBook.availableCopies > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!memberId || !bookId) return;
    if (!isAvailable) return;
    onSubmit(memberId, bookId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Select Member *</label>
        <select
          className="form-select"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        >
          <option value="" disabled>Choose a member...</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.email})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Select Book *</label>
        <select
          className="form-select"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        >
          <option value="" disabled>Choose a book...</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} — {b.availableCopies} available
            </option>
          ))}
        </select>
      </div>

      {selectedBook && (
        <div
          className={`card card-padded mb-6 flex items-center gap-3 ${
            isAvailable ? 'bg-success-subtle' : 'bg-danger-subtle'
          }`}
          style={{
            backgroundColor: isAvailable ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
            borderColor: isAvailable ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)',
            padding: '12px 16px'
          }}
        >
          {isAvailable ? (
            <CheckCircle2 size={20} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
          ) : (
            <AlertCircle size={20} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
          )}
          <div>
            <div className="font-semibold text-sm">
              {isAvailable ? 'Book Available' : 'This book is currently unavailable.'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {isAvailable
                ? `${selectedBook.availableCopies} copy(ies) in stock ready to issue.`
                : 'All copies are currently borrowed. Choose another title.'}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button
          variant="primary"
          type="submit"
          loading={loading}
          disabled={!isAvailable || !memberId || !bookId}
          style={{ marginLeft: 'auto' }}
        >
          Issue Book
        </Button>
      </div>
    </form>
  );
}
