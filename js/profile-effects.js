// Profile section effects - particles and draggable fish
document.addEventListener('DOMContentLoaded', () => {
    const profileSection = document.querySelector('.profile-section');
    
    if (!profileSection) return;

    // Initialize particles for profile section only
    initProfileParticles();
    
    // Make fish draggable
    initDraggableFish();
    
    // Initialize scroll-triggered animations
    // initScrollAnimations();
});

function initProfileParticles() {
    const container = document.querySelector('.profile-particles-container');
    if (!container) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'profile-particle';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 9 + 3;
        
        // Random animation duration
        const duration = Math.random() * 12 + 8;
        
        // Random delay
        const delay = Math.random() * 10;
        
        // Random blur
        const blur = Math.random() * 3 + 2;
        
        // Random opacity
        const opacity = Math.random() * 0.44 + 0.28;
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.filter = `blur(${blur}px)`;
        particle.style.opacity = opacity;
        
        container.appendChild(particle);
    }
}

function initDraggableFish() {
    const fishes = document.querySelectorAll('.profile-section .fish');
    
    fishes.forEach(fish => {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        fish.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = fish.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            fish.style.cursor = 'grabbing';
            fish.style.transition = 'none';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            fish.style.left = (initialX + deltaX) + 'px';
            fish.style.top = (initialY + deltaY) + 'px';
            fish.style.right = 'auto';
            fish.style.bottom = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                fish.style.cursor = 'move';
                fish.style.transition = 'transform 0.3s ease';
            }
        });
    });
}

function initScrollAnimations() {
    const profilePicture = document.querySelector('.profile-picture-scroll');
    if (!profilePicture) return;
    
    function updatePictureScroll() {
        const rect = profilePicture.getBoundingClientRect();
        const elementHeight = profilePicture.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate how far down the element is in the viewport
        // Starts animating when element is near the bottom of viewport
        const distanceFromBottom = windowHeight - rect.top;
        const triggerPoint = windowHeight * 0.3; // Start animation when 30% from bottom
        
        if (distanceFromBottom > triggerPoint) {
            // Calculate progress from 0 to 1
            const progress = Math.min((distanceFromBottom - triggerPoint) / (windowHeight * 0.5), 1);
            
            profilePicture.style.opacity = progress;
            profilePicture.style.transform = `translateY(${(1 - progress) * 50}px)`;
        }
    }
    
    window.addEventListener('scroll', updatePictureScroll, { passive: true });
    updatePictureScroll(); // Call once on load
}
