// Poster Gallery with Infinite Carousel
class PosterGallery {
    constructor() {
        this.posterCards = document.querySelectorAll('.poster-card');
        this.grid = document.querySelector('.poster-grid');
        this.gridContainer = document.querySelector('.poster-grid-container');
        this.prevBtn = document.querySelector('.poster-nav-prev');
        this.nextBtn = document.querySelector('.poster-nav-next');
        this.currentIndex = 0;
        this.autoScrollInterval = null;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        if (!this.posterCards.length || !this.grid) return;

        // Clone posters for infinite loop effect
        this.clonePosters();

        // Setup click handlers for poster cards
        this.posterCards = document.querySelectorAll('.poster-card'); // Re-query after cloning
        this.posterCards.forEach(card => {
            card.addEventListener('click', () => {
                const posterNum = card.getAttribute('data-poster');
                this.openLightbox(posterNum, card);
            });
        });

        // Setup navigation button handlers
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.moveToPrev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.moveToNext());
        }

        // Start infinite carousel
        this.startCarousel();
        this.updateCenterCards();

        // Pause on hover
        this.gridContainer.addEventListener('mouseenter', () => this.pauseCarousel());
        this.gridContainer.addEventListener('mouseleave', () => this.startCarousel());
    }

    clonePosters() {
        // Clone all posters at the beginning and end for seamless infinite scroll
        const posters = Array.from(this.posterCards);
        
        // Add clones at the end
        posters.forEach(poster => {
            const cloneEnd = poster.cloneNode(true);
            this.grid.appendChild(cloneEnd);
        });
        
        // Add clones at the beginning
        const reversedPosters = [...posters].reverse();
        reversedPosters.forEach(poster => {
            const cloneStart = poster.cloneNode(true);
            this.grid.insertBefore(cloneStart, this.grid.firstChild);
        });
        
        // Set initial position to show original posters (skip the cloned beginning)
        const originalCount = posters.length;
        const cardWidth = 155;
        this.currentIndex = originalCount;
        this.grid.style.transform = `translateX(-${this.currentIndex * cardWidth}px)`;
    }

    startCarousel() {
        if (this.autoScrollInterval) return;
        
        this.autoScrollInterval = setInterval(() => {
            this.moveToNext();
        }, 2000);
    }

    pauseCarousel() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    moveToNext() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex++;
        
        const cardWidth = 155; // 140px width + 15px gap
        const offset = this.currentIndex * cardWidth;
        
        this.grid.style.transition = 'transform 0.4s ease';
        this.grid.style.transform = `translateX(-${offset}px)`;
        
        // Reset position when reaching end clones
        setTimeout(() => {
            const originalCount = 7; // We have 7 original posters
            // If we're past the original posters (into the end clones)
            if (this.currentIndex >= originalCount * 2) {
                this.grid.style.transition = 'none';
                this.currentIndex = originalCount;
                this.grid.style.transform = `translateX(-${this.currentIndex * cardWidth}px)`;
                
                setTimeout(() => {
                    this.grid.style.transition = 'transform 0.4s ease';
                }, 50);
            }
            this.isTransitioning = false;
            this.updateCenterCards();
        }, 400);
    }

    moveToPrev() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex--;
        
        const cardWidth = 155; // 140px width + 15px gap
        const offset = this.currentIndex * cardWidth;
        
        this.grid.style.transition = 'transform 0.4s ease';
        this.grid.style.transform = `translateX(-${offset}px)`;
        
        // Reset position when reaching beginning clones
        setTimeout(() => {
            const originalCount = 7; // We have 7 original posters
            // If we're before the original posters (into the start clones)
            if (this.currentIndex < originalCount) {
                this.grid.style.transition = 'none';
                this.currentIndex = originalCount * 2 - 1;
                this.grid.style.transform = `translateX(-${this.currentIndex * cardWidth}px)`;
                
                setTimeout(() => {
                    this.grid.style.transition = 'transform 0.4s ease';
                }, 50);
            }
            this.isTransitioning = false;
            this.updateCenterCards();
        }, 400);
    }

    updateCenterCards() {
        const allCards = document.querySelectorAll('.poster-card');
        const containerRect = this.gridContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        allCards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distanceFromCenter = Math.abs(containerCenter - cardCenter);
            
            // Mark center cards (two middle ones)
            if (distanceFromCenter < containerRect.width / 4) {
                card.classList.add('center');
            } else {
                card.classList.remove('center');
            }
        });
    }

    openLightbox(posterNum, cardElement) {
        this.pauseCarousel(); // Pause carousel when opening lightbox
        
        // Get poster details from the card
        const title = cardElement.querySelector('.poster-title')?.textContent || 'Poster';
        const posterImage = cardElement.querySelector('.poster-image');
        const imageSrc = posterImage ? posterImage.src : '';
        
        // Define captions for each poster
        const posterCaptions = {
            'Blue Ink': 'An abstract exploration of fluid ink patterns in deep blue hues.',
            'Cross the Bridge': 'A symbolic journey across boundaries and transitions.',
            'Nature Collage': 'A harmonious blend of natural elements and textures.',
            'Observe': 'A contemplative piece encouraging mindful observation.',
            'Past Life': 'Reflections on memories and experiences from another time.',
            'Universe': 'A cosmic representation of infinite possibilities.',
            'Wings of Vigil': 'Guardian spirits watching over with protective grace.'
        };
        
        const caption = posterCaptions[title] || 'A creative poster design.';

        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'poster-lightbox';
        lightbox.innerHTML = `
            <div class="poster-lightbox-content">
                <button class="poster-lightbox-close">&times;</button>
                <div class="poster-lightbox-image-container">
                    <img src="${imageSrc}" alt="${title}" class="poster-lightbox-image">
                </div>
                <div class="poster-lightbox-info">
                    <h3 class="poster-lightbox-title">${title}</h3>
                    <p class="poster-lightbox-description">${caption}</p>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);

        // Close handlers
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('poster-lightbox-close')) {
                this.closeLightbox(lightbox);
            }
        });

        // Keyboard handler
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox(lightbox);
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    closeLightbox(lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.remove();
            this.startCarousel(); // Resume carousel after closing lightbox
        }, 300);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PosterGallery();
});
