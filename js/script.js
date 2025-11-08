// ===== PORTFOLIO INTERACTIVE FEATURES =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
    initMobileMenu();
    initActiveNavigation();
    initTypingEffect();
    initHeroStatsCounter();
    initImageErrorHandling();
    initSkillFloatingAnimations();
});

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.project-card, .skill-badge, .contact-item, .about-text');
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // Stagger animations for project cards
        const delay = el.classList.contains('project-card') ? index * 0.1 : index * 0.05;
        el.style.animationDelay = `${delay}s`;
        observer.observe(el);
    });
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        // Set the redirect URL to come back to the same page with success parameter
        const successUrl = window.location.href.split('?')[0] + '?sent=true';
        const nextInput = form.querySelector('#form-success-url');
        if (nextInput) {
            nextInput.value = successUrl;
        }
        
        // Check if form was just submitted successfully
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('sent') === 'true') {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            form.reset();
        }
        
        form.addEventListener('submit', function(e) {
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simple validation before submitting
            if (!validateForm(data)) {
                e.preventDefault();
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // FormSubmit will handle the submission and redirect back to this page
            // Allow the form to submit normally
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateForm(data) {
    return data.name && data.email && data.subject && data.message;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    if (!value) {
        showFieldError(field, `${fieldName} is required`);
        return false;
    }
    
    if (fieldName === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            const isActive = navLinks.classList.toggle('active');
            this.classList.toggle('active');
            // Update aria-expanded for accessibility
            this.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
        
        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ===== ACTIVE NAVIGATION =====
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const roleText = document.querySelector('.role-text');
    if (!roleText) return;
    
    const roles = ['Web & Mobile Developer', 'AR Developer', 'Flutter Specialist', 'Problem Solver', 'Creative Technologist'];
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeRole() {
        const currentRole = roles[currentRoleIndex];
        
        if (isDeleting) {
            roleText.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            roleText.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentCharIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before next role
        }
        
        setTimeout(typeRole, typeSpeed);
    }
    
    // Start typing effect after a delay
    setTimeout(typeRole, 1500);
}

// ===== HERO STATS COUNTER ANIMATION =====
function initHeroStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    if (statNumbers.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                entry.target.classList.add('counted');
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// ===== SCROLL TO TOP BUTTON =====
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        transform: translateY(20px);
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
            scrollBtn.style.transform = 'translateY(20px)';
        }
    });
    
    // Add hover effect
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-2px)';
        scrollBtn.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0)';
        scrollBtn.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
initScrollToTop();


// ===== APP PREVIEW FUNCTIONALITY =====
function initAppPreview() {
    // Handle clicks on View Details buttons
    const viewProjectButtons = document.querySelectorAll('.project-link[data-app]');
    
    viewProjectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const appType = this.getAttribute('data-app');
            if (appType) {
                showAppPreview(appType);
            }
        });
    });
    
    // Handle clicks on project preview images
    const projectPreviews = document.querySelectorAll('.project-preview[data-app]');
    
    projectPreviews.forEach(preview => {
        preview.addEventListener('click', function(e) {
            e.preventDefault();
            const appType = this.getAttribute('data-app');
            if (appType) {
                showAppPreview(appType);
            }
        });
    });
}

function showAppPreview(appType) {
    if (appType === 'kids-cancervive') {
        showKidsCancervivePreview();
    } else if (appType === 'adventura') {
        showAdventuraPreview();
    } else if (appType === 'eidolon') {
        showEidolonPreview();
    } else if (appType === 'weathercast-pro') {
        showWeatherCastPreview();
    } else if (appType === 'discover-ph') {
        showDiscoverPHPreview();
    } else if (appType === 'loloto') {
        showLolotoPreview();
    } else if (appType === 'porsche-showcase') {
        showPorschePreview();
    }
}

function showKidsCancervivePreview() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'preview-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
        padding: 2rem;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'app-preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-header">
                <h2>Kids Cancervive App Preview</h2>
                <button class="preview-close">&times;</button>
            </div>
            <div class="preview-body">
                <div class="app-details">
                    <h3>App Details</h3>
                    <p>Kids Cancervive is a comprehensive healthcare platform designed specifically for pediatric cancer patients and their families. The app provides treatment tracking, hospital information, chemotherapy details, financial management tools, donation systems, and comprehensive support resources to help families navigate the challenges of pediatric cancer care.</p>
                </div>
                <div class="app-workflow">
                    <h3>App Workflow & Features</h3>
                    <div class="workflow-steps">
                        <div class="workflow-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>App Introduction</h4>
                                <p>Splash screen and app information to welcome users and provide essential details</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Main Dashboard</h4>
                                <p>Central hub providing quick access to all app features and navigation</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Healthcare Resources</h4>
                                <p>Hospital information, chemotherapy details, and financial management tools</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Support & Information</h4>
                                <p>Donation system, LGU information, and comprehensive FAQ section</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="screenshot-gallery">
                    <h3>App Screenshots</h3>
                    <div class="gallery-grid">
                        <div class="gallery-item phone-frame-item" data-step="1">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../KC APP/app image/splash screen.jpg" alt="KC App Splash Screen" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Splash Screen</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="1">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../KC APP/app image/app info.jpg" alt="KC App Info" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">App Information</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../KC APP/app image/main dash board.jpg" alt="KC App Main Dashboard" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Main Dashboard</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../KC APP/app image/main dashboard 2.jpg" alt="KC App Main Dashboard 2" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Dashboard Overview</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../KC APP/app image/hospital.jpg" alt="KC App Hospital" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Hospital Information</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../KC APP/app image/chemo info.jpg" alt="KC App Chemo Info" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Chemotherapy Information</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../KC APP/app image/finance .jpg" alt="KC App Finance" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Financial Management</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="4">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../KC APP/app image/donation.jpg" alt="KC App Donation" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Donation System</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="4">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../KC APP/app image/lgu.jpg" alt="KC App LGU" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">LGU Information</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="4">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../KC APP/app image/faq.jpg" alt="KC App FAQ" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Frequently Asked Questions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Style the modal with dark theme
    modal.style.cssText = `
        background: #1E1B2E;
        border-radius: 1rem;
        max-width: 1200px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(167, 139, 250, 0.2);
    `;
    
    // Add comprehensive styling with dark theme and phone mockups
    const style = document.createElement('style');
    style.textContent = `
        .preview-modal-content {
            padding: 0;
            background: #1E1B2E;
        }
        
        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem 2rem 1rem 2rem;
            border-bottom: 1px solid rgba(167, 139, 250, 0.2);
            background: linear-gradient(135deg, #1E1B2E 0%, #252238 100%);
            border-radius: 1rem 1rem 0 0;
        }
        
        .preview-header h2 {
            margin: 0;
            color: #F3F4F6;
            font-size: 1.5rem;
            font-weight: 700;
        }
        
        .preview-close {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #94A3B8;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .preview-close:hover {
            background: rgba(167, 139, 250, 0.2);
            color: #A78BFA;
        }
        
        .preview-body {
            padding: 2rem;
            background: #1E1B2E;
        }
        
        .app-details { margin-bottom: 1.5rem; }
        .app-details h3 { color: #F3F4F6; font-size: 1.1rem; font-weight: 600; margin: 0 0 0.5rem 0; text-align: center; }
        .app-details p { margin: 0; color: #E2E8F0; }
        .app-workflow {
            margin-bottom: 3rem;
        }
        
        .app-workflow h3 {
            color: #F3F4F6;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .workflow-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .workflow-step {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1.5rem;
            background: #252238;
            border-radius: 0.75rem;
            border-left: 4px solid #A78BFA;
            transition: transform 0.3s ease;
        }
        
        .workflow-step:hover {
            transform: translateX(5px);
        }
        
        .step-number {
            background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%);
            color: white;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.125rem;
            flex-shrink: 0;
        }
        
        .step-content h4 {
            margin: 0 0 0.5rem 0;
            color: #F3F4F6;
            font-size: 1rem;
            font-weight: 600;
        }
        
        .step-content p {
            margin: 0;
            color: #94A3B8;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        
        .screenshot-gallery h3 {
            color: #F3F4F6;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 2rem;
            justify-items: center;
        }
        
        .gallery-item {
            position: relative;
            border-radius: 1rem;
            overflow: visible;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            background: transparent;
        }
        
        .gallery-item:hover {
            transform: translateY(-8px) scale(1.02);
        }
        
        .gallery-item img {
            width: 100%;
            height: auto;
            object-fit: cover;
            display: block;
            border-radius: 0;
        }
        
        .gallery-caption {
            margin-top: 1rem;
            color: #C4B5FD;
            font-weight: 500;
            font-size: 0.875rem;
            text-align: center;
        }
        
        .phone-frame-item {
            padding: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .phone-mockup-frame {
            width: 220px;
            height: 440px;
            background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%);
            border-radius: 35px;
            padding: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 0 2px rgba(255, 255, 255, 0.1);
            position: relative;
        }
        
        .phone-mockup-frame::before {
            content: '';
            position: absolute;
            top: 18px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 5px;
            background: #1a1a1a;
            border-radius: 5px;
            z-index: 10;
        }
        
        .phone-mockup-screen {
            width: 100%;
            height: 100%;
            background: #000;
            border-radius: 28px;
            overflow: hidden;
            position: relative;
        }
        
        .phone-mockup-screen img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        
        .preview-footer {
            padding: 1.5rem 2rem 2rem 2rem;
            border-top: 1px solid rgba(167, 139, 250, 0.2);
            text-align: center;
            background: #1E1B2E;
            border-radius: 0 0 1rem 1rem;
        }
        
        @media (max-width: 768px) {
            .workflow-steps {
                grid-template-columns: 1fr;
            }
            
            .gallery-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            
            .phone-mockup-frame {
                width: 180px;
                height: 360px;
            }
            
            .preview-header, .preview-body, .preview-footer {
                padding: 1rem;
            }
        }
    `;
    
    document.head.appendChild(style);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent body scroll when modal is open - use overflow hidden instead of fixed
    // This preserves scroll position naturally
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Close handlers
    function closeModal() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            // Simply restore overflow - scroll position is naturally preserved
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
                document.head.removeChild(style);
            }
        }, 300);
    }
    
    modal.querySelector('.preview-close').addEventListener('click', closeModal);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    // Add click to enlarge images
    const galleryItems = modal.querySelectorAll('.gallery-item');
    const allImages = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        caption: item.querySelector('.gallery-caption').textContent
    }));
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showImageModal(allImages, index);
        });
    });
}

function showAdventuraPreview() {
    const overlay = document.createElement('div');
    overlay.className = 'preview-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
        padding: 2rem;
    `;

    const modal = document.createElement('div');
    modal.className = 'app-preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-header">
                <h2>ADVENTURA App Preview</h2>
                <div class="preview-header-logo"><img src="../Adventura/images/Logo.1.png" alt="Adventura Logo"></div>
                <button class="preview-close">&times;</button>
            </div>
            <div class="preview-body">
                <div class="app-details">
                    <h3>App Details</h3>
                    <p>ADVENTURA is an AR-powered campus navigation system for DHVSU that overlays 3D building guidance and interactive wayfinding to help students and visitors find buildings and destinations quickly using augmented reality technology.</p>
                </div>
                <div class="app-workflow">
                    <h3>App Workflow & Features</h3>
                    <div class="workflow-steps">
                        <div class="workflow-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Start the App & Navigate the Campus Map</h4>
                                <p>Launch screen and interactive campus map to begin navigation.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Search & Choose Buildings</h4>
                                <p>Search buildings and pick a destination with ease.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>AR Navigation</h4>
                                <p>Turn-by-turn AR overlays and destination markers on campus.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="screenshot-gallery">
                    <h3>App Screenshots</h3>
                    <div class="gallery-grid">
                        
                        <div class="gallery-item phone-frame-item" data-step="1">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Adventura/images/starting.png" alt="Starting Screen" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Starting Screen</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="1">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Adventura/images/interactive campus map.png" alt="Interactive Campus Map" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Interactive Campus Map</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Adventura/images/choosing of buildings.png" alt="Choosing of Buildings" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Choosing Buildings</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Adventura/images/searching of buildings.jpg" alt="Searching of Buildings" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Searching Buildings</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Adventura/images/building navigation.jpg" alt="Building Navigation" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Building Navigation</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Adventura/images/augmented reality.png" alt="Augmented Reality View" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Augmented Reality</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Adventura/images/destination marker.png" alt="Destination Marker" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Destination Marker</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Adventura/images/hamburger button.jpg" alt="Hamburger Button" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Menu Button</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="1">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Adventura/images/birds eye view.jpg" alt="Bird's Eye View" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Bird's Eye View</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Enhanced styles with phone mockups
    const style = document.createElement('style');
    style.textContent = `
        .preview-modal-content { padding: 0; background: #1E1B2E; }
        .preview-header { position:relative; display:flex; justify-content:space-between; align-items:center; padding: 2rem 2rem 1rem 2rem; border-bottom:1px solid rgba(167, 139, 250, 0.2); background: linear-gradient(135deg, #1E1B2E 0%, #252238 100%); border-radius: 1rem 1rem 0 0; overflow:hidden; }
        .preview-header h2 { margin:0; color: #F3F4F6; font-size:1.5rem; font-weight:700; }
        .preview-header-logo { position:absolute; right:1rem; top:50%; transform: translateY(-50%); opacity:0.1; pointer-events:none; }
        .preview-header-logo img { height:80px; width:auto; display:block; filter: grayscale(100%); }
        .preview-close { background:none; border:none; font-size:2rem; cursor:pointer; color: #94A3B8; padding:0.5rem; border-radius:0.5rem; transition:all 0.2s; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .preview-close:hover { background: rgba(167, 139, 250, 0.2); color: #A78BFA; }
        .preview-body { padding: 2rem; background: #1E1B2E; }
        .app-details { margin-bottom: 1.5rem; }
        .app-details h3 { color: #F3F4F6; font-size: 1.1rem; font-weight: 600; margin: 0 0 0.5rem 0; text-align: center; }
        .app-details p { margin: 0; color: #E2E8F0; }
        .app-workflow { margin-bottom: 3rem; }
        .app-workflow h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1.5rem; text-align:center; }
        .workflow-steps { display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:1.5rem; margin-bottom:2rem; }
        .workflow-step { display:flex; align-items:flex-start; gap:1rem; padding:1.5rem; background: #252238; border-radius:0.75rem; border-left:4px solid #A78BFA; transition: transform 0.3s ease; }
        .workflow-step:hover { transform: translateX(5px); }
        .step-number { background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%); color:white; width:2.5rem; height:2.5rem; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.125rem; flex-shrink:0; }
        .step-content h4 { margin:0 0 0.5rem 0; color: #F3F4F6; font-size:1rem; font-weight:600; }
        .step-content p { margin:0; color: #94A3B8; font-size:0.875rem; line-height:1.5; }
        .screenshot-gallery h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1.5rem; text-align:center; }
        .gallery-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:2rem; justify-items: center; }
        .gallery-item { position:relative; border-radius:1rem; overflow:visible; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor:pointer; background: transparent; }
        .gallery-item:hover { transform: translateY(-8px) scale(1.02); }
        .gallery-item img { width:100%; height:auto; object-fit:cover; display:block; border-radius:0; }
        .gallery-caption { margin-top:1rem; color:#C4B5FD; font-weight:500; font-size:0.875rem; text-align:center; }
        .phone-frame-item { padding: 0.5rem; display: flex; flex-direction: column; align-items: center; }
        .phone-mockup-frame { width: 220px; height: 440px; background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 35px; padding: 10px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 0 2px rgba(255, 255, 255, 0.1); position: relative; }
        .phone-mockup-frame::before { content: ''; position: absolute; top: 18px; left: 50%; transform: translateX(-50%); width: 50px; height: 5px; background: #1a1a1a; border-radius: 5px; z-index: 10; }
        .phone-mockup-screen { width: 100%; height: 100%; background: #000; border-radius: 28px; overflow: hidden; position: relative; }
        .phone-mockup-screen img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .desktop-frame-item { padding: 1rem; display: flex; flex-direction: column; align-items: center; }
        .desktop-mockup-frame { background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px 12px 0 0; padding: 12px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 0 2px rgba(255, 255, 255, 0.1); position: relative; max-width: 600px; width: 100%; }
        .desktop-mockup-frame::before { content: ''; position: absolute; top: 8px; left: 16px; width: 10px; height: 10px; background: #ff5f57; border-radius: 50%; box-shadow: 16px 0 0 #ffbd2e, 32px 0 0 #28ca42; }
        .desktop-mockup-screen { background: #000; border-radius: 6px; overflow: hidden; }
        .desktop-mockup-screen img { width: 100%; height: auto; display: block; }
        .preview-footer { padding:1.5rem 2rem 2rem 2rem; border-top:1px solid rgba(167, 139, 250, 0.2); text-align:center; background: #1E1B2E; border-radius: 0 0 1rem 1rem; }
        @media (max-width: 768px) {
            .workflow-steps { grid-template-columns: 1fr; }
            .gallery-grid { grid-template-columns: 1fr; gap: 1.5rem; }
            .phone-mockup-frame { width: 180px; height: 360px; }
            .preview-header, .preview-body, .preview-footer { padding: 1rem; }
        }
    `;

    // Basic container styles
    modal.style.cssText = `
        background: #1E1B2E;
        border-radius: 1rem;
        max-width: 1200px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(167, 139, 250, 0.2);
    `;

    document.head.appendChild(style);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent body scroll when modal is open - use overflow hidden instead of fixed
    // This preserves scroll position naturally
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);

    function closeModal() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
            // Restore body scroll - simply restore overflow
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
    }

    modal.querySelector('.preview-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    // Wire up click-to-enlarge using existing image modal
    const galleryItems = modal.querySelectorAll('.gallery-item');
    const allImages = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        caption: item.querySelector('.gallery-caption').textContent
    }));
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showImageModal(allImages, index);
        });
    });
}

function showEidolonPreview() {
    const overlay = document.createElement('div');
    overlay.className = 'preview-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
        padding: 2rem;
    `;

    const modal = document.createElement('div');
    modal.className = 'app-preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-header">
                <h2>Eidolon ID Wallet Preview</h2>
                <div class="preview-header-logo"><img src="../Eidolon/images/logo.png" alt="Eidolon Logo"></div>
                <button class="preview-close">&times;</button>
            </div>
            <div class="preview-body">
                <div class="app-details">
                    <h3>App Details</h3>
                    <p>Eidolon ID Wallet is a secure digital ID management application that allows users to scan, store, manage, and share digital IDs with encryption, biometric authentication, and cloud sync capabilities. Perfect for keeping all your important identification documents in one secure, accessible place.</p>
                </div>
                <div class="app-workflow">
                    <h3>App Workflow & Features</h3>
                    <div class="workflow-steps">
                        <div class="workflow-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Onboarding & Security</h4>
                                <p>Login, set password, MPIN, and biometrics for secure access.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Manage IDs</h4>
                                <p>Add, import, scan, archive, and favorite IDs with details.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Share & Settings</h4>
                                <p>Share IDs, change PIN, adjust settings, and view FAQs/Terms.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="screenshot-gallery">
                    <h3>App Screenshots</h3>
                    <div class="gallery-grid">
                        
                        <div class="gallery-item phone-frame-item" data-step="1">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/log in.png" alt="Log In" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Log In</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="1">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/set up password.png" alt="Set Up Password" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Set Up Password</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="1">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/setting new pin.png" alt="Setting New PIN" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Set New PIN</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="1">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/set up biometrics.png" alt="Set Up Biometrics" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Set Up Biometrics</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/dashboard.png" alt="Dashboard" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Dashboard</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/my ids.png" alt="My IDs" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">My IDs</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/add id.png" alt="Add ID" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Add ID</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/import id.png" alt="Import ID" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Import ID</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/scan id option.png" alt="Scan ID Option" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Scan ID Option</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/scan id.png" alt="Scan ID" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Scan ID</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/id details.png" alt="ID Details" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">ID Details</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/hide details.png" alt="Hide Details" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Hide Details</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/archiving id.png" alt="Archiving ID" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Archiving ID</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/archives.png" alt="Archives" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Archives</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="2">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/favorites.png" alt="Favorites" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Favorites</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/share id.png" alt="Share ID" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Share ID</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/how to save image.png" alt="How to Save Image" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Save Image Guide</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/saving notification.png" alt="Saving Notification" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Saving Notification</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/settings.png" alt="Settings" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Settings</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/change mpin.png" alt="Change MPIN" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Change MPIN</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/terms and condition.png" alt="Terms and Conditions" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Terms & Conditions</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/faq.png" alt="FAQ" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">FAQ</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/hamburger button.png" alt="Hamburger Button" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Menu Button</div>
                        </div>
                        <div class="gallery-item phone-frame-item" data-step="3">
                            <div class="phone-mockup-frame">
                                <div class="phone-mockup-screen">
                                    <img src="../Eidolon/images/recover or delete.png" alt="Recover or Delete" loading="lazy">
                                </div>
                            </div>
                            <div class="gallery-caption">Recover or Delete</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Apply enhanced styles with phone mockups
    const style = document.createElement('style');
    style.textContent = `
        .preview-modal-content { padding: 0; background: #1E1B2E; }
        .preview-header { position:relative; display:flex; justify-content:space-between; align-items:center; padding: 2rem 2rem 1rem 2rem; border-bottom:1px solid rgba(167, 139, 250, 0.2); background: linear-gradient(135deg, #1E1B2E 0%, #252238 100%); border-radius: 1rem 1rem 0 0; overflow:hidden; }
        .preview-header h2 { margin:0; color: #F3F4F6; font-size:1.5rem; font-weight:700; }
        .preview-header-logo { position:absolute; right:1rem; top:50%; transform: translateY(-50%); opacity:0.1; pointer-events:none; }
        .preview-header-logo img { height:80px; width:auto; display:block; filter: grayscale(100%); }
        .preview-close { background:none; border:none; font-size:2rem; cursor:pointer; color: #94A3B8; padding:0.5rem; border-radius:0.5rem; transition:all 0.2s; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .preview-close:hover { background: rgba(167, 139, 250, 0.2); color: #A78BFA; }
        .preview-body { padding: 2rem; background: #1E1B2E; }
        .app-details { margin-bottom: 1.5rem; }
        .app-details h3 { color: #F3F4F6; font-size: 1.1rem; font-weight: 600; margin: 0 0 0.5rem 0; text-align: center; }
        .app-details p { margin: 0; color: #E2E8F0; }
        .app-workflow { margin-bottom: 3rem; }
        .app-workflow h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1.5rem; text-align:center; }
        .workflow-steps { display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:1.5rem; margin-bottom:2rem; }
        .workflow-step { display:flex; align-items:flex-start; gap:1rem; padding:1.5rem; background: #252238; border-radius:0.75rem; border-left:4px solid #A78BFA; transition: transform 0.3s ease; }
        .workflow-step:hover { transform: translateX(5px); }
        .step-number { background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%); color:white; width:2.5rem; height:2.5rem; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.125rem; flex-shrink:0; }
        .step-content h4 { margin:0 0 0.5rem 0; color: #F3F4F6; font-size:1rem; font-weight:600; }
        .step-content p { margin:0; color: #94A3B8; font-size:0.875rem; line-height:1.5; }
        .screenshot-gallery h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1.5rem; text-align:center; }
        .gallery-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:2rem; justify-items: center; }
        .gallery-item { position:relative; border-radius:1rem; overflow:visible; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor:pointer; background: transparent; }
        .gallery-item:hover { transform: translateY(-8px) scale(1.02); }
        .gallery-item img { width:100%; height:auto; object-fit:cover; display:block; border-radius:0; }
        .gallery-caption { margin-top:1rem; color:#C4B5FD; font-weight:500; font-size:0.875rem; text-align:center; }
        .phone-frame-item { padding: 0.5rem; display: flex; flex-direction: column; align-items: center; }
        .phone-mockup-frame { width: 220px; height: 440px; background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 35px; padding: 10px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 0 2px rgba(255, 255, 255, 0.1); position: relative; }
        .phone-mockup-frame::before { content: ''; position: absolute; top: 18px; left: 50%; transform: translateX(-50%); width: 50px; height: 5px; background: #1a1a1a; border-radius: 5px; z-index: 10; }
        .phone-mockup-screen { width: 100%; height: 100%; background: #000; border-radius: 28px; overflow: hidden; position: relative; }
        .phone-mockup-screen img { width: 100%; height: 100%; object-fit: cover; display: block; }
        @media (max-width: 768px) {
            .workflow-steps { grid-template-columns: 1fr; }
            .gallery-grid { grid-template-columns: 1fr; gap: 1.5rem; }
            .phone-mockup-frame { width: 180px; height: 360px; }
            .preview-header, .preview-body { padding: 1rem; }
        }
    `;

    // Container styles with dark theme
    modal.style.cssText = `
        background: #1E1B2E;
        border-radius: 1rem;
        max-width: 1200px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(167, 139, 250, 0.2);
    `;

    document.head.appendChild(style);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent body scroll when modal is open - use overflow hidden instead of fixed
    // This preserves scroll position naturally
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);

    function closeModal() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
            // Restore body scroll - simply restore overflow
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
    }

    modal.querySelector('.preview-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    // Click-to-enlarge using existing image modal
    const galleryItems = modal.querySelectorAll('.gallery-item');
    const allImages = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        caption: item.querySelector('.gallery-caption').textContent
    }));
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showImageModal(allImages, index);
        });
    });
}

function showWeatherCastPreview() {
    const overlay = document.createElement('div');
    overlay.className = 'preview-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
        padding: 2rem;
    `;

    const modal = document.createElement('div');
    modal.className = 'app-preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-header">
                <h2>WeatherCast Pro Preview</h2>
                <button class="preview-close">&times;</button>
            </div>
            <div class="preview-body">
                <div class="app-details">
                    <h3>Project Details</h3>
                    <p>WeatherCast Pro is a modern, progressive web app that provides real-time weather information with geolocation support, detailed forecasts, and a beautiful user interface. Built as a PWA for seamless mobile and desktop experience.</p>
                </div>
                <div class="app-workflow">
                    <h3>Features & Functionality</h3>
                    <div class="workflow-steps">
                        <div class="workflow-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Real-time Weather Data</h4>
                                <p>Get current weather conditions, temperature, humidity, and wind speed from reliable weather APIs.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Geolocation Support</h4>
                                <p>Automatic location detection to provide weather information for your current area.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Forecast & Details</h4>
                                <p>Extended forecasts, hourly predictions, and detailed weather information for informed planning.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Progressive Web App</h4>
                                <p>Installable PWA with offline capabilities and native app-like experience.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="preview-footer">
                <a href="https://dreidvd.github.io/Weather-Cast-Pro/" class="btn btn-primary" target="_blank">
                    <span class="download-icon">🌐</span> Visit Website
                </a>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .preview-modal-content { padding: 0; background: #1E1B2E; }
        .preview-header { position:relative; display:flex; justify-content:space-between; align-items:center; padding: 2rem 2rem 1rem 2rem; border-bottom:1px solid rgba(167, 139, 250, 0.2); background: linear-gradient(135deg, #1E1B2E 0%, #252238 100%); border-radius: 1rem 1rem 0 0; overflow:hidden; }
        .preview-header h2 { margin:0; color: #F3F4F6; font-size:1.5rem; font-weight:700; }
        .preview-close { background:none; border:none; font-size:2rem; cursor:pointer; color: #94A3B8; padding:0.5rem; border-radius:0.5rem; transition:all 0.2s; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .preview-close:hover { background: rgba(167, 139, 250, 0.2); color: #A78BFA; }
        .preview-body { padding: 2rem; background: #1E1B2E; }
        .app-details { margin-bottom: 3rem; }
        .app-details h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1rem; }
        .app-details p { color: #E2E8F0; line-height:1.8; }
        .app-workflow { margin-bottom: 3rem; }
        .app-workflow h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1.5rem; text-align:center; }
        .workflow-steps { display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:1.5rem; margin-bottom:2rem; }
        .workflow-step { display:flex; align-items:flex-start; gap:1rem; padding:1.5rem; background: #252238; border-radius:0.75rem; border-left:4px solid #A78BFA; transition: transform 0.3s ease; }
        .workflow-step:hover { transform: translateX(5px); }
        .step-number { background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%); color:white; width:2.5rem; height:2.5rem; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.125rem; flex-shrink:0; }
        .step-content h4 { margin:0 0 0.5rem 0; color: #F3F4F6; font-size:1rem; font-weight:600; }
        .step-content p { margin:0; color: #94A3B8; font-size:0.875rem; line-height:1.5; }
        .preview-footer { padding: 2rem; border-top: 1px solid rgba(167, 139, 250, 0.2); display: flex; justify-content: center; background: #1E1B2E; border-radius: 0 0 1rem 1rem; }
        .preview-footer .btn { text-decoration: none; }
        @media (max-width: 768px) {
            .workflow-steps { grid-template-columns: 1fr; }
            .preview-header, .preview-body, .preview-footer { padding: 1rem; }
        }
    `;

    modal.style.cssText = `
        background: #1E1B2E;
        border-radius: 1rem;
        max-width: 1200px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(167, 139, 250, 0.2);
    `;

    document.head.appendChild(style);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent body scroll when modal is open - use overflow hidden instead of fixed
    // This preserves scroll position naturally
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);

    function closeModal() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
            // Restore body scroll - simply restore overflow
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
    }

    modal.querySelector('.preview-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
}

function showDiscoverPHPreview() {
    const overlay = document.createElement('div');
    overlay.className = 'preview-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
        padding: 2rem;
    `;

    const modal = document.createElement('div');
    modal.className = 'app-preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-header">
                <h2>Discover PH Preview</h2>
                <button class="preview-close">&times;</button>
            </div>
            <div class="preview-body">
                <div class="app-details">
                    <h3>Project Details</h3>
                    <p>Discover PH is an interactive tourism platform showcasing the beauty and culture of the Philippines. Features include destination guides, interactive maps, multilingual content, and SEO optimization for travelers exploring the archipelago.</p>
                </div>
                <div class="app-workflow">
                    <h3>Features & Functionality</h3>
                    <div class="workflow-steps">
                        <div class="workflow-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Destination Discovery</h4>
                                <p>Explore beautiful destinations across the Philippines with detailed information and stunning visuals.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Interactive Maps</h4>
                                <p>Navigate destinations with integrated maps showing locations, routes, and points of interest.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Multilingual Support</h4>
                                <p>Content available in multiple languages to serve both local and international travelers.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>SEO Optimized</h4>
                                <p>Search engine optimized to help travelers discover Philippine destinations easily.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="preview-footer">
                <a href="https://dreidvd.github.io/Discover-PH/html/index.html" class="btn btn-primary" target="_blank">
                    <span class="download-icon">🌐</span> Visit Website
                </a>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .preview-modal-content { padding: 0; background: #1E1B2E; }
        .preview-header { position:relative; display:flex; justify-content:space-between; align-items:center; padding: 2rem 2rem 1rem 2rem; border-bottom:1px solid rgba(167, 139, 250, 0.2); background: linear-gradient(135deg, #1E1B2E 0%, #252238 100%); border-radius: 1rem 1rem 0 0; overflow:hidden; }
        .preview-header h2 { margin:0; color: #F3F4F6; font-size:1.5rem; font-weight:700; }
        .preview-close { background:none; border:none; font-size:2rem; cursor:pointer; color: #94A3B8; padding:0.5rem; border-radius:0.5rem; transition:all 0.2s; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .preview-close:hover { background: rgba(167, 139, 250, 0.2); color: #A78BFA; }
        .preview-body { padding: 2rem; background: #1E1B2E; }
        .app-details { margin-bottom: 3rem; }
        .app-details h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1rem; text-align: center; }
        .app-details p { color: #E2E8F0; line-height:1.8; }
        .app-workflow { margin-bottom: 3rem; }
        .app-workflow h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1.5rem; text-align:center; }
        .workflow-steps { display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:1.5rem; margin-bottom:2rem; }
        .workflow-step { display:flex; align-items:flex-start; gap:1rem; padding:1.5rem; background: #252238; border-radius:0.75rem; border-left:4px solid #A78BFA; transition: transform 0.3s ease; }
        .workflow-step:hover { transform: translateX(5px); }
        .step-number { background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%); color:white; width:2.5rem; height:2.5rem; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.125rem; flex-shrink:0; }
        .step-content h4 { margin:0 0 0.5rem 0; color: #F3F4F6; font-size:1rem; font-weight:600; }
        .step-content p { margin:0; color: #94A3B8; font-size:0.875rem; line-height:1.5; }
        .preview-footer { padding: 2rem; border-top: 1px solid rgba(167, 139, 250, 0.2); display: flex; justify-content: center; background: #1E1B2E; border-radius: 0 0 1rem 1rem; }
        .preview-footer .btn { text-decoration: none; }
        @media (max-width: 768px) {
            .workflow-steps { grid-template-columns: 1fr; }
            .preview-header, .preview-body, .preview-footer { padding: 1rem; }
        }
    `;

    modal.style.cssText = `
        background: #1E1B2E;
        border-radius: 1rem;
        max-width: 1200px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(167, 139, 250, 0.2);
    `;

    document.head.appendChild(style);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent body scroll when modal is open - use overflow hidden instead of fixed
    // This preserves scroll position naturally
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);

    function closeModal() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
            // Restore body scroll - simply restore overflow
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
    }

    modal.querySelector('.preview-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
}

function showLolotoPreview() {
    const overlay = document.createElement('div');
    overlay.className = 'preview-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
        padding: 2rem;
    `;

    const modal = document.createElement('div');
    modal.className = 'app-preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-header">
                <h2>Loloto Management Preview</h2>
                <button class="preview-close">&times;</button>
            </div>
            <div class="preview-body">
                <div class="app-details">
                    <h3>App Details</h3>
                    <p>Loloto Management is a comprehensive business management application designed for junkshops. It provides inventory tracking, financial analytics, receipt management, and business insights to help junkshop owners manage their operations efficiently.</p>
                </div>
                <div class="app-workflow">
                    <h3>Features & Functionality</h3>
                    <div class="workflow-steps">
                        <div class="workflow-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Inventory Management</h4>
                                <p>Track items, materials, and stock levels with real-time updates and categorization.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Financial Analytics</h4>
                                <p>Monitor income, expenses, profits, and financial trends with detailed reports and charts.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Receipt Management</h4>
                                <p>Generate, store, and manage digital receipts for all transactions and purchases.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Business Insights</h4>
                                <p>Get actionable insights and analytics to make informed business decisions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .preview-modal-content { padding: 0; background: #1E1B2E; }
        .preview-header { position:relative; display:flex; justify-content:space-between; align-items:center; padding: 2rem 2rem 1rem 2rem; border-bottom:1px solid rgba(167, 139, 250, 0.2); background: linear-gradient(135deg, #1E1B2E 0%, #252238 100%); border-radius: 1rem 1rem 0 0; overflow:hidden; }
        .preview-header h2 { margin:0; color: #F3F4F6; font-size:1.5rem; font-weight:700; }
        .preview-close { background:none; border:none; font-size:2rem; cursor:pointer; color: #94A3B8; padding:0.5rem; border-radius:0.5rem; transition:all 0.2s; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .preview-close:hover { background: rgba(167, 139, 250, 0.2); color: #A78BFA; }
        .preview-body { padding: 2rem; background: #1E1B2E; }
        .app-details { margin-bottom: 3rem; }
        .app-details h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1rem; text-align: center; }
        .app-details p { color: #E2E8F0; line-height:1.8; }
        .app-workflow { margin-bottom: 3rem; }
        .app-workflow h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1.5rem; text-align:center; }
        .workflow-steps { display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:1.5rem; margin-bottom:2rem; }
        .workflow-step { display:flex; align-items:flex-start; gap:1rem; padding:1.5rem; background: #252238; border-radius:0.75rem; border-left:4px solid #A78BFA; transition: transform 0.3s ease; }
        .workflow-step:hover { transform: translateX(5px); }
        .step-number { background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%); color:white; width:2.5rem; height:2.5rem; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.125rem; flex-shrink:0; }
        .step-content h4 { margin:0 0 0.5rem 0; color: #F3F4F6; font-size:1rem; font-weight:600; }
        .step-content p { margin:0; color: #94A3B8; font-size:0.875rem; line-height:1.5; }
        .preview-footer { padding: 2rem; border-top: 1px solid rgba(167, 139, 250, 0.2); display: flex; justify-content: center; background: #1E1B2E; border-radius: 0 0 1rem 1rem; }
        .preview-footer .btn { text-decoration: none; }
        @media (max-width: 768px) {
            .workflow-steps { grid-template-columns: 1fr; }
            .preview-header, .preview-body, .preview-footer { padding: 1rem; }
        }
    `;

    modal.style.cssText = `
        background: #1E1B2E;
        border-radius: 1rem;
        max-width: 1200px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(167, 139, 250, 0.2);
    `;

    document.head.appendChild(style);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent body scroll when modal is open - use overflow hidden instead of fixed
    // This preserves scroll position naturally
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);

    function closeModal() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
            // Restore body scroll - simply restore overflow
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
    }

    modal.querySelector('.preview-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
}

function showPorschePreview() {
    const overlay = document.createElement('div');
    overlay.className = 'preview-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
        padding: 2rem;
    `;

    const modal = document.createElement('div');
    modal.className = 'app-preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-header">
                <h2>Porsche Showcase Preview</h2>
                <button class="preview-close">&times;</button>
            </div>
            <div class="preview-body">
                <div class="app-details">
                    <h3>Project Details</h3>
                    <p>Porsche Showcase is an elegant automotive showcase website featuring stunning parallax effects, smooth animations, and a premium design aesthetic. The website demonstrates advanced CSS3 techniques including parallax scrolling, transform animations, and modern web design principles.</p>
                </div>
                <div class="app-workflow">
                    <h3>Features & Functionality</h3>
                    <div class="workflow-steps">
                        <div class="workflow-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Parallax Effects</h4>
                                <p>Immersive parallax scrolling creates depth and visual interest as users navigate through the site.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Smooth Animations</h4>
                                <p>Fluid transitions and animations enhance user experience and showcase modern web design.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Responsive Design</h4>
                                <p>Fully responsive layout ensures optimal viewing experience across all devices and screen sizes.</p>
                            </div>
                        </div>
                        <div class="workflow-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Premium Aesthetics</h4>
                                <p>Luxurious design language that reflects the premium brand identity and quality.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="preview-footer">
                <a href="https://dreidvd.github.io/porsche/" class="btn btn-primary" target="_blank">
                    <span class="download-icon">🌐</span> Visit Website
                </a>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .preview-modal-content { padding: 0; background: #1E1B2E; }
        .preview-header { position:relative; display:flex; justify-content:space-between; align-items:center; padding: 2rem 2rem 1rem 2rem; border-bottom:1px solid rgba(167, 139, 250, 0.2); background: linear-gradient(135deg, #1E1B2E 0%, #252238 100%); border-radius: 1rem 1rem 0 0; overflow:hidden; }
        .preview-header h2 { margin:0; color: #F3F4F6; font-size:1.5rem; font-weight:700; }
        .preview-close { background:none; border:none; font-size:2rem; cursor:pointer; color: #94A3B8; padding:0.5rem; border-radius:0.5rem; transition:all 0.2s; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .preview-close:hover { background: rgba(167, 139, 250, 0.2); color: #A78BFA; }
        .preview-body { padding: 2rem; background: #1E1B2E; }
        .app-details { margin-bottom: 3rem; }
        .app-details h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1rem; text-align: center; }
        .app-details p { color: #E2E8F0; line-height:1.8; }
        .app-workflow { margin-bottom: 3rem; }
        .app-workflow h3 { color: #F3F4F6; font-size:1.25rem; font-weight:600; margin-bottom:1.5rem; text-align:center; }
        .workflow-steps { display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:1.5rem; margin-bottom:2rem; }
        .workflow-step { display:flex; align-items:flex-start; gap:1rem; padding:1.5rem; background: #252238; border-radius:0.75rem; border-left:4px solid #A78BFA; transition: transform 0.3s ease; }
        .workflow-step:hover { transform: translateX(5px); }
        .step-number { background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%); color:white; width:2.5rem; height:2.5rem; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.125rem; flex-shrink:0; }
        .step-content h4 { margin:0 0 0.5rem 0; color: #F3F4F6; font-size:1rem; font-weight:600; }
        .step-content p { margin:0; color: #94A3B8; font-size:0.875rem; line-height:1.5; }
        .preview-footer { padding: 2rem; border-top: 1px solid rgba(167, 139, 250, 0.2); text-align: center; background: #1E1B2E; border-radius: 0 0 1rem 1rem; }
        .preview-footer p { color: #94A3B8; }
        @media (max-width: 768px) {
            .workflow-steps { grid-template-columns: 1fr; }
            .preview-header, .preview-body, .preview-footer { padding: 1rem; }
        }
    `;

    modal.style.cssText = `
        background: #1E1B2E;
        border-radius: 1rem;
        max-width: 1200px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(167, 139, 250, 0.2);
    `;

    document.head.appendChild(style);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent body scroll when modal is open - use overflow hidden instead of fixed
    // This preserves scroll position naturally
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);

    function closeModal() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
            // Restore body scroll - simply restore overflow
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
    }

    modal.querySelector('.preview-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
}

function showImageModal(images, currentIndex) {
    const overlay = document.createElement('div');
    overlay.className = 'image-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modal = document.createElement('div');
    modal.className = 'image-modal-container';
    modal.style.cssText = `
        position: relative;
        max-width: 95vw;
        max-height: 95vh;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'image-modal-close';
    closeBtn.style.cssText = `
        position: absolute;
        top: -50px;
        right: 0;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10002;
    `;
    
    // Navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&#8249;';
    prevBtn.className = 'image-modal-nav image-modal-prev';
    prevBtn.style.cssText = `
        position: absolute;
        left: -60px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10002;
    `;
    
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&#8250;';
    nextBtn.className = 'image-modal-nav image-modal-next';
    nextBtn.style.cssText = `
        position: absolute;
        right: -60px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10002;
    `;
    
    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-modal-content';
    imageContainer.style.cssText = `
        position: relative;
        max-width: 100%;
        max-height: 100%;
    `;
    
    const img = document.createElement('img');
    img.className = 'image-modal-img';
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 0.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;
    
    // Caption
    const captionEl = document.createElement('div');
    captionEl.className = 'image-modal-caption';
    captionEl.style.cssText = `
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-weight: 600;
        text-align: center;
        background: rgba(0, 0, 0, 0.7);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 1rem;
    `;
    
    // Image counter
    const counterEl = document.createElement('div');
    counterEl.className = 'image-modal-counter';
    counterEl.style.cssText = `
        position: absolute;
        top: -50px;
        left: 0;
        color: white;
        font-weight: 600;
        background: rgba(0, 0, 0, 0.7);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
    `;
    
    // Current image index
    let currentImgIndex = currentIndex;
    
    function updateImage() {
        const currentImage = images[currentImgIndex];
        img.src = currentImage.src;
        captionEl.textContent = currentImage.caption;
        counterEl.textContent = `${currentImgIndex + 1} / ${images.length}`;
        
        // Update button states
        prevBtn.style.opacity = currentImgIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentImgIndex === images.length - 1 ? '0.5' : '1';
        prevBtn.style.pointerEvents = currentImgIndex === 0 ? 'none' : 'auto';
        nextBtn.style.pointerEvents = currentImgIndex === images.length - 1 ? 'none' : 'auto';
    }
    
    // Navigation functions
    function showPrev() {
        if (currentImgIndex > 0) {
            currentImgIndex--;
            updateImage();
        }
    }
    
    function showNext() {
        if (currentImgIndex < images.length - 1) {
            currentImgIndex++;
            updateImage();
        }
    }
    
    function closeModal() {
        overlay.style.opacity = '0';
        setTimeout(() => {
            // Simply restore overflow - scroll position is naturally preserved
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 300);
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    
    // Keyboard navigation
    const keyHandler = (e) => {
        switch(e.key) {
            case 'Escape':
                closeModal();
                document.removeEventListener('keydown', keyHandler);
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    };
    document.addEventListener('keydown', keyHandler);
    
    // Close on overlay click (but not on modal content)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Hover effects for buttons
    [closeBtn, prevBtn, nextBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(255, 255, 255, 0.3)';
            btn.style.transform = btn === closeBtn ? 'scale(1.1)' : 'translateY(-50%) scale(1.1)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(255, 255, 255, 0.2)';
            btn.style.transform = btn === closeBtn ? 'scale(1)' : 'translateY(-50%) scale(1)';
        });
    });
    
    // Add responsive styles for mobile
    const responsiveStyle = document.createElement('style');
    responsiveStyle.textContent = `
        @media (max-width: 768px) {
            .image-modal-nav {
                left: 10px !important;
                right: 10px !important;
                width: 40px !important;
                height: 40px !important;
                font-size: 1.5rem !important;
            }
            .image-modal-prev {
                left: 10px !important;
            }
            .image-modal-next {
                right: 10px !important;
            }
            .image-modal-close {
                top: 10px !important;
                right: 10px !important;
                width: 40px !important;
                height: 40px !important;
                font-size: 1.5rem !important;
            }
            .image-modal-counter {
                top: 10px !important;
                left: 10px !important;
                font-size: 0.75rem !important;
                padding: 0.25rem 0.5rem !important;
            }
            .image-modal-caption {
                bottom: -30px !important;
                font-size: 0.875rem !important;
                padding: 0.25rem 0.5rem !important;
            }
        }
    `;
    document.head.appendChild(responsiveStyle);
    
    // Assemble modal
    imageContainer.appendChild(img);
    imageContainer.appendChild(captionEl);
    modal.appendChild(closeBtn);
    modal.appendChild(prevBtn);
    modal.appendChild(nextBtn);
    modal.appendChild(counterEl);
    modal.appendChild(imageContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent body scroll when modal is open - use overflow hidden instead of fixed
    // This preserves scroll position naturally
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Initialize
    updateImage();
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // Clean up styles when modal closes
    const originalCloseModal = closeModal;
    closeModal = function() {
        if (document.head.contains(responsiveStyle)) {
            document.head.removeChild(responsiveStyle);
        }
        // Simply restore overflow - scroll position is naturally preserved
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        originalCloseModal();
    };
}

// Initialize app preview
initAppPreview();

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Any scroll-based functionality can be added here
}, 16)); // ~60fps

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    // Only log errors in development (when not in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Portfolio Error:', e.error);
    }
    // In production, errors are silently handled to avoid exposing internals
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    }
});

// Focus management for better accessibility
document.addEventListener('DOMContentLoaded', function() {
    const focusableElements = document.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="email"], input[type="submit"], [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});

// ===== SKILL FLOATING ANIMATIONS =====
function initSkillFloatingAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Skip animation setup for users who prefer reduced motion
        return;
    }
    
    const skillBadges = document.querySelectorAll('.skill-badge');
    
    skillBadges.forEach((badge, index) => {
        // Create unique animation delays and durations for each skill
        const delay = (index * 0.3) % 2; // Stagger delays between 0-2 seconds
        const duration = 5 + (index % 3) * 0.5; // Vary duration between 5-6.5 seconds
        
        // Apply custom animation properties
        badge.style.animationDelay = `${delay}s`;
        badge.style.animationDuration = `${duration}s`;
    });
}

// ===== IMAGE ERROR HANDLING =====
function initImageErrorHandling() {
    // Handle all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace with a placeholder or hide the image
            this.style.display = 'none';
            // Optionally, you could set a placeholder image:
            // this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
        });
    });
    
    // Handle background images in elements with background-image style
    const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
    elementsWithBg.forEach(el => {
        const bgImage = el.style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (urlMatch) {
                const imgUrl = urlMatch[1];
                const testImg = new Image();
                testImg.onerror = function() {
                    // If image fails to load, add a fallback class
                    el.classList.add('bg-image-error');
                    el.style.backgroundImage = 'none';
                    el.style.backgroundColor = '#f0f0f0';
                    // Add a placeholder text if it's a project preview
                    if (el.classList.contains('project-preview')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'project-placeholder-text';
                        placeholder.textContent = 'Image not available';
                        placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 0.9rem;';
                        if (!el.querySelector('.project-placeholder-text')) {
                            el.appendChild(placeholder);
                        }
                    }
                };
                testImg.src = imgUrl;
            }
        }
    });
}
