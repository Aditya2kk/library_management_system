import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, totalElements, pageSize, onPageChange }) {
  if (totalPages <= 1 && totalElements <= pageSize) return null;

  const startIdx = currentPage * pageSize + 1;
  const endIdx = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <span className="font-semibold">{totalElements > 0 ? startIdx : 0}</span> to{' '}
        <span className="font-semibold">{endIdx}</span> of{' '}
        <span className="font-semibold">{totalElements}</span> results
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => onPageChange(i)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="pagination-btn"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
