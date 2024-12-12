class TerminalAnimation {
    constructor() {
        this.terminal = document.querySelector('.terminal-content');
        this.loadingTexts = [
            'Initializing...',
            'Loading dependencies...',
            'Compiling components...',
            'Deploying portfolio...',
            'Ready!'
        ];
        this.init();
    }

    async init() {
        for (const text of this.loadingTexts) {
            await this.typeText(text);
            await this.wait(1000);
        }
        this.hideLoadingScreen();
    }

    async typeText(text) {
        const delay = 50;
        for (let i = 0; i < text.length; i++) {
            const currentText = text.substring(0, i + 1);
            this.terminal.querySelector('.typed-text').textContent = currentText;
            await this.wait(delay);
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    hideLoadingScreen() {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
            document.body.classList.add('loaded');
        }, 500);
    }
}

// Theme Toggler
class ThemeToggler {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        this.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Navigation Highlight
class Navigation {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 60) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Skill Bars Animation
class SkillBars {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.animated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (this.animated) return;
            
            const skillsSection = document.querySelector('.skills');
            const skillsPosition = skillsSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (skillsPosition < screenPosition) {
                this.animateSkills();
                this.animated = true;
            }
        });
    }

    animateSkills() {
        this.skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = `${progress}%`;
        });
    }
}

// Project Cards Animation
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, { threshold: 0.1 });

        this.cards.forEach(card => observer.observe(card));
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            try {
                this.form.classList.add('sending');
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                this.showMessage('Message sent successfully!', 'success');
                this.form.reset();
            } catch (error) {
                this.showMessage('Error sending message. Please try again.', 'error');
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

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    new TerminalAnimation();
    new ThemeToggler();
    new Navigation();
    new SkillBars();
    new ProjectCards();
    new ContactForm();
});

// Performance optimizations
const debounce = (func, wait = 20) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});