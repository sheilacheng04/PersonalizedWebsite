// Advanced scroll-driven animations for content page
document.addEventListener('DOMContentLoaded', () => {
    initAdvancedScrollAnimations();
});

function initAdvancedScrollAnimations() {
    // Detect device capabilities
    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Skip complex animations if user prefers reduced motion
    if (prefersReducedMotion) {
        document.body.classList.add('reduce-motion');
        return;
    }
    
    // Get all animatable containers and elements
    const containers = {
        profileBoxes: document.querySelectorAll('.profile-box'),
        carouselContainer: document.querySelector('.projects-carousel-container'),
        contactLinks: document.querySelector('.projects-contact-links-container'),
        thirdContainer: document.querySelector('.projects-third-container'),
        feedbackAquarium: document.querySelector('.feedback-aquarium'),
        contactsContainer: document.querySelector('.projects-contacts-container'),
        posterGallery: document.querySelector('.poster-gallery'),
        sectionTitles: document.querySelectorAll('.section-title'),
        projectCards: document.querySelectorAll('.project-card'),
        contactIcons: document.querySelectorAll('.projects-contact-icon'),
        feedbackCircles: document.querySelectorAll('.feedback-circle')
    };
    
    // Animation configurations for different container types
    const animationConfigs = {
        'profile-box': {
            animation: 'fadeInScale',
            duration: 800,
            stagger: 150,
            threshold: 0.2
        },
        'carousel': {
            animation: 'slideInFromRight',
            duration: 1000,
            threshold: 0.15
        },
        'contact-links': {
            animation: 'fadeInUp',
            duration: 900,
            threshold: 0.2
        },
        'feedback-aquarium': {
            animation: 'fadeInScaleRotate',
            duration: 1200,
            threshold: 0.1
        },
        'contacts': {
            animation: 'slideInFromLeft',
            duration: 900,
            threshold: 0.2
        },
        'poster-gallery': {
            animation: 'fadeInUp',
            duration: 1000,
            threshold: 0.1
        },
        'title': {
            animation: 'slideInFromLeft',
            duration: 700,
            threshold: 0.5
        }
    };
    
    // Create Intersection Observer with optimized settings
    const observerOptions = {
        root: null,
        rootMargin: isMobile ? '-10% 0px -10% 0px' : '-15% 0px -15% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.5]
    };
    
    // Main observer for container animations
    const containerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const target = entry.target;
            const animationType = target.dataset.animationType;
            const config = animationConfigs[animationType] || {};
            
            if (entry.isIntersecting && entry.intersectionRatio >= (config.threshold || 0.2)) {
                // Add animation class based on type
                if (!target.classList.contains('animated')) {
                    animateElement(target, config);
                    target.classList.add('animated');
                }
            }
        });
    }, observerOptions);
    
    // Staggered animation observer for child elements
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target;
                const children = parent.querySelectorAll('[data-stagger]');
                
                children.forEach((child, index) => {
                    const staggerDelay = parseInt(child.dataset.stagger) || 100;
                    setTimeout(() => {
                        child.classList.add('stagger-visible');
                    }, index * staggerDelay);
                });
                
                staggerObserver.unobserve(parent);
            }
        });
    }, { threshold: 0.2 });
    
    // Apply animation data attributes and observe elements
    
    // Profile boxes with stagger
    containers.profileBoxes.forEach((box, index) => {
        box.dataset.animationType = 'profile-box';
        box.dataset.staggerIndex = index;
        box.style.opacity = '0';
        box.style.transform = 'scale(0.8) translateY(40px)';
        containerObserver.observe(box);
    });
    
    // Carousel container
    if (containers.carouselContainer) {
        containers.carouselContainer.dataset.animationType = 'carousel';
        containers.carouselContainer.style.opacity = '0';
        containers.carouselContainer.style.transform = 'translateX(100px)';
        containerObserver.observe(containers.carouselContainer);
    }
    
    // Contact links container
    if (containers.contactLinks) {
        containers.contactLinks.dataset.animationType = 'contact-links';
        containers.contactLinks.style.opacity = '0';
        containers.contactLinks.style.transform = 'translateY(50px)';
        containerObserver.observe(containers.contactLinks);
    }
    
    // Feedback aquarium with special effect
    if (containers.feedbackAquarium) {
        containers.feedbackAquarium.dataset.animationType = 'feedback-aquarium';
        containers.feedbackAquarium.style.opacity = '0';
        containers.feedbackAquarium.style.transform = 'scale(0.85) rotateX(10deg)';
        containerObserver.observe(containers.feedbackAquarium);
    }
    
    // Contacts container
    if (containers.contactsContainer) {
        containers.contactsContainer.dataset.animationType = 'contacts';
        containers.contactsContainer.style.opacity = '0';
        containers.contactsContainer.style.transform = 'translateX(-80px)';
        containerObserver.observe(containers.contactsContainer);
    }
    
    // Poster gallery
    if (containers.posterGallery) {
        containers.posterGallery.dataset.animationType = 'poster-gallery';
        containers.posterGallery.style.opacity = '0';
        containers.posterGallery.style.transform = 'translateY(60px)';
        containerObserver.observe(containers.posterGallery);
    }
    
    // Section titles
    containers.sectionTitles.forEach(title => {
        if (!title.closest('.profile-section')) {
            title.dataset.animationType = 'title';
            title.style.opacity = '0';
            title.style.transform = 'translateX(-60px)';
            containerObserver.observe(title);
        }
    });
    
    // Setup stagger animations for child elements
    if (containers.contactLinks) {
        const icons = containers.contactLinks.querySelectorAll('.projects-contact-icon');
        icons.forEach((icon, index) => {
            icon.dataset.stagger = '120';
            icon.classList.add('stagger-item');
        });
        if (icons.length > 0) {
            containers.contactLinks.dataset.hasStagger = 'true';
            staggerObserver.observe(containers.contactLinks);
        }
    }
    
    // Feedback circles stagger
    if (containers.feedbackAquarium) {
        setTimeout(() => {
            const circles = document.querySelectorAll('.feedback-circle');
            circles.forEach((circle, index) => {
                circle.dataset.stagger = '80';
                circle.classList.add('stagger-item');
            });
            if (circles.length > 0) {
                containers.feedbackAquarium.dataset.hasStagger = 'true';
                staggerObserver.observe(containers.feedbackAquarium);
            }
        }, 500);
    }
    
    // Animation execution function
    function animateElement(element, config) {
        const duration = config.duration || 800;
        const animation = config.animation || 'fadeInUp';
        const staggerDelay = config.stagger || 0;
        const staggerIndex = parseInt(element.dataset.staggerIndex) || 0;
        
        // Apply stagger delay for grouped elements
        const totalDelay = staggerIndex * staggerDelay;
        
        setTimeout(() => {
            element.style.transition = `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
            
            switch(animation) {
                case 'fadeInScale':
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1) translateY(0)';
                    break;
                    
                case 'slideInFromRight':
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                    break;
                    
                case 'slideInFromLeft':
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                    break;
                    
                case 'fadeInUp':
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    break;
                    
                case 'fadeInScaleRotate':
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1) rotateX(0deg)';
                    element.style.transformStyle = 'preserve-3d';
                    break;
                    
                default:
                    element.style.opacity = '1';
                    element.style.transform = 'none';
            }
            
            // Add bounce effect on completion
            setTimeout(() => {
                element.style.transition = `transform 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
            }, duration);
            
        }, totalDelay);
    }
    
    // Parallax effect for larger containers on scroll (desktop only)
    if (!isMobile) {
        let ticking = false;
        
        function applyParallax() {
            const scrolled = window.pageYOffset;
            
            if (containers.carouselContainer && containers.carouselContainer.classList.contains('animated')) {
                const carouselTop = containers.carouselContainer.getBoundingClientRect().top;
                const carouselOffset = -(carouselTop / 15);
                containers.carouselContainer.style.transform = `translateY(${carouselOffset}px) translateX(0)`;
            }
            
            ticking = false;
        }
        
        function requestParallaxTick() {
            if (!ticking) {
                requestAnimationFrame(applyParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestParallaxTick, { passive: true });
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        containerObserver.disconnect();
        staggerObserver.disconnect();
    });
}
