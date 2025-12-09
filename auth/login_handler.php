<?php
/**
 * Login Handler
 * Processes login form submissions
 */

session_start();
require_once '../config/db_connect.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        $error = 'Please enter both email and password.';
    } else {
        try {
            // Fetch user from database
            $stmt = $pdo->prepare("SELECT user_id, email, password_hash, first_name, last_name, role FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password_hash'])) {
                // Password is correct, create session
                session_regenerate_id(true);
                
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['first_name'] = $user['first_name'];
                $_SESSION['last_name'] = $user['last_name'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['last_regeneration'] = time();
                
                // Redirect based on role
                if ($user['role'] === 'admin') {
                    header('Location: /admin_dashboard.php');
                } else {
                    header('Location: /student_home.php');
                }
                exit();
            } else {
                $error = 'Invalid email or password.';
            }
        } catch (PDOException $e) {
            error_log("Login error: " . $e->getMessage());
            $error = 'An error occurred. Please try again.';
        }
    }
    
    // Redirect back to login with error
    $_SESSION['login_error'] = $error;
    header('Location: /login.php');
    exit();
}
