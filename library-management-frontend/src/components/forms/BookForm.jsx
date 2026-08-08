import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

export function BookForm({ initialData, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    availableCopies: 1
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        category: initialData.category || '',
        availableCopies: initialData.availableCopies !== undefined ? initialData.availableCopies : 1
      });
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    }
    if (formData.availableCopies < 0) {
      errs.availableCopies = 'Available copies must be 0 or more';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Book Title *</label>
        <input
          type="text"
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="e.g. Clean Code"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Author</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Robert C. Martin"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Software Engineering"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Available Copies *</label>
        <input
          type="number"
          min="0"
          className={`form-input ${errors.availableCopies ? 'error' : ''}`}
          value={formData.availableCopies}
          onChange={(e) => setFormData({ ...formData, availableCopies: parseInt(e.target.value) || 0 })}
        />
        {errors.availableCopies && <div className="form-error">{errors.availableCopies}</div>}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={loading}>
          {initialData ? 'Save Changes' : 'Add Book'}
        </Button>
      </div>
    </form>
  );
}
