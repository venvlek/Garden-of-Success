<?php
require_once __DIR__ . '/../db.php'; header('Content-Type: application/json'); $pdo=db();
$pdo->exec("CREATE TABLE IF NOT EXISTS posts (id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255) NOT NULL,excerpt TEXT NOT NULL,content MEDIUMTEXT NOT NULL,tags VARCHAR(255) DEFAULT '',published TINYINT(1) DEFAULT 1,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
if($_SERVER['REQUEST_METHOD']==='GET'){
  if(isset($_GET['id'])){ $st=$pdo->prepare("SELECT * FROM posts WHERE id=?"); $st->execute([intval($_GET['id'])]); $p=$st->fetch(); if($p) echo json_encode($p); else { http_response_code(404); echo json_encode(['error'=>'Not found']); } exit; }
  $st=$pdo->query("SELECT id,title,excerpt,tags,created_at FROM posts WHERE published=1 ORDER BY created_at DESC LIMIT 100"); echo json_encode($st->fetchAll()); exit;
}
http_response_code(405); echo json_encode(['error'=>'Method not allowed']);
?>