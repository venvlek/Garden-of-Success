<?php
require_once __DIR__ . '/../db.php'; header('Content-Type: application/json');
if(!empty($_SESSION['uid'])) echo json_encode(['authenticated'=>true,'role'=>$_SESSION['role'],'csrf'=>csrf_token()]);
else echo json_encode(['authenticated'=>false]);
?>