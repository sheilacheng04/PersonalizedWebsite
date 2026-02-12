// Profile Pagination
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('profilePrevBtn');
    const nextBtn = document.getElementById('profileNextBtn');
    const pageIndicator = document.querySelector('.profile-page-indicator');
    const pages = document.querySelectorAll('.profile-page');
    
    let currentPage = 1;
    const totalPages = pages.length;
    
    function showPage(pageNumber) {
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Show the current page
        pages[pageNumber - 1].classList.add('active');
        
        // Update indicator
        pageIndicator.textContent = `${pageNumber} / ${totalPages}`;
        
        // Update button states
        prevBtn.disabled = pageNumber === 1;
        nextBtn.disabled = pageNumber === totalPages;
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });
    
    // Initialize
    showPage(currentPage);
});
