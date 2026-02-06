<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');
$in=json_decode(file_get_contents('php://input'),true);
$email=$in['email']??''; $pass=$in['password']??'';
if(!$email||!$pass){ http_response_code(400); echo json_encode(['error'=>'Email and password required']); exit; }
$pdo=db(); $st=$pdo->prepare("SELECT * FROM users WHERE email=? LIMIT 1"); $st->execute([$email]); $u=$st->fetch();
if($u && password_verify($pass,$u['password_hash'])){ $_SESSION['uid']=$u['id']; $_SESSION['role']=$u['role']; echo json_encode(['ok'=>true,'role'=>$u['role'],'csrf'=>csrf_token(),'email'=>$u['email']]); }
else{ http_response_code(401); echo json_encode(['error'=>'Invalid credentials']); }
?>