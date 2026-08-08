import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ChevronRight } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

const ROUTE_NAMES = {
  '/': 'Dashboard',
  '/books': 'Books Directory',
  '/members': 'Members Directory',
  '/borrow': 'Issue Book',
  '/active-borrowings': 'Active Borrowings',
  '/borrow-history': 'Borrow History',
};

export function Topbar({ collapsed, onToggleSidebar, onMobileToggle }) {
  const location = useLocation();
  const currentPath = location.pathname;
  let pageTitle = ROUTE_NAMES[currentPath];
  if (!pageTitle && currentPath.startsWith('/books/')) {
    pageTitle = 'Book Details';
  }
  if (!pageTitle) {
    pageTitle = 'Library System';
  }

  return (
    <header className={`topbar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="topbar-left">
        <button className="topbar-toggle" onClick={onMobileToggle} aria-label="Toggle mobile menu">
          <Menu size={20} />
        </button>

        <div className="topbar-breadcrumb">
          <span>LibraryHub</span>
          <ChevronRight size={14} />
          <span className="topbar-breadcrumb-current">{pageTitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="flex items-center gap-3">
          <div style={{ textAlign: 'right', display: 'none', mdDisplay: 'block' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Librarian Admin</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Main Branch</div>
          </div>
          <Avatar name="Librarian Admin" size="md" />
        </div>
      </div>
    </header>
  );
}
