import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/base.css';
import '../styles/resources.css';

export default function Resources() {
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) overlay.classList.add('active');
    setTimeout(() => navigate(path), 600);
  };

  useEffect(() => {
    // Remove transition overlay
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) setTimeout(() => overlay.classList.remove('active'), 100);

    // ---- Custom Cursor ----
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.display = 'block';
    document.body.appendChild(cursor);
    const onMouseMove = (e: MouseEvent) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; };
    document.addEventListener('mousemove', onMouseMove);
    document.querySelectorAll('a, button, .resource-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    const onDown = () => cursor.classList.add('grab');
    const onUp = () => cursor.classList.remove('grab');
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    const onLeave = () => { cursor.style.opacity = '0'; };
    const onEnter = () => { cursor.style.opacity = '1'; };
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // ---- Theme color from localStorage ----
    const savedHue = localStorage.getItem('themeHue');
    if (savedHue) {
      const hue = parseInt(savedHue);
      if (hue !== 200) {
        const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
          let r: number, g: number, b: number;
          if (s === 0) { r = g = b = l; } else {
            const hue2rgb = (p: number, q: number, t: number) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t; if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p; };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
          }
          return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        };
        const root = document.documentElement;
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

    return () => {
      cursor.remove();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <>
      {/* Page Transition Overlay */}
      <div className="page-transition-overlay"></div>

      {/* Resources Page Content */}
      <div className="resources-page">
        <div className="resources-container">
          <h1 className="resources-title">Resources</h1>
          <p className="resources-subtitle">Tools and technologies used to create this portfolio</p>

          <div className="resources-grid">
            {/* Development Tools */}
            <div className="resource-category">
              <h2 className="category-title">Development</h2>
              <div className="resource-list">
                <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer" className="resource-item">
                  <div className="resource-icon">🖥️</div>
                  <div className="resource-info">
                    <h3>Vue.js 3</h3>
                    <p>Progressive JavaScript Framework</p>
                  </div>
                </a>
                <a href="https://unpkg.com/" target="_blank" rel="noopener noreferrer" className="resource-item">
                  <div className="resource-icon">📦</div>
                  <div className="resource-info">
                    <h3>unpkg</h3>
                    <p>Fast, global CDN for npm packages</p>
                  </div>
                </a>
                <a href="https://www.w3schools.com/" target="_blank" rel="noopener noreferrer" className="resource-item">
                  <div className="resource-icon">📚</div>
                  <div className="resource-info">
                    <h3>W3Schools</h3>
                    <p>Web development tutorials and reference</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Design Tools */}
            <div className="resource-category">
              <h2 className="category-title">Design</h2>
              <div className="resource-list">
                <a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer" className="resource-item">
                  <div className="resource-icon">🎨</div>
                  <div className="resource-info">
                    <h3>Canva</h3>
                    <p>Graphic design and visual content</p>
                  </div>
                </a>
                <a href="https://www.figma.com/" target="_blank" rel="noopener noreferrer" className="resource-item">
                  <div className="resource-icon">🎯</div>
                  <div className="resource-info">
                    <h3>Figma</h3>
                    <p>UI/UX design and prototyping</p>
                  </div>
                </a>
              </div>
            </div>

            {/* AI Assistance */}
            <div className="resource-category">
              <h2 className="category-title">AI Assistance</h2>
              <div className="resource-list">
                <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="resource-item">
                  <div className="resource-icon">🤖</div>
                  <div className="resource-info">
                    <h3>GitHub Copilot</h3>
                    <p>AI-powered code completion</p>
                  </div>
                </a>
                <a href="https://chatgpt.com/share/695a0bcc-5944-8013-963b-66208e119a84" target="_blank" rel="noopener noreferrer" className="resource-item">
                  <div className="resource-icon">💬</div>
                  <div className="resource-info">
                    <h3>ChatGPT</h3>
                    <p>AI assistant for problem solving</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Media & Assets */}
            <div className="resource-category">
              <h2 className="category-title">Media &amp; Assets</h2>
              <div className="resource-list">
                <a href="https://ph.pinterest.com/" target="_blank" rel="noopener noreferrer" className="resource-item">
                  <div className="resource-icon">🖼️</div>
                  <div className="resource-info">
                    <h3>Images &amp; Decorative Elements</h3>
                    <p>Visual assets and graphics</p>
                  </div>
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="resource-item">
                  <div className="resource-icon">🎬</div>
                  <div className="resource-info">
                    <h3>Video</h3>
                    <p>Video content and animations</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <a href="/" className="back-home-btn" onClick={(e) => handleNavClick(e, '/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </>
  );
}
