document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Gather form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            age: parseInt(document.getElementById('age').value, 10),
            gender: document.getElementById('gender').value,
            patientType: document.getElementById('patientType').value,
            disease: document.getElementById('disease').value.trim(),
            doctorAssigned: document.getElementById('doctorAssigned').value.trim(),
            roomNumber: document.getElementById('roomNumber').value.trim(),
            status: document.getElementById('status').value
        };

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            // UI Loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';
            submitBtn.disabled = true;

            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            await handleResponse(response);

            // Success
            showToast('Patient registered successfully!');
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
