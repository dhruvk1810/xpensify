const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

// Auth
export async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function getMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

// Transactions
export async function getTransactions() {
  const res = await fetch(`${API_BASE}/transactions`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function createTransaction(transaction) {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(transaction),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create transaction');
  return data;
}

export async function updateTransaction(id, updates) {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update transaction');
  return data;
}

export async function deleteTransaction(id) {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete transaction');
  return data;
}

export async function deleteTransactions(ids) {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'DELETE',
    headers: getHeaders(),
    body: JSON.stringify({ ids }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete transactions');
  return data;
}

// Budgets
export async function getBudget(month, year) {
  const query = new URLSearchParams();
  if (month) query.append('month', month);
  if (year) query.append('year', year);
  const res = await fetch(`${API_BASE}/budgets?${query}`, {
    headers: getHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch budget');
  return res.json();
}

export async function saveBudget(budget) {
  const res = await fetch(`${API_BASE}/budgets`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(budget),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save budget');
  return data;
}

