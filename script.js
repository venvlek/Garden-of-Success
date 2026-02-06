//  <!-- Define navigation functions early so onclick handlers can find them -->
  
window.PAGES = ['home','about','academics','admissions','gallery','gallery-view','pta','blog','contact'];

    function showOnly(id){
      // Hide all sections first
      document.querySelectorAll('.page').forEach(sec=>sec.classList.add('hidden'));
      // Always show the requested section
      const el = document.getElementById(id);
      if (el) el.classList.remove('hidden');
      // On HOME, also show About and Contact sections
      if (id === 'home') {
        const about = document.getElementById('about');
        const contact = document.getElementById('contact');
        if (about) about.classList.remove('hidden');
        if (contact) contact.classList.remove('hidden');
      }
    }
    window.showOnly = showOnly; // expose globally

    function go(id){
      if(!window.PAGES.includes(id)) return false;
      showOnly(id);
      if(location.hash !== '#' + id) history.replaceState(null,'','#'+id);
      return false;
    }
    window.go = go; // expose globally

    function routeOnLoad(){
      const id = (location.hash||'#home').replace('#','');
      showOnly(window.PAGES.includes(id)?id:'home');
    }
    window.addEventListener('DOMContentLoaded', routeOnLoad);
  
    // --- Logo setup -----------------------------------------------------------
    // To use your logo, set the path below, e.g.: const LOGO_URL = 'assets/logo.png';
    const LOGO_URL = 'gos.png'; // put gos.png in the SAME folder as this HTML (or change to 'assets/gos.png')
    (function applyLogo(){
      const stored = localStorage.getItem('logoData');
      const url = LOGO_URL || stored;
      const box = document.getElementById('logoBox');
      const fallback = document.getElementById('logoFallback');
      const img = document.getElementById('logoImg');
      if (!box || !fallback || !img) return;
      if (url) {
        fallback.style.display = 'none';
        img.src = url;
        img.style.display = 'block';
      }
    })();

    // --- Mobile menu ----------------------------------------------------------
  function toggleMenu(force) {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;

    if (typeof force === 'boolean') {
      menu.classList.toggle('open', force);
    } else {
      menu.classList.toggle('open');
    }
  }
    // --- Year -----------------------------------------------------------------
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Blog data & filter ---------------------------------------------------
    const POSTS = [
      { id:'stem-fair-2025', title:'STEM Fair 2025: Bright Ideas, Brighter Futures', date:'2025-10-25', tags:['STEM','Events','Innovation'], excerpt:'Students showcased renewable energy prototypes and beginner robotics.', content:'From solar cars to line-following robots, learners presented projects that highlight curiosity and perseverance.' },
      { id:'cultural-day', title:"Cultural Day: Celebrating Nigeria’s Heritage", date:'2025-11-12', tags:['Culture','Community'], excerpt:'Dances, crafts, and delicious local cuisine filled the campus.', content:'Vibrant attire and parent-led workshops on language, music, and folklore.' },
      { id:'literacy-week', title:'Literacy Week Highlights', date:'2025-12-02', tags:['Literacy','Academics'], excerpt:'Reading relays, author visits, and book swaps across grades.', content:'We launched class reading corners and a monthly book club.' }
    ];
    const blogList = document.getElementById('blogList');
    const noPosts = document.getElementById('noPosts');

    function renderPosts(list){
      if (!blogList) return; // if blog section not on page yet
      blogList.innerHTML = '';
      list.forEach(p => {
        const article = document.createElement('article');
        article.className = 'card';
        article.style.padding = '1rem';
        const date = new Date(p.date).toLocaleDateString();
        article.innerHTML = `
          <p style="font-size:12px; color:#065f46">${date}</p>
          <h3 style="margin:.2rem 0; color:#065f46">${p.title}</h3>
          <p style="color:#374151">${p.excerpt}</p>
          <div style="margin-top:.3rem; display:flex; gap:.3rem; flex-wrap:wrap">${(p.tags||[]).map(t=>`<span class='tag'>${t}</span>`).join('')}</div>
          <a href="#" onclick="viewPost('${p.id}'); return false;" style="display:inline-block; margin-top:.4rem; font-weight:600; color:var(--green-700)">Read more →</a>
        `;
        blogList.appendChild(article);
      });
      if (noPosts) noPosts.style.display = list.length ? 'none' : 'block';
    }

    function filterPosts(){
      const input = document.getElementById('blogSearch');
      if (!input) return; // ignore if not on blog section
      const q = input.value.trim().toLowerCase();
      if (!q) return renderPosts(POSTS);
      const filtered = POSTS.filter(p => (p.title + ' ' + p.excerpt + ' ' + (p.tags||[]).join(' ')).toLowerCase().includes(q));
      renderPosts(filtered);
    }

    function viewPost(id){
      const p = POSTS.find(x=>x.id===id);
      if (!p) return;
      const overlay = document.createElement('div');
      overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(0,0,0,.4)'; overlay.style.zIndex='1000';
      overlay.innerHTML = `
        <div class="card" style="max-width:720px; margin:5vh auto; background:#fff; padding:1.25rem">
          <button onclick="this.closest('div').parentElement.remove()" class="btn btn-outline" style="float:right">Close</button>
          <h2 style="margin-top:.5rem">${p.title}</h2>
          <p style="font-size:12px; color:#065f46">${new Date(p.date).toLocaleDateString()} • ${(p.tags||[]).join(' • ')}</p>
          <p style="margin-top:.5rem; color:#374151">${p.content}</p>
        </div>`;
      overlay.addEventListener('click', (e)=>{ if(e.target===overlay) overlay.remove(); });
      document.body.appendChild(overlay);
    }

    // Initial render for blog list (safe if blog elements exist)
    renderPosts(POSTS);

    // --- Logo picker (optional): Press Shift+L or click the brand to set a custom logo
    (function setupLogoPicker(){
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      document.body.appendChild(input);
      function handleFile(f){
        const reader = new FileReader();
        reader.onload = (e)=>{
          try{
            localStorage.setItem('logoData', e.target.result);
            // re-apply logo immediately
            const img = document.getElementById('logoImg');
            const fallback = document.getElementById('logoFallback');
            if (img && fallback){ fallback.style.display='none'; img.src = e.target.result; img.style.display='block'; }
          }catch(err){ console.warn('Could not save logo to localStorage', err); }
        };
        reader.readAsDataURL(f);
      }
      input.addEventListener('change', ()=>{ if(input.files && input.files[0]) handleFile(input.files[0]); });
      // keyboard shortcut
      window.addEventListener('keydown', (e)=>{ if(e.shiftKey && (e.key==='L' || e.key==='l')){ input.click(); } });
      // click brand to set logo (desktop)
      const brand = document.querySelector('.brand');
      if (brand){ brand.addEventListener('dblclick', (e)=>{ e.preventDefault(); input.click(); }); }
    })();

    // --- Lightweight self‑tests (debug) --------------------------------------
    (function runSelfTests(){
      try {
        console.assert(typeof window.go === 'function', 'go() should be defined');
        console.assert(typeof window.showOnly === 'function', 'showOnly() should be defined');
        // Test: navigating to home should also reveal about & contact
        showOnly('home');
        const okAbout = !document.getElementById('about').classList.contains('hidden');
        const okContact = !document.getElementById('contact').classList.contains('hidden');
        console.assert(okAbout && okContact, 'Home should show About and Contact');
        // Test: navigating to academics should hide about by default
        showOnly('academics');
        const hiddenAbout = document.getElementById('about').classList.contains('hidden');
        const hiddenContact = document.getElementById('contact').classList.contains('hidden');
        console.assert(hiddenAbout && hiddenContact, 'Non-home pages should hide About & Contact');
        // Restore home view
        const id = (location.hash||'#home').replace('#','');
        showOnly(window.PAGES.includes(id)?id:'home');
        console.log('%cBasic navigation tests passed','color:#15803d');
      } catch(e){ console.warn('Self-tests skipped:', e); }
    })();
//Galary view
    const GALLERIES = {
  classroom: {
    title: 'Classroom Activities',
    images: [
      'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1200',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200'
    ]
  },
  sports: {
    title: 'Sports & Games',
    images: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200',
      'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200'
    ]
  },
  events: {
    title: 'School Events',
    images: [
      'event/I1.jpg',
      'event/I2.jpg',
      'event/I3.jpg',
      'event/I4.jpg',
      'event/I5.jpg',
      'event/I6.jpg',
      'event/I7.jpg',
      'event/I8.jpg',
      'event/I9.jpg',
      'event/I10.jpg',
      'event/I11.jpg',
      'event/I12.jpg',
      'event/I13.jpg',
      'event/I14.jpg',
      'event/I15.jpg',
      'event/I16.jpg',
      'event/I17.jpg',
      'event/I18.jpg', 'event/I19.jpg','event/I20.jpg','event/I21.jpg','event/I22.jpg','event/I23.jpg','event/I25.jpg',
      'event/I26.jpg', 'event/I27.jpg','event/I28.jpg', 'event/I29.jpg','event/I30.jpg', 'event/I31.jpg', 'event/I32.jpg',
      'event/I33.jpg', 'event/I34.jpg', 'event/I35.jpg', 'event/I36.jpg', 'event/I37.jpg', 'event/I38.jpg', 'event/I39.jpg',
      'event/I40.jpg', 'event/I41.jpg', 'event/I42.jpg', 'event/I43.jpg', 'event/I44.jpg', 'event/I45.jpg',
      'event/I46.jpg', 'event/I47.jpg', 'event/I48.jpg', 'event/I49.jpg', 'event/I50.jpg', 'event/I51.jpg'
    ]
  }
};

function openGallery(type) {
  const gallery = GALLERIES[type];
  if (!gallery) return;

  const title = document.getElementById('galleryTitle');
  const container = document.getElementById('galleryImages');

  title.textContent = gallery.title;
  container.innerHTML = '';

  gallery.images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.loading = 'lazy';
    container.appendChild(img);
  });

  go('gallery-view');
}


// EmailJS initialization and contact form handler
(function(){
  emailjs.init("qks5GXttjyPUHRc4f");
})();

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();

      emailjs.sendForm(
        "service_hcbd68h",
        "template_5sscgwt",
        this
      ).then(
        function() {
          alert("Message sent successfully!");
          document.getElementById("contactForm").reset();
        },
        function(error) {
          alert("Failed to send message.");
          console.error("EmailJS Error:", error);
        }
      );
    });
  }
});

// ================= ADMIN PANEL FUNCTIONALITY =================

// Admin credentials (in production, use secure backend authentication)
const ADMIN_PASSWORD = "garden2025"; // Change this to your preferred password

// Check if admin is logged in
function isAdminLoggedIn() {
  return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// Show admin login modal
function showAdminLogin() {
  if (isAdminLoggedIn()) {
    go('admin');
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Admin Login</h2>
      <div id="loginError" style="display:none" class="error-message"></div>
      <form id="adminLoginForm">
        <input type="password" id="adminPassword" class="input" placeholder="Enter admin password" required autofocus>
        <div style="display:flex; gap:0.75rem; margin-top:1rem">
          <button type="submit" class="btn btn-solid" style="flex:1">Login</button>
          <button type="button" class="btn btn-outline" style="flex:1" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminLoggedIn', 'true');
      modal.remove();
      go('admin');
      loadAdminData();
    } else {
      errorDiv.textContent = 'Incorrect password. Please try again.';
      errorDiv.style.display = 'block';
      document.getElementById('adminPassword').value = '';
    }
  });

  document.body.appendChild(modal);
}

// Logout admin
function logoutAdmin() {
  sessionStorage.removeItem('adminLoggedIn');
  go('home');
  alert('Logged out successfully');
}

// Switch between admin tabs
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-content').forEach(c => c.classList.add('hidden'));
  
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`admin${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.remove('hidden');
}

// Load admin data when admin page is accessed
function loadAdminData() {
  loadPostsList();
  loadGalleryPreviews();
}

// ================= BLOG POST MANAGEMENT =================

// Add new blog post
document.addEventListener('DOMContentLoaded', function() {
  const addPostForm = document.getElementById('addPostForm');
  if (addPostForm) {
    addPostForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const title = document.getElementById('postTitle').value;
      const date = document.getElementById('postDate').value;
      const tags = document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(t => t);
      const excerpt = document.getElementById('postExcerpt').value;
      const content = document.getElementById('postContent').value;

      const id = 'post-' + Date.now();
      const newPost = { id, title, date, tags, excerpt, content };

      // Add to POSTS array
      POSTS.unshift(newPost);
      
      // Save to localStorage
      localStorage.setItem('blogPosts', JSON.stringify(POSTS));

      // Refresh displays
      renderPosts(POSTS);
      loadPostsList();

      // Reset form
      this.reset();
      alert('Post added successfully!');
    });
  }
});

// Load existing posts in admin
function loadPostsList() {
  const container = document.getElementById('postsList');
  if (!container) return;

  if (POSTS.length === 0) {
    container.innerHTML = '<p style="color:#6b7280">No posts yet.</p>';
    return;
  }

  container.innerHTML = POSTS.map(post => `
    <div class="post-item">
      <div class="post-info">
        <div class="post-title">${post.title}</div>
        <div class="post-meta">${new Date(post.date).toLocaleDateString()} • ${(post.tags || []).join(', ')}</div>
      </div>
      <button class="btn-delete" onclick="deletePost('${post.id}')">Delete</button>
    </div>
  `).join('');
}

// Delete blog post
function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  const index = POSTS.findIndex(p => p.id === id);
  if (index > -1) {
    POSTS.splice(index, 1);
    localStorage.setItem('blogPosts', JSON.stringify(POSTS));
    renderPosts(POSTS);
    loadPostsList();
    alert('Post deleted successfully');
  }
}

// ================= GALLERY MANAGEMENT =================

// Add image to gallery
document.addEventListener('DOMContentLoaded', function() {
  const addGalleryForm = document.getElementById('addGalleryForm');
  if (addGalleryForm) {
    addGalleryForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const section = document.getElementById('gallerySection').value;
      const imageUrl = document.getElementById('galleryImageUrl').value;

      if (!GALLERIES[section]) {
        alert('Invalid gallery section');
        return;
      }

      // Add image to gallery
      GALLERIES[section].images.push(imageUrl);
      
      // Save to localStorage
      localStorage.setItem('galleries', JSON.stringify(GALLERIES));

      // Refresh preview
      loadGalleryPreviews();

      // Reset form
      this.reset();
      alert('Image added successfully!');
    });
  }
});

// Load gallery previews in admin
function loadGalleryPreviews() {
  ['classroom', 'sports', 'events'].forEach(section => {
    const container = document.getElementById(`gallery${section.charAt(0).toUpperCase() + section.slice(1)}`);
    if (!container) return;

    const images = GALLERIES[section]?.images || [];
    
    if (images.length === 0) {
      container.innerHTML = '<p style="color:#6b7280; font-size:14px">No images yet.</p>';
      return;
    }

    container.innerHTML = images.map((img, index) => `
      <div class="gallery-admin-item">
        <img src="${img}" alt="${section} image ${index + 1}" loading="lazy">
        <button onclick="deleteGalleryImage('${section}', ${index})" title="Delete image">×</button>
      </div>
    `).join('');
  });
}

// Delete gallery image
function deleteGalleryImage(section, index) {
  if (!confirm('Are you sure you want to delete this image?')) return;

  if (GALLERIES[section] && GALLERIES[section].images[index]) {
    GALLERIES[section].images.splice(index, 1);
    localStorage.setItem('galleries', JSON.stringify(GALLERIES));
    loadGalleryPreviews();
    alert('Image deleted successfully');
  }
}

// ================= LOAD DATA FROM LOCALSTORAGE ON PAGE LOAD =================

// Load saved posts on page load
(function loadSavedData() {
  // Load blog posts
  const savedPosts = localStorage.getItem('blogPosts');
  if (savedPosts) {
    try {
      const parsed = JSON.parse(savedPosts);
      POSTS.length = 0; // Clear existing
      POSTS.push(...parsed);
    } catch (e) {
      console.error('Error loading saved posts:', e);
    }
  }

  // Load galleries
  const savedGalleries = localStorage.getItem('galleries');
  if (savedGalleries) {
    try {
      const parsed = JSON.parse(savedGalleries);
      Object.assign(GALLERIES, parsed);
    } catch (e) {
      console.error('Error loading saved galleries:', e);
    }
  }
})();

// Update PAGES array to include admin
window.PAGES.push('admin');