<?php
require_once __DIR__ . '/../db.php';
if(!empty($_SESSION['role']) && $_SESSION['role']==='staff_admin'){ header('Location: index.php'); exit; }
$err='';
if(!empty($_POST['email']) && !empty($_POST['password'])){
  $pdo=db(); $st=$pdo->prepare("SELECT * FROM users WHERE email=? LIMIT 1"); $st->execute([$_POST['email']]); $u=$st->fetch();
  if($u && password_verify($_POST['password'],$u['password_hash'])){ $_SESSION['uid']=$u['id']; $_SESSION['role']=$u['role']; header('Location: index.php'); exit; } else { $err='Invalid credentials'; }
}
?><!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Staff Admin Login</title><link rel="stylesheet" href="../public/assets/admin.css"></head><body>
<main class="wrap small"><h1>Staff Admin</h1><?php if($err){ echo '<p style="color:#b91c1c">'.htmlspecialchars($err).'</p>'; } ?>
<form method="post"><label>Email <input type="email" name="email" required></label><label>Password <input type="password" name="password" required></label><button type="submit">Sign in</button></form>
<p style="margin-top:.5rem; font-size:12px;color:#6b7280">Seed admin: <?php echo SEED_ADMIN_EMAIL; ?></p></main></body></html>
