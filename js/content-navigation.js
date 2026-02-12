// Content page navigation and menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burgerMenu');
    const overlayMenu = document.getElementById('overlayMenu');
    const closeOverlay = document.getElementById('closeOverlay');
    const overlayLinks = document.querySelectorAll('.overlay-link');

    // Open overlay menu
    burgerMenu.addEventListener('click', () => {
        overlayMenu.classList.add('active');
    });

    // Close overlay menu
    closeOverlay.addEventListener('click', () => {
        overlayMenu.classList.remove('active');
    });

    // Close menu when clicking a link
    overlayLinks.forEach(link => {
        link.addEventListener('click', () => {
            overlayMenu.classList.remove('active');
        });
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlayMenu.classList.contains('active')) {
            overlayMenu.classList.remove('active');
        }
    });

    // Handle hash navigation from home page
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    // Initialize ripple effect on overlay menu
    try {
        $(overlayMenu).ripples({
            resolution: 256,
            dropRadius: 20,
            perturbance: 0.1,
        });
    } catch(e) {
        console.error('Menu ripple effect error:', e);
    }
});
