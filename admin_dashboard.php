<?php
/**
 * Admin Dashboard
 * Manage reservations - approval and activation
 */

require_once 'auth/session_check.php';

// Ensure user is an admin
if ($_SESSION['role'] !== 'admin') {
    header('Location: /student_home.php');
    exit();
}

$pageTitle = 'Admin Dashboard - LockR';
include 'includes/header.php';
?>

<div class="container">
    <h1 class="page-title">Reservation Management</h1>
    
    <div class="dashboard-tabs">
        <div class="tab-buttons">
            <button class="tab-button active" onclick="switchTab('pending-tab')">
                For Endorsement (Pending)
            </button>
            <button class="tab-button" onclick="switchTab('approved-tab')">
                For Approval (Activate)
            </button>
        </div>
        
        <div id="pending-tab" class="tab-content active">
            <div class="loading">Loading pending reservations...</div>
        </div>
        
        <div id="approved-tab" class="tab-content">
            <div class="loading">Loading approved reservations...</div>
        </div>
    </div>
    
    <div class="mt-20">
        <a href="/admin_manage_lockers.php" class="btn btn-primary">Manage Lockers</a>
    </div>
</div>

<!-- Receipt View Modal -->
<div id="receiptModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="hideModal('receiptModal')">&times;</span>
        <div class="modal-header">
            <h3>Payment Receipt / Referral Slip</h3>
        </div>
        <div class="modal-body">
            <img id="receiptImage" src="" alt="Receipt" style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
