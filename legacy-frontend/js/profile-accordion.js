// Profile Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionBox = this.closest('.accordion-box');
            const isActive = accordionBox.classList.contains('active');
            
            // Close all accordions
            document.querySelectorAll('.accordion-box').forEach(box => {
                box.classList.remove('active');
            });
            
            // Open clicked accordion if it wasn't already active
            if (!isActive) {
                accordionBox.classList.add('active');
            }
        });
    });
});
