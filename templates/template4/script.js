class MagneticCursor {
    constructor() {
        this.cursor = document.querySelector('.magnetic-cursor');
        this.links = document.querySelectorAll('a, button');
        this.initCursor();
        this.initHovers();
    }

    initCursor() {
        window.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                this.cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
            });
        });
    }

    initHovers() {
        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(3)';
            });

            link.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
            });

            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                link.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
            });
        });
    }
}

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.initSmoothScroll();
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
}

// Image Reveal Animation
class ImageReveal {
    constructor() {
        this.images = document.querySelectorAll('.image-reveal');
        this.initObserver();
    }

    initObserver() {
        const options = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, options);

        this.images.forEach(image => observer.observe(image));
    }
}

// Collection Grid Animation
class CollectionGrid {
    constructor() {
        this.items = document.querySelectorAll('.collection-item');
        this.initHovers();
    }

    initHovers() {
        this.items.forEach(item => {
            const image = item.querySelector('img');
            
            item.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
                this.dimOtherItems(item);
            });

            item.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
                this.resetItems();
            });
        });
    }

    dimOtherItems(activeItem) {
        this.items.forEach(item => {
            if (item !== activeItem) {
                item.style.opacity = '0.5';
            }
        });
    }

    resetItems() {
        this.items.forEach(item => {
            item.style.opacity = '1';
        });
    }
}

// Form Handling
class AppointmentForm {
    constructor() {
        this.form = document.querySelector('.appointment-form');
        this.initForm();
    }

    initForm() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            try {
                this.form.classList.add('sending');
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                this.showMessage('Appointment request sent successfully!', 'success');
                this.form.reset();
            } catch (error) {
                this.showMessage('Error sending request. Please try again.', 'error');
            } finally {
                this.form.classList.remove('sending');
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

// Shopping Cart
class ShoppingCart {
    constructor() {
        this.cartCount = document.querySelector('.cart-count');
        this.cartItems = [];
        this.initCart();
    }

    initCart() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                this.addToCart(e.target.closest('.featured-item'));
            });
        });
    }

    addToCart(item) {
        this.cartItems.push({
            id: Date.now(),
            name: item.querySelector('h3').textContent,
            price: item.querySelector('.price').textContent
        });
        
        this.updateCartCount();
        this.animateCartButton();
    }

    updateCartCount() {
        this.cartCount.textContent = this.cartItems.length;
    }

    animateCartButton() {
        this.cartCount.classList.add('pulse');
        setTimeout(() => this.cartCount.classList.remove('pulse'), 300);
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    new MagneticCursor();
    new SmoothScroll();
    new ImageReveal();
    new CollectionGrid();
    new AppointmentForm();
    new ShoppingCart();

    // Page load animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});

// Performance optimization
const debounce = (func, wait = 20) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Lazy loading images
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