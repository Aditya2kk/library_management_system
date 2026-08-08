import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';

import { Dashboard } from './pages/Dashboard';
import { Books } from './pages/Books';
import { BookDetails } from './pages/BookDetails';
import { Members } from './pages/Members';
import { BorrowBook } from './pages/BorrowBook';
import { ActiveBorrowings } from './pages/ActiveBorrowings';
import { BorrowHistory } from './pages/BorrowHistory';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/members" element={<Members />} />
            <Route path="/borrow" element={<BorrowBook />} />
            <Route path="/active-borrowings" element={<ActiveBorrowings />} />
            <Route path="/borrow-history" element={<BorrowHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
