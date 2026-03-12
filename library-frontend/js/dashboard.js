document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tableBody = document.getElementById('booksTableBody');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    // Modal Elements
    const modal = document.getElementById('updateModal');
    const closeBtns = document.querySelectorAll('.close-btn, .close-btn-action');
    const updateForm = document.getElementById('updateForm');

    // Load initial data
    loadBooks();

    // Event Listeners
    searchForm.addEventListener('submit', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    updateForm.addEventListener('submit', handleUpdateSubmit);

    // Close modal handlers
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- Core Functions ---

    async function loadBooks(searchQuery = '') {
        try {
            renderLoading();
            let data;

            if (searchQuery) {
                data = await libraryAPI.searchBooks(searchQuery);
            } else {
                data = await libraryAPI.getAllBooks();
            }

            renderTable(data.data);
        } catch (error) {
            showToast(error.message, 'error');
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: var(--danger)">Failed to load data: ${error.message}</td></tr>`;
        }
    }

    function renderLoading() {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center loading-text"><i class="fa-solid fa-spinner fa-spin"></i> Loading books...</td></tr>';
    }

    function renderTable(books) {
        tableBody.innerHTML = '';

        if (!books || books.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 2rem;">No books found matching criteria.</td></tr>';
            return;
        }

        books.forEach(book => {
            const tr = document.createElement('tr');

            const statusClass = book.status === 'Available' ? 'status-admitted' : 'status-discharged';
            const shortId = book._id.substring(book._id.length - 6); // Just for display

            tr.innerHTML = `
                <td><strong>...${shortId}</strong></td>
                <td>
                    <div style="font-weight: 600; color: var(--text-dark);">${book.title}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">ISBN: ${book.isbn}</div>
                </td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td><span class="status-badge ${statusClass}">${book.status}</span></td>
                <td>${book.availableCopies} / ${book.totalCopies}</td>
                <td>
                    <div class="action-btns">
                        <button class="edit" onclick="openUpdateModal('${book._id}', '${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}', '${book.genre.replace(/'/g, "\\'")}', ${book.availableCopies}, '${book.status}')" title="Edit Book"><i class="fa-solid fa-pen"></i></button>
                        <button class="delete" onclick="deleteBook('${book._id}')" title="Delete Book"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // --- Search Handlers ---

    function handleSearch(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        loadBooks(query);
    }

    function clearSearch() {
        searchInput.value = '';
        loadBooks();
    }

    // --- Delete Handler ---

    window.deleteBook = async function (id) {
        if (!confirm('Are you sure you want to delete this book record? This cannot be undone.')) {
            return;
        }

        try {
            await libraryAPI.deleteBook(id);
            showToast('Book record deleted successfully');
            loadBooks(searchInput.value.trim()); // reload current view
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    // --- Update Handlers ---

    window.openUpdateModal = function (id, title, author, genre, available, status) {
        try {
            // Populate form
            document.getElementById('updateBookId').value = id;
            document.getElementById('updateTitle').value = title;
            document.getElementById('updateAuthor').value = author;
            document.getElementById('updateGenre').value = genre;
            document.getElementById('updateAvailable').value = available;
            document.getElementById('updateStatus').value = status;

            // Show modal
            modal.classList.add('active');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    function closeModal() {
        modal.classList.remove('active');
        updateForm.reset();
    }

    async function handleUpdateSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('updateBookId').value;
        const updatedData = {
            title: document.getElementById('updateTitle').value.trim(),
            author: document.getElementById('updateAuthor').value.trim(),
            genre: document.getElementById('updateGenre').value.trim(),
            availableCopies: parseInt(document.getElementById('updateAvailable').value),
            status: document.getElementById('updateStatus').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            await handleResponse(response);
            showToast('Book details updated successfully!');
            closeModal();
            loadBooks(searchInput.value.trim());
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
});
