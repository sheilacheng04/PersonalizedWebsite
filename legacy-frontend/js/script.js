// Portfolio functionality

// Smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Get transition overlay
    const overlay = document.querySelector('.page-transition-overlay');
    
    // Intercept all navigation links
    const navLinks = document.querySelectorAll('a[href]:not([target="_blank"])');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's a same-page anchor or external link
            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            // Prevent default navigation
            e.preventDefault();
            
            // Activate transition overlay
            if (overlay) {
                overlay.classList.add('active');
            }
            
            // Navigate after transition
            setTimeout(() => {
                window.location.href = href;
            }, 600); // Match CSS transition duration
        });
    });
    
    // Remove overlay on page load
    if (overlay) {
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 100);
    }
});

// Projects page navigation
let currentPage = 1;
const totalPages = 3;

const pageImages = {
    1: { left: '../assets/projects/Page1-Left.png', right: '../assets/projects/Page1-Right.png', leftClick: 1, rightClick: 2 },
    2: { left: '../assets/projects/Page2-Left.png', right: '../assets/projects/Page2-Right.png', leftClick: 1, rightClick: 3 },
    3: { left: '../assets/projects/Page3-Left.png', right: '../assets/projects/Page3-Right.png', leftClick: 2, rightClick: 3 }
};

function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return;
    
    currentPage = pageNumber;
    const leftImg = document.getElementById('leftPageImg');
    const rightImg = document.getElementById('rightPageImg');
    const leftItem = document.querySelector('.project-item-left');
    const rightItem = document.querySelector('.project-item-right');
    
    if (leftImg && rightImg && leftItem && rightItem) {
        leftImg.src = pageImages[pageNumber].left;
        rightImg.src = pageImages[pageNumber].right;
        leftImg.alt = `Left Page ${pageNumber}`;
        rightImg.alt = `Right Page ${pageNumber}`;
        
        // Update click handlers
        leftItem.setAttribute('onclick', `goToPage(${pageImages[pageNumber].leftClick})`);
        rightItem.setAttribute('onclick', `goToPage(${pageImages[pageNumber].rightClick})`);
    }
}

// Zoom functionality
let currentZoom = 1;

function zoomImage(imageSrc) {
    const modal = document.getElementById('zoomModal');
    const modalImg = document.getElementById('zoomedImage');
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    currentZoom = 1;
    modalImg.style.transform = `translate(-50%, -50%) scale(${currentZoom})`;
    
    // Add scroll wheel zoom
    modal.addEventListener('wheel', handleZoomScroll);
}

function closeZoom() {
    const modal = document.getElementById('zoomModal');
    modal.removeEventListener('wheel', handleZoomScroll);
    modal.style.display = 'none';
    currentZoom = 1;
}

function handleZoomScroll(e) {
    e.preventDefault();
    const modalImg = document.getElementById('zoomedImage');
    const zoomSpeed = 0.1;
    
    if (e.deltaY < 0) {
        // Scroll up - zoom in
        currentZoom += zoomSpeed;
    } else {
        // Scroll down - zoom out
        currentZoom = Math.max(1, currentZoom - zoomSpeed);
    }
    
    // Limit zoom
    currentZoom = Math.min(currentZoom, 5);
    
    modalImg.style.transform = `translate(-50%, -50%) scale(${currentZoom})`;
}

// Water header particles (FinisherHeader)
document.addEventListener('DOMContentLoaded', () => {
    const headerEl = document.querySelector('.finisher-header');
    if (headerEl && window.FinisherHeader) {
        new FinisherHeader({
            count: 26,
            size: { min: 7, max: 140, pulse: 0.08 },
            speed: {
                x: { min: 0, max: 0.1 },
                y: { min: 0, max: 0.2 }
            },
            colors: {
                background: 'transparent',
                particles: ['#0f2d5c', '#143874', '#e96b34', '#f7fbff']
            },
            blending: 'screen',
            opacity: { center: 0.08, edge: 0.42 },
            skew: -5,
            shapes: ['c']
        });
    }
});
