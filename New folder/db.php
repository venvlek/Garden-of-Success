<?php
require_once __DIR__ . '/config.php';
function db(){
  static $pdo=null;
  if($pdo===null){
    $dsn='mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4';
    $pdo=new PDO($dsn, DB_USER, DB_PASS, [
      PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
    ]);
  }
  return $pdo;
}
function ensure_seed_admin(){
  $pdo=db();
  $pdo->exec("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,email VARCHAR(255) UNIQUE NOT NULL,password_hash VARCHAR(255) NOT NULL,role ENUM('staff_admin','visitor') NOT NULL DEFAULT 'visitor',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
  $count=(int)$pdo->query("SELECT COUNT(*) FROM users WHERE role='staff_admin'")->fetchColumn();
  if($count===0){
    $hash=password_hash(SEED_ADMIN_PASSWORD, PASSWORD_DEFAULT);
    $stmt=$pdo->prepare("INSERT INTO users(email,password_hash,role) VALUES(?,?,'staff_admin')");
    $stmt->execute([SEED_ADMIN_EMAIL,$hash]);
  }
}
function csrf_token(){ if(empty($_SESSION['csrf'])) $_SESSION['csrf']=bin2hex(random_bytes(32)); return $_SESSION['csrf']; }
function csrf_check($t){ return isset($_SESSION['csrf']) && hash_equals($_SESSION['csrf'],$t); }
ensure_seed_admin();
?>