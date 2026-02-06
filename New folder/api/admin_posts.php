<?php
require_once __DIR__ . '/../db.php'; header('Content-Type: application/json');
if(($_SESSION['role']??'')!=='staff_admin'){ http_response_code(403); echo json_encode(['error'=>'Forbidden']); exit; }
$pdo=db();
$pdo->exec("CREATE TABLE IF NOT EXISTS posts (id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255) NOT NULL,excerpt TEXT NOT NULL,content MEDIUMTEXT NOT NULL,tags VARCHAR(255) DEFAULT '',published TINYINT(1) DEFAULT 1,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
$m=$_SERVER['REQUEST_METHOD'];
if($m==='POST'){ $in=json_decode(file_get_contents('php://input'),true); if(!csrf_check($in['csrf']??'')){ http_response_code(400); echo json_encode(['error'=>'Bad CSRF']); exit; } $st=$pdo->prepare("INSERT INTO posts(title,excerpt,content,tags,published) VALUES(?,?,?,?,?)"); $st->execute([$in['title']??'', $in['excerpt']??'', $in['content']??'', $in['tags']??'', intval($in['published']??1)]); echo json_encode(['ok'=>true,'id'=>$pdo->lastInsertId()]); exit; }
if($m==='PUT'){ parse_str(file_get_contents('php://input'), $raw); $in=json_decode($raw['json']??'{}', true); if(!csrf_check($in['csrf']??'')){ http_response_code(400); echo json_encode(['error'=>'Bad CSRF']); exit; } $st=$pdo->prepare("UPDATE posts SET title=?,excerpt=?,content=?,tags=?,published=? WHERE id=?"); $st->execute([$in['title']??'', $in['excerpt']??'', $in['content']??'', $in['tags']??'', intval($in['published']??1), intval($in['id']??0)]); echo json_encode(['ok'=>true]); exit; }
if($m==='DELETE'){ parse_str(file_get_contents('php://input'), $raw); $in=json_decode($raw['json']??'{}', true); if(!csrf_check($in['csrf']??'')){ http_response_code(400); echo json_encode(['error'=>'Bad CSRF']); exit; } $st=$pdo->prepare("DELETE FROM posts WHERE id=?"); $st->execute([intval($in['id']??0)]); echo json_encode(['ok'=>true]); exit; }
http_response_code(405); echo json_encode(['error'=>'Method not allowed']);
?>