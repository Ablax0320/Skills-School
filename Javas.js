/* ============================================
   JAVASCRIPT - ADVANCED INTERACTIVITY
   ============================================ */

// Course Data
const coursesData = [
    {
        id: 1,
        title: "Computer Science",
        description: "Kompyuter fanining asosiy tushunchalari va nazariyalari",
        weeks: 12,
        level: "beginner",
        price: "Bepul",
        badge: "Asosi"
    },
    {
        id: 2,
        title: "Algoritmlar va Dasturlash Asoslari",
        description: "Mustahkam algoritm tuzish va problem-solving mahorati",
        weeks: 16,
        level: "intermediate",
        price: "450.000",
        badge: "Muhim"
    },
    {
        id: 3,
        title: "C++ Dasturlash",
        description: "C++ da yuqori samarali dasturlar yozish o'rgatiladi",
        weeks: 14,
        level: "intermediate",
        price: "500.000",
        badge: "Texnik"
    },
    {
        id: 4,
        title: "Python Dasturlash",
        description: "Python bilan yangi dunyoni kashfining o'rgatiladi",
        weeks: 12,
        level: "beginner",
        price: "Bepul",
        badge: "Boshlash"
    },
    {
        id: 5,
        title: "Web Dasturlash",
        description: "HTML, CSS, JavaScript bilan veb-saytlar yaratish",
        weeks: 16,
        level: "intermediate",
        price: "550.000",
        badge: "Zamonaviy"
    },
    {
        id: 6,
        title: "Ma'lumotlar Bazasi (SQL)",
        description: "SQL va relational databases bilan ishlash",
        weeks: 10,
        level: "intermediate",
        price: "400.000",
        badge: "Muhim"
    },
    {
        id: 7,
        title: "Ma'lumotlar Tuzilmasi",
        description: "Array, Stack, Queue, Tree, Graph va boshqalar",
        weeks: 14,
        level: "advanced",
        price: "600.000",
        badge: "Texnik"
    },
    {
        id: 8,
        title: "Linux, Ubuntu va Cybersecurity",
        description: "Tizim administratsiyasi va xavfsizlik asoslari",
        weeks: 18,
        level: "advanced",
        price: "750.000",
        badge: "Xavfsizlik"
    }
];

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const ctaButton = document.getElementById('ctaButton');
const coursesGrid = document.getElementById('coursesGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderCourses('all');
    setupEventListeners();
    createCanvasAnimation();
});

// Hamburger Menu
hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Navigation Links
const navLinkItems = document.querySelectorAll('.nav-link');
navLinkItems.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Render Courses
function renderCourses(filter) {
    coursesGrid.innerHTML = '';
    
    const filteredCourses = filter === 'all' 
        ? coursesData 
        : coursesData.filter(course => course.level === filter);

    filteredCourses.forEach((course, index) => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.setAttribute('data-level', course.level);
        courseCard.innerHTML = `
            <div class="course-header">
                <div class="course-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect x="6" y="8" width="36" height="28" stroke="currentColor" stroke-width="2" rx="2"/>
                        <circle cx="24" cy="34" r="2" fill="currentColor"/>
                    </svg>
                </div>
                <span class="course-badge">${course.badge}</span>
            </div>
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
                <span>📚 ${course.weeks} hafta</span>
                <span>👥 ${getLevelName(course.level)}</span>
            </div>
            <div class="course-footer">
                <button class="course-button" onclick="showCourseDetail(${course.id})">Batafsil</button>
                <span class="course-price">${course.price}</span>
            </div>
        `;
        coursesGrid.appendChild(courseCard);
    });
}

function getLevelName(level) {
    const levels = {
        'beginner': 'Boshlang\'ich',
        'intermediate': 'O\'rta',
        'advanced': 'Murakkab'
    };
    return levels[level];
}

// Filter Functionality
filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        renderCourses(filter);
    });
});

// Course Detail
function showCourseDetail(id) {
    alert(`${coursesData[id - 1].title} kursiga yozilish uchun contact shaklini to'ldiring!`);
}

// CTA Button
ctaButton.addEventListener('click', function() {
    document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
});

// Contact Form
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Rahmat! Sizning so\'rovingiz qabul qilindi. Tez orada biz siz bilan bog\'lanamiz! 🚀');
    contactForm.reset();
});

// Setup Event Listeners
function setupEventListeners() {
    // Scroll animations
    observeElements();
}

// Intersection Observer for animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.course-card, .feature-item, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Canvas Animation
function createCanvasAnimation() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 180, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Dynamic 3D Tilt Effect
const courseCards = document.querySelectorAll('.course-card');
courseCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 40px rgba(0, 180, 255, 0.2)';
    } else {
        navbar.style.boxShadow = '0 10px 40px rgba(0, 180, 255, 0.15)';
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

console.log('✨ Skills School - Professional IT Ta\'limi Platform Yuklandi!');
