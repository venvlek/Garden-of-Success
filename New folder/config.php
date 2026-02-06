<?php
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'gos_db');
define('DB_USER', getenv('DB_USER') ?: 'gos_user');
define('DB_PASS', getenv('DB_PASS') ?: 'CHANGE_ME_DB_PASSWORD');
define('SEED_ADMIN_EMAIL', getenv('SEED_ADMIN_EMAIL') ?: 'admin@gardenofsuccess.edu.ng');
define('SEED_ADMIN_PASSWORD', getenv('SEED_ADMIN_PASSWORD') ?: 'ChangeMe#123');
define('ALLOW_ORIGIN', '*');
session_name('gos_session'); session_start();
?>