/**
 * LockR Digital Platform - Main JavaScript
 * Handles AJAX requests, modals, and interactive features
 */

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}

// Tab switching
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const selectedButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Load reservations for admin dashboard
function loadReservations(status, tabId) {
    fetch(`/api/get_reservations.php?status=${status}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayReservations(data.reservations, tabId, status);
            } else {
                console.error('Error loading reservations:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Display reservations in table
function displayReservations(reservations, tabId, status) {
    const container = document.getElementById(tabId);
    if (!container) return;
    
    if (reservations.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No reservations found.</p></div>';
        return;
    }
    
    let html = `
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Locker ID</th>
                        <th>Referral No.</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Floor</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    reservations.forEach(reservation => {
        const studentName = `${reservation.first_name} ${reservation.last_name}`;
        const date = new Date(reservation.created_at).toLocaleDateString();
        
        let actionButtons = '';
        if (status === 'pending') {
            actionButtons = `
                <button class="btn btn-sm btn-success" onclick="updateReservationStatus(${reservation.reservation_id}, 'approve')">Approve</button>
                <button class="btn btn-sm btn-danger" onclick="updateReservationStatus(${reservation.reservation_id}, 'reject')">Reject</button>
            `;
        } else if (status === 'approved') {
            actionButtons = `
                <button class="btn btn-sm btn-primary" onclick="updateReservationStatus(${reservation.reservation_id}, 'activate')">Activate</button>
                <button class="btn btn-sm btn-danger" onclick="updateReservationStatus(${reservation.reservation_id}, 'reject')">Reject</button>
            `;
        }
        
        html += `
            <tr>
                <td>${reservation.locker_number}</td>
                <td>${reservation.referral_number || 'N/A'}</td>
                <td>${reservation.student_id}</td>
                <td>${studentName}</td>
                <td>${reservation.floor_number}</td>
                <td>${date}</td>
                <td>
                    <div class="action-buttons">
                        ${reservation.referral_slip_path ? 
                            `<button class="btn btn-sm btn-secondary" onclick="viewReceipt('${reservation.referral_slip_path}')">View Receipt</button>` 
                            : ''}
                        ${actionButtons}
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// Update reservation status
function updateReservationStatus(reservationId, action) {
    const confirmMessage = action === 'activate' ? 
        'Are you sure you want to activate this reservation?' :
        action === 'approve' ?
        'Are you sure you want to approve this reservation?' :
        'Are you sure you want to reject this reservation?';
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    const formData = new FormData();
    formData.append('reservation_id', reservationId);
    formData.append('action', action);
    
    fetch('/api/update_reservation_status.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Reload reservations
            loadReservations('pending', 'pending-tab');
            loadReservations('approved', 'approved-tab');
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

// View receipt image
function viewReceipt(imagePath) {
    const modal = document.getElementById('receiptModal');
    const img = document.getElementById('receiptImage');
    if (modal && img) {
        img.src = '/' + imagePath;
        showModal('receiptModal');
    }
}

// File upload preview
function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileNameDisplay = document.getElementById('fileName');
    
    if (file) {
        if (fileNameDisplay) {
            fileNameDisplay.textContent = file.name;
        }
        
        // Preview image if it's an image file
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('imagePreview');
                if (preview) {
                    preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 300px; border-radius: 8px; margin-top: 10px;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    }
}

// Submit locker reservation
function submitReservation(lockerId) {
    const form = document.getElementById('reservationForm');
    if (!form) return;
    
    const formData = new FormData(form);
    formData.append('locker_id', lockerId);
    
    fetch('/api/reserve_locker.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            hideModal('uploadModal');
            showModal('successModal');
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

// Locker management functions
function openAddLockerModal() {
    document.getElementById('lockerForm').reset();
    document.getElementById('lockerModalTitle').textContent = 'Add New Locker';
    document.getElementById('lockerFormAction').value = 'add';
    document.getElementById('lockerId').value = '';
    showModal('lockerModal');
}

function openEditLockerModal(locker) {
    document.getElementById('lockerModalTitle').textContent = 'Edit Locker';
    document.getElementById('lockerFormAction').value = 'update';
    document.getElementById('lockerId').value = locker.locker_id;
    document.getElementById('lockerNumber').value = locker.locker_number;
    document.getElementById('floorNumber').value = locker.floor_number;
    document.getElementById('gridX').value = locker.grid_position_x;
    document.getElementById('gridY').value = locker.grid_position_y;
    document.getElementById('lockerStatus').value = locker.status;
    showModal('lockerModal');
}

function submitLockerForm() {
    const form = document.getElementById('lockerForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const action = formData.get('action');
    
    fetch('/api/manage_lockers.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            hideModal('lockerModal');
            location.reload();
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

function deleteLocker(lockerId) {
    if (!confirm('Are you sure you want to delete this locker?')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('locker_id', lockerId);
    
    fetch('/api/manage_lockers.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load reservations on admin dashboard
    if (document.getElementById('pending-tab')) {
        loadReservations('pending', 'pending-tab');
    }
    if (document.getElementById('approved-tab')) {
        loadReservations('approved', 'approved-tab');
    }
});
