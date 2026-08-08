import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  BookUp,
  CheckCircle,
  Plus,
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';

import { getBooks, getMembers, getActiveBorrowings } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableCopies: 0,
    totalMembers: 0,
    activeBorrows: 0,
    categories: {},
  });
  const [recentBorrows, setRecentBorrows] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [booksPage, membersList, activeBorrowsList] = await Promise.all([
          getBooks(0, 100).catch(() => ({ content: [], totalElements: 0 })),
          getMembers().catch(() => []),
          getActiveBorrowings().catch(() => [])
        ]);

        const books = booksPage.content || [];
        const totalBooks = booksPage.totalElements || books.length;
        const availableCopies = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
        const totalMembers = membersList.length;
        const activeBorrows = activeBorrowsList.length;

        // Aggregate books by category
        const categories = {};
        books.forEach((b) => {
          const cat = b.category || 'General';
          categories[cat] = (categories[cat] || 0) + 1;
        });

        setStats({
          totalBooks,
          availableCopies,
          totalMembers,
          activeBorrows,
          categories,
        });

        setRecentBorrows(activeBorrowsList.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Chart Data: Books by Category
  const categoryLabels = Object.keys(stats.categories);
  const categoryValues = Object.values(stats.categories);

  const categoryChartData = {
    labels: categoryLabels.length > 0 ? categoryLabels : ['Software', 'Java', 'Design'],
    datasets: [
      {
        data: categoryValues.length > 0 ? categoryValues : [3, 2, 1],
        backgroundColor: ['#2563EB', '#4F46E5', '#0D9488', '#F59E0B', '#16A34A', '#94A3B8'],
        borderWidth: 0,
      },
    ],
  };

  // Chart Data: Monthly Activity Mock/Live
  const activityChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Books Borrowed',
        data: [12, 19, 15, 22, 30, 25, 28, stats.activeBorrows + 15],
        backgroundColor: '#2563EB',
        borderRadius: 6,
      },
      {
        label: 'Books Returned',
        data: [10, 15, 12, 20, 26, 22, 24, 18],
        backgroundColor: '#0D9488',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">{greeting}, Librarian</h1>
            <p className="page-subtitle">Here's what's happening in your library today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" icon={Plus} onClick={() => navigate('/members')}>
              Add Member
            </Button>
            <Button variant="primary" icon={BookUp} onClick={() => navigate('/borrow')}>
              Issue Book
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {loading ? (
          <>
            <Skeleton height="100px" />
            <Skeleton height="100px" />
            <Skeleton height="100px" />
            <Skeleton height="100px" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Books"
              value={stats.totalBooks}
              icon={BookOpen}
              color="blue"
              trend={{ label: '+12 this month', type: 'up' }}
            />
            <StatCard
              title="Available Copies"
              value={stats.availableCopies}
              icon={CheckCircle}
              color="green"
              trend={{ label: 'Ready to issue', type: 'neutral' }}
            />
            <StatCard
              title="Registered Members"
              value={stats.totalMembers}
              icon={Users}
              color="teal"
              trend={{ label: '+24 this month', type: 'up' }}
            />
            <StatCard
              title="Active Borrowings"
              value={stats.activeBorrows}
              icon={Clock}
              color="amber"
              trend={{ label: 'In circulation', type: 'neutral' }}
            />
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Borrowing Activity</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Monthly Trend</span>
          </div>
          <div style={{ height: 260 }}>
            <Bar
              data={activityChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { color: '#F1F5F9' }, ticks: { precision: 0 } },
                },
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Books by Category</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Distribution</span>
          </div>
          <div style={{ height: 260, display: 'flex', justifyContent: 'center' }}>
            <Doughnut
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Active Borrowings Preview Table */}
      <div className="card mt-8">
        <div className="data-table-toolbar">
          <div className="font-semibold text-md flex items-center gap-2">
            <Clock size={18} style={{ color: 'var(--color-royal-blue)' }} />
            Active Borrowings Overview
          </div>
          <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/active-borrowings')}>
            View All ({stats.activeBorrows})
          </Button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Member</th>
                <th>Book Title</th>
                <th>Issue Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                    Loading active borrows...
                  </td>
                </tr>
              ) : recentBorrows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px' }}>
                    No active borrow records found.
                  </td>
                </tr>
              ) : (
                recentBorrows.map((b) => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td className="font-semibold">{b.memberName || `Member #${b.memberId}`}</td>
                    <td>{b.bookTitle || `Book #${b.bookId}`}</td>
                    <td>{b.issueDate}</td>
                    <td>
                      <Badge variant="blue">Borrowed</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
