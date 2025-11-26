DOMContendocument.addEventListener('DOMContentLoaded', function(){
  // Menú hamburguesa móvil
  const hamburger = document.getElementById('hamburger-menu');
  const nav = document.getElementById('main-nav');
  if(hamburger && nav) {
    hamburger.addEventListener('click', function() {
      const open = nav.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
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
      'hero.title':'Descubre Valencia de forma sostenible',
      'hero.lead':'Recorre la ciudad con itinerarios verdes, transporte responsable y consejos prácticos para minimizar tu huella.',
      'hero.cta1':'Ver Rutas','hero.cta2':'Guía Práctica'
    },
    en: {
      'hero.title':'Discover Valencia sustainably',
      'hero.lead':'Explore the city with green routes, responsible transport and practical tips to reduce your footprint.',
      'hero.cta1':'See Routes','hero.cta2':'Practical Guide'
    }
  };

  function setLang(lang){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
    });
    localStorage.setItem('siteLang',lang);
    // update language toggle label(s)
    document.querySelectorAll('#lang-toggle').forEach(b=>{
      b.textContent = (lang === 'es') ? 'ES' : 'EN';
      b.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    });
  }

  // attach to toggle(s)
  langToggleButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const current = localStorage.getItem('siteLang') || 'es';
  const next = current === 'es' ? 'en' : 'es';
  setLang(next);
    });
  });

  // set default language and update toggle label(s)
+  setLang(localStorage.getItem('siteLang') || 'es');

  // Contact form handling
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const response = document.getElementById('formResponse');
      if(!name || !email || !message){
        response.style.color = 'red';
        response.textContent = 'Por favor completa todos los campos.';
        return;
      }
      // Simular envío (sin backend)
      response.style.color = 'green';
      response.textContent = 'Mensaje enviado. Gracias por contactar.';
      form.reset();
    });
  }

  // Simple filter for rutas
  const pills = document.querySelectorAll('.pill');
  if(pills.length){
    const cards = document.querySelectorAll('.card');
    // timeouts for stagger control so we can clear them on rapid toggles
    let scheduledTimeouts = [];

    function clearScheduled(){
      scheduledTimeouts.forEach(t => clearTimeout(t));
      scheduledTimeouts = [];
    }

    function showAll(){
      // Immediately show all cards without aggressive reflow
      cards.forEach(c => {
        c.style.display = '';
        c.classList.remove('anim-hide', 'anim-show', 'hidden');
        c.style.transitionDelay = '';
      });
    }

    function filterBy(type){
      clearScheduled();

      const toShow = [];
      const toHide = [];

      // Use DOM order so animation follows the order you arranged manually
      cards.forEach(c => {
        const t = (c.getAttribute('data-type') || '').toLowerCase();
        const shouldShow = !type || type === 'todas' || type === 'toda' || type === 'all' || t.includes(type);
        if(shouldShow) toShow.push(c);
        else toHide.push(c);
      });

      const hideStep = 80; // ms between hides
      const showStep = 80; // ms between shows
      const animDuration = 420; // should match CSS transition ~.42s

      // HIDE PHASE: staggered in DOM order
      toHide.forEach((c, i) => {
        const t = setTimeout(() => {
          // ensure element is visible before triggering hide
          c.classList.remove('anim-show');
          // trigger hide animation
          c.classList.add('anim-hide');
          // when transition ends, set display none
          const onEnd = function(e){
            if(e.propertyName === 'opacity'){
              c.style.display = 'none';
              c.classList.remove('anim-hide');
              c.removeEventListener('transitionend', onEnd);
            }
          };
          c.addEventListener('transitionend', onEnd);
        }, i * hideStep);
        scheduledTimeouts.push(t);
      });

      // total hide phase time
      const totalHideTime = (toHide.length * hideStep) + animDuration + 20;

      // SHOW PHASE: after hide phase completes, reveal in DOM order
      toShow.forEach((c, i) => {
        const t = setTimeout(() => {
          // make sure element participates in layout
          c.style.display = '';
          // start from hidden transform state
          c.classList.remove('anim-hide');
          c.classList.add('anim-show');
          // cleanup class after transition
          const onEnd = function(e){
            if(e.propertyName === 'opacity'){
              c.classList.remove('anim-show');
              c.removeEventListener('transitionend', onEnd);
            }
          };
          c.addEventListener('transitionend', onEnd);
        }, totalHideTime + i * showStep);
        scheduledTimeouts.push(t);
      });
    }

    // small debounce to avoid rapid toggles causing janky transitions
    let filterTimer = null;
    function applyFilterDebounced(type){
      clearTimeout(filterTimer);
      filterTimer = setTimeout(()=> filterBy(type), 40);
    }

    pills.forEach(p => {
      // make pills keyboard accessible
      p.setAttribute('role', 'button');
      p.setAttribute('tabindex', '0');
      p.setAttribute('aria-pressed', p.classList.contains('active') ? 'true' : 'false');

      const activate = () => {
        // remove active from other pills
        pills.forEach(x => { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
        p.classList.add('active');
        p.setAttribute('aria-pressed', 'true');
        const type = p.textContent.trim().toLowerCase();
        applyFilterDebounced(type);
      };

      p.addEventListener('click', activate);
      p.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });

    // initialize: if an active pill exists, apply its filter, otherwise show all
    const active = document.querySelector('.pill.active');
    if(active) filterBy(active.textContent.trim().toLowerCase());
    else showAll();
  }

});

// Header: toggle background on scroll
document.addEventListener('DOMContentLoaded', function(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  const toggle = () => {
    if(window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  toggle();
  window.addEventListener('scroll', toggle);
});

// If page has a full-viewport hero, remove body padding-top so header overlays it
document.addEventListener('DOMContentLoaded', function(){
  const hero = document.querySelector('.hero');
  const header = document.querySelector('.site-header');
  const defaultPadding = '74px';
  function adjustPadding(){
    if(hero && header){
      // let header overlay the hero (no white gap)
      document.body.style.paddingTop = '0px';
    } else if(header){
      document.body.style.paddingTop = defaultPadding;
    }
  }
  adjustPadding();
  window.addEventListener('resize', adjustPadding);
});
