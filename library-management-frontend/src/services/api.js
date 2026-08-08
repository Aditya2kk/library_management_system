const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (_) {
      // Ignore json parsing error if response body is empty or not JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// --- Books API ---
export async function getBooks(page = 0, size = 10, sort = 'title,asc') {
  const res = await fetch(`${API_BASE_URL}/api/books?page=${page}&size=${size}&sort=${sort}`);
  return handleResponse(res);
}

export async function getBookById(id) {
  const res = await fetch(`${API_BASE_URL}/api/books/${id}`);
  return handleResponse(res);
}

export async function searchBooksByAuthor(author) {
  const res = await fetch(`${API_BASE_URL}/api/books/search?author=${encodeURIComponent(author)}`);
  return handleResponse(res);
}

export async function createBook(bookData) {
  const res = await fetch(`${API_BASE_URL}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return handleResponse(res);
}

export async function updateBook(id, bookData) {
  const res = await fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return handleResponse(res);
}

export async function deleteBook(id) {
  const res = await fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

// --- Members API ---
export async function getMembers() {
  const res = await fetch(`${API_BASE_URL}/api/members`);
  return handleResponse(res);
}

export async function createMember(memberData) {
  const res = await fetch(`${API_BASE_URL}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData)
  });
  return handleResponse(res);
}

export async function updateMember(id, memberData) {
  const res = await fetch(`${API_BASE_URL}/api/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData)
  });
  return handleResponse(res);
}

export async function deleteMember(id) {
  const res = await fetch(`${API_BASE_URL}/api/members/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

// --- Borrowing API ---
export async function borrowBook(memberId, bookId) {
  const res = await fetch(`${API_BASE_URL}/api/borrow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId: Number(memberId), bookId: Number(bookId) })
  });
  return handleResponse(res);
}

export async function returnBook(borrowRecordId) {
  const res = await fetch(`${API_BASE_URL}/api/borrow/return/${borrowRecordId}`, {
    method: 'PUT'
  });
  return handleResponse(res);
}

export async function getActiveBorrowings() {
  const res = await fetch(`${API_BASE_URL}/api/borrow/active`);
  return handleResponse(res);
}

export async function getBorrowHistory(memberId) {
  const res = await fetch(`${API_BASE_URL}/api/borrow/history/${memberId}`);
  return handleResponse(res);
}
