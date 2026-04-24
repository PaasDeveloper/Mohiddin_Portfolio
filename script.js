const header = document.querySelector('[data-header]');
const progress = document.querySelector('[data-progress]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
const navItems = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = navItems
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${scrolled}%`;
  header.classList.toggle('is-scrolled', window.scrollY > 20);

  let current = '';
  for (const section of sections) {
    const top = section.getBoundingClientRect().top;
    if (top <= 120) current = `#${section.id}`;
  }
  navItems.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === current));
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navLinks.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

document.querySelectorAll('.spotlight').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
