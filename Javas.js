// ============================================
// SKILLS SCHOOL - ADVANCED JAVASCRIPT
// Professional Interactive Features & Animations
// ============================================

// DOM Elements Cache
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');
const navItems = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const courseCards = document.querySelectorAll('.course-card');
const contactForm = document.querySelector('.contact-form');
const heroSection = document.querySelector('.hero');

// ============================================
// 1. MOBILE MENU TOGGLE
// ============================================
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu on link click
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// ============================================
// 2. NAVBAR SCROLL EFFECT
// ============================================
let lastScrollTop = 0;
const navbarHeight = navbar?.offsetHeight || 80;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar?.classList.add('scrolled');
        navbar.style.boxShadow = '0 10px 30px rgba(0, 180, 255, 0.3)';
    } else {
        navbar?.classList.remove('scrolled');
        navbar.style.boxShadow = 'var(--shadow-lg)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ============================================
// 3. SMOOTH SCROLL NAVIGATION
// ============================================
navItems.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - navbarHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// 4. COURSE FILTERING SYSTEM
// ============================================
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.textContent.toLowerCase().trim();

            // Filter courses
            courseCards.forEach(card => {
                const courseBadge = card.querySelector('.course-badge');
                const badgeText = courseBadge ? courseBadge.textContent.toLowerCase().trim() : '';
                
                if (filterValue === 'hammasі' || filterValue === 'все' || filterValue === 'all') {
                    card.style.display = 'block';
                    card.classList.add('fadeInAnimation');
                    setTimeout(() => card.classList.remove('fadeInAnimation'), 800);
                } else if (badgeText.includes(filterValue) || 
                           card.querySelector('h3').textContent.toLowerCase().includes(filterValue)) {
                    card.style.display = 'block';
                    card.classList.add('fadeInAnimation');
                    setTimeout(() => card.classList.remove('fadeInAnimation'), 800);
                } else {
                    card.style.display = 'none';
                }
            });

            // Add smooth animation
            courseCards.forEach(card => {
                if (card.style.display !== 'none') {
                    card.style.animation = 'scaleIn3D 0.8s ease-out';
                }
            });
        });
    });

    // Set default filter to "All"
    const allBtn = Array.from(filterBtns).find(btn => 
        btn.textContent.toLowerCase().includes('hammasі') || 
        btn.textContent.toLowerCase().includes('барча') ||
        btn.textContent.toLowerCase().includes('all')
    );
    if (allBtn) allBtn.click();
}

// ============================================
// 5. MOUSE TILT EFFECT FOR CARDS
// ============================================
function addMouseTiltEffect(element) {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        const xRotate = (yPercent - 50) * 0.5;
        const yRotate = (50 - xPercent) * 0.5;

        element.style.transform = `perspective(1000px) rotateX(${xRotate}deg) rotateY(${yRotate}deg) translateZ(20px)`;
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
}

courseCards.forEach(card => {
    addMouseTiltEffect(card);
});

// Apply to feature items
const featureItems = document.querySelectorAll('.feature-item');
featureItems.forEach(item => {
    addMouseTiltEffect(item);
});

// Apply to testimonial cards
const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach(card => {
    addMouseTiltEffect(card);
});

// ============================================
// 6. FORM VALIDATION & SUBMISSION
// ============================================
if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    const submitBtn = contactForm.querySelector('.submit-btn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validation
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--danger)';
                isValid = false;
            } else {
                input.style.borderColor = 'var(--border)';
            }
        });

        if (isValid) {
            // Show success animation
            submitBtn.textContent = '✓ Jo\'natildi!';
            submitBtn.style.background = 'linear-gradient(135deg, var(--success), #00cc66)';
            
            // Collect form data
            const formData = {
                name: contactForm.querySelector('input[type="text"]').value,
                email: contactForm.querySelector('input[type="email"]').value,
                course: contactForm.querySelector('select') ? contactForm.querySelector('select').value : 'N/A',
                message: contactForm.querySelector('textarea').value,
                timestamp: new Date().toLocaleString('uz-UZ')
            };

            // Log form data (in production, send to server)
            console.log('Form Data:', formData);
            
            // Reset form after 2 seconds
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = 'Jo\'natish';
                submitBtn.style.background = 'linear-gradient(135deg, var(--accent), var(--accent-glow))';
                inputs.forEach(input => {
                    input.style.borderColor = 'var(--border)';
                });
            }, 2000);
        }
    });

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--accent)';
        });

        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--danger)';
            } else {
                input.style.borderColor = 'var(--border)';
            }
        });
    });
}

// ============================================
// 7. INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp3D 1s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.course-card, .feature-item, .testimonial-card, .stat-item').forEach(el => {
    observer.observe(el);
});

// ============================================
// 8. CANVAS PARTICLE ANIMATION (Hero Section)
// ============================================
function createParticleAnimation() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '5';
    canvas.style.pointerEvents = 'none';
    
    if (heroSection) {
        heroSection.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = heroSection ? heroSection.offsetHeight : window.innerHeight;

    // Particle system
    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary wrapping
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 180, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();

            // Draw connections between nearby particles
            particles.forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(0, 180, 255, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = heroSection ? heroSection.offsetHeight : window.innerHeight;
    });
}

// Only create particles on desktop
if (window.innerWidth > 768) {
    createParticleAnimation();
}

// ============================================
// 9. ACTIVE NAV LINK INDICATOR
// ============================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
                link.style.color = 'var(--accent)';
            } else {
                link.style.color = 'var(--primary)';
            }
        });
    });
}

updateActiveNavLink();

// ============================================
// 10. TYPING EFFECT FOR HERO TITLE
// ============================================
function typewriterEffect() {
    const titleWords = document.querySelectorAll('.hero-title .word');
    let totalDelay = 0;

    titleWords.forEach((word, index) => {
        const letters = word.textContent.split('');
        word.textContent = '';
        
        letters.forEach((letter, letterIndex) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.display = 'inline-block';
            span.style.animation = `fadeInUp3D 0.1s ease-out forwards`;
            span.style.animationDelay = `${totalDelay + letterIndex * 50}ms`;
            word.appendChild(span);
        });

        totalDelay += letters.length * 50 + 200;
    });
}

// Call typewriter effect on page load
window.addEventListener('load', () => {
    typewriterEffect();
});

// ============================================
// 11. SCROLL PROGRESS BAR
// ============================================
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgressBar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--accent), var(--accent-glow));
        width: 0%;
        z-index: 999;
        box-shadow: 0 0 20px rgba(0, 180, 255, 0.5);
        transition: width 0.1s linear;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

createScrollProgressBar();

// ============================================
// 12. SMOOTH FADE IN ON PAGE LOAD
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// 13. KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Alt + M: Toggle menu
    if (e.altKey && e.key === 'm') {
        if (menuToggle) menuToggle.click();
    }

    // Alt + H: Go to home
    if (e.altKey && e.key === 'h') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Alt + C: Go to courses
    if (e.altKey && e.key === 'c') {
        const coursesSection = document.getElementById('courses');
        if (coursesSection) {
            coursesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ============================================
// 14. UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
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

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add active state to course cards on click
courseCards.forEach(card => {
    card.addEventListener('click', function() {
        courseCards.forEach(c => c.style.borderColor = 'var(--border)');
        this.style.borderColor = 'var(--accent)';
    });
});

// ============================================
// 15. PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ============================================
// 16. CONSOLE GREETING
// ============================================
console.log('%c🚀 Skills School - Professional IT Ta\'limi', 'color: #00b4ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(0,180,255,0.5)');
console.log('%cMukkammal 3D animatsiyalar va professional design!', 'color: #00ffcc; font-size: 14px; font-style: italic');
console.log('%cKeyboard Shortcuts: Alt+M (Menu), Alt+H (Home), Alt+C (Courses)', 'color: #aaaaaa; font-size: 12px');

// ============================================
// 17. INITIALIZATION ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Skills School fully loaded and interactive!');
    
    // Add animations to all elements
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach((el, index) => {
        el.style.animation = `fadeInUp3D 1s ease-out forwards`;
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// ============================================
// 18. SMOOTH SCROLL POLYFILL
// ============================================
if (!('scrollBehavior' in document.documentElement.style)) {
    window.addEventListener('click', (e) => {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                e.preventDefault();
            }
        }
    });
}

// Export functions for external use if needed
window.SkillsSchool = {
    debounce,
    throttle,
    createParticleAnimation,
    updateActiveNavLink,
    typewriterEffect
};
