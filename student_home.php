<?php
/**
 * Student Home Page
 * Floor selection interface
 */

require_once 'auth/session_check.php';

// Ensure user is a student
if ($_SESSION['role'] !== 'student') {
    header('Location: /admin_dashboard.php');
    exit();
}

$pageTitle = 'Select Floor - LockR';
include 'includes/header.php';
?>

<div class="container">
    <div class="floor-selection">
        <h1 class="page-title">Select a Floor</h1>
        
        <div class="floor-grid">
            <a href="/locker_grid.php?floor=6" class="floor-card">
                <h2>6</h2>
                <p>6th Floor</p>
            </a>
            
            <a href="/locker_grid.php?floor=7" class="floor-card">
                <h2>7</h2>
                <p>7th Floor</p>
            </a>
            
            <a href="/locker_grid.php?floor=9" class="floor-card">
                <h2>9</h2>
                <p>9th Floor</p>
            </a>
            
            <a href="/locker_grid.php?floor=10" class="floor-card">
                <h2>10</h2>
                <p>10th Floor</p>
            </a>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
