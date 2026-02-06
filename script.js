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

<script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>

  (function(){
    emailjs.init("qks5GXttjyPUHRc4f"); // ✅ your public key
  })();

  document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    emailjs.sendForm(
      "service_hcbd68h",   // ✅ service ID
      "template_5sscgwt",  // ✅ template ID
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
