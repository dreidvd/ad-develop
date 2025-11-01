// ===== PROJECTS SLIDESHOW FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    initProjectsSlideshow();
});

function initProjectsSlideshow() {
    // Initialize both slideshows independently
    const mobileSlideshow = document.querySelector('.mobile-slideshow');
    const websiteSlideshow = document.querySelector('.website-slideshow');
    
    if (mobileSlideshow) {
        setupSlideshow(mobileSlideshow);
    }
    
    if (websiteSlideshow) {
        setupSlideshow(websiteSlideshow);
    }
    
    // Setup filter buttons to toggle visibility
    setupFilters();
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle slideshow visibility
            const mobileSlideshow = document.querySelector('.mobile-slideshow');
            const websiteSlideshow = document.querySelector('.website-slideshow');
            
            if (filter === 'mobile') {
                if (mobileSlideshow) mobileSlideshow.style.display = '';
                if (websiteSlideshow) websiteSlideshow.style.display = 'none';
            } else if (filter === 'website') {
                if (mobileSlideshow) mobileSlideshow.style.display = 'none';
                if (websiteSlideshow) websiteSlideshow.style.display = '';
            }
        });
    });
}

function setupSlideshow(slideshow) {
    if (!slideshow) return;
    
    const track = slideshow.querySelector('.slideshow-track');
    const slides = slideshow.querySelectorAll('.slide');
    const prevBtn = slideshow.querySelector('.slideshow-prev');
    const nextBtn = slideshow.querySelector('.slideshow-next');
    const dotsContainer = slideshow.querySelector('.slideshow-dots');
    
    if (!track || !slides.length) return;
    
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    let currentIndex = 0;
    let isTransitioning = false;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'slideshow-dot';
        dot.setAttribute('aria-label', `Go to project ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.slideshow-dot');
    
    // Update slideshow position
    function updateSlideshow() {
        if (slides.length === 0) return;
        
        // Ensure currentIndex is valid
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex >= slides.length) currentIndex = slides.length - 1;
        
        const translateX = -currentIndex * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (isTransitioning || index === currentIndex || index < 0 || index >= slides.length) return;
        
        isTransitioning = true;
        currentIndex = index;
        updateSlideshow();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 1200); // Match CSS transition duration
    }
    
    // Next slide
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    // Previous slide
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }
    
    // Event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next
            } else {
                prevSlide(); // Swipe right - previous
            }
        }
    }
    
    // Initialize
    updateSlideshow();
}
