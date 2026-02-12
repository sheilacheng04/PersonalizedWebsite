// Custom Circular Cursor
function initCursor() {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.display = 'block';
    document.body.appendChild(cursor);
    
    console.log('Custom cursor initialized');

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Function to add hover listeners to interactive elements
    const addInteractiveListeners = () => {
        const interactiveElements = document.querySelectorAll('a, button, .btn-circle, .poster-item, .project-item, .fish, .zoom-btn, .contacts-social-icon, .category-btn, .hobby-checkbox, input[type="checkbox"]');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    };

    // Initial call
    addInteractiveListeners();

    // Re-check for new interactive elements (for Vue components)
    const observer = new MutationObserver(() => {
        addInteractiveListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Add grab effect on mouse down
    document.addEventListener('mousedown', () => {
        cursor.classList.add('grab');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('grab');
    });

    // Hide cursor when leaving the window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
} else {
    initCursor();
}
