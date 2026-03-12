const API_BASE_URL = 'https://library-backend.onrender.com/books'; // or your local 'http://localhost:5000/books'

// Helper to handle API responses
async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'API Request Failed');
    }
    return data;
}

// API Service Object
const libraryAPI = {
    // Get all books
    getAllBooks: async () => {
        const response = await fetch(API_BASE_URL);
        return handleResponse(response);
    },

    // Search books
    searchBooks: async (title) => {
        const queryParams = new URLSearchParams();
        if (title) queryParams.append('title', title);

        const response = await fetch(`${API_BASE_URL}/search?${queryParams}`);
        return handleResponse(response);
    },

    // Add a book
    addBook: async (bookData) => {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });
        return handleResponse(response);
    },

    // Delete a book
    deleteBook: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        return handleResponse(response);
    }
};

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.className = `toast show ${type}`;
    toast.innerHTML = `
        <i class="fa-solid fa-${type === 'success' ? 'circle-check' : 'circle-exclamation'}" style="color: var(--${type}); font-size: 1.25rem;"></i>
        <span>${message}</span>
    `;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
