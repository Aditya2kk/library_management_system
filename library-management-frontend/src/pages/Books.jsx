import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, BookOpen } from 'lucide-react';

import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { BookForm } from '../components/forms/BookForm';

import { getBooks, searchBooksByAuthor, createBook, updateBook, deleteBook } from '../services/api';
import { useToast } from '../context/ToastContext';

export function Books() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Search state
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const results = await searchBooksByAuthor(searchQuery);
        setBooks(results || []);
        setTotalPages(1);
        setTotalElements(results ? results.length : 0);
      } else {
        const data = await getBooks(page, size, 'title,asc');
        setBooks(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch books', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, size, searchQuery, addToast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Categories list for filter dropdown
  const categories = Array.from(new Set(books.map((b) => b.category).filter(Boolean)));

  const filteredBooks = books.filter((b) => {
    if (!selectedCategory) return true;
    return b.category === selectedCategory;
  });

  const handleCreateBook = async (formData) => {
    setSubmitting(true);
    try {
      await createBook(formData);
      addToast('Book added successfully', 'success');
      setIsAddModalOpen(false);
      fetchBooks();
    } catch (err) {
      addToast(err.message || 'Failed to create book', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBook = async (formData) => {
    if (!editingBook) return;
    setSubmitting(true);
    try {
      await updateBook(editingBook.id, formData);
      addToast('Book updated successfully', 'success');
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      addToast(err.message || 'Failed to update book', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    setSubmitting(true);
    try {
      await deleteBook(deletingBook.id);
      addToast('Book deleted successfully', 'success');
      setDeletingBook(null);
      fetchBooks();
    } catch (err) {
      addToast(err.message || 'Failed to delete book', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (copies) => {
    if (copies > 2) return <Badge variant="green">Available ({copies})</Badge>;
    if (copies > 0) return <Badge variant="amber">Low Stock ({copies})</Badge>;
    return <Badge variant="red">Unavailable</Badge>;
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Books Directory</h1>
            <p className="page-subtitle">Manage catalog, inventory, and title details.</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Book
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="data-table-wrapper">
        <div className="data-table-toolbar">
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setPage(0);
            }}
            placeholder="Search by author..."
          />

          <div className="flex gap-3 items-center">
            {categories.length > 0 && (
              <select
                className="form-select"
                style={{ width: 180 }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status / Copies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={BookOpen}
                      title="No books found"
                      description="Try adjusting your search query or add a new book to the library."
                      actionLabel="Add Book"
                      onAction={() => setIsAddModalOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>#{book.id}</td>
                    <td className="font-semibold">{book.title}</td>
                    <td>{book.author || '—'}</td>
                    <td>
                      <Badge variant="gray" showDot={false}>
                        {book.category || 'General'}
                      </Badge>
                    </td>
                    <td>{getStatusBadge(book.availableCopies)}</td>
                    <td>
                      <div className="table-actions">
                        <Button
                          variant="ghost"
                          className="btn-icon"
                          onClick={() => navigate(`/books/${book.id}`)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          className="btn-icon"
                          onClick={() => setEditingBook(book)}
                          title="Edit Book"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="danger-ghost"
                          className="btn-icon"
                          onClick={() => setDeletingBook(book)}
                          title="Delete Book"
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

        {!searchQuery && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={size}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* Add Book Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Book"
      >
        <BookForm
          onSubmit={handleCreateBook}
          onCancel={() => setIsAddModalOpen(false)}
          loading={submitting}
        />
      </Modal>

      {/* Edit Book Modal */}
      <Modal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        title="Edit Book Details"
      >
        <BookForm
          initialData={editingBook}
          onSubmit={handleUpdateBook}
          onCancel={() => setEditingBook(null)}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDeleteBook}
        title="Delete Book"
        message={`Are you sure you want to delete "${deletingBook?.title}"? This action cannot be undone.`}
        confirmText="Delete Book"
        loading={submitting}
      />
    </div>
  );
}
