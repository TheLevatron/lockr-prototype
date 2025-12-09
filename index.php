<?php
/**
 * Index Page - Root entry point
 * Redirects to appropriate page based on session
 */

session_start();

// Check if user is logged in
if (isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
    // Redirect based on role
    if ($_SESSION['role'] === 'admin') {
        header('Location: /admin_dashboard.php');
    } else {
        header('Location: /student_home.php');
    }
    exit();
} else {
    // Not logged in, redirect to login
    header('Location: /login.php');
    exit();
}
