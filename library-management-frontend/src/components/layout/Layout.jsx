import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { getActiveBorrowings } from '../../services/api';

export function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeBorrowsCount, setActiveBorrowsCount] = useState(0);

  useEffect(() => {
    async function fetchActiveCount() {
      try {
        const borrows = await getActiveBorrowings();
        if (Array.isArray(borrows)) {
          setActiveBorrowsCount(borrows.length);
        }
      } catch (_) {
        // Silently handle backend offline
      }
    }
    fetchActiveCount();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        activeBorrowsCount={activeBorrowsCount}
      />
      <div className={`app-main-wrapper ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Topbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onMobileToggle={() => setMobileOpen(!mobileOpen)}
        />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
