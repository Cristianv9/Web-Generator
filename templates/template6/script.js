const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = select('.custom-cursor');
        this.cursorTrail = select('.cursor-trail');
        this.links = selectAll('a, button');
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            window.requestAnimationFrame(() => {
                this.cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
                this.cursorTrail.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
            });
        });

        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => this.cursor.classList.add('cursor-hover'));
            link.addEventListener('mouseleave', () => this.cursor.classList.remove('cursor-hover'));
        });
    }
}

// Loading Screen
class LoadingScreen {
    constructor() {
        this.loadingScreen = select('.loading-screen');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 500);
            }, 2000);
        });
    }
}

// Smooth Scroll Navigation
class SmoothScroll {
    constructor() {
        this.links = selectAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                const headerOffset = 100;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
}

// Parallax Effects
class ParallaxEffect {
    constructor() {
        this.items = selectAll('[data-parallax]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.items.forEach(item => {
                const speed = item.dataset.parallax || 0.5;
                const rect = item.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                
                if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                    const translateY = scrolled * speed;
                    item.style.transform = `translate3d(0, ${translateY}px, 0)`;
                }
            });
        });
    }
}

// Text Animation
class TextAnimation {
    constructor() {
        this.animatedTexts = selectAll('.animate-text');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });

        this.animatedTexts.forEach(text => observer.observe(text));
    }
}

// Work Filter
class WorkFilter {
    constructor() {
        this.filterButtons = selectAll('.filter-btn');
        this.workItems = selectAll('.work-card');
        this.init();
    }

    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter work items
                this.workItems.forEach(item => {
                    const category = item.dataset.category;
                    if (filter === 'all' || filter === category) {
                        item.style.display = 'block';
                        setTimeout(() => item.classList.add('show'), 0);
                    } else {
                        item.classList.remove('show');
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
            });
        });
    }
}

// Form Handling
class ContactForm {
    constructor() {
        this.form = select('#contact-form');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            try {
                // Show loading state
                this.form.classList.add('loading');
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Success handling
                this.showMessage('Message sent successfully!', 'success');
                this.form.reset();
                
            } catch (error) {
                this.showMessage('Error sending message. Please try again.', 'error');
            } finally {
                this.form.classList.remove('loading');
            }
        });
    }

    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        this.form.appendChild(messageElement);
        
        setTimeout(() => messageElement.remove(), 3000);
    }
}

// Scroll Progress Indicator
class ScrollProgress {
    constructor() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        document.body.appendChild(this.progressBar);
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            
            const progress = (scrolled / documentHeight) * 100;
            this.progressBar.style.width = `${progress}%`;
        });
    }
}

// Navigation Menu
class NavigationMenu {
    constructor() {
        this.nav = select('.main-nav');
        this.menuToggle = select('.menu-toggle');
        this.navMenu = select('.nav-menu');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        // Menu toggle on mobile
        this.menuToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.menuToggle.classList.toggle('active');
        });

        // Hide/show navbar on scroll
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > this.lastScroll && currentScroll > 100) {
                this.nav.classList.add('hide');
            } else {
                this.nav.classList.remove('hide');
            }
            
            this.lastScroll = currentScroll;
        });
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
    new LoadingScreen();
    new SmoothScroll();
    new ParallaxEffect();
    new TextAnimation();
    new WorkFilter();
    new ContactForm();
    new ScrollProgress();
    new NavigationMenu();
});

// Performance optimizations
// Debounce scroll and resize events
function debounce(func, wait = 20) {
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

// Lazy loading images
const lazyImages = selectAll('[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Add smooth animations on scroll
const animateOnScroll = () => {
    const elements = selectAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('in-view');
        }
    });
};

window.addEventListener('scroll', debounce(animateOnScroll));