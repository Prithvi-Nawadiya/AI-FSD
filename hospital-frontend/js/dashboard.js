document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tableBody = document.getElementById('patientsTableBody');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    // Modal Elements
    const modal = document.getElementById('updateModal');
    const closeBtns = document.querySelectorAll('.close-btn, .close-btn-action');
    const updateForm = document.getElementById('updateForm');

    // Load initial data
    loadPatients();

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

    async function loadPatients(searchQuery = '') {
        try {
            renderLoading();
            let url = API_BASE_URL;

            if (searchQuery) {
                url = `${API_BASE_URL}/search?name=${encodeURIComponent(searchQuery)}&disease=${encodeURIComponent(searchQuery)}`;
            }

            const response = await fetch(url);
            const data = await handleResponse(response);

            renderTable(data.data);
        } catch (error) {
            showToast(error.message, 'error');
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: var(--danger)">Failed to load data: ${error.message}</td></tr>`;
        }
    }

    function renderLoading() {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center loading-text"><i class="fa-solid fa-spinner fa-spin"></i> Loading patients...</td></tr>';
    }

    function renderTable(patients) {
        tableBody.innerHTML = '';

        if (!patients || patients.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 2rem;">No patients found matching criteria.</td></tr>';
            return;
        }

        patients.forEach(patient => {
            const tr = document.createElement('tr');

            const statusClass = patient.status === 'Discharged' ? 'status-discharged' : 'status-admitted';

            tr.innerHTML = `
                <td><strong>${patient.patientId}</strong></td>
                <td>
                    <div style="font-weight: 600; color: var(--text-dark);">${patient.fullName}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${patient.email}</div>
                </td>
                <td>${patient.disease}</td>
                <td>${patient.doctorAssigned}</td>
                <td><span class="status-badge ${statusClass}">${patient.status}</span></td>
                <td>${formatDate(patient.admissionDate)}</td>
                <td>
                    <div class="action-btns">
                        <button class="edit" onclick="openUpdateModal('${patient._id}')" title="Edit Patient"><i class="fa-solid fa-pen"></i></button>
                        <button class="delete" onclick="deletePatient('${patient._id}')" title="Delete Patient"><i class="fa-solid fa-trash"></i></button>
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
        loadPatients(query);
    }

    function clearSearch() {
        searchInput.value = '';
        loadPatients();
    }

    // --- Delete Handler ---

    window.deletePatient = async function (id) {
        if (!confirm('Are you sure you want to delete this patient record? This cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            await handleResponse(response);

            showToast('Patient record deleted successfully');
            loadPatients(searchInput.value.trim()); // reload current view
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    // --- Update Handlers ---

    window.openUpdateModal = async function (id) {
        try {
            // Fetch patient details by id
            const response = await fetch(`${API_BASE_URL}/${id}`);
            const result = await handleResponse(response);
            const patient = result.data;

            // Populate form
            document.getElementById('updatePatientId').value = patient._id;
            document.getElementById('updateName').value = patient.fullName;
            document.getElementById('updatePhone').value = patient.phoneNumber;
            document.getElementById('updateDisease').value = patient.disease;
            document.getElementById('updateDoctor').value = patient.doctorAssigned;
            document.getElementById('updateStatus').value = patient.status;

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

        const id = document.getElementById('updatePatientId').value;
        const updatedData = {
            fullName: document.getElementById('updateName').value.trim(),
            phoneNumber: document.getElementById('updatePhone').value.trim(),
            disease: document.getElementById('updateDisease').value.trim(),
            doctorAssigned: document.getElementById('updateDoctor').value.trim(),
            status: document.getElementById('updateStatus').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            await handleResponse(response);
            showToast('Patient details updated successfully!');
            closeModal();
            loadPatients(searchInput.value.trim());
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
});
