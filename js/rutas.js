// rutas.js - language toggle, header behavior and filter logic for rutas.html
document.addEventListener('DOMContentLoaded', function(){
  // Menú hamburguesa
  const hamburger = document.getElementById('hamburger-menu');
  const nav = document.getElementById('main-nav');
  
  if(hamburger && nav) {
    hamburger.addEventListener('click', function() {
      const isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    
    // Cerrar menú al hacer click en un enlace
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  const langToggleButtons = document.querySelectorAll('#lang-toggle');
  const i18n = {
    es: {
      'page.title': 'Rutas',
      'page.description': 'Descubre las rutas naturales de Valencia a través de nuestra guía interactiva, diseñada para promover un turismo sostenible que integra naturaleza, cultura y ocio responsable.',
      'filter.all': 'Todas',
      'filter.centro': 'Centro',
      'filter.jardines': 'Jardines',
      'filter.playa': 'Playa',
      'btn.gallery': 'Ver galería →'
    },
    en: {
      'page.title': 'Routes',
      'page.description': 'Discover Valencia\'s natural routes through our interactive guide, designed to promote sustainable tourism that integrates nature, culture and responsible leisure.',
      'filter.all': 'All',
      'filter.centro': 'Downtown',
      'filter.jardines': 'Gardens',
      'filter.playa': 'Beach',
      'btn.gallery': 'View gallery →'
    }
  };

  function setLang(lang){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
    });
    localStorage.setItem('siteLang',lang);
    document.querySelectorAll('#lang-toggle').forEach(b=>{
      b.textContent = (lang === 'es') ? 'ES' : 'EN';
      b.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    });
  }

  langToggleButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const current = localStorage.getItem('siteLang') || 'es';
      const next = current === 'es' ? 'en' : 'es';
      setLang(next);
    });
  });
  setLang(localStorage.getItem('siteLang') || 'es');

  // Header scrolled
  const header = document.querySelector('.site-header');
  if(header){
    const toggle = () => { if(window.scrollY > 60) header.classList.add('scrolled'); else header.classList.remove('scrolled'); };
    toggle();
    window.addEventListener('scroll', toggle);
  }

  // Filters (same logic as main.js)
  const pills = document.querySelectorAll('.pill');
  if(pills.length){
    const cards = document.querySelectorAll('.card');
    let scheduledTimeouts = [];
    function clearScheduled(){ scheduledTimeouts.forEach(t=>clearTimeout(t)); scheduledTimeouts = []; }
    function showAll(){ cards.forEach(c=>{ c.style.display=''; c.classList.remove('anim-hide','anim-show','hidden'); }); }
    function filterBy(type){
      clearScheduled();
      const toShow = [], toHide = [];
      cards.forEach(c=>{ const t=(c.getAttribute('data-type')||'').toLowerCase(); const shouldShow = !type || type==='todas' || type==='toda' || type==='all' || t.includes(type); if(shouldShow) toShow.push(c); else toHide.push(c); });
      const hideStep = 80, showStep = 80, animDuration = 420;
      toHide.forEach((c,i)=>{ const t=setTimeout(()=>{ c.classList.remove('anim-show'); c.classList.add('anim-hide'); const onEnd=function(e){ if(e.propertyName==='opacity'){ c.style.display='none'; c.classList.remove('anim-hide'); c.removeEventListener('transitionend', onEnd); } }; c.addEventListener('transitionend', onEnd); }, i*hideStep); scheduledTimeouts.push(t); });
      const totalHideTime = (toHide.length*hideStep) + animDuration + 20;
      toShow.forEach((c,i)=>{ const t=setTimeout(()=>{ c.style.display=''; c.classList.remove('anim-hide'); c.classList.add('anim-show'); const onEnd=function(e){ if(e.propertyName==='opacity'){ c.classList.remove('anim-show'); c.removeEventListener('transitionend', onEnd); } }; c.addEventListener('transitionend', onEnd); }, totalHideTime + i*showStep); scheduledTimeouts.push(t); });
    }
    let filterTimer = null;
    function applyFilterDebounced(type){ clearTimeout(filterTimer); filterTimer = setTimeout(()=>filterBy(type),40); }
    pills.forEach(p=>{
      p.setAttribute('role','button'); p.setAttribute('tabindex','0'); p.setAttribute('aria-pressed', p.classList.contains('active')?'true':'false');
      const activate = ()=>{ pills.forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-pressed','false');}); p.classList.add('active'); p.setAttribute('aria-pressed','true'); const type = p.textContent.trim().toLowerCase(); applyFilterDebounced(type); };
      p.addEventListener('click', activate); p.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); activate(); } });
    });
    const active = document.querySelector('.pill.active'); if(active) filterBy(active.textContent.trim().toLowerCase()); else showAll();
  }

//Slider de galería de imágenes

  const modal = document.getElementById('gallery-modal');
  const modalTitle = document.getElementById('modal-title');
  const sliderImg = document.getElementById('slider-img');
  const sliderDots = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  
  let currentImages = [];
  let currentIndex = 0;
  let autoSlideInterval = null;

  // Abrir modal al hacer click en "Ver galería"
  document.querySelectorAll('[data-action="open-gallery"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.card');
      const title = card.getAttribute('data-title');
      const images = card.getAttribute('data-images').split(',');
      
      openGallery(title, images);
    });
  });

  function openGallery(title, images) {
    currentImages = images;
    currentIndex = 0;
    modalTitle.textContent = title;
    
    // Crear dots
    sliderDots.innerHTML = '';
    images.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'slider-dot';
      if(i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      sliderDots.appendChild(dot);
    });
    
    showSlide(0);
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    
    // Auto-slide cada 4 segundos
    startAutoSlide();
  }

  function closeGallery() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    stopAutoSlide();
  }

  function showSlide(index) {
    if(index < 0) index = currentImages.length - 1;
    if(index >= currentImages.length) index = 0;
    
    currentIndex = index;
    sliderImg.src = `assets/${currentImages[index]}`;
    sliderImg.alt = modalTitle.textContent;
    
    // Actualizar dots
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function goToSlide(index) {
    stopAutoSlide();
    showSlide(index);
    startAutoSlide();
  }

  function nextSlide() {
    stopAutoSlide();
    showSlide(currentIndex + 1);
    startAutoSlide();
  }

  function prevSlide() {
    stopAutoSlide();
    showSlide(currentIndex - 1);
    startAutoSlide();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 4000);
  }

  function stopAutoSlide() {
    if(autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  // Eventos de cierre
  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeGallery);
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeGallery();
    }
  });

  // Navegación con flechas
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if(!modal.hasAttribute('hidden')) {
      if(e.key === 'ArrowLeft') prevSlide();
      if(e.key === 'ArrowRight') nextSlide();
    }
  });
});
