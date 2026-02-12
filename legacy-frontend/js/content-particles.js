// Initialize particles and finisher-header for content page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Finisher Header particles
    new FinisherHeader({
        count: 30,
        size: {
            min: 2,
            max: 8,
            pulse: 0.5
        },
        speed: {
            x: {
                min: 0.1,
                max: 0.4
            },
            y: {
                min: 0.1,
                max: 0.4
            }
        },
        colors: {
            background: 'transparent',
            particles: [
                '#64b4dc',
                '#3a8ab8',
                '#4e96c8',
                '#5aa4d0',
                '#ffffff'
            ]
        },
        blending: 'overlay',
        opacity: {
            center: 0.6,
            edge: 0.3
        },
        skew: -2,
        shapes: ['c']
    });

    // Initialize water particles for content page
    const contentPage = document.querySelector('.content-page');
    if (contentPage && typeof WaterParticles !== 'undefined') {
        new WaterParticles(contentPage);
    }
});
