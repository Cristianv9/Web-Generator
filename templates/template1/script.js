const isThreeLoaded = typeof THREE !== 'undefined';

// Main Scene Controller
class SceneController {
    constructor() {
        if (!isThreeLoaded) {
            console.warn('Three.js not loaded. Skipping 3D features.');
            return;
        }

        this.initScenes();
    }

    initScenes() {
        try {
            // Only initialize 3D scenes if canvas elements exist
            if (document.getElementById('bg-scene')) {
                new BackgroundScene();
            }
            if (document.getElementById('hero-canvas')) {
                new HeroModel();
            }
        } catch (error) {
            console.warn('Error initializing 3D scenes:', error);
        }
    }
}

// Background Scene with error handling
class BackgroundScene {
    constructor() {
        try {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('bg-scene'),
                alpha: true,
                antialias: true
            });
            this.particles = [];
            this.init();
        } catch (error) {
            console.warn('Error creating background scene:', error);
        }
    }

    init() {
        if (!this.renderer) return;
        
        try {
            this.setupRenderer();
            this.createParticles();
            this.setupCamera();
            this.animate();
            this.handleResize();
        } catch (error) {
            console.warn('Error initializing background scene:', error);
        }
    }

    // ... rest of BackgroundScene methods
}

// Hero Model with error handling
class HeroModel {
    constructor() {
        try {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('hero-canvas'),
                alpha: true,
                antialias: true
            });
            this.model = null;
            this.init();
        } catch (error) {
            console.warn('Error creating hero model:', error);
        }
    }

    // ... rest of HeroModel methods
}

// Regular DOM Interactions
class UIController {
    constructor() {
        this.initializeComponents();
    }

    initializeComponents() {
        // Initialize non-3D components
        new LoadingScreen();
        new SkillsAnimation();
        new ProjectPreview();
        new ContactForm();
        this.initializeSmoothScroll();
        this.initializeLazyLoading();
    }

    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyMedia = document.querySelectorAll('img[data-src], video[data-src]');
            const mediaObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const media = entry.target;
                        media.src = media.dataset.src;
                        media.classList.add('loaded');
                        observer.unobserve(media);
                    }
                });
            });

            lazyMedia.forEach(media => mediaObserver.observe(media));
        }
    }
}

// Regular components (No Three.js dependencies)
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.querySelector('.loading-screen');
        this.progressBar = document.querySelector('.progress');
        if (this.loadingScreen && this.progressBar) {
            this.init();
        }
    }

    init() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                this.hideLoadingScreen();
            }
            this.progressBar.style.width = `${progress}%`;
        }, 200);
    }

    hideLoadingScreen() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            document.body.classList.add('loaded');
        }, 500);
    }
}

// Initialize everything safely
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components first
    const ui = new UIController();

    // Check if we should initialize 3D features
    if (isThreeLoaded) {
        const sceneController = new SceneController();
    } else {
        // Fallback for when Three.js is not available
        document.body.classList.add('no-webgl');
    }
});

// Export necessary classes for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SceneController,
        UIController,
        LoadingScreen
    };
}