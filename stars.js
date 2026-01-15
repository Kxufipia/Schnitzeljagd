document.addEventListener('DOMContentLoaded', () => {
    // Create Sky Container if not exists
    let sky = document.getElementById('star-sky');
    if (!sky) {
        sky = document.createElement('div');
        sky.id = 'star-sky';
        document.body.prepend(sky);
    }

    // Generate scattered stars
    const starCount = 40; // Number of stars

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.innerHTML = '+';

        // Random Position (Top 35% of screen to simulate sky)
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 35 + 'vh';

        // Random scale for depth
        const scale = 0.8 + Math.random() * 1.5;
        star.style.fontSize = scale + 'rem';
        star.style.opacity = 0.3 + Math.random() * 0.5;

        // Random blink styling
        star.style.animationDelay = Math.random() * 5 + 's';
        if (Math.random() > 0.6) star.classList.add('active');

        // Interaction - Handled by CSS for dynamic colors now
        // But we can keep the scale/rotate transform logic if we want, 
        // OR just let CSS handle it all. CSS is better for theme.
        // Let's remove this JS interaction block entirely.

        // Reset isn't needed if we don't set it.

        sky.appendChild(star);
    }
});
