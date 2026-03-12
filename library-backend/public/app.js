const apiBase = '/books';

const booksList = document.getElementById('booksList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const refreshBtn = document.getElementById('refreshBtn');
const addBookForm = document.getElementById('addBookForm');

async function fetchBooks() {
  booksList.innerHTML = 'Loading...';
  try {
    const res = await fetch(apiBase);
    const body = await res.json();
    if (!body.success) throw new Error(body.error || 'Failed');
    renderBooks(body.data);
  } catch (err) {
    booksList.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

function renderBooks(items) {
  if (!items.length) {
    booksList.innerHTML = '<div>No books found.</div>';
    return;
  }

  booksList.innerHTML = items.map(book => `
    <div class="book" data-id="${book._id}">
      <div class="title">${escapeHtml(book.title)}</div>
      <div class="meta">Author: ${escapeHtml(book.author)} | ISBN: ${escapeHtml(book.isbn)} | Genre: ${escapeHtml(book.genre)}</div>
      <div class="actions">
        <button class="delete">Delete</button>
      </div>
    </div>
  `).join('');

  // attach delete handlers
  document.querySelectorAll('.book .delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.closest('.book').dataset.id;
      if (!confirm('Delete this book?')) return;
      try {
        const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
        const body = await res.json();
        if (!body.success) throw new Error(body.error || 'Delete failed');
        fetchBooks();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    });
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

searchBtn.addEventListener('click', async () => {
  const q = searchInput.value.trim();
  if (!q) return fetchBooks();
  booksList.innerHTML = 'Searching...';
  try {
    const res = await fetch(`${apiBase}/search?title=${encodeURIComponent(q)}`);
    const body = await res.json();
    if (!body.success) throw new Error(body.error || 'Search failed');
    renderBooks(body.data);
  } catch (err) {
    booksList.innerHTML = `<div class="error">${err.message}</div>`;
  }
});

refreshBtn.addEventListener('click', fetchBooks);

addBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(addBookForm);
  const payload = {};
  for (const [k, v] of form.entries()) {
    if (v === '') continue;
    payload[k] = (k === 'publicationYear' || k === 'totalCopies') ? Number(v) : v;
  }

  try {
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const body = await res.json();
    if (!body.success) throw new Error(body.error || 'Add failed');
    addBookForm.reset();
    fetchBooks();
  } catch (err) {
    alert('Add failed: ' + err.message);
  }
});

// initial load
fetchBooks();
