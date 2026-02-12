// Projects Carousel Interactive Controls
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.projects-slider');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (!slider || projectItems.length === 0) return;
    
    let currentRotation = 0;
    let isManualControl = false;
    let isPaused = false;
    let resumeTimer = null;
    let animationFrameId = null;
    let lastTimestamp = null;
    const rotationSpeed = 360 / 25000; // degrees per millisecond (360 degrees over 25 seconds)
    const stepAngle = 360 / projectItems.length; // Angle between each project
    
    // Stop CSS animation and switch to manual control
    function pauseAnimation() {
        slider.style.animation = 'none';
        isManualControl = true;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
    
    // Permanently pause carousel
    function stopCarousel() {
        isPaused = true;
        pauseAnimation();
        clearTimeout(resumeTimer);
    }
    
    // Resume carousel
    function startCarousel() {
        isPaused = false;
        isManualControl = false;
        lastTimestamp = performance.now();
        animateRotation();
    }
    
    // Resume automatic rotation after delay - continues from current position
    function resumeAnimation() {
        if (isPaused) return;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
            isManualControl = false;
            lastTimestamp = performance.now();
            animateRotation();
        }, 2000); // Resume after 2 seconds of no input
    }
    
    // Continuously rotate the carousel
    function animateRotation() {
        if (isManualControl || isPaused) return;
        
        const now = performance.now();
        const delta = now - lastTimestamp;
        lastTimestamp = now;
        
        currentRotation += delta * rotationSpeed;
        slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`;
        
        animationFrameId = requestAnimationFrame(animateRotation);
    }
    
    // Start the initial animation
    lastTimestamp = performance.now();
    animateRotation();
    
    // Navigate to next project
    function nextProject() {
        pauseAnimation();
        currentRotation += stepAngle;
        slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`;
        resumeAnimation();
    }
    
    // Navigate to previous project
    function prevProject() {
        pauseAnimation();
        currentRotation -= stepAngle;
        slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`;
        resumeAnimation();
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevProject();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextProject();
        }
    });
    
    // Mouse drag controls
    let isDragging = false;
    let startX = 0;
    let startRotation = 0;
    
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startRotation = currentRotation;
        pauseAnimation();
        slider.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const rotationChange = deltaX * 0.1; // Sensitivity
        currentRotation = startRotation + rotationChange;
        
        slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`;
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            slider.style.cursor = 'grab';
            resumeAnimation();
        }
    });
    
    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartRotation = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartRotation = currentRotation;
        pauseAnimation();
    });
    
    slider.addEventListener('touchmove', (e) => {
        const deltaX = e.touches[0].clientX - touchStartX;
        const rotationChange = deltaX * 0.1;
        currentRotation = touchStartRotation + rotationChange;
        
        slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`;
    });
    
    slider.addEventListener('touchend', () => {
        resumeAnimation();
    });
    
    // Project data for details
    const projectData = [
        {
            icon: '<img src="assets/logo/VisiTrack_logo.png" alt="VisiTrack">',
            title: 'VisiTrack',
            description: 'A visitor tracking system designed to organize entries, exits, and records efficiently.',
            fullDescription: 'VisiTrack helps manage visitor data by recording entries in a structured and reliable way. It focuses on accuracy, accountability, and ease of use, making manual tracking less chaotic. The system was designed with both function and clarity in mind.',
            tech: ['Outsystems'],
            features: ['Visitor logging system', 'Organized record management', 'Simple and clean interface', 'Error-reducing input flow'],
            link: '#'
        },
        {
            icon: '<img src="assets/logo/Contextufile_logo.png" alt="ContextuFile">',
            title: 'ContextuFile',
            description: 'An intelligent file organization system that understands what your files are about.',
            fullDescription: 'ContextuFile uses contextual meaning from file titles to automatically organize files into folders. Instead of manual sorting, the system analyzes keywords and intent to reduce clutter. It\'s built to make file management smarter and less annoying.',
            tech: ['Python', 'spaCy', 'HTML', 'JavaScript', 'CSS'],
            features: ['Context-based file classification', 'Automated folder organization', 'NLP-powered logic', 'Scalable system design'],
            link: '#'
        },
        {
            icon: '<img src="assets/logo/ArisePH_logo.png" alt="ARISE PH Database">',
            title: 'ARISE PH Database',
            description: 'A centralized database system designed for structured data management.',
            fullDescription: 'ARISE PH Database focuses on data integrity, organization, and efficient retrieval. It was designed to support real-world use cases that require reliable records and reporting. The system emphasizes structure over chaos.',
            tech: ['Workbook', 'Frappe'],
            features: ['Centralized data storage', 'Structured relationships', 'Secure and consistent records', 'Query-based reporting'],
            link: '#'
        },
        {
            icon: '<img src="assets/logo/Portfolio_logo.png" alt="Portfolio">',
            title: 'Web Portfolio (Yes, This One)',
            description: 'A fully personalized portfolio built from scratch—no templates, just vibes.',
            fullDescription: 'This website was designed and coded to reflect my personality, interests, and skills. Inspired by underwater glass aesthetics, it focuses on smooth motion, playful interactions, and clarity. Every section was intentionally designed and developed.',
            tech: ['HTML', 'CSS', 'JavaScript'],
            features: ['Custom design from scratch', 'Interactive animations', 'Responsive layout', 'Themed UI experience'],
            link: '#'
        }
    ];

    // Get detail view container
    const detailView = document.getElementById('projectDetailView');
    
    // Function to show project details in container
    function showProjectDetails(index) {
        const project = projectData[index];
        
        detailView.innerHTML = `
            <div class="project-detail-content">
                <div class="detail-icon">${project.icon}</div>
                <h2 class="detail-title">${project.title}</h2>
                <p class="detail-description">${project.fullDescription}</p>
                <div class="detail-tech">
                    ${project.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
                <div class="detail-features">
                    <h3>Key Features:</h3>
                    <ul class="detail-features-list">
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // Add click handlers to project boxes
    const projectBoxes = document.querySelectorAll('.project-box');
    projectBoxes.forEach((box, index) => {
        box.addEventListener('click', (e) => {
            e.stopPropagation();
            showProjectDetails(index);
        });
        box.style.cursor = 'pointer';
    });

    // Add visual cursor hint
    slider.style.cursor = 'grab';
});
