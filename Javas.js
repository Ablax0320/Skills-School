import * as THREE from 'three';

// ========== SETUP ==========
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020210);
scene.fog = new THREE.FogExp2(0x020210, 0.0008);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 18);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// ========== YORUG'LIK ==========
// Ambient light
const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

// Quyosh nuri (point light)
const sunLight = new THREE.PointLight(0xffaa66, 2, 50);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Qo'shimcha yorug'liklar
const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
fillLight.position.set(1, 2, 1);
scene.add(fillLight);

const backLight = new THREE.PointLight(0xff66cc, 0.2);
backLight.position.set(-2, 1, -3);
scene.add(backLight);

// ========== QUYOSH (Sun) ==========
const sunGeometry = new THREE.SphereGeometry(1.2, 128, 128);
const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa55,
    emissive: 0xff4411,
    emissiveIntensity: 1.2,
    metalness: 0.1,
    roughness: 0.3
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Quyosh atrofidagi yorug'lik sferasi (glow effect)
const sunGlowGeometry = new THREE.SphereGeometry(1.35, 64, 64);
const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff8844,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide
});
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
scene.add(sunGlow);

// ========== SAYYORALAR MA'LUMOTLARI ==========
const planets = [
    { name: 'Merkuriy', radius: 0.12, distance: 2.0, color: 0xaa8866, speed: 0.025, detail: 32 },
    { name: 'Venera',   radius: 0.15, distance: 2.6, color: 0xccaa77, speed: 0.018, detail: 48 },
    { name: 'Yer',      radius: 0.16, distance: 3.2, color: 0x4488ff, speed: 0.015, detail: 64 },
    { name: 'Mars',     radius: 0.14, distance: 3.8, color: 0xcc6644, speed: 0.012, detail: 48 },
    { name: 'Yupiter',  radius: 0.32, distance: 4.8, color: 0xccaa88, speed: 0.008, detail: 96 },
    { name: 'Saturn',   radius: 0.28, distance: 5.6, color: 0xddbb99, speed: 0.006, detail: 96 },
    { name: 'Uran',     radius: 0.22, distance: 6.4, color: 0x88ccdd, speed: 0.005, detail: 64 },
    { name: 'Neptun',   radius: 0.22, distance: 7.2, color: 0x4488aa, speed: 0.004, detail: 64 }
];

const planetMeshes = [];
const orbits = [];

// Sayyoralarni yaratish
planets.forEach((planet, index) => {
    // Sayyora sferasi
    const geometry = new THREE.SphereGeometry(planet.radius, planet.detail, planet.detail);
    const material = new THREE.MeshStandardMaterial({
        color: planet.color,
        metalness: 0.4,
        roughness: 0.6,
        emissive: 0x000000
    });
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.userData = {
        distance: planet.distance,
        speed: planet.speed,
        angle: Math.random() * Math.PI * 2,
        name: planet.name
    };
    
    // Boshlang'ich pozitsiya
    planetMesh.position.x = planet.distance;
    scene.add(planetMesh);
    
    // Orbit chizig'i (halqa shaklida)
    const orbitPoints = [];
    const orbitRadius = planet.distance;
    const orbitSegments = 128;
    
    for (let i = 0; i <= orbitSegments; i++) {
        const angle = (i / orbitSegments) * Math.PI * 2;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;
        orbitPoints.push(new THREE.Vector3(x, 0, z));
    }
    
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x4488aa, transparent: true, opacity: 0.3 });
    const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);
    
    planetMeshes.push(planetMesh);
    orbits.push(orbitLine);
    
    // Saturn uchun halqa
    if (planet.name === 'Saturn') {
        const ringGeometry = new THREE.TorusGeometry(planet.radius * 1.6, 0.06, 64, 200);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0xccaa88,
            metalness: 0.7,
            roughness: 0.4,
            transparent: true,
            opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        planetMesh.add(ring);
        ring.rotation.x = Math.PI / 2.2;
        ring.rotation.z = 0.3;
    }
});

// ========== ASTEROID HALQASI (Mars va Yupiter oralig'ida) ==========
const asteroidCount = 800;
const asteroidGroup = new THREE.Group();
const asteroidGeometry = new THREE.BufferGeometry();
const asteroidPositions = new Float32Array(asteroidCount * 3);

for (let i = 0; i < asteroidCount; i++) {
    const radius = 4.2 + Math.random() * 0.8;
    const angle = Math.random() * Math.PI * 2;
    const yOffset = (Math.random() - 0.5) * 0.8;
    
    asteroidPositions[i * 3] = Math.cos(angle) * radius;
    asteroidPositions[i * 3 + 1] = yOffset;
    asteroidPositions[i * 3 + 2] = Math.sin(angle) * radius;
}

asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));

const asteroidMaterial = new THREE.PointsMaterial({
    color: 0xaa9977,
    size: 0.04,
    transparent: true
});

const asteroidField = new THREE.Points(asteroidGeometry, asteroidMaterial);
scene.add(asteroidField);

// ========== YULDUZLAR (Stars Background) ==========
const starCount = 2000;
const starsGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 400;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 150 - 50;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.7
});

const stars = new THREE.Points(starsGeometry, starMaterial);
scene.add(stars);

// Ikkinchi darajali kichik yulduzlar (uzoq)
const starCount2 = 800;
const starsGeometry2 = new THREE.BufferGeometry();
const starPositions2 = new Float32Array(starCount2 * 3);

for (let i = 0; i < starCount2; i++) {
    starPositions2[i * 3] = (Math.random() - 0.5) * 600;
    starPositions2[i * 3 + 1] = (Math.random() - 0.5) * 300;
    starPositions2[i * 3 + 2] = (Math.random() - 0.5) * 200 - 100;
}

starsGeometry2.setAttribute('position', new THREE.BufferAttribute(starPositions2, 3));

const starMaterial2 = new THREE.PointsMaterial({
    color: 0xaaddff,
    size: 0.05,
    transparent: true,
    opacity: 0.5
});

const stars2 = new THREE.Points(starsGeometry2, starMaterial2);
scene.add(stars2);

// ========== ZARRALAR (uzoq galaktika effekti) ==========
const particleCount = 4000;
const particlesGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 80;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: 0x88aaff,
    size: 0.03,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

// ========== ANIMATSIYA ==========
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.008;
    
    // Quyoshning aylanishi va porlashi
    sun.rotation.y += 0.004;
    sunGlow.rotation.y += 0.001;
    
    // Quyosh nuri intensivligining o'zgarishi
    const intensity = 1.8 + Math.sin(time * 3) * 0.2;
    sunLight.intensity = intensity;
    
    // Sayyoralarni harakatlantirish
    planetMeshes.forEach(planet => {
        const data = planet.userData;
        data.angle += data.speed;
        
        const x = Math.cos(data.angle) * data.distance;
        const z = Math.sin(data.angle) * data.distance;
        
        planet.position.set(x, 0, z);
        
        // Sayyoraning o'z o'qi atrofida aylanishi
        planet.rotation.y += 0.01;
    });
    
    // Asteroid halqasini aylantirish
    asteroidField.rotation.y += 0.002;
    
    // Yulduzlarni sekin aylantirish
    stars.rotation.y += 0.0002;
    stars.rotation.x += 0.0001;
    stars2.rotation.y -= 0.00015;
    
    // Zarralarni aylantirish
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0002;
    
    // Kamerani sekin harakatlantirish (sayyoralarni kuzatish effekti)
    camera.position.x += (Math.sin(time * 0.1) * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (Math.sin(time * 0.15) * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

animate();

// ========== WINDOW RESIZE ==========
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ========== MOUSE INTERAKSIYASI ==========
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    targetX = mouseX * 0.8;
    targetY = mouseY * 0.5;
});

function updateCameraTarget() {
    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (-targetY - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    requestAnimationFrame(updateCameraTarget);
}
updateCameraTarget();

console.log('🚀 Realistik Quyosh tizimi ishga tushdi!');
