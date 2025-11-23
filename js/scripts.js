// Portfolio JavaScript Functionality

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initActiveNavigation();
    initMobileNavigation();
    initScrollAnimations();
    initContactForm();
    initScrollToTop();
});

/**
 * Smooth Scrolling for Navigation Links
 * Makes navigation links scroll smoothly to sections instead of jumping
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

/**
 * Active Navigation Highlighting
 * Highlights the current section in navigation as user scrolls
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveLink);
    
    // Update on page load
    updateActiveLink();
}

/**
 * Mobile Navigation Toggle
 * Handles hamburger menu for mobile devices
 */
function initMobileNavigation() {
    // Create hamburger menu button
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = `
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
    `;
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Insert hamburger before nav menu
    navContainer.insertBefore(hamburger, navMenu);
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('mobile-menu-open');
        hamburger.classList.toggle('hamburger-open');
        
        // Update aria-expanded
        const isOpen = navMenu.classList.contains('mobile-menu-open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navContainer.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.remove('mobile-menu-open');
    hamburger.classList.remove('hamburger-open');
    hamburger.setAttribute('aria-expanded', 'false');
}

/**
 * Scroll Animations
 * Adds fade-in animations as elements come into view
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-category, .experience-item, .project-card, .contact-form');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Contact Form Handling
 * Validates and handles contact form submission
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
        // Validate form
        if (validateForm(name, email, message)) {
            // Show success message
            showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            
            // Reset form
            this.reset();
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateForm(name, email, message) {
    let isValid = true;
    
    // Name validation
    if (!name || name.length < 2) {
        showFieldError('name', 'Please enter your name (at least 2 characters)');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Message validation
    if (!message || message.length < 10) {
        showFieldError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous error
    clearFieldError(fieldName);
    
    // Validate based on field type
    switch(fieldName) {
        case 'name':
            if (!value || value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value)) {
                showFieldError(fieldName, 'Please enter a valid email');
            }
            break;
        case 'message':
            if (!value || value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters');
            }
            break;
    }
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    clearFieldError(fieldName);
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    formGroup.appendChild(errorDiv);
    field.classList.add('error');
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    field.classList.remove('error');
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Insert before form
    const form = document.querySelector('.contact-form form');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

/**
 * Scroll to Top Button
 * Shows a button to scroll back to top when user scrolls down
 */
function initScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Additional CSS for JavaScript-enhanced features
const additionalCSS = `
/* Mobile Navigation Styles */
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.hamburger-line {
    width: 30px;
    height: 3px;
    background-color: var(--text-color);
    transition: var(--transition);
    transform-origin: center;
}

.hamburger-open .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-open .hamburger-line:nth-child(2) {
    opacity: 0;
}

.hamburger-open .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
}

.nav-menu {
    transition: var(--transition);
}

.mobile-menu-open {
    display: flex !important;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    padding: 1rem;
    box-shadow: var(--shadow-lg);
    border-top: 1px solid var(--border-color);
}

/* Animation Styles */
.animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
}

/* Form Validation Styles */
.error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.form-message {
    padding: 1rem;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    font-weight: 500;
}

.form-message.success {
    background-color: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
}

/* Scroll to Top Button */
.scroll-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.25rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
    z-index: 1000;
}

.scroll-to-top.visible {
    opacity: 1;
    visibility: visible;
}

.scroll-to-top:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }
    
    .nav-menu {
        display: none;
    }
    
    .mobile-menu-open {
        display: flex !important;
    }
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);
