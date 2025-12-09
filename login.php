<?php
/**
 * Login Page
 * Student and Admin login interface
 */

session_start();

// If already logged in, redirect
if (isset($_SESSION['user_id'])) {
    if ($_SESSION['role'] === 'admin') {
        header('Location: /admin_dashboard.php');
    } else {
        header('Location: /student_home.php');
    }
    exit();
}

// Get error message if exists
$error = $_SESSION['login_error'] ?? '';
unset($_SESSION['login_error']);

$pageTitle = 'Login - LockR';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h1>LockR</h1>
                <p>School Locker Management System</p>
            </div>
            
            <?php if ($error): ?>
                <div class="error-message">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>
            
            <form action="/auth/login_handler.php" method="POST">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="form-control" required>
                </div>
                
                <button type="submit" class="btn btn-primary full-width">Login</button>
            </form>
            
            <div class="google-login">
                <button type="button" class="btn btn-google" disabled>
                    Log in with Google (Coming Soon)
                </button>
            </div>
            
            <p class="text-center mt-20" style="font-size: 12px; color: #666;">
                Test credentials: student1@iacademy.edu.ph / password123
            </p>
        </div>
    </div>
    
    <script src="/assets/js/main.js"></script>
</body>
</html>
