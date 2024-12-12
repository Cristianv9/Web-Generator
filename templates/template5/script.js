class GridCursor {
    constructor() {
        this.cursor = document.querySelector('.grid-cursor');
        this.links = document.querySelectorAll('a, button');
        this.initCursor();
        this.initHovers();
    }

    initCursor() {
        document.addEventListener('mousemove', e => {
            this.cursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
        });

        document.addEventListener('mousedown', () => this.cursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => this.cursor.classList.remove('clicking'));
    }

    initHovers() {
        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });
            link.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });
        });
    }
}

// Navigation Menu
class Navigation {
    constructor() {
        this.menuBtn = document.querySelector('.menu-btn');
        this.menuOverlay = document.querySelector('.menu-overlay');
        this.menuLinks = document.querySelectorAll('.menu-links a');
        this.init();
    }

    init() {
        this.menuBtn.addEventListener('click', () => this.toggleMenu());
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.menuBtn.classList.toggle('active');
        this.menuOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMenu() {
        this.menuBtn.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        const options = {
            threshold: 0.3
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, options);

        this.sections.forEach(section => observer.observe(section));
    }
}

// Text Reveal Animation
class TextReveal {
    constructor() {
        this.textElements = document.querySelectorAll('.reveal-text');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            this.textElements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('active');
                }, 200 * index);
            });
        });
    }
}

// Work Grid
class WorkGrid {
    constructor() {
        this.workItems = document.querySelectorAll('.work-item');
        this.initHoverEffect();
    }

    initHoverEffect() {
        this.workItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.workItems.forEach(other => {
                    if (other !== item) {
                        other.style.opacity = '0.5';
                    }
                });
            });

            item.addEventListener('mouseleave', () => {
                this.workItems.forEach(other => {
                    other.style.opacity = '1';
                });
            });
        });
    }
}

// Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', e => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        try {
            this.form.classList.add('submitting');
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showMessage('Message sent successfully!', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Error sending message. Please try again.', 'error');
        } finally {
            this.form.classList.remove('submitting');
        }
    }

    showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        
        this.form.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }
}

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    new GridCursor();
    new Navigation();
    new ScrollAnimations();
    new TextReveal();
    new WorkGrid();
    new ContactForm();
    new SmoothScroll();
});

// Performance optimizations
function debounce(func, wait = 20) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));