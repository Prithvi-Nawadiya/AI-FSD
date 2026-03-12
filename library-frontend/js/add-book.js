document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Gather form data
        const formData = {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            isbn: document.getElementById('isbn').value.trim(),
            genre: document.getElementById('genre').value.trim(),
            publisher: document.getElementById('publisher').value.trim(),
            publicationYear: document.getElementById('publicationYear').value ? parseInt(document.getElementById('publicationYear').value, 10) : undefined,
            totalCopies: parseInt(document.getElementById('totalCopies').value, 10),
            shelfLocation: document.getElementById('shelfLocation').value.trim(),
            bookType: document.getElementById('bookType').value,
            status: document.getElementById('status').value
        };

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            // UI Loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;

            await libraryAPI.addBook(formData);

            // Success
            showToast('Book added successfully!');
            registerForm.reset();

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Registration Error:', error);
            showToast(error.message, 'error');
        } finally {
            // Restore UI state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});
