<?php
/**
 * Locker Grid Page
 * Visual grid display of lockers for a selected floor
 */

require_once 'auth/session_check.php';
require_once 'config/db_connect.php';

// Ensure user is a student
if ($_SESSION['role'] !== 'student') {
    header('Location: /admin_dashboard.php');
    exit();
}

// Get and validate floor parameter
$floor = filter_input(INPUT_GET, 'floor', FILTER_VALIDATE_INT);
if (!$floor || !in_array($floor, [6, 7, 9, 10])) {
    header('Location: /student_home.php');
    exit();
}

// Fetch lockers for this floor
try {
    $stmt = $pdo->prepare("SELECT locker_id, locker_number, floor_number, grid_position_x, grid_position_y, status FROM lockers WHERE floor_number = ? ORDER BY grid_position_y, grid_position_x");
    $stmt->execute([$floor]);
    $lockers = $stmt->fetchAll();
    
    // Check if user has an active reservation
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE user_id = ? AND status IN ('pending', 'approved', 'active')");
    $stmt->execute([$_SESSION['user_id']]);
    $hasActiveReservation = $stmt->fetchColumn() > 0;
    
} catch (PDOException $e) {
    error_log("Locker grid error: " . $e->getMessage());
    $lockers = [];
    $hasActiveReservation = false;
}

// Organize lockers by grid position
$lockerGrid = [];
$maxX = 0;
$maxY = 0;

foreach ($lockers as $locker) {
    $x = $locker['grid_position_x'];
    $y = $locker['grid_position_y'];
    $lockerGrid[$y][$x] = $locker;
    
    if ($x > $maxX) $maxX = $x;
    if ($y > $maxY) $maxY = $y;
}

// Check for pending reservations to show as yellow
$reservedLockers = [];
try {
    $stmt = $pdo->prepare("
        SELECT locker_id 
        FROM reservations 
        WHERE status IN ('pending', 'approved') 
        AND locker_id IN (SELECT locker_id FROM lockers WHERE floor_number = ?)
    ");
    $stmt->execute([$floor]);
    while ($row = $stmt->fetch()) {
        $reservedLockers[] = $row['locker_id'];
    }
} catch (PDOException $e) {
    error_log("Reserved lockers error: " . $e->getMessage());
}

$pageTitle = "Floor $floor - Locker Grid - LockR";
include 'includes/header.php';
?>

<div class="container">
    <div class="locker-grid-container">
        <div class="floor-header">
            <h2>Floor <?php echo $floor; ?> - Locker Grid</h2>
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-color available"></div>
                    <span>Available</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color occupied"></div>
                    <span>Occupied/Disabled</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color reserved"></div>
                    <span>Reserved (Pending)</span>
                </div>
            </div>
        </div>
        
        <?php if ($hasActiveReservation): ?>
        <div class="error-message">
            You already have an active reservation. Please wait for it to be processed.
        </div>
        <?php endif; ?>
        
        <div style="overflow-x: auto;">
            <div class="locker-grid">
                <div class="grid-container" style="grid-template-columns: repeat(<?php echo $maxX; ?>, 80px);">
                    <?php for ($y = 1; $y <= $maxY; $y++): ?>
                        <?php for ($x = 1; $x <= $maxX; $x++): ?>
                            <?php if (isset($lockerGrid[$y][$x])): 
                                $locker = $lockerGrid[$y][$x];
                                
                                // Determine visual status
                                $visualStatus = $locker['status'];
                                if (in_array($locker['locker_id'], $reservedLockers)) {
                                    $visualStatus = 'reserved';
                                }
                                
                                $clickable = ($visualStatus === 'available' && !$hasActiveReservation);
                                $onclick = $clickable ? "onclick=\"showReservationModal({$locker['locker_id']}, '{$locker['locker_number']}')\"" : '';
                            ?>
                                <div class="locker-cell <?php echo $visualStatus; ?>" 
                                     <?php echo $onclick; ?> 
                                     style="<?php echo !$clickable ? 'cursor: not-allowed;' : ''; ?>">
                                    <?php echo htmlspecialchars($locker['locker_number']); ?>
                                </div>
                            <?php else: ?>
                                <div class="locker-cell" style="background-color: transparent; cursor: default;"></div>
                            <?php endif; ?>
                        <?php endfor; ?>
                    <?php endfor; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Reservation Confirmation Modal -->
<div id="reservationModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="hideModal('reservationModal')">&times;</span>
        <div class="modal-header">
            <h3>Reserve Locker</h3>
        </div>
        <div class="modal-body">
            <p>Do you want to reserve locker <strong id="selectedLockerNumber"></strong>?</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="hideModal('reservationModal')">Cancel</button>
            <button class="btn btn-primary" onclick="showRulesModal()">Confirm</button>
        </div>
    </div>
</div>

<!-- Rules and Regulations Modal -->
<div id="rulesModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="hideModal('rulesModal')">&times;</span>
        <div class="modal-header">
            <h3>Locker Rules and Regulations</h3>
        </div>
        <div class="modal-body">
            <div class="rules-content">
                <h4>General Rules:</h4>
                <ul>
                    <li>Lockers are assigned for the entire academic year</li>
                    <li>Students must present a valid payment receipt/referral slip</li>
                    <li>Locker keys must be returned at the end of the year</li>
                    <li>Lost keys will incur a replacement fee</li>
                    <li>Do not store valuable items in lockers</li>
                </ul>
                
                <h4>Prohibited Items:</h4>
                <ul>
                    <li>Flammable materials</li>
                    <li>Weapons or dangerous items</li>
                    <li>Perishable food items</li>
                    <li>Illegal substances</li>
                </ul>
                
                <h4>Maintenance:</h4>
                <ul>
                    <li>Keep your locker clean and organized</li>
                    <li>Report any damage immediately</li>
                    <li>School reserves the right to inspect lockers</li>
                </ul>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="agreeRules" required>
                <label for="agreeRules">I have read and agree to the rules and regulations</label>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="hideModal('rulesModal')">Cancel</button>
            <button class="btn btn-primary" onclick="proceedToUpload()">Continue</button>
        </div>
    </div>
</div>

<!-- Upload Receipt Modal -->
<div id="uploadModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="hideModal('uploadModal')">&times;</span>
        <div class="modal-header">
            <h3>Upload Payment Receipt</h3>
        </div>
        <div class="modal-body">
            <form id="reservationForm" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="referralNumber">Referral Number *</label>
                    <input type="text" id="referralNumber" name="referral_number" class="form-control" required>
                </div>
                
                <div class="file-upload-area">
                    <input type="file" id="referralSlip" name="referral_slip" accept="image/*" onchange="handleFileSelect(event)" required>
                    <label for="referralSlip" class="file-upload-label">
                        📁 Click to upload payment receipt/referral slip
                    </label>
                    <div id="fileName" class="file-name"></div>
                    <div id="imagePreview"></div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="hideModal('uploadModal')">Cancel</button>
            <button class="btn btn-primary" onclick="submitReservation(selectedLockerId)">Submit Reservation</button>
        </div>
    </div>
</div>

<!-- Success Modal -->
<div id="successModal" class="modal">
    <div class="modal-content">
        <div class="modal-body">
            <div class="success-container">
                <div class="success-icon">✓</div>
                <h2>Reservation Submitted!</h2>
                <p>Your reservation has been submitted successfully and is pending approval from the administrator.</p>
                <button class="btn btn-primary" onclick="window.location.href='/student_home.php'">Return to Home</button>
            </div>
        </div>
    </div>
</div>

<script>
let selectedLockerId = null;

function showReservationModal(lockerId, lockerNumber) {
    selectedLockerId = lockerId;
    document.getElementById('selectedLockerNumber').textContent = lockerNumber;
    showModal('reservationModal');
}

function showRulesModal() {
    hideModal('reservationModal');
    showModal('rulesModal');
}

function proceedToUpload() {
    const agreeCheckbox = document.getElementById('agreeRules');
    if (!agreeCheckbox.checked) {
        alert('Please agree to the rules and regulations to continue.');
        return;
    }
    hideModal('rulesModal');
    showModal('uploadModal');
}
</script>

<?php include 'includes/footer.php'; ?>
