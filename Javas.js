import * as THREE from 'three';

// ========== SETUP ==========
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010108);
scene.fog = new THREE.FogExp2(0x010108, 0.0005);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 16);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// ========== YORUG'LIK (Kuchaytirilgan) ==========
const ambientLight = new THREE.AmbientLight(0x222244);
scene.add(ambientLight);

// Quyosh nuri (kuchli)
const sunLight = new THREE.PointLight(0xffaa66, 2.5, 60);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// To'ldiruvchi yorug'liklar
const fillLight = new THREE.DirectionalLight(0x88aaff, 0.5);
fillLight.position.set(2, 3, 2);
scene.add(fillLight);

const backLight = new THREE.PointLight(0xff66cc, 0.4);
backLight.position.set(-3, 2, -5);
scene.add(backLight);

const rimLight = new THREE.PointLight(0x44ffaa, 0.3);
rimLight.position.set(3, 1, 4);
scene.add(rimLight);

// ========== QUYOSH (Yorqin va katta) ==========
const sunGeometry = new THREE.SphereGeometry(1.4, 128, 128);
const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa55,
    emissive: 0xff4422,
    emissiveIntensity: 1.5,
    metalness: 0.1,
    roughness: 0.2
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Quyosh porlashi (glow)
const sunGlowGeometry = new THREE.SphereGeometry(1.6, 64, 64);
const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff8844,
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide
});
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
scene.add(sunGlow);

// Quyosh atrofidagi zarralar (korona)
const coronaCount = 800;
const coronaGeometry = new THREE.BufferGeometry();
const coronaPositions = new Float32Array(coronaCount * 3);

for (let i = 0; i < coronaCount; i++) {
    const radius = 1.7 + Math.random() * 0.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    coronaPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    coronaPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    coronaPositions[i * 3 + 2] = radius * Math.cos(phi);
}

coronaGeometry.setAttribute('position', new THREE.BufferAttribute(coronaPositions, 3));
const coronaMaterial = new THREE.PointsMaterial({
    color: 0xff8844,
    size: 0.02,
    transparent: true,
    blending: THREE.AdditiveBlending
});
const corona = new THREE.Points(coronaGeometry, coronaMaterial);
scene.add(corona);

// ========== SAYYORALAR ==========
const planets = [
    { name: 'Merkuriy', radius: 0.14, distance: 2.2, color: 0xccaa88, speed: 0.028, detail: 48 },
    { name: 'Venera',   radius: 0.17, distance: 2.9, color: 0xddbb99, speed: 0.020, detail: 64 },
    { name: 'Yer',      radius: 0.18, distance: 3.6, color: 0x4488ff, speed: 0.017, detail: 64 },
    { name: 'Mars',     radius: 0.16, distance: 4.3, color: 0xdd6644, speed: 0.014, detail: 48 },
    { name: 'Yupiter',  radius: 0.36, distance: 5.4, color: 0xccaa88, speed: 0.009, detail: 96 },
    { name: 'Saturn',   radius: 0.32, distance: 6.3, color: 0xeeddbb, speed: 0.007, detail: 96 },
    { name: 'Uran',     radius: 0.25, distance: 7.2, color: 0x88ccdd, speed: 0.006, detail: 64 },
    { name: 'Neptun',   radius: 0.25, distance: 8.1, color: 0x4488aa, speed: 0.005, detail: 64 }
];

const planetMeshes = [];

planets.forEach((planet, index) => {
    const geometry = new THREE.SphereGeometry(planet.radius, planet.detail, planet.detail);
    const material = new THREE.MeshStandardMaterial({
        color: planet.color,
        metalness: 0.3,
        roughness: 0.5,
        emissive: 0x111111
    });
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.userData = {
        distance: planet.distance,
        speed: planet.speed,
        angle: Math.random() * Math.PI * 2,
        name: planet.name
    };
    
    planetMesh.position.x = planet.distance;
    scene.add(planetMesh);
    
    // Orbit chizig'i
    const orbitPoints = [];
    const orbitRadius = planet.distance;
    for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.4 });
    const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);
    
    planetMeshes.push(planetMesh);
    
    // Saturn halqasi
    if (planet.name === 'Saturn') {
        const ringGeometry = new THREE.TorusGeometry(planet.radius * 1.7, 0.08, 64, 200);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0xddbb99,
            metalness: 0.6,
            roughness: 0.3,
            transparent: true,
            opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        planetMesh.add(ring);
        ring.rotation.x = Math.PI / 2.2;
    }
});

// ========== ASTEROID HALQASI ==========
const asteroidCount = 1500;
const asteroidGeometry = new THREE.BufferGeometry();
const asteroidPositions = new Float32Array(asteroidCount * 3);
const asteroidColors = new Float32Array(asteroidCount * 3);

for (let i = 0; i < asteroidCount; i++) {
    const radius = 4.8 + Math.random() * 1.2;
    const angle = Math.random() * Math.PI * 2;
    const yOffset = (Math.random() - 0.5) * 1.2;
    asteroidPositions[i * 3] = Math.cos(angle) * radius;
    asteroidPositions[i * 3 + 1] = yOffset;
    asteroidPositions[i * 3 + 2] = Math.sin(angle) * radius;
    
    asteroidColors[i * 3] = 0.6 + Math.random() * 0.3;
    asteroidColors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
    asteroidColors[i * 3 + 2] = 0.3 + Math.random() * 0.2;
}

asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
asteroidGeometry.setAttribute('color', new THREE.BufferAttribute(asteroidColors, 3));

const asteroidMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true
});

const asteroidField = new THREE.Points(asteroidGeometry, asteroidMaterial);
scene.add(asteroidField);

// ========== YULDUZLAR (Ko'proq va yorqinroq) ==========
const starCount = 4000;
const starsGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 500;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 250;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 80;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8
});

const stars = new THREE.Points(starsGeometry, starMaterial);
scene.add(stars);

// Kichik yulduzlar
const starCount2 = 2500;
const starsGeometry2 = new THREE.BufferGeometry();
const starPositions2 = new Float32Array(starCount2 * 3);

for (let i = 0; i < starCount2; i++) {
    starPositions2[i * 3] = (Math.random() - 0.5) * 800;
    starPositions2[i * 3 + 1] = (Math.random() - 0.5) * 400;
    starPositions2[i * 3 + 2] = (Math.random() - 0.5) * 300 - 150;
}

starsGeometry2.setAttribute('position', new THREE.BufferAttribute(starPositions2, 3));

const starMaterial2 = new THREE.PointsMaterial({
    color: 0xaaddff,
    size: 0.06,
    transparent: true,
    opacity: 0.5
});

const stars2 = new THREE.Points(starsGeometry2, starMaterial2);
scene.add(stars2);

// ========== UCHUVCHI ZARRALAR ==========
const particleCount = 6000;
const particlesGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 100;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 30;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: 0x88aaff,
    size: 0.04,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

// ========== ANIMATSIYA ==========
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.008;
    
    // Quyosh
    sun.rotation.y += 0.005;
    sunGlow.rotation.y += 0.002;
    corona.rotation.y += 0.003;
    corona.rotation.x += 0.002;
    
    // Quyosh nuri intensivligi
    const intensity = 2.2 + Math.sin(time * 3) * 0.3;
    sunLight.intensity = intensity;
    
    // Sayyoralar
    planetMeshes.forEach(planet => {
        const data = planet.userData;
        data.angle += data.speed;
        planet.position.x = Math.cos(data.angle) * data.distance;
        planet.position.z = Math.sin(data.angle) * data.distance;
        planet.rotation.y += 0.012;
    });
    
    // Asteroid halqasi
    asteroidField.rotation.y += 0.0025;
    
    // Yulduzlar
    stars.rotation.y += 0.0003;
    stars.rotation.x += 0.00015;
    stars2.rotation.y -= 0.0002;
    
    // Zarralar
    particles.rotation.y += 0.0004;
    particles.rotation.x += 0.00025;
    
    // Kamera harakati
    camera.position.x += (Math.sin(time * 0.08) * 0.8 - camera.position.x) * 0.02;
    camera.position.y += (Math.sin(time * 0.12) * 0.4 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

animate();

// ========== RESIZE ==========
window.addEventListener('resize', onWindowResize);
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
    targetX = mouseX * 1.2;
    targetY = mouseY * 0.8;
});

function updateCameraTarget() {
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (-targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    requestAnimationFrame(updateCameraTarget);
}
updateCameraTarget();

console.log('✅ 3D Quyosh tizimi ishga tushdi!');
