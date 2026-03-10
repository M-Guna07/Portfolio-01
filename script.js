/* ================================================
   GUNA MURUGESAN – PORTFOLIO JAVASCRIPT
   Features:
   - Sticky/scrolled navbar
   - Hamburger menu toggle
   - Smooth scrolling (enhanced)
   - Scroll-reveal animations
   - Active nav link highlighting
   ================================================ */

/* ---- 1. Grab DOM Elements ---- */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const navLinks   = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('section[id]');
const revealEls  = document.querySelectorAll('.reveal');

/* ================================================
   2. NAVBAR – Scrolled State
   Adds/removes "scrolled" class based on scroll position.
   This triggers the frosted-glass effect in CSS.
   ================================================ */
function handleNavScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // Run once on load


/* ================================================
   3. HAMBURGER MENU TOGGLE (Mobile)
   Toggles the mobile drawer open/closed.
   Also manages aria-expanded for accessibility.
   ================================================ */
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

/* Close mobile menu when a link is clicked */
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* Close mobile menu on outside click */
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }
});


/* ================================================
   4. SMOOTH SCROLLING
   For all <a> tags pointing to an anchor (#section).
   Offsets for the fixed navbar height.
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    const navHeight = navbar.offsetHeight;
    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


/* ================================================
   5. ACTIVE NAV LINK HIGHLIGHTING
   Observes each section and adds an "active" class
   to the matching nav link as user scrolls.
   ================================================ */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        /* Remove active from all nav links */
        navLinks.forEach(link => link.classList.remove('active'));

        /* Add active to the matching nav link */
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  {
    rootMargin: '-40% 0px -50% 0px', // triggers when section is in the middle zone
    threshold: 0
  }
);

sections.forEach(section => sectionObserver.observe(section));

/* Add active nav link CSS (injected so it works without touching CSS file) */
const activeStyle = document.createElement('style');
activeStyle.textContent = `.nav-link.active { color: var(--text) !important; }
.nav-link.active::after { width: 100% !important; }`;
document.head.appendChild(activeStyle);


/* ================================================
   6. SCROLL-REVEAL ANIMATION
   Uses IntersectionObserver to watch .reveal elements.
   When they enter the viewport, adds "visible" class
   which triggers the fade+slide-up CSS transition.
   ================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        /* Once revealed, unobserve so it doesn't re-animate */
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: '0px 0px -60px 0px', // trigger 60px before element enters view
    threshold: 0.1
  }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ================================================
   7. ORBIT BADGES – Subtle Floating Animation
   Adds a gentle floating effect to the avatar badges
   using requestAnimationFrame for smooth performance.
   ================================================ */
const orbitBadges = document.querySelectorAll('.orbit-badge');

orbitBadges.forEach((badge, i) => {
  /* Each badge floats with a different phase */
  const phase  = (i / orbitBadges.length) * Math.PI * 2;
  const amp    = 6; /* Amplitude in px */
  const speed  = 0.001;

  function floatBadge(time) {
    const y = Math.sin(time * speed + phase) * amp;
    badge.style.transform = badge.style.transform.replace(/translateY\([^)]*\)/, '') +
      ` translateY(${y}px)`;

    /* Override original transform based on badge position class */
    if (badge.classList.contains('ob-1')) {
      badge.style.transform = `translateX(-50%) translateY(${y}px)`;
    } else if (badge.classList.contains('ob-2')) {
      badge.style.transform = `translateY(calc(-50% + ${y}px))`;
    } else if (badge.classList.contains('ob-3')) {
      badge.style.transform = `translateX(-50%) translateY(${y}px)`;
    } else if (badge.classList.contains('ob-4')) {
      badge.style.transform = `translateY(calc(-50% + ${y}px))`;
    }

    requestAnimationFrame(floatBadge);
  }

  requestAnimationFrame(floatBadge);
});


/* ================================================
   8. PROJECT CARD – Tilt on Hover (subtle 3D effect)
   Listens to mousemove on project cards and applies
   a small CSS 3D rotation for a premium feel.
   ================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left; /* Mouse X relative to card */
    const y      = e.clientY - rect.top;  /* Mouse Y relative to card */
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;

    /* Max 6deg tilt */
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) *  6;

    card.style.transform =
      `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  /* Reset on mouse leave */
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});


/* ================================================
   9. CONSOLE EASTER EGG
   A fun little message for devs who open DevTools.
   ================================================ */
console.log(
  `%c Guna Murugesan – Portfolio %c\n%c👋 Hey there, fellow dev! Thanks for peeking behind the curtain.\nLet's connect → gunamurugesan04@gmail.com`,
  'background:#e8a838; color:#0a0a0c; font-size:16px; font-weight:bold; padding:6px 12px; border-radius:4px 4px 0 0',
  '',
  'color:#e8a838; font-size:12px; padding:4px 0'
);
