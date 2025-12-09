<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle ?? 'LockR - Locker Management System'; ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<?php if (isset($_SESSION['user_id'])): ?>
<header class="header">
    <div class="header-content">
        <h1>LockR - Locker Management</h1>
        <div class="user-info">
            <span class="user-name">
                <?php echo htmlspecialchars($_SESSION['first_name'] . ' ' . $_SESSION['last_name']); ?>
                (<?php echo ucfirst($_SESSION['role']); ?>)
            </span>
            <a href="/auth/logout.php" class="btn btn-logout">Logout</a>
        </div>
    </div>
</header>
<?php endif; ?>
