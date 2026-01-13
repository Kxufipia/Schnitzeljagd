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

        // Interaction
        star.onmouseover = () => {
            star.style.color = '#ffaa00';
            star.style.textShadow = '0 0 15px #ff4500';
            star.style.transform = `scale(${scale * 1.5}) rotate(90deg)`;
            star.style.opacity = '1';
        };

        // Reset on mouse out
        star.onmouseout = () => {
            star.style.color = '';
            star.style.textShadow = '';
            star.style.transform = '';
            star.style.opacity = '';
        };

        sky.appendChild(star);
    }
});
