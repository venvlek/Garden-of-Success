<?php
require_once __DIR__ . '/../db.php'; header('Content-Type: application/json'); $pdo=db();
$pdo->exec("CREATE TABLE IF NOT EXISTS admissions (id INT AUTO_INCREMENT PRIMARY KEY,full_name VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL,phone VARCHAR(50) DEFAULT '',message TEXT NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
$full=trim($_POST['full_name']??''); $email=trim($_POST['email']??''); $phone=trim($_POST['phone']??''); $msg=trim($_POST['message']??'');
if(!$full||!$email||!$msg){ http_response_code(400); echo json_encode(['error'=>'Missing fields']); exit; }
$st=$pdo->prepare("INSERT INTO admissions(full_name,email,phone,message) VALUES(?,?,?,?)"); $st->execute([$full,$email,$phone,$msg]);
echo json_encode(['ok'=>true]);
?>