const canvas = document.getElementById('campfire');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Mouse interaction
let mouse = { x: undefined, y: undefined };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100; // Start below screen
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = -Math.random() * 2 - 1; // Always move up
        this.size = Math.random() * 3 + 1;
        this.life = Math.random() * 100 + 100;
        this.maxLife = this.life;
        this.color = `rgba(255, ${100 + Math.random() * 100}, 0,`; // Orange/Yellow range
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
        // Natural upward movement
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // Mouse interaction (swirl)
        if (mouse.x !== undefined) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                const force = (200 - distance) / 200;
                this.vx += (dx / distance) * force * 0.1;
                this.vy += (dy / distance) * force * 0.1;
            }
        }

        // Turbulence
        this.vx += (Math.random() - 0.5) * 0.05;

        // Reset if dead or off screen
        if (this.life <= 0 || this.y < -50) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        const opacity = (this.life / this.maxLife) * this.alpha;
        ctx.fillStyle = this.color + opacity + ')';
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particles = [];
    // Calculate number of particles based on screen size
    const particleCount = (width * height) / 10000;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
        // Pre-warm the system so particles cover the screen initially
        for (let j = 0; j < 200; j++) particles[i].update();
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });
}

init();
animate();
