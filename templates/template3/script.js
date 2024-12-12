class LoadingScreen {
    constructor() {
        this.loadingScreen = document.querySelector('.loading-screen');
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

// Car Configurator
class CarConfigurator {
    constructor() {
        this.configCar = document.querySelector('.config-car');
        this.colorBtns = document.querySelectorAll('.color-btn');
        this.viewBtns = document.querySelectorAll('.view-btn');
        this.currentColor = 'black';
        this.currentView = 'side';
        this.prices = {
            base: 150000,
            options: {}
        };
        this.init();
    }

    init() {
        this.colorBtns.forEach(btn => {
            btn.addEventListener('click', () => this.changeColor(btn.dataset.color));
        });

        this.viewBtns.forEach(btn => {
            btn.addEventListener('click', () => this.changeView(btn.dataset.view));
        });

        this.updatePrice();
    }

    changeColor(color) {
        this.currentColor = color;
        this.configCar.src = `/api/placeholder/car/${this.currentView}/${color}`;
        this.updatePrice();
    }

    changeView(view) {
        this.currentView = view;
        this.configCar.src = `/api/placeholder/car/${view}/${this.currentColor}`;
    }

    updatePrice() {
        const totalPrice = this.calculateTotal();
        document.querySelector('.total-price span:last-child').textContent = 
            `$${totalPrice.toLocaleString()}`;
    }

    calculateTotal() {
        return this.prices.base + Object.values(this.prices.options).reduce((a, b) => a + b, 0);
    }
}

// Model Filter
class ModelFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.models = document.querySelectorAll('.model-card');
        this.init();
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterModels(btn.dataset.filter);
            });
        });
    }

    filterModels(category) {
        this.models.forEach(model => {
            if (category === 'all' || model.dataset.category === category) {
                model.style.display = 'block';
                setTimeout(() => model.classList.add('show'), 0);
            } else {
                model.classList.remove('show');
                setTimeout(() => model.style.display = 'none', 300);
            }
        });
    }
}

// Smooth Scroll Navigation
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
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

// Test Drive Form
class TestDriveForm {
    constructor() {
        this.form = document.querySelector('.test-drive-form');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            try {
                this.form.classList.add('submitting');
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                this.showMessage('Test drive scheduled successfully!', 'success');
                this.form.reset();
            } catch (error) {
                this.showMessage('Error scheduling test drive. Please try again.', 'error');
            } finally {
                this.form.classList.remove('submitting');
            }
        });
    }

    showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        
        this.form.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }
}

// Parallax Effect for Hero Car
class ParallaxEffect {
    constructor() {
        this.heroCar = document.querySelector('.hero-car');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            this.heroCar.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    new LoadingScreen();
    new CarConfigurator();
    new ModelFilter();
    new SmoothScroll();
    new TestDriveForm();
    new ParallaxEffect();
});

// Performance optimization
const debounce = (func, wait = 20) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
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