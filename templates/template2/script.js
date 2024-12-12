class AudioManager {
    constructor() {
        this.sounds = {
            hover: new Audio('hover.wav'),
            click: new Audio('click.wav'),
            achievement: new Audio('achievement.wav'),
            levelUp: new Audio('levelup.wav')
        };
        this.bgMusic = new Audio('background.mp3');
        this.bgMusic.loop = true;
        this.isMuted = localStorage.getItem('isMuted') === 'true';
        this.init();
    }

    init() {
        this.updateMuteButton();
        document.querySelector('.sound-toggle').addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            localStorage.setItem('isMuted', this.isMuted);
            this.updateMuteButton();
            if (!this.isMuted) this.bgMusic.play();
            else this.bgMusic.pause();
        });
    }

    updateMuteButton() {
        const btn = document.querySelector('.sound-toggle');
        btn.textContent = this.isMuted ? '🔇' : '🔊';
    }

    play(soundName) {
        if (!this.isMuted && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
        }
    }
}

// Loading Screen with Game-Style Progress
class LoadingScreen {
    constructor() {
        this.screen = document.querySelector('.loading-screen');
        this.progressBar = document.querySelector('.progress');
        this.progressText = document.querySelector('.progress-text');
        this.assets = [
            'background.mp3',
            'hover.wav',
            'click.wav',
            'achievement.wav',
            'levelup.wav'
        ];
        this.init();
    }

    async init() {
        await this.simulateLoading();
        this.hideLoadingScreen();
    }

    async simulateLoading() {
        let progress = 0;
        const increment = 100 / this.assets.length;

        for (const asset of this.assets) {
            await new Promise(resolve => setTimeout(resolve, 500));
            progress += increment;
            this.updateProgress(progress);
        }
    }

    updateProgress(progress) {
        const rounded = Math.min(100, Math.round(progress));
        this.progressBar.style.width = `${rounded}%`;
        this.progressText.textContent = `${rounded}%`;
    }

    hideLoadingScreen() {
        this.screen.style.opacity = '0';
        setTimeout(() => {
            this.screen.style.display = 'none';
            document.body.classList.add('loaded');
        }, 500);
    }
}

// Character Animation Controller
class PixelCharacter {
    constructor() {
        this.character = document.querySelector('.character-sprite');
        this.states = {
            idle: { frames: 4, speed: 200 },
            walk: { frames: 8, speed: 100 },
            jump: { frames: 6, speed: 150 }
        };
        this.currentState = 'idle';
        this.currentFrame = 0;
        this.init();
    }

    init() {
        this.startAnimation();
        this.handleHover();
    }

    startAnimation() {
        setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.states[this.currentState].frames;
            this.updateSprite();
        }, this.states[this.currentState].speed);
    }

    updateSprite() {
        const frameSize = 32; // pixel size of each frame
        const position = -(this.currentFrame * frameSize);
        this.character.style.backgroundPosition = `${position}px 0px`;
    }

    setState(state) {
        if (this.states[state] && this.currentState !== state) {
            this.currentState = state;
            this.currentFrame = 0;
        }
    }

    handleHover() {
        this.character.addEventListener('mouseenter', () => this.setState('walk'));
        this.character.addEventListener('mouseleave', () => this.setState('idle'));
    }
}

// Skill Tree System
class SkillTree {
    constructor() {
        this.nodes = document.querySelectorAll('.skill-node');
        this.audioManager = new AudioManager();
        this.init();
    }

    init() {
        this.nodes.forEach(node => {
            this.initializeNode(node);
            this.addNodeInteraction(node);
        });
    }

    initializeNode(node) {
        const level = parseInt(node.dataset.level) || 0;
        const levelBar = node.querySelector('.level-fill');
        
        setTimeout(() => {
            levelBar.style.width = `${level}%`;
        }, 500);
    }

    addNodeInteraction(node) {
        node.addEventListener('click', () => {
            this.levelUp(node);
        });

        node.addEventListener('mouseenter', () => {
            this.showNodeDetails(node);
        });
    }

    levelUp(node) {
        const currentLevel = parseInt(node.dataset.level) || 0;
        if (currentLevel < 100) {
            const newLevel = Math.min(100, currentLevel + 10);
            node.dataset.level = newLevel;
            
            const levelBar = node.querySelector('.level-fill');
            levelBar.style.width = `${newLevel}%`;
            
            this.audioManager.play('levelUp');
            this.createLevelUpEffect(node);
        }
    }

    createLevelUpEffect(node) {
        const effect = document.createElement('div');
        effect.className = 'level-up-effect';
        effect.textContent = 'LEVEL UP!';
        node.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
    }

    showNodeDetails(node) {
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.innerHTML = `
            <h4>${node.dataset.skill}</h4>
            <p>Level: ${node.dataset.level}/100</p>
        `;
        node.appendChild(tooltip);
        
        node.addEventListener('mouseleave', () => tooltip.remove());
    }
}

// Project Showcase
class ProjectShowcase {
    constructor() {
        this.projects = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.projects.forEach(project => {
            this.initializeProject(project);
        });
    }

    initializeProject(project) {
        const preview = project.querySelector('.project-preview');
        const video = project.querySelector('video');

        if (video) {
            preview.addEventListener('mouseenter', () => {
                video.play();
            });

            preview.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }

        // Add parallax effect to project cards
        project.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = project.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            project.style.transform = `
                perspective(1000px)
                rotateY(${x * 10}deg)
                rotateX(${-y * 10}deg)
                translateZ(20px)
            `;
        });

        project.addEventListener('mouseleave', () => {
            project.style.transform = '';
        });
    }
}

// Achievement System
class AchievementSystem {
    constructor() {
        this.achievements = new Set();
        this.init();
    }

    init() {
        this.setupScrollAchievements();
        this.setupInteractionAchievements();
    }

    setupScrollAchievements() {
        window.addEventListener('scroll', () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercentage > 25) this.unlock('Explorer');
            if (scrollPercentage > 50) this.unlock('Adventurer');
            if (scrollPercentage > 90) this.unlock('Completionist');
        });
    }

    setupInteractionAchievements() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.project-card')) {
                this.unlock('Project Curious');
            }
            if (e.target.closest('.skill-node')) {
                this.unlock('Skill Master');
            }
        });
    }

    unlock(achievement) {
        if (!this.achievements.has(achievement)) {
            this.achievements.add(achievement);
            this.showNotification(achievement);
            new AudioManager().play('achievement');
        }
    }

    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <h4>Achievement Unlocked!</h4>
                <p>${achievement}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoadingScreen();
    new AudioManager();
    new PixelCharacter();
    new SkillTree();
    new ProjectShowcase();
    new AchievementSystem();

    // Add game-like hover sounds to interactive elements
    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('mouseenter', () => {
            new AudioManager().play('hover');
        });
    });
});

// Performance optimization
const debounce = (func, wait = 20) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Lazy loading images with intersection observer
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