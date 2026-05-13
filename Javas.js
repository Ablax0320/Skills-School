// ============================================
// SKILLS SCHOOL - JAVASCRIPT FUNCTIONALITY
// Interactive features va animations
// ============================================

// DOM Elements
const courseCards = document.querySelectorAll('.course-card');
const contactForm = document.querySelector('.contact-form');
const navLinks = document.querySelectorAll('.nav-link');
const ctaButton = document.querySelector('.cta-button');

// ============================================
// 1. SMOOTH SCROLL & NAVBAR EFFECTS
// ============================================

// Navbar shadow on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
    } else {
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#0066cc';
        } else {
            link.style.color = '';
        }
    });
});

// ============================================
// 2. COURSE CARD INTERACTIONS
// ============================================

courseCards.forEach(card => {
    // Hover animation
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Add glow effect
        const courseName = this.querySelector('h3').textContent;
        console.log('Kurs tanlanmoqda:', courseName);
    });
    
    // Click animation
    card.addEventListener('click', function() {
        const courseName = this.querySelector('h3').textContent;
        const courseMeta = this.querySelector('.course-meta').textContent;
        
        // Show toast notification
        showNotification(`"${courseName}" kursiga qiziqtiraksiz!`);
        
        // Add ripple effect
        createRipple(event);
    });
});

// ============================================
// 3. CTA BUTTON ANIMATION
// ============================================

if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        // Bounce animation
        ctaButton.style.animation = 'none';
        setTimeout(() => {
            ctaButton.style.animation = 'fadeInUp 0.8s ease-out 0.5s both, glow 2s ease-in-out 0.5s infinite';
        }, 10);
        
        showNotification('Kurslarni ko\'rishga tayyormis!');
        
        // Scroll to courses section
        const coursesSection = document.getElementById('courses');
        if (coursesSection) {
            setTimeout(() => {
                coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    });
}

// ============================================
// 4. FORM SUBMISSION
// ============================================

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = contactForm.querySelectorAll('input, textarea');
        let allFilled = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                allFilled = false;
                input.style.borderColor = '#ff6b6b';
                input.style.animation = 'shake 0.5s';
            }
        });
        
        if (allFilled) {
            // Success animation
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.textContent = '✓ Jo\'natildi!';
            submitBtn.style.background = '#4caf50';
            
            // Clear form
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = 'Jo\'natish';
                submitBtn.style.background = '';
            }, 2000);
            
            showNotification('Xabaringiz muvaffaqiyatli jo\'natildi!');
        }
    });
    
    // Remove error styles on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '';
            input.style.animation = '';
        });
    });
}

// ============================================
// 5. NOTIFICATION SYSTEM
// ============================================

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #0066cc, #0052a3);
        color: white;
        padding: 1.2rem 1.8rem;
        border-radius: 50px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 10px 40px rgba(0, 102, 204, 0.4);
        animation: slideInRight 0.5s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// ============================================
// 6. RIPPLE EFFECT
// ============================================

function createRipple(event) {
    const button = event.target.closest('button') || event.target.closest('.course-card');
    if (!button) return;
    
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        top: ${y}px;
        left: ${x}px;
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// 7. LAZY LOAD ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-on-scroll');
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and items
document.querySelectorAll('.course-card, .feature-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ============================================
// 8. PARALLAX EFFECT
// ============================================

window.addEventListener('mousemove', (e) => {
    const floatingBoxes = document.querySelectorAll('.floating-box');
    
    floatingBoxes.forEach(box => {
        const speed = 5;
        const x = (window.innerWidth - e.clientX * speed) / 100;
        const y = (window.innerHeight - e.clientY * speed) / 100;
        
        box.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});

// ============================================
// 9. COUNTER ANIMATION
// ============================================

function animateCounters() {
    const stats = document.querySelectorAll('.stat-item h4');
    
    stats.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        const isPercentage = stat.textContent.includes('%');
        const suffix = isPercentage ? '%' : '';
        let currentValue = 0;
        
        const increment = finalValue / 30;
        const interval = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= finalValue) {
                stat.textContent = finalValue + suffix;
                clearInterval(interval);
            } else {
                stat.textContent = Math.floor(currentValue) + suffix;
            }
        }, 50);
    });
}

// Run counter animation when section is visible
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                aboutObserver.unobserve(entry.target);
            }
        });
    });
    aboutObserver.observe(aboutSection);
}

// ============================================
// 10. KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    // ESC key - close any open modals
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notif => notif.remove());
    }
    
    // Arrow keys - navigate between course cards
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentCard = document.activeElement;
        if (currentCard.classList.contains('course-card')) {
            const allCards = Array.from(courseCards);
            const currentIndex = allCards.indexOf(currentCard);
            
            if (e.key === 'ArrowRight') {
                const nextCard = allCards[currentIndex + 1] || allCards[0];
                nextCard.focus();
            } else {
                const prevCard = allCards[currentIndex - 1] || allCards[allCards.length - 1];
                prevCard.focus();
            }
        }
    }
});

// ============================================
// 11. DARK MODE TOGGLE (Optional)
// ============================================

function setupDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
        document.documentElement.style.setProperty('--secondary', '#0d0d0d');
        document.documentElement.style.setProperty('--primary', '#ffffff');
        document.documentElement.style.setProperty('--light-gray', '#1a1a1a');
    }
}

// ============================================
// 12. PERFORMANCE MONITORING
// ============================================

window.addEventListener('load', () => {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Sahifa yuklandi: ' + pageLoadTime + 'ms');
    }
});

// ============================================
// 13. MOBILE MENU OPTIMIZATION
// ============================================

function optimizeMobile() {
    if (window.innerWidth <= 768) {
        courseCards.forEach(card => {
            card.addEventListener('click', function() {
                // Add active state for mobile
                courseCards.forEach(c => c.style.outline = '');
                this.style.outline = '3px solid #0066cc';
            });
        });
    }
}

window.addEventListener('resize', optimizeMobile);
optimizeMobile();

// ============================================
// 14. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Skills School saytiga xush kelibsiz!');
    setupDarkMode();
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// ============================================
// 15. ACCESSIBILITY IMPROVEMENTS
// ============================================

// Improve focus states
courseCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            card.click();
        }
    });
});

// Add ARIA labels
courseCards.forEach((card, index) => {
    const title = card.querySelector('h3').textContent;
    card.setAttribute('aria-label', `${index + 1}-kurs: ${title}`);
});

// ============================================
// 16. TOUCH OPTIMIZATION
// ============================================

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swiped left - go to next section
        window.scrollBy({ left: 300, behavior: 'smooth' });
    }
    if (touchEndX > touchStartX + 50) {
        // Swiped right - go to previous section
        window.scrollBy({ left: -300, behavior: 'smooth' });
    }
}

// ============================================
// Export functions for external use
// ============================================

window.SkillsSchool = {
    showNotification: showNotification,
    animateCounters: animateCounters,
    scrollToCourses: () => {
        document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
    }
};

console.log('✓ Barcha funksiyalar faol!');
