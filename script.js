/* ═══════════════════════════════════════════════════════
   PEEYUSH VERMA PORTFOLIO — script.js
   All animations, interactions, and functionality
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. PAGE LOADER ─── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    initAOS();
    startTyping();
  }, 2200);
});

/* ─── 2. AOS (Animate On Scroll) ─── */
function initAOS() {
  AOS.init({
    duration: 700,
    easing: 'cubic-bezier(0.4,0,0.2,1)',
    once: true,
    offset: 80,
  });
}

/* ─── 3. CUSTOM CURSOR ─── */
const dot  = document.getElementById('cursor-dot');
const glow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX  = 0, glowY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) {
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  }
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  if (glow) {
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
  }
  requestAnimationFrame(animateGlow);
}
animateGlow();

// Cursor scale on interactive elements
document.querySelectorAll('a, button, .skill-chip, .project-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (dot)  { dot.style.transform  = 'translate(-50%,-50%) scale(2)'; dot.style.opacity = '0.5'; }
    if (glow) { glow.style.width = '60px'; glow.style.height = '60px'; glow.style.opacity = '0.6'; }
  });
  el.addEventListener('mouseleave', () => {
    if (dot)  { dot.style.transform  = 'translate(-50%,-50%) scale(1)'; dot.style.opacity = '1'; }
    if (glow) { glow.style.width = '40px'; glow.style.height = '40px'; glow.style.opacity = '0.4'; }
  });
});

/* ─── 4. LAMP THEME TOGGLE ─── */
const lampContainer = document.getElementById('lampContainer');
const lampBulb      = document.getElementById('lampBulb');

// Load saved theme
const savedTheme = localStorage.getItem('pv-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

function toggleTheme() {
  const rope = document.getElementById('rope');
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';

  // Rope pull animation
  if (rope) {
    rope.style.transition = 'transform 0.15s ease';
    rope.style.transform  = 'scaleY(0.8)';
    setTimeout(() => {
      rope.style.transform = 'scaleY(1)';
    }, 150);
  }

  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('pv-theme', next);
}

if (lampContainer) lampContainer.addEventListener('click', toggleTheme);

/* ─── 5. NAVBAR ─── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
});

// Hamburger
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
}

// Close menu on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger && hamburger.classList.remove('open');
    navLinks  && navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active link tracking
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      allNavLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

/* ─── 6. TYPING ANIMATION ─── */
const phrases = [
  'AI/ML Engineer',
  'Data Analyst',
  'ML Enthusiast',
  'Python Developer',
  'Problem Solver',
];
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let typingPaused = false;

function startTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  typeLoop(el);
}

function typeLoop(el) {
  const phrase = phrases[phraseIdx];

  if (!deleting) {
    el.textContent = phrase.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(() => typeLoop(el), 1800);
      return;
    }
    setTimeout(() => typeLoop(el), 70);
  } else {
    el.textContent = phrase.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(() => typeLoop(el), 40);
  }
}

/* ─── 7. PARTICLE CANVAS ─── */
(function initParticles() {
  const canvas  = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  let W, H, particles = [];
  let mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.vx += (dx / dist) * force * 0.5;
          this.vy += (dy / dist) * force * 0.5;
        }
      }
      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;
      this.x += this.vx;
      this.y += this.vy;
      // Wrap
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(99,102,241,${this.alpha})`
        : `rgba(99,102,241,${this.alpha * 0.6})`;
      ctx.fill();
    }
  }

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => new Particle());
  }
  createParticles();

  function drawConnections() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist/110) * (isDark ? 0.15 : 0.08);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ─── 8. TILT EFFECT on Project Cards ─── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rotateX =  dy * -8;
    const rotateY =  dx *  8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

/* ─── 9. MAGNETIC BUTTONS ─── */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect  = btn.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) * 0.25;
    const dy    = (e.clientY - cy) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.15s ease';
  });
});

/* ─── 10. SMOOTH SCROLLING for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── 11. COPY EMAIL ─── */
const copyBtn = document.getElementById('copyEmailBtn');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('peeyushju@gmail.com').then(() => {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
      }, 2000);
    });
  });
}

/* ─── 12. CONTACT FORM ─── */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = contactForm.querySelector('#name').value.trim();
    const email   = contactForm.querySelector('#email').value.trim();
    const subject = contactForm.querySelector('#subject').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !subject || !message) {
      showNote('Please fill in all fields.', 'error');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showNote('Please enter a valid email address.', 'error');
      return;
    }

    // Build mailto link
    const body = encodeURIComponent(`Hi Peeyush,\n\n${message}\n\nFrom: ${name} (${email})`);
    const mailtoLink = `mailto:peeyushju@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailtoLink;

    showNote('Opening your email client... Thanks for reaching out!', 'success');
    contactForm.reset();
  });
}

function showNote(msg, type) {
  if (!formNote) return;
  formNote.textContent = msg;
  formNote.className   = `form-note ${type}`;
  setTimeout(() => { formNote.textContent = ''; formNote.className = 'form-note'; }, 5000);
}

/* ─── 13. COUNTER ANIMATION for Stats ─── */
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target') || el.textContent);
  const isDecimal = el.textContent.includes('.');
  const suffix    = el.textContent.replace(/[\d.]/g, '');
  const duration  = 1500;
  const start     = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const value = target * ease;
    el.textContent = (isDecimal ? value.toFixed(2) : Math.round(value)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Trigger counters when about section enters view
const statNums = document.querySelectorAll('.stat-num');
statNums.forEach(el => {
  el.setAttribute('data-target', parseFloat(el.textContent));
  el.textContent = '0';
});

const aboutSection = document.getElementById('about');
if (aboutSection) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(el => animateCounter(el));
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  counterObserver.observe(aboutSection);
}

/* ─── 14. SKILL CHIP STAGGER REVEAL ─── */
const skillCategories = document.querySelectorAll('.skill-category');
const chipObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const chips = entry.target.querySelectorAll('.skill-chip');
      chips.forEach((chip, i) => {
        chip.style.opacity    = '0';
        chip.style.transform  = 'translateY(12px)';
        chip.style.transition = `opacity 0.4s ease ${i * 50}ms, transform 0.4s ease ${i * 50}ms`;
        setTimeout(() => {
          chip.style.opacity   = '1';
          chip.style.transform = 'translateY(0)';
        }, 100 + i * 50);
      });
      chipObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

skillCategories.forEach(cat => chipObserver.observe(cat));

/* ─── 15. EXPERIENCE TIMELINE REVEAL ─── */
const expItems = document.querySelectorAll('.exp-item');
const expObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateX(0)';
      expObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

expItems.forEach((item, i) => {
  item.style.opacity    = '0';
  item.style.transform  = 'translateX(-30px)';
  item.style.transition = `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms`;
  expObserver.observe(item);
});

/* ─── 16. CERT CARD HOVER SHIMMER ─── */
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(99,102,241,0.08) 0%, var(--glass-bg) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ─── 17. SECTION ENTER GLOW EFFECT ─── */
const sections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
    }
  });
}, { threshold: 0.1 });
sections.forEach(s => sectionObserver.observe(s));

/* ─── 18. PROJECT CARD GLOW FOLLOW ─── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const glow  = card.querySelector('.project-glow');
    if (glow) {
      glow.style.left    = (x - 60) + 'px';
      glow.style.top     = (y - 60) + 'px';
      glow.style.opacity = '1';
    }
  });
  card.addEventListener('mouseleave', () => {
    const glow = card.querySelector('.project-glow');
    if (glow) glow.style.opacity = '0';
  });
});

/* ─── 19. SCROLL PROGRESS BAR ─── */
(function createProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 0%; height: 3px;
    background: linear-gradient(90deg, #6366F1, #06B6D4);
    z-index: 9999;
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  });
})();

/* ─── 20. BACK-TO-TOP BUTTON ─── */
(function createBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.style.cssText = `
    position: fixed;
    bottom: 2rem; right: 2rem;
    width: 44px; height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 4px 20px rgba(99,102,241,0.4);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s;
    z-index: 800;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.opacity   = '1';
      btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity   = '0';
      btn.style.transform = 'translateY(20px)';
    }
  });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── 21. ORBIT DOT POSITIONING FIX ─── */
(function positionOrbitDots() {
  // Orbit-1: 1 dot at top
  const orbit1Dots = document.querySelectorAll('.orbit-1 .orbit-dot');
  orbit1Dots.forEach((dot, i) => {
    const angle = (i / orbit1Dots.length) * 360;
    const rad   = 150;
    dot.style.cssText += `
      position: absolute;
      top: 50%; left: 50%;
      margin-top: -18px; margin-left: -18px;
      animation: orbitDot1 8s linear infinite;
      animation-delay: ${(i / orbit1Dots.length) * -8}s;
    `;
  });

  // Orbit-2: 2 dots
  const orbit2Dots = document.querySelectorAll('.orbit-2 .orbit-dot');
  orbit2Dots.forEach((dot, i) => {
    dot.style.cssText += `
      position: absolute;
      top: 50%; left: 50%;
      margin-top: -18px; margin-left: -18px;
      animation: orbitDot2 14s linear infinite;
      animation-delay: ${(i / orbit2Dots.length) * -14}s;
    `;
  });

  // Orbit-3: 3 dots
  const orbit3Dots = document.querySelectorAll('.orbit-3 .orbit-dot');
  orbit3Dots.forEach((dot, i) => {
    dot.style.cssText += `
      position: absolute;
      top: 50%; left: 50%;
      margin-top: -18px; margin-left: -18px;
      animation: orbitDot3 20s linear infinite;
      animation-delay: ${(i / orbit3Dots.length) * -20}s;
    `;
  });

  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes orbitDot1 {
      from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
    }
    @keyframes orbitDot2 {
      from { transform: rotate(0deg) translateX(190px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(190px) rotate(-360deg); }
    }
    @keyframes orbitDot3 {
      from { transform: rotate(0deg) translateX(230px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(230px) rotate(-360deg); }
    }
  `;
  document.head.appendChild(style);
})();

/* ─── 22. HERO SECTION PARALLAX ─── */
window.addEventListener('scroll', () => {
  const hero  = document.querySelector('.hero-content');
  const grid  = document.querySelector('.hero-bg-grid');
  const scrollY = window.scrollY;

  if (hero && scrollY < window.innerHeight) {
    hero.style.transform = `translateY(${scrollY * 0.2}px)`;
    hero.style.opacity   = 1 - scrollY / (window.innerHeight * 0.8);
  }
  if (grid && scrollY < window.innerHeight) {
    grid.style.transform = `translateY(${scrollY * 0.1}px)`;
  }
});

/* ─── 23. INTERACTIVE BACKGROUND GLOW (mouse follow on sections) ─── */
document.addEventListener('mousemove', e => {
  const sections = document.querySelectorAll('.hero-section, .about-section, .skills-section, .projects-section');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      section.style.setProperty('--mouse-x', x + 'px');
      section.style.setProperty('--mouse-y', y + 'px');
    }
  });
});

/* ─── 24. GLITCH EFFECT on Hero Name ─── */
(function heroGlitch() {
  const heroName = document.querySelector('.hero-name');
  if (!heroName) return;

  setInterval(() => {
    if (Math.random() > 0.93) {
      heroName.style.textShadow = `2px 0 #6366F1, -2px 0 #06B6D4`;
      setTimeout(() => {
        heroName.style.textShadow = '';
      }, 80);
    }
  }, 1200);
})();

/* ─── 25. FOOTER YEAR ─── */
(function setYear() {
  const yearEls = document.querySelectorAll('.footer-copy');
  yearEls.forEach(el => {
    el.innerHTML = el.innerHTML.replace('2025', new Date().getFullYear());
  });
})();

/* ─── 26. KEYBOARD ACCESSIBILITY ─── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    if (hamburger && navLinks && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

/* ─── 27. LAZY IMAGE / IFRAME OBSERVER ─── */
const lazyEls = document.querySelectorAll('[data-src]');
if (lazyEls.length) {
  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.getAttribute('data-src');
        lazyObserver.unobserve(entry.target);
      }
    });
  });
  lazyEls.forEach(el => lazyObserver.observe(el));
}

/* ─── 28. PREVENT CONTEXT MENU on canvas (optional) ─── */
const canvas = document.getElementById('particleCanvas');
if (canvas) canvas.addEventListener('contextmenu', e => e.preventDefault());

/* ─── INIT LOG ─── */
console.log('%c✦ Peeyush Verma Portfolio', 'color:#6366F1;font-size:18px;font-weight:bold;');
console.log('%cBuilt with ♥ using HTML5 · CSS3 · JavaScript', 'color:#8B5CF6;font-size:12px;');