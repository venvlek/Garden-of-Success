<?php
require_once __DIR__ . '/../db.php';
if(($_SESSION['role']??'')!=='staff_admin'){ header('Location: login.php'); exit; }
$csrf=csrf_token();
?><!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Staff Admin — Garden of Success</title><link rel="stylesheet" href="../public/assets/admin.css"></head><body>
<header class="topbar"><strong>Garden of Success — Staff Admin</strong><nav><a href="index.php">Dashboard</a><a href="logout.php">Logout</a></nav></header>
<main class="wrap">
<section class="card"><h2>Create Post</h2>
<form id="newPost"><input type="hidden" name="csrf" value="<?php echo htmlspecialchars($csrf); ?>">
<label>Title <input name="title" required></label>
<label>Excerpt <textarea name="excerpt" required></textarea></label>
<label>Content <textarea name="content" required></textarea></label>
<label>Tags (comma) <input name="tags"></label>
<label>Published <select name="published"><option value="1">Yes</option><option value="0">No (draft)</option></select></label>
<button type="submit">Publish</button></form></section>
<section class="card"><h2>Posts</h2><div id="posts"></div></section></main>
<script>
async function fetchJSON(url, opts={}){ const r=await fetch(url, Object.assign({headers:{'Content-Type':'application/json'}},opts)); if(!r.ok) throw new Error(await r.text()); return r.json(); }
document.getElementById('newPost').addEventListener('submit', async (e)=>{ e.preventDefault(); const f=e.target; const data={csrf:f.csrf.value,title:f.title.value,excerpt:f.excerpt.value,content:f.content.value,tags:f.tags.value,published:f.published.value}; await fetchJSON('../api/admin_posts.php',{method:'POST', body: JSON.stringify(data)}); alert('Saved!'); f.reset(); loadPosts(); });
async function loadPosts(){ const list=await fetchJSON('../api/posts.php'); const box=document.getElementById('posts'); box.innerHTML=''; list.forEach(p=>{ const d=document.createElement('div'); d.className='row'; d.innerHTML=`<b>${p.title}</b> <small>${p.created_at}</small> <button data-id="${p.id}" class="del">Delete</button>`; box.appendChild(d); }); box.querySelectorAll('.del').forEach(btn=>{ btn.addEventListener('click', async ()=>{ const id=btn.getAttribute('data-id'); if(!confirm('Delete post?')) return; const json={id:Number(id), csrf:'<?php echo htmlspecialchars($csrf); ?>'}; const body=new URLSearchParams({json: JSON.stringify(json)}); await fetch('../api/admin_posts.php',{method:'DELETE', body}); loadPosts(); }); }); }
loadPosts();
</script></body></html>
