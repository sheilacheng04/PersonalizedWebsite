import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { feedbackApi } from '../api/feedback';
import type { Feedback } from '../api/feedback';
import { projectList, posterList } from '../data/assets';
import '../styles/base.css';
import '../styles/content.css';

// ---- Particle positions for ocean particles ----
const PARTICLE_CLASSES = [
  'small','medium','small','large','small','medium','small','large','medium','small',
  'small','medium','small','large','medium','small','small','medium','large','small',
  'medium','small','small','medium','small','large','medium','small','small','large',
  'medium','small','large','small','medium','small','small','medium','large','small',
  'medium','small','small','large','medium','small','medium','small','large','small',
  'medium','small','small','large','medium','small',
];

// ---- HSL to RGB conversion (for theme-color) ----
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function applyThemeColor(hue: number) {
  const root = document.documentElement;
  const DEFAULT_HUE = 200;
  if (hue == DEFAULT_HUE) {
    root.style.setProperty('--theme-light', '100, 180, 220');
    root.style.setProperty('--theme-medium', '58, 138, 184');
    root.style.setProperty('--theme-dark', '0, 60, 120');
    root.style.setProperty('--theme-very-dark', '5, 18, 45');
    root.style.setProperty('--theme-very-light', '120, 200, 255');
    root.style.setProperty('--theme-hue', String(hue));
  } else {
    const light = hslToRgb(hue / 360, 0.6, 0.63);
    const medium = hslToRgb(hue / 360, 0.52, 0.48);
    const dark = hslToRgb(hue / 360, 1, 0.24);
    const veryDark = hslToRgb(hue / 360, 0.8, 0.10);
    const veryLight = hslToRgb(hue / 360, 1, 0.74);
    root.style.setProperty('--theme-light', `${light[0]}, ${light[1]}, ${light[2]}`);
    root.style.setProperty('--theme-medium', `${medium[0]}, ${medium[1]}, ${medium[2]}`);
    root.style.setProperty('--theme-dark', `${dark[0]}, ${dark[1]}, ${dark[2]}`);
    root.style.setProperty('--theme-very-dark', `${veryDark[0]}, ${veryDark[1]}, ${veryDark[2]}`);
    root.style.setProperty('--theme-very-light', `${veryLight[0]}, ${veryLight[1]}, ${veryLight[2]}`);
    root.style.setProperty('--theme-hue', String(hue));
  }
}

// ---- Poster captions ----
const posterCaptions: Record<string, string> = {
  'Blue Ink': 'An abstract exploration of fluid ink patterns in deep blue hues.',
  'Cross the Bridge': 'A symbolic journey across boundaries and transitions.',
  'Nature Collage': 'A harmonious blend of natural elements and textures.',
  'Observe': 'A contemplative piece encouraging mindful observation.',
  'Past Life': 'Reflections on memories and experiences from another time.',
  'Universe': 'A cosmic representation of infinite possibilities.',
  'Wings of Vigil': 'Guardian spirits watching over with protective grace.',
};

export default function Content() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ---- State ----
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [lightboxPoster, setLightboxPoster] = useState<{ src: string; title: string } | null>(null);
  const [themeHue, setThemeHue] = useState(() => {
    return parseInt(localStorage.getItem('themeHue') || '200');
  });
  
  // Feedback form state (replaces Vue.js)
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  // Refs
  const sliderRef = useRef<HTMLDivElement>(null);
  const posterGridRef = useRef<HTMLDivElement>(null);
  const posterContainerRef = useRef<HTMLDivElement>(null);
  const feedbackCirclesRef = useRef<HTMLDivElement>(null);

  // ---- Apply theme on hue change ----
  useEffect(() => {
    applyThemeColor(themeHue);
    localStorage.setItem('themeHue', String(themeHue));
  }, [themeHue]);

  // ---- Theme preview circle color ----
  const themePreviewStyle = {
    background: `linear-gradient(135deg, hsl(${themeHue}, 60%, 63%), hsl(${themeHue}, 52%, 48%))`
  };

  // ---- Handle nav click with transition ----
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) overlay.classList.add('active');
    setTimeout(() => navigate(path), 600);
  };

  // ---- Submit feedback form ----
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const newFeedback = await feedbackApi.create({ name: formName, email: formEmail, message: formMessage });
      setFeedbackList(prev => [newFeedback, ...prev]);
      setSuccessMessage('Your message has been sent! Thanks for reaching out.');
      setFormName(''); setFormEmail(''); setFormMessage('');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      setErrorMessage('Failed to send message. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Load feedback data ----
  useEffect(() => {
    feedbackApi.getAll().then(data => setFeedbackList(data)).catch(console.error);
  }, []);

  // ---- Page transition, hash navigation, custom cursor, FinisherHeader, water particles ----
  useEffect(() => {
    // Remove transition overlay
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) setTimeout(() => overlay.classList.remove('active'), 100);

    // Hash navigation
    if (location.hash) {
      setTimeout(() => {
        const target = document.querySelector(location.hash);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }

    // ---- Custom Cursor ----
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.display = 'block';
    document.body.appendChild(cursor);
    const onMouseMove = (e: MouseEvent) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; };
    document.addEventListener('mousemove', onMouseMove);
    const addInteractive = () => {
      document.querySelectorAll('a, button, .btn-circle, .poster-card, .project-box, .feedback-circle, input, textarea').forEach(el => {
        if ((el as any).__cursorBound) return;
        (el as any).__cursorBound = true;
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
    };
    addInteractive();
    let mutDebounce: ReturnType<typeof setTimeout> | null = null;
    const mutObs = new MutationObserver(() => {
      if (mutDebounce) return;
      mutDebounce = setTimeout(() => { mutDebounce = null; addInteractive(); }, 300);
    });
    mutObs.observe(document.body, { childList: true, subtree: true });
    const onDown = () => cursor.classList.add('grab');
    const onUp = () => cursor.classList.remove('grab');
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    const onLeave = () => { cursor.style.opacity = '0'; };
    const onEnter = () => { cursor.style.opacity = '1'; };
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // ---- FinisherHeader ----
    const initFinisher = () => {
      if (window.FinisherHeader) {
        new window.FinisherHeader({
          count: 30, size: { min: 2, max: 8, pulse: 0.5 },
          speed: { x: { min: 0.1, max: 0.4 }, y: { min: 0.1, max: 0.4 } },
          colors: { background: 'transparent', particles: ['#64b4dc','#3a8ab8','#4e96c8','#5aa4d0','#ffffff'] },
          blending: 'overlay', opacity: { center: 0.6, edge: 0.3 }, skew: -2, shapes: ['c']
        });
      }
    };
    const finisherTimer = setInterval(() => { if (window.FinisherHeader) { clearInterval(finisherTimer); initFinisher(); } }, 200);
    setTimeout(() => clearInterval(finisherTimer), 5000);

    // ---- Water Particles for content page ----
    const contentPage = document.querySelector('.content-page');
    if (contentPage) {
      const pc = document.createElement('div');
      pc.className = 'particles-container';
      contentPage.insertBefore(pc, contentPage.firstChild);
      const particles: HTMLDivElement[] = [];
      let mx = 0, my = 0;
      for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'water-particle';
        const x = Math.random() * 100, y = Math.random() * 100;
        const sz = Math.random() * 6 + 2, dur = Math.random() * 20 + 15;
        const del = Math.random() * 10, bl = Math.random() * 3 + 2, op = Math.random() * 0.44 + 0.28;
        Object.assign(p.style, { left: `${x}%`, top: `${y}%`, width: `${sz}px`, height: `${sz}px`, animationDuration: `${dur}s`, animationDelay: `${del}s`, filter: `blur(${bl}px)`, opacity: String(op), transition: 'transform 0.2s ease-out' });
        p.dataset.baseX = String(x); p.dataset.baseY = String(y);
        pc.appendChild(p); particles.push(p);
      }
      let needsUpdate = false;
      const updateParticles = () => {
        particles.forEach(p => {
          const bx = parseFloat(p.dataset.baseX || '0'), by = parseFloat(p.dataset.baseY || '0');
          const dx = mx - bx, dy = my - by, d = Math.sqrt(dx*dx+dy*dy);
          if (d < 50) { const f = (50-d)/50; p.style.transform = `translate(${dx*f*0.4}%, ${dy*f*0.4}%)`; }
          else p.style.transform = 'translate(0,0)';
        });
        needsUpdate = false;
      };
      contentPage.addEventListener('mousemove', ((e: MouseEvent) => {
        const rect = contentPage.getBoundingClientRect();
        mx = ((e.clientX - rect.left) / rect.width) * 100;
        my = ((e.clientY - rect.top) / rect.height) * 100;
        if (!needsUpdate) { needsUpdate = true; requestAnimationFrame(updateParticles); }
      }) as EventListener);
    }

    // Cleanup
    return () => {
      cursor.remove();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      mutObs.disconnect();
      clearInterval(finisherTimer);
    };
  }, [location.hash]);

  // ---- Scroll animations (IntersectionObserver) ----
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) { document.body.classList.add('reduce-motion'); return; }

    type AnimConfig = { animation: string; duration: number; stagger?: number; threshold: number };
    const configs: Record<string, AnimConfig> = {
      'profile-box': { animation: 'fadeInScale', duration: 800, stagger: 150, threshold: 0.2 },
      'carousel': { animation: 'slideInFromRight', duration: 1000, threshold: 0.15 },
      'contact-links': { animation: 'fadeInUp', duration: 900, threshold: 0.2 },
      'feedback-aquarium': { animation: 'fadeInScaleRotate', duration: 1200, threshold: 0.1 },
      'contacts': { animation: 'slideInFromLeft', duration: 900, threshold: 0.2 },
      'poster-gallery': { animation: 'fadeInUp', duration: 1000, threshold: 0.1 },
    };

    const animateElement = (el: HTMLElement, config: AnimConfig) => {
      const delay = (parseInt(el.dataset.staggerIndex || '0')) * (config.stagger || 0);
      setTimeout(() => {
        el.style.transition = `all ${config.duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        el.style.opacity = '1';
        switch (config.animation) {
          case 'fadeInScale': el.style.transform = 'scale(1) translateY(0)'; break;
          case 'slideInFromRight': case 'slideInFromLeft': el.style.transform = 'translateX(0)'; break;
          case 'fadeInUp': el.style.transform = 'translateY(0)'; break;
          case 'fadeInScaleRotate': el.style.transform = 'scale(1) rotateX(0deg)'; el.style.transformStyle = 'preserve-3d'; break;
          default: el.style.transform = 'none';
        }
      }, delay);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const t = entry.target as HTMLElement;
        const type = t.dataset.animationType || '';
        const config = configs[type];
        if (entry.isIntersecting && config && entry.intersectionRatio >= config.threshold && !t.classList.contains('animated')) {
          animateElement(t, config);
          t.classList.add('animated');
        }
      });
    }, { root: null, rootMargin: isMobile ? '-10% 0px -10% 0px' : '-15% 0px -15% 0px', threshold: [0, 0.1, 0.2, 0.3, 0.5] });

    // Observe profile boxes
    document.querySelectorAll('.profile-box').forEach((box, i) => {
      const el = box as HTMLElement;
      el.dataset.animationType = 'profile-box'; el.dataset.staggerIndex = String(i);
      el.style.opacity = '0'; el.style.transform = 'scale(0.8) translateY(40px)';
      observer.observe(el);
    });
    // Carousel container
    const carousel = document.querySelector('.projects-carousel-container') as HTMLElement | null;
    if (carousel) { carousel.dataset.animationType = 'carousel'; carousel.style.opacity = '0'; carousel.style.transform = 'translateX(100px)'; observer.observe(carousel); }
    // Contact links
    const contactLinks = document.querySelector('.projects-contact-links-container') as HTMLElement | null;
    if (contactLinks) { contactLinks.dataset.animationType = 'contact-links'; contactLinks.style.opacity = '0'; contactLinks.style.transform = 'translateY(50px)'; observer.observe(contactLinks); }
    // Aquarium
    const aquarium = document.querySelector('.feedback-aquarium') as HTMLElement | null;
    if (aquarium) { aquarium.dataset.animationType = 'feedback-aquarium'; aquarium.style.opacity = '0'; aquarium.style.transform = 'scale(0.85) rotateX(10deg)'; observer.observe(aquarium); }
    // Contacts container
    const contacts = document.querySelector('.projects-contacts-container') as HTMLElement | null;
    if (contacts) { contacts.dataset.animationType = 'contacts'; contacts.style.opacity = '0'; contacts.style.transform = 'translateX(-80px)'; observer.observe(contacts); }
    // Poster gallery
    const posterGallery = document.querySelector('.poster-gallery') as HTMLElement | null;
    if (posterGallery) { posterGallery.dataset.animationType = 'poster-gallery'; posterGallery.style.opacity = '0'; posterGallery.style.transform = 'translateY(60px)'; observer.observe(posterGallery); }

    return () => observer.disconnect();
  }, []);

  // ---- 3D Carousel Controls ----
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const items = slider.querySelectorAll('.project-item');
    if (items.length === 0) return;

    let currentRotation = 0;
    let isManualControl = false;
    let isPaused = false;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    let animFrameId: number | null = null;
    let lastTimestamp = performance.now();
    const rotationSpeed = 360 / 25000;
    const stepAngle = 360 / items.length;

    const pauseAnim = () => { slider.style.animation = 'none'; isManualControl = true; if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; } };
    const resumeAnim = () => {
      if (isPaused) return;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { isManualControl = false; lastTimestamp = performance.now(); animateRot(); }, 2000);
    };
    const animateRot = () => {
      if (isManualControl || isPaused) return;
      const now = performance.now(); const delta = now - lastTimestamp; lastTimestamp = now;
      currentRotation += delta * rotationSpeed;
      slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`;
      animFrameId = requestAnimationFrame(animateRot);
    };
    animateRot();

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); pauseAnim(); currentRotation -= stepAngle; slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`; resumeAnim(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); pauseAnim(); currentRotation += stepAngle; slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`; resumeAnim(); }
    };
    document.addEventListener('keydown', onKeyDown);

    // Mouse drag
    let isDragging = false, startX = 0, startRot = 0;
    const onSliderMouseDown = (e: MouseEvent) => { isDragging = true; startX = e.clientX; startRot = currentRotation; pauseAnim(); slider.style.cursor = 'grabbing'; };
    const onDocMouseMove = (e: MouseEvent) => { if (!isDragging) return; const dx = e.clientX - startX; currentRotation = startRot + dx * 0.1; slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`; };
    const onDocMouseUp = () => { if (isDragging) { isDragging = false; slider.style.cursor = 'grab'; resumeAnim(); } };
    slider.addEventListener('mousedown', onSliderMouseDown);
    document.addEventListener('mousemove', onDocMouseMove);
    document.addEventListener('mouseup', onDocMouseUp);

    // Touch
    let touchStartX = 0, touchStartRot = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; touchStartRot = currentRotation; pauseAnim(); };
    const onTouchMove = (e: TouchEvent) => { const dx = e.touches[0].clientX - touchStartX; currentRotation = touchStartRot + dx * 0.1; slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`; };
    const onTouchEnd = () => resumeAnim();
    slider.addEventListener('touchstart', onTouchStart);
    slider.addEventListener('touchmove', onTouchMove);
    slider.addEventListener('touchend', onTouchEnd);

    slider.style.cursor = 'grab';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousemove', onDocMouseMove);
      document.removeEventListener('mouseup', onDocMouseUp);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (resumeTimer) clearTimeout(resumeTimer);
    };
  }, []);

  // ---- Poster Gallery Infinite Carousel ----
  useEffect(() => {
    const grid = posterGridRef.current;
    const container = posterContainerRef.current;
    if (!grid || !container) return;

    const originalCards = Array.from(grid.querySelectorAll('.poster-card'));
    if (originalCards.length === 0) return;

    // Clone posters for infinite loop
    originalCards.forEach(card => { const clone = card.cloneNode(true) as HTMLElement; grid.appendChild(clone); });
    const reversed = [...originalCards].reverse();
    reversed.forEach(card => { const clone = card.cloneNode(true) as HTMLElement; grid.insertBefore(clone, grid.firstChild); });

    const cardWidth = 155;
    let currentIndex = originalCards.length;
    let isTransitioning = false;
    grid.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    const updateCenter = () => {
      const allCards = grid.querySelectorAll('.poster-card');
      const rect = container.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      allCards.forEach(card => {
        const cr = card.getBoundingClientRect();
        const cc = cr.left + cr.width / 2;
        if (Math.abs(center - cc) < rect.width / 4) card.classList.add('center');
        else card.classList.remove('center');
      });
    };
    updateCenter();

    const moveToNext = () => {
      if (isTransitioning) return;
      isTransitioning = true; currentIndex++;
      grid.style.transition = 'transform 0.4s ease';
      grid.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      setTimeout(() => {
        if (currentIndex >= originalCards.length * 2) {
          grid.style.transition = 'none'; currentIndex = originalCards.length;
          grid.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
          setTimeout(() => { grid.style.transition = 'transform 0.4s ease'; }, 50);
        }
        isTransitioning = false; updateCenter();
      }, 400);
    };

    const moveToPrev = () => {
      if (isTransitioning) return;
      isTransitioning = true; currentIndex--;
      grid.style.transition = 'transform 0.4s ease';
      grid.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      setTimeout(() => {
        if (currentIndex < originalCards.length) {
          grid.style.transition = 'none'; currentIndex = originalCards.length * 2 - 1;
          grid.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
          setTimeout(() => { grid.style.transition = 'transform 0.4s ease'; }, 50);
        }
        isTransitioning = false; updateCenter();
      }, 400);
    };

    let autoScroll: ReturnType<typeof setInterval> | null = setInterval(moveToNext, 2000);
    container.addEventListener('mouseenter', () => { if (autoScroll) { clearInterval(autoScroll); autoScroll = null; } });
    container.addEventListener('mouseleave', () => { if (!autoScroll) autoScroll = setInterval(moveToNext, 2000); });

    // Nav buttons
    const prevBtn = document.querySelector('.poster-nav-prev');
    const nextBtn = document.querySelector('.poster-nav-next');
    const onPrev = () => moveToPrev();
    const onNext = () => moveToNext();
    prevBtn?.addEventListener('click', onPrev);
    nextBtn?.addEventListener('click', onNext);

    // Click to lightbox on poster cards
    const onCardClick = (e: Event) => {
      const card = (e.currentTarget as HTMLElement);
      const title = card.querySelector('.poster-title')?.textContent || 'Poster';
      const img = card.querySelector('.poster-image') as HTMLImageElement | null;
      const src = img?.src || '';
      setLightboxPoster({ src, title });
      if (autoScroll) { clearInterval(autoScroll); autoScroll = null; }
    };
    const allCards = grid.querySelectorAll('.poster-card');
    allCards.forEach(card => card.addEventListener('click', onCardClick));

    return () => {
      if (autoScroll) clearInterval(autoScroll);
      prevBtn?.removeEventListener('click', onPrev);
      nextBtn?.removeEventListener('click', onNext);
      allCards.forEach(card => card.removeEventListener('click', onCardClick));
    };
  }, []);

  // ---- Feedback circles physics (simplified) ----
  useEffect(() => {
    const container = feedbackCirclesRef.current;
    if (!container || feedbackList.length === 0) return;

    // Clear existing circles
    container.innerHTML = '';

    interface CircleData {
      element: HTMLElement;
      feedback: Feedback;
      velocityX: number;
      velocityY: number;
      lastX?: number;
      lastY?: number;
    }
    const circles: CircleData[] = [];
    let draggingCircle: HTMLElement | null = null;
    let dragOffset = { x: 0, y: 0 };

    feedbackList.forEach((fb) => {
      const circle = document.createElement('div');
      circle.className = 'feedback-circle';
      const nameEl = document.createElement('div');
      nameEl.className = 'feedback-circle-name';
      nameEl.textContent = fb.name;
      const msgEl = document.createElement('div');
      msgEl.className = 'feedback-circle-message';
      msgEl.textContent = fb.message;
      circle.appendChild(nameEl);
      circle.appendChild(msgEl);
      circles.push({ element: circle, feedback: fb, velocityX: 0, velocityY: 0 });

      circle.addEventListener('click', () => {
        if (!circle.classList.contains('dragging')) {
          // Show feedback modal
          const modal = document.createElement('div');
          modal.className = 'feedback-modal';
          modal.innerHTML = `<div class="feedback-modal-content"><button class="feedback-modal-close">&times;</button><h3>${fb.name}</h3><p class="feedback-modal-email">${fb.email}</p><p class="feedback-modal-message">${fb.message}</p></div>`;
          document.body.appendChild(modal);
          modal.addEventListener('click', (ev) => {
            if (ev.target === modal || (ev.target as HTMLElement).classList.contains('feedback-modal-close')) modal.remove();
          });
        }
      });

      container.appendChild(circle);
      circle.style.opacity = '0'; circle.style.transform = 'scale(0)';
      setTimeout(() => { circle.style.transition = 'all 0.5s ease'; circle.style.opacity = '1'; circle.style.transform = 'scale(1)'; }, 100);
    });

    // Drag handlers
    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as HTMLElement).closest('.feedback-circle') as HTMLElement | null;
      if (!target) return;
      e.preventDefault();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const rect = target.getBoundingClientRect();
      dragOffset = { x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 };
      draggingCircle = target;
      target.classList.add('dragging');
      target.style.animationPlayState = 'paused';
    };
    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingCircle) return;
      e.preventDefault();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const cRect = container.getBoundingClientRect();
      const dRect = draggingCircle.getBoundingClientRect();
      let newX = clientX - cRect.left - dragOffset.x;
      let newY = clientY - cRect.top - dragOffset.y;
      const r = dRect.width / 2;
      newX = Math.max(r, Math.min(cRect.width - r, newX));
      newY = Math.max(r, Math.min(cRect.height - r, newY));
      draggingCircle.style.left = newX + 'px';
      draggingCircle.style.top = newY + 'px';
      draggingCircle.style.transform = 'none';
    };
    const handleDragEnd = () => {
      if (!draggingCircle) return;
      draggingCircle.classList.remove('dragging');
      const dc = draggingCircle;
      setTimeout(() => { dc.style.animationPlayState = 'running'; }, 1000);
      draggingCircle = null;
    };

    container.addEventListener('mousedown', handleDragStart as EventListener);
    document.addEventListener('mousemove', handleDragMove as EventListener);
    document.addEventListener('mouseup', handleDragEnd);
    container.addEventListener('touchstart', handleDragStart as EventListener, { passive: false });
    document.addEventListener('touchmove', handleDragMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleDragMove as EventListener);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove as EventListener);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [feedbackList]);

  // ---- Accordion handler (via event delegation) ----
  const handleAccordionClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const box = btn.closest('.accordion-box');
    if (!box) return;
    const isActive = box.classList.contains('active');
    document.querySelectorAll('.accordion-box').forEach(b => b.classList.remove('active'));
    if (!isActive) box.classList.add('active');
  }, []);

  // ---- Back to top ----
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ---- Close lightbox ----
  const closeLightbox = () => setLightboxPoster(null);

  // ---- Close menu ----
  const closeMenu = () => setMenuOpen(false);

  // ---- Overlay link click ----
  const handleOverlayLink = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => {
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // ---- ESC key to close menu ----
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        if (lightboxPoster) setLightboxPoster(null);
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [lightboxPoster]);

  return (
    <>
      {/* Page Transition Overlay */}
      <div className="page-transition-overlay"></div>

      {/* Particle Background */}
      <div className="finisher-header"></div>

      {/* Fixed Header */}
      <header className="fixed-header">
        <a href="/" className="header-home-btn" onClick={(e) => handleNavClick(e, '/')}>
          <img src="/assets/common/Home_button.png" alt="Home" />
        </a>
        <button className="burger-menu" id="burgerMenu" onClick={() => setMenuOpen(true)}>
          <span></span><span></span><span></span>
        </button>
      </header>

      {/* Overlay Menu */}
      <div className={`overlay-menu${menuOpen ? ' active' : ''}`} id="overlayMenu">
        <button className="close-overlay" id="closeOverlay" onClick={closeMenu}>&times;</button>
        <nav className="overlay-nav">
          <a href="#profile" className="overlay-link" onClick={(e) => handleOverlayLink(e, '#profile')}>Profile</a>
          <a href="#projects" className="overlay-link" onClick={(e) => handleOverlayLink(e, '#projects')}>Projects</a>
          <a href="#posters" className="overlay-link" onClick={(e) => handleOverlayLink(e, '#posters')}>Posters</a>
          <a href="#contacts" className="overlay-link" onClick={(e) => handleOverlayLink(e, '#contacts')}>Contacts</a>
          <Link to="/resources" className="overlay-link" onClick={closeMenu}>Resources</Link>
        </nav>
      </div>

      {/* Floating Ocean Particles */}
      <div className="content-particles-container">
        {PARTICLE_CLASSES.map((size, i) => (
          <div key={i} className={`content-particle ${size}`}></div>
        ))}
      </div>

      {/* Main Content */}
      <main className="content-page">
        {/* Profile Section */}
        <section id="profile" className="section profile-section">
          <div className="profile-container">
            <div className="profile-header">
              <h2 className="profile-greeting">Hi! I'm</h2>
              <h1 className="profile-name">Sheila Nicole Cheng</h1>
            </div>

            <div className="profile-grid">
              {/* Box 1: Description and Quote */}
              <div className="profile-box box-1">
                <div className="box-content">
                  <p className="description-text">I work across coding, design, and project coordination creating solutions that are both functional and visually refined. Comfortable below the surface, effective above it</p>
                  <p className="quote-text">"Debugging ideas before they become problems."</p>
                </div>
              </div>

              {/* Box 2: Skills Grid */}
              <div className="profile-box box-2">
                <div className="skills-grid">
                  <div className="skill-item">
                    <span className="skill-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg></span>
                    <span className="skill-name">Web Dev</span>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg></span>
                    <span className="skill-name">UI/UX</span>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg></span>
                    <span className="skill-name">Data Analysis</span>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg></span>
                    <span className="skill-name">System Design</span>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span>
                    <span className="skill-name">Visual Design</span>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg></span>
                    <span className="skill-name">Problem Solving</span>
                  </div>
                </div>
              </div>

              {/* Box 3: Resources */}
              <div className="profile-box box-3">
                <div className="box-content-small">
                  <Link to="/resources" className="box-link resources-link">
                    <span className="resource-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></span>
                    <h3 className="box-title">Resources</h3>
                  </Link>
                </div>
              </div>

              {/* Box 4: CV Link */}
              <div className="profile-box box-4">
                <div className="box-content-small cv-box">
                  <a href="/assets/profile/Cheng_CV (1).pdf" target="_blank" rel="noopener noreferrer" className="cv-link">
                    <span className="cv-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></span>
                    <span className="cv-text">Explore my CV</span>
                  </a>
                </div>
              </div>

              {/* Row 3: 4 accordion boxes */}
              <div className="profile-box accordion-box box-5">
                <button className="accordion-header" onClick={handleAccordionClick}>
                  <span className="accordion-title">Web Development</span>
                  <span className="accordion-icon">+</span>
                </button>
                <div className="accordion-content"><p>I build responsive websites using HTML, CSS, and JavaScript, from scratch and with intention.</p></div>
              </div>
              <div className="profile-box accordion-box box-6">
                <button className="accordion-header" onClick={handleAccordionClick}>
                  <span className="accordion-title">UI / UX Design</span>
                  <span className="accordion-icon">+</span>
                </button>
                <div className="accordion-content"><p>I design interfaces that feel smooth, intuitive, and not stressful to look at.</p></div>
              </div>
              <div className="profile-box accordion-box box-7">
                <button className="accordion-header" onClick={handleAccordionClick}>
                  <span className="accordion-title">Python Applications</span>
                  <span className="accordion-icon">+</span>
                </button>
                <div className="accordion-content"><p>I create functional Python systems, from desktop apps to logic-based tools.</p></div>
              </div>
              <div className="profile-box accordion-box box-8">
                <button className="accordion-header" onClick={handleAccordionClick}>
                  <span className="accordion-title">Illustrations</span>
                  <span className="accordion-icon">+</span>
                </button>
                <div className="accordion-content"><p>Very selective. Aquatic approval required.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section projects-section">
          <div className="projects-banner">
            <div className="projects-containers-wrapper">
              <div className="projects-carousel-container">
                <h2 className="projects-section-title">Projects</h2>
                <div className="projects-slider" ref={sliderRef} style={{ '--quantity': 4 } as React.CSSProperties}>
                  {projectList.map((project, i) => (
                    <div key={i} className="project-item" style={{ '--position': i + 1 } as React.CSSProperties}>
                      <div className="project-box" onClick={() => setSelectedProject(i)} style={{ cursor: 'pointer' }}>
                        <div className="project-icon"><img src={project.icon} alt={project.title} /></div>
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">{project.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Poster Gallery */}
              <div className="projects-fourth-container" id="posters">
                <div className="poster-gallery">
                  <h2 className="poster-gallery-title">Posters</h2>
                  <div className="poster-gallery-wrapper">
                    <button className="poster-nav-btn poster-nav-prev" aria-label="Previous posters">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <div className="poster-grid-container" ref={posterContainerRef}>
                      <div className="poster-grid" ref={posterGridRef}>
                        {posterList.map((poster, i) => (
                          <div key={i} className="poster-card" data-poster={i + 1}>
                            <div className="poster-thumbnail">
                              <img src={poster.src} alt={poster.alt} className="poster-image" />
                            </div>
                            <p className="poster-title">{poster.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="poster-nav-btn poster-nav-next" aria-label="Next posters">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Detail View */}
              <div className="projects-second-container">
                <div className="project-detail-view" id="projectDetailView">
                  {selectedProject !== null ? (
                    <div className="project-detail-content">
                      <div className="detail-icon"><img src={projectList[selectedProject].icon} alt={projectList[selectedProject].title} /></div>
                      <h2 className="detail-title">{projectList[selectedProject].title}</h2>
                      <p className="detail-description">{projectList[selectedProject].fullDescription}</p>
                      <div className="detail-tech">
                        {projectList[selectedProject].tech.map((t, i) => <span key={i} className="tech-badge">{t}</span>)}
                      </div>
                      <div className="detail-features">
                        <h3>Key Features:</h3>
                        <ul className="detail-features-list">
                          {projectList[selectedProject].features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="project-detail-placeholder"><p>Click a project to view details</p></div>
                  )}
                </div>
              </div>

              {/* Contact Links Container */}
              <div className="projects-contact-links-container">
                <div className="contact-links-content">
                  <h3 className="contact-links-title">Send a message, I don't bite.</h3>
                  <div className="contact-links-grid">
                    <a href="https://www.linkedin.com/in/sheila-nicole-cheng-35982b327/" target="_blank" rel="noopener noreferrer" className="contact-link-card" title="LinkedIn">
                      <div className="contact-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </div>
                    </a>
                    <a href="https://github.com/sheilacheng04" target="_blank" rel="noopener noreferrer" className="contact-link-card" title="GitHub">
                      <div className="contact-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      </div>
                    </a>
                    <a href="mailto:sheilanicoledizon@gmail.com" className="contact-link-card" title="Email">
                      <div className="contact-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                    </a>
                  </div>

                  {/* Color Theme Picker */}
                  <div className="theme-picker-container">
                    <label className="theme-picker-label">Customize Colors</label>
                    <div className="theme-picker-wrapper">
                      <input
                        type="range" min="0" max="360" value={themeHue}
                        className="theme-color-slider" id="themeColorSlider"
                        onChange={(e) => setThemeHue(parseInt(e.target.value))}
                      />
                      <div className="theme-preview-circle" id="themePreview" style={themePreviewStyle}></div>
                    </div>
                    <span className="theme-picker-hint">Slide to change the aquatic hue</span>
                    <button
                      className="theme-reset-btn" id="resetThemeBtn" type="button"
                      aria-label="Reset to default color"
                      onClick={() => { setThemeHue(200); localStorage.setItem('themeHue', '200'); }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Third container - Aquarium + Contacts */}
            <div className="projects-third-container">
              <div className="feedback-aquarium">
                <div className="glass-seam-left"></div>
                <div className="glass-seam-right"></div>
                <div className="glass-seam-bottom-left"></div>
                <div className="glass-seam-bottom-right"></div>
                <div className="glass-seam-bottom-center"></div>
                <div className="feedback-circles-container" ref={feedbackCirclesRef}></div>
              </div>

              <div className="projects-contacts-container" id="contacts">
                <form className="feedback-form" onSubmit={handleSubmitFeedback}>
                  <h3 className="feedback-title">Leave a thought. Watch it float.</h3>
                  <input type="text" placeholder="Your Name" className="form-input" value={formName} onChange={e => setFormName(e.target.value)} required />
                  <input type="email" placeholder="Your Email" className="form-input" value={formEmail} onChange={e => setFormEmail(e.target.value)} required />
                  <textarea placeholder="Your Message" className="form-textarea" rows={4} value={formMessage} onChange={e => setFormMessage(e.target.value)} required></textarea>
                  <button type="submit" className="form-submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Message'}</button>
                  {successMessage && <div className="success-message">{successMessage}</div>}
                  {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Top Button */}
        <div className="back-to-top-container">
          <button className="back-to-top" id="backToTop" aria-label="Back to top" onClick={scrollToTop}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
            <span>To the Top</span>
          </button>
        </div>

        {/* Credits Footer */}
        <footer className="credits-footer">
          <div className="credits-content">
            <p className="credits-text">Designed &amp; Developed by <span className="credits-name">Sheila Nicole Cheng</span></p>
            <p className="credits-tagline">No fishes were harmed in the making of this aquarium.</p>
            <p className="credits-year">&copy; 2026</p>
          </div>
        </footer>
      </main>

      {/* Poster Lightbox Modal */}
      {lightboxPoster && (
        <div className="poster-lightbox" onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}>
          <div className="poster-lightbox-content">
            <button className="poster-lightbox-close" onClick={closeLightbox}>&times;</button>
            <div className="poster-lightbox-image-container">
              <img src={lightboxPoster.src} alt={lightboxPoster.title} className="poster-lightbox-image" />
            </div>
            <div className="poster-lightbox-info">
              <h3 className="poster-lightbox-title">{lightboxPoster.title}</h3>
              <p className="poster-lightbox-description">{posterCaptions[lightboxPoster.title] || 'A creative poster design.'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
