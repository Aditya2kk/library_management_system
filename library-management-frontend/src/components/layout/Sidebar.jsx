import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookUp,
  Clock,
  History,
  BookMarked
} from 'lucide-react';

export function Sidebar({ collapsed, mobileOpen, onMobileClose, activeBorrowsCount = 0 }) {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/books', label: 'Books', icon: BookOpen },
    { path: '/members', label: 'Members', icon: Users },
    { path: '/borrow', label: 'Borrowing', icon: BookUp },
    { path: '/active-borrowings', label: 'Active Borrowings', icon: Clock, badge: activeBorrowsCount > 0 ? activeBorrowsCount : null },
    { path: '/borrow-history', label: 'Borrow History', icon: History },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`} onClick={onMobileClose} />
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <BookMarked size={20} />
          </div>
          <span className="sidebar-logo-text">LibraryHub</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={onMobileClose}
              >
                <Icon size={20} />
                <span className="sidebar-nav-text">{item.label}</span>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="sidebar-nav-badge">{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
