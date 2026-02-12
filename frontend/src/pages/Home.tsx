import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/base.css';
import '../styles/home.css';

declare global {
  interface Window {
    FinisherHeader: any;
    $: any;
    jQuery: any;
  }
}

export default function Home() {
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string, hash?: string) => {
    e.preventDefault();
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) overlay.classList.add('active');
    setTimeout(() => {
      navigate(path + (hash || ''));
    }, 600);
  };

  useEffect(() => {
    // Remove transition overlay on mount
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
      setTimeout(() => overlay.classList.remove('active'), 100);
    }

    // ---- Custom Cursor ----
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.display = 'block';
    document.body.appendChild(cursor);

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };
    document.addEventListener('mousemove', onMouseMove);

    const addInteractiveListeners = () => {
      const els = document.querySelectorAll('a, button, .btn-circle, .poster-item, .project-item, input[type="checkbox"]');
      els.forEach(el => {
        if ((el as any).__cursorBound) return;
        (el as any).__cursorBound = true;
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
    };
    addInteractiveListeners();
    let mutDebounce: ReturnType<typeof setTimeout> | null = null;
    const mutObserver = new MutationObserver(() => {
      if (mutDebounce) return;
      mutDebounce = setTimeout(() => { mutDebounce = null; addInteractiveListeners(); }, 300);
    });
    mutObserver.observe(document.body, { childList: true, subtree: true });

    const onMouseDown = () => cursor.classList.add('grab');
    const onMouseUp = () => cursor.classList.remove('grab');
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    const onDocLeave = () => { cursor.style.opacity = '0'; };
    const onDocEnter = () => { cursor.style.opacity = '1'; };
    document.addEventListener('mouseleave', onDocLeave);
    document.addEventListener('mouseenter', onDocEnter);

    // ---- Water Particles ----
    const homePage = document.querySelector('.home-page');
    if (homePage) {
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'particles-container';
      homePage.insertBefore(particlesContainer, homePage.firstChild);

      const particles: HTMLDivElement[] = [];
      let mouseX = 0, mouseY = 0;

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'water-particle';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 6 + 2;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 10;
        const blur = Math.random() * 3 + 2;
        const opacity = Math.random() * 0.44 + 0.28;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.filter = `blur(${blur}px)`;
        particle.style.opacity = String(opacity);
        particle.style.transition = 'transform 0.2s ease-out';
        particle.dataset.baseX = String(x);
        particle.dataset.baseY = String(y);
        particlesContainer.appendChild(particle);
        particles.push(particle);
      }

      const onParticleMouseMove = (e: MouseEvent) => {
        const rect = homePage.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        if (!particleNeedsUpdate) { particleNeedsUpdate = true; requestAnimationFrame(updateParticles); }
      };
      let particleNeedsUpdate = false;
      const updateParticles = () => {
        particles.forEach(p => {
          const baseX = parseFloat(p.dataset.baseX || '0');
          const baseY = parseFloat(p.dataset.baseY || '0');
          const dx = mouseX - baseX;
          const dy = mouseY - baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 50) {
            const force = (50 - distance) / 50;
            p.style.transform = `translate(${dx * force * 0.4}%, ${dy * force * 0.4}%)`;
          } else {
            p.style.transform = 'translate(0, 0)';
          }
        });
        particleNeedsUpdate = false;
      };
      homePage.addEventListener('mousemove', onParticleMouseMove as EventListener);
    }

    // ---- jQuery Ripple Effect ----
    const initRipple = () => {
      const $ = window.$ || window.jQuery;
      if ($ && $.fn.ripples) {
        const hp = $('.home-page');
        const tf = $('.title-full');
        const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (hp.length) {
          try {
            hp.ripples({ resolution: isMobile ? 128 : 256, dropRadius: isMobile ? 15 : 18, perturbance: 0.025, interactive: true });
          } catch (e) { console.error('Ripple error:', e); }
        }
        if (tf.length) {
          try {
            tf.ripples({ resolution: isMobile ? 64 : 128, dropRadius: isMobile ? 10 : 12, perturbance: 0.03, interactive: true });
          } catch (e) { console.error('Title ripple error:', e); }
        }
      }
    };
    const rippleTimer = setInterval(() => {
      if (window.$ || window.jQuery) { clearInterval(rippleTimer); initRipple(); }
    }, 200);
    setTimeout(() => clearInterval(rippleTimer), 5000);

    // Cleanup
    return () => {
      cursor.remove();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onDocLeave);
      document.removeEventListener('mouseenter', onDocEnter);
      mutObserver.disconnect();
      clearInterval(rippleTimer);
      // Destroy ripples
      try {
        const $ = window.$ || window.jQuery;
        if ($ && $.fn.ripples) {
          $('.home-page').ripples('destroy');
          $('.title-full').ripples('destroy');
        }
      } catch (_) { /* ignore */ }
    };
  }, []);

  return (
    <>
      {/* Page Transition Overlay */}
      <div className="page-transition-overlay"></div>

      <div className="home-page">
        <div className="ellipse-design">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="circle circle-4"></div>
          <div className="circle circle-5"></div>
          <div className="circle circle-6"></div>
          <div className="circle circle-7"></div>
          <div className="circle circle-8"></div>
          <div className="circle circle-9"></div>
        </div>

        {/* Header Elements */}
        <div className="home-button">
          <img src="/assets/common/Home_button.png" alt="Home" />
        </div>

        <a href="https://www.linkedin.com/in/sheila-nicole-cheng-35982b327/" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
          <img src="/assets/common/Linkedln.png" alt="LinkedIn" />
        </a>

        <a href="mailto:sheilanicoledizon@gmail.com" className="email-icon">
          <img src="/assets/common/Email.png" alt="Email" />
        </a>

        {/* Main Title */}
        <div className="title-container">
          <div className="title-short">
            <h1 className="title-text">S.CHENG</h1>
          </div>
          <div className="title-full">
            <img src="/assets/home/SheilaNicoleCheng.png" alt="Sheila Nicole Cheng" />
          </div>
        </div>

        {/* Button Circles */}
        <a href="/content#posters" className="btn-circle posters-btn" onClick={(e) => handleNavClick(e, '/content', '#posters')}>
          <span className="btn-title">Posters</span>
          <span className="btn-description">Vibrant graphics &amp; eye-catching designs</span>
        </a>
        <a href="/content#contacts" className="btn-circle contacts-btn" onClick={(e) => handleNavClick(e, '/content', '#contacts')}>
          <span className="btn-title">Contacts</span>
          <span className="btn-description">Reach out &amp; let's create something amazing</span>
        </a>
        <a href="/content#projects" className="btn-circle projects-btn" onClick={(e) => handleNavClick(e, '/content', '#projects')}>
          <span className="btn-title">Projects</span>
          <span className="btn-description">Explore my creative journey &amp; portfolio</span>
        </a>
        <a href="/content#profile" className="btn-circle profile-btn" onClick={(e) => handleNavClick(e, '/content', '#profile')}>
          <span className="btn-title">Profile</span>
          <span className="btn-description">Get to know me &amp; what I'm all about</span>
        </a>
      </div>
    </>
  );
}
