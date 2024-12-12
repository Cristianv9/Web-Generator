document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Trigger entrance animations
            animateHeroElements();
        }, 500);
    }, 2000);
});

// Navigation Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navOverlay = document.querySelector('.nav-overlay');
const navLinks = document.querySelectorAll('.nav-menu a');

menuToggle.addEventListener('click', toggleMenu);

function toggleMenu() {
    menuToggle.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    // Animate menu items
    const menuItems = document.querySelectorAll('.nav-menu li');
    menuItems.forEach((item, index) => {
        if (navOverlay.classList.contains('active')) {
            item.style.transitionDelay = `${index * 0.1}s`;
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        } else {
            item.style.transitionDelay = '0s';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        }
    });
}

// Close menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu();
        scrollToSection(link.getAttribute('href'));
    });
});

// Smooth scrolling
function scrollToSection(target) {
    const element = document.querySelector(target);
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Split text animation for hero heading
function splitText() {
    const heroTitle = document.querySelector('.split-text');
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.animationDelay = `${index * 0.05}s`;
        span.classList.add('char');
        heroTitle.appendChild(span);
    });
}

// Animate hero elements
function animateHeroElements() {
    splitText();
    document.querySelector('.hero-content p').classList.add('fade-in-active');
    document.querySelector('.cta-container').classList.add('fade-in-active');
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .service-card').forEach(element => {
    observer.observe(element);
});

// Parallax effect for hero background
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const shape = document.querySelector('.background-shape');
    const moveX = mouseX * 100;
    const moveY = mouseY * 100;
    
    shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// Form handling with validation and animation
const contactForm = document.getElementById('contactForm');
const formGroups = document.querySelectorAll('.form-group');

formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    const label = group.querySelector('label');
    
    input.addEventListener('focus', () => {
        group.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (input.value === '') {
            group.classList.remove('focused');
        }
    });
    
    // Maintain focused state if input has value
    if (input.value !== '') {
        group.classList.add('focused');
    }
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('.submit-button');
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showFormMessage('Message sent successfully!', 'success');
        contactForm.reset();
        
    } catch (error) {
        showFormMessage('Error sending message. Please try again.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
});

function showFormMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    contactForm.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// Scroll Progress Indicator
const progressIndicator = document.createElement('div');
progressIndicator.className = 'scroll-progress';
document.body.appendChild(progressIndicator);

window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    
    const progress = (scrolled / documentHeight) * 100;
    progressIndicator.style.width = `${progress}%`;
});

// Image lazy loading
const lazyImages = document.querySelectorAll('.project-image .image-placeholder');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            imageObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

lazyImages.forEach(image => {
    imageObserver.observe(image);
});