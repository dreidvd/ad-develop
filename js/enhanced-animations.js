// ===== ENHANCED ANIMATIONS & INTERACTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initHeaderScroll();
    initParallaxEffects();
    initSmoothScroll();
    initHoverEffects();
    initSkillLevelAnimations();
    initScreenshotCarousels();
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger animations for child elements
                const children = entry.target.querySelectorAll('.skill-badge, .project-card, .contact-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in, .section-header, .about-content, .contact-subtitle, .contact-wrapper');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-background, .geometric-shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    }, { passive: true });
}

// ===== SMOOTH SCROLL ENHANCEMENT =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SKILL LEVEL BAR ANIMATIONS =====
function initSkillLevelAnimations() {
    const skillBadges = document.querySelectorAll('.skill-badge[data-level]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBadge = entry.target;
                const level = skillBadge.getAttribute('data-level');
                const levelFill = skillBadge.querySelector('.skill-level-fill');
                
                if (levelFill && !levelFill.classList.contains('animated')) {
                    levelFill.style.width = '0%';
                    levelFill.classList.add('animated');
                    
                    // Animate to actual width
                    setTimeout(() => {
                        levelFill.style.width = level + '%';
                    }, 100);
                }
                
                observer.unobserve(skillBadge);
            }
        });
    }, observerOptions);
    
    skillBadges.forEach(badge => {
        observer.observe(badge);
    });
}

// ===== SCREENSHOT CAROUSEL ANIMATIONS =====
function initScreenshotCarousels() {
    // Only initialize carousels for Kids Cancervive (multi-phone layout)
    const kcPreview = document.querySelector('.project-preview[data-app="kids-cancervive"]');
    if (!kcPreview) return;
    
    const carousels = kcPreview.querySelectorAll('.screenshot-carousel');
    
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.screenshot-slide');
        if (slides.length <= 1) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let intervalId = null;
        
        // Auto-rotate carousel
        const rotateCarousel = () => {
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');
            
            // Move to next slide
            currentSlide = (currentSlide + 1) % totalSlides;
            
            // Add active class to new slide
            slides[currentSlide].classList.add('active');
        };
        
        // Start rotation every 3 seconds
        const startRotation = () => {
            intervalId = setInterval(rotateCarousel, 3000);
        };
        
        startRotation();
        
        // Pause on hover
        kcPreview.addEventListener('mouseenter', () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        });
        
        kcPreview.addEventListener('mouseleave', () => {
            startRotation();
        });
    });
}

// ===== HOVER EFFECTS =====
function initHoverEffects() {
    // Ripple effect for buttons only (removed tilt effect to prevent button click issues)
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .project-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== CURSOR TRAIL EFFECT (Optional - can be disabled) =====
function initCursorTrail() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid rgba(99, 102, 241, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Enlarge on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-badge');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = 'rgba(99, 102, 241, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'rgba(99, 102, 241, 0.5)';
        });
    });
}

// Uncomment to enable cursor trail
// initCursorTrail();

// ===== ADD RIPPLE STYLES =====
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .skill-badge, .project-card, .contact-item {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
`;
document.head.appendChild(style);
