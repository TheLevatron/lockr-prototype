<?php
/**
 * Admin Locker Management
 * Add, edit, and delete lockers
 */

require_once 'auth/session_check.php';
require_once 'config/db_connect.php';

// Ensure user is an admin
if ($_SESSION['role'] !== 'admin') {
    header('Location: /student_home.php');
    exit();
}

// Get selected floor or default to 6
$selectedFloor = filter_input(INPUT_GET, 'floor', FILTER_VALIDATE_INT);
if (!$selectedFloor || !in_array($selectedFloor, [6, 7, 9, 10])) {
    $selectedFloor = 6;
}

// Fetch lockers for selected floor
try {
    $stmt = $pdo->prepare("SELECT * FROM lockers WHERE floor_number = ? ORDER BY locker_number");
    $stmt->execute([$selectedFloor]);
    $lockers = $stmt->fetchAll();
} catch (PDOException $e) {
    error_log("Fetch lockers error: " . $e->getMessage());
    $lockers = [];
}

$pageTitle = 'Manage Lockers - LockR';
include 'includes/header.php';
?>

<div class="container">
    <h1 class="page-title">Locker Management</h1>
    
    <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
            <div class="form-group" style="margin: 0;">
                <label for="floorSelect">Select Floor:</label>
                <select id="floorSelect" class="form-control" style="width: 200px;" onchange="window.location.href='?floor=' + this.value">
                    <option value="6" <?php echo $selectedFloor == 6 ? 'selected' : ''; ?>>Floor 6</option>
                    <option value="7" <?php echo $selectedFloor == 7 ? 'selected' : ''; ?>>Floor 7</option>
                    <option value="9" <?php echo $selectedFloor == 9 ? 'selected' : ''; ?>>Floor 9</option>
                    <option value="10" <?php echo $selectedFloor == 10 ? 'selected' : ''; ?>>Floor 10</option>
                </select>
            </div>
            
            <button class="btn btn-primary" onclick="openAddLockerModal()">+ Add New Locker</button>
        </div>
    </div>
    
    <div class="locker-list">
        <?php if (empty($lockers)): ?>
            <div class="empty-state">
                <p>No lockers found on this floor.</p>
            </div>
        <?php else: ?>
            <?php foreach ($lockers as $locker): ?>
                <div class="locker-item" onclick='openEditLockerModal(<?php echo json_encode($locker); ?>)'>
                    <h4><?php echo htmlspecialchars($locker['locker_number']); ?></h4>
                    <p>Floor: <?php echo $locker['floor_number']; ?></p>
                    <p>Position: (<?php echo $locker['grid_position_x']; ?>, <?php echo $locker['grid_position_y']; ?>)</p>
                    <span class="status-badge <?php echo $locker['status']; ?>">
                        <?php echo ucfirst($locker['status']); ?>
                    </span>
                    <div style="margin-top: 10px;">
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteLocker(<?php echo $locker['locker_id']; ?>)">
                            Delete
                        </button>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    
    <div class="mt-20">
        <a href="/admin_dashboard.php" class="btn btn-secondary">Back to Dashboard</a>
    </div>
</div>

<!-- Add/Edit Locker Modal -->
<div id="lockerModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="hideModal('lockerModal')">&times;</span>
        <div class="modal-header">
            <h3 id="lockerModalTitle">Add New Locker</h3>
        </div>
        <div class="modal-body">
            <form id="lockerForm">
                <input type="hidden" id="lockerFormAction" name="action" value="add">
                <input type="hidden" id="lockerId" name="locker_id">
                
                <div class="form-group">
                    <label for="lockerNumber">Locker Number *</label>
                    <input type="text" id="lockerNumber" name="locker_number" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="floorNumber">Floor Number *</label>
                    <select id="floorNumber" name="floor_number" class="form-control" required>
                        <option value="6">Floor 6</option>
                        <option value="7">Floor 7</option>
                        <option value="9">Floor 9</option>
                        <option value="10">Floor 10</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="gridX">Grid Position X *</label>
                    <input type="number" id="gridX" name="grid_position_x" class="form-control" min="1" required>
                </div>
                
                <div class="form-group">
                    <label for="gridY">Grid Position Y *</label>
                    <input type="number" id="gridY" name="grid_position_y" class="form-control" min="1" required>
                </div>
                
                <div class="form-group">
                    <label for="lockerStatus">Status *</label>
                    <select id="lockerStatus" name="status" class="form-control" required>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="disabled">Disabled</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="hideModal('lockerModal')">Cancel</button>
            <button class="btn btn-primary" onclick="submitLockerForm()">Save</button>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
