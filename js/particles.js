// Floating particles effect - like particles in water
class WaterParticles {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 50;
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        // Create particles container
        this.particlesContainer = document.createElement('div');
        this.particlesContainer.className = 'particles-container';
        this.container.insertBefore(this.particlesContainer, this.container.firstChild);

        // Create individual particles
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }

        // Add mouse tracking
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouseX = ((e.clientX - rect.left) / rect.width) * 100;
            this.mouseY = ((e.clientY - rect.top) / rect.height) * 100;
            this.updateParticles();
        });
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'water-particle';
        
        // Random initial position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size between 2-8px
        const size = Math.random() * 6 + 2;
        
        // Random animation duration (slower = more water-like)
        const duration = Math.random() * 20 + 15; // 15-35 seconds
        
        // Random delay for staggered effect
        const delay = Math.random() * 10;
        
        // Random blur amount
        const blur = Math.random() * 3 + 2; // 2-5px blur
        
        // Random opacity
        const opacity = Math.random() * 0.44 + 0.28; // 0.28-0.72
        
        // Set styles
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.filter = `blur(${blur}px)`;
        particle.style.opacity = opacity;
        particle.style.transition = 'transform 0.2s ease-out';
        
        // Store initial position
        particle.dataset.baseX = x;
        particle.dataset.baseY = y;
        
        this.particlesContainer.appendChild(particle);
        this.particles.push(particle);
    }

    updateParticles() {
        this.particles.forEach(particle => {
            const baseX = parseFloat(particle.dataset.baseX);
            const baseY = parseFloat(particle.dataset.baseY);
            
            // Calculate distance to mouse
            const dx = this.mouseX - baseX;
            const dy = this.mouseY - baseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // More noticeable attraction effect (within 50% range)
            if (distance < 50) {
                const force = (50 - distance) / 50; // 0 to 1
                const moveX = (dx * force * 0.4); // Move 40% of the way
                const moveY = (dy * force * 0.4);
                
                particle.style.transform = `translate(${moveX}%, ${moveY}%)`;
            } else {
                particle.style.transform = 'translate(0, 0)';
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.querySelector('.home-page');
    if (homePage) {
        new WaterParticles(homePage);
    }
});
