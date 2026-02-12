// Water ripple effect for home page (optimized)
$(document).ready(function() {
    const homePage = $('.home-page');
    const titleFull = $('.title-full');
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (homePage.length) {
        try {
            homePage.ripples({
                resolution: isMobile ? 128 : 256,
                dropRadius: isMobile ? 15 : 18,
                perturbance: 0.025,
                interactive: true
            });
        } catch(e) {
            console.error('Ripple effect error:', e);
        }
    }
    
    if (titleFull.length) {
        try {
            titleFull.ripples({
                resolution: isMobile ? 64 : 128,
                dropRadius: isMobile ? 10 : 12,
                perturbance: 0.03,
                interactive: true
            });
        } catch(e) {
            console.error('Title ripple effect error:', e);
        }
    }
});
