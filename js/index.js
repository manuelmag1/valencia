// Cambio de idioma.

document.addEventListener('DOMContentLoaded', function(){
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

  // Hero padding 
  const hero = document.querySelector('.hero');
  const defaultPadding = '74px';
  function adjustPadding(){
    if(hero && header) document.body.style.paddingTop = '0px';
    else if(header) document.body.style.paddingTop = defaultPadding;
  }
  adjustPadding();
  window.addEventListener('resize', adjustPadding);

// Mensaje Bienvenida Personalizado
  const welcomeMsg = document.getElementById('welcome-message');
  if(welcomeMsg) {
    const lang = localStorage.getItem('siteLang') || 'es';
    const hour = new Date().getHours();
    let greeting = '';
    
    // Mensaje según hora del día
    if(lang === 'es') {
      if(hour >= 5 && hour < 12) greeting = '¡Buenos días! ☀️';
      else if(hour >= 12 && hour < 19) greeting = '¡Buenas tardes! 🌤️';
      else greeting = '¡Buenas noches! 🌙';
    } else {
      if(hour >= 5 && hour < 12) greeting = 'Good morning! ☀️';
      else if(hour >= 12 && hour < 19) greeting = 'Good afternoon! 🌤️';
      else greeting = 'Good evening! 🌙';
    }
    
    welcomeMsg.textContent = greeting;
    
    // Actualizar mensaje al cambiar idioma
    langToggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const newLang = localStorage.getItem('siteLang');
          let newGreeting = '';
          if(newLang === 'es') {
            if(hour >= 5 && hour < 12) newGreeting = '¡Buenos días! ☀️';
            else if(hour >= 12 && hour < 19) newGreeting = '¡Buenas tardes! 🌤️';
            else newGreeting = '¡Buenas noches! 🌙';
          } else {
            if(hour >= 5 && hour < 12) newGreeting = 'Good morning! ☀️';
            else if(hour >= 12 && hour < 19) newGreeting = 'Good afternoon! 🌤️';
            else newGreeting = 'Good evening! 🌙';
          }
          welcomeMsg.textContent = newGreeting;
        }, 100);
      });
    });
  }

// Menu desplegable con mouseover/mouseout

  if(nav && window.innerWidth > 900) {
    const navLinks = nav.querySelectorAll('a');
    
    navLinks.forEach(link => {
      link.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.color = 'var(--orange)';
      });
      
      link.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
        this.style.color = '';
      });
    });
  }
});
