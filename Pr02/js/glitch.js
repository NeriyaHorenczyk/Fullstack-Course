// Insert a full-page canvas overlay for glitch effects
const canvas = document.createElement('canvas');
canvas.id = 'glitchOverlay';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Make the overlay full-page and non-intercepting
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = 9999;

// Resize handling
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse position
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Glitch parameters
const scanlineDensity = 10; // px between scanlines
const horizontalShiftChance = 0.005;
const colorShiftChance = 0.02;

// Animation loop
function glitchLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // SCANLINES
    ctx.fillStyle = 'rgba(0,255,0,0.05)';
    for (let y = 0; y < canvas.height; y += scanlineDensity) {
        if (Math.random() < 0.5) {
            const scanLineHeight = (Math.random() * 3 + 1) | 0; // 1 to 4 px
            ctx.fillRect(0, y, canvas.width, scanLineHeight);
        }
    }

    // HORIZONTAL TEARING EFFECT (simulate misalignment)
    const bodyElements = document.querySelectorAll('h1, h2, h3, p, .game, .tile');
    bodyElements.forEach((el) => {
        if (Math.random() < horizontalShiftChance) {
            const shiftX = (Math.random() * 8 - 4) | 0; // -4px to +4px
            el.style.transform = `translateX(${shiftX}px)`;
        } else {
            el.style.transform = '';
        }
    });

    // RANDOM COLOR SHIFT (brief flicker)
    if (Math.random() < colorShiftChance) {
        document.body.style.filter = `hue-rotate(${Math.random() * 30 - 15}deg) brightness(${
            0.8 + Math.random() * 0.4
        })`;
    } else {
        document.body.style.filter = '';
    }

    // CURSOR-BASED CHROMATIC DISTORTION
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = (mouseX - centerX) / centerX; // -1 to 1
    const dy = (mouseY - centerY) / centerY; // -1 to 1

    const maxOffset = 4; // max pixels for RGB channels
    const rOffset = dx * maxOffset;
    const gOffset = dy * maxOffset;
    const bOffset = (-(dx + dy) / 2) * maxOffset;

    // Apply via CSS filter to simulate chromatic shift
    // document.body.style.filter = `drop-shadow(${rOffset}px 0 red) drop-shadow(0 ${gOffset}px lime) drop-shadow(${bOffset}px 0 cyan)`;

    requestAnimationFrame(glitchLoop);
}

// Start the glitch effect
glitchLoop();
