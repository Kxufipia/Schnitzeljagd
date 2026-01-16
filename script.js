// Theme Helpers - Expose immediately for inline scripts
window.getCurrentTheme = function () {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') || localStorage.getItem('theme') || 'dark';
};

window.appendThemeParam = function (url) {
    const theme = window.getCurrentTheme();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}mode=${theme}`;
};

document.addEventListener('DOMContentLoaded', () => {
    // Theme Logic using URL params ?mode=dark|light

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); // Keep local backup

        // Update URL without reload to reflect change immediately if feasible
        const url = new URL(window.location);
        url.searchParams.set('mode', theme);
        window.history.replaceState({}, '', url);

        updateActiveState(theme);
        updateLinks(theme);
    }

    function updateActiveState(theme) {
        const btnDark = document.getElementById('btn-dark');
        const btnLight = document.getElementById('btn-light');

        if (btnDark && btnLight) {
            if (theme === 'dark') {
                btnDark.style.fontWeight = 'bold';
                btnDark.style.color = 'var(--wow-gold)';
                btnLight.style.fontWeight = 'normal';
                btnLight.style.opacity = '0.5';
                btnLight.style.color = 'inherit';
            } else {
                btnLight.style.fontWeight = 'bold';
                btnLight.style.color = 'var(--wow-blue)';
                btnDark.style.fontWeight = 'normal';
                btnDark.style.opacity = '0.5';
                btnDark.style.color = 'inherit';
            }
        }
    }

    // Update simple <a> links to include mode
    function updateLinks(theme) {
        document.querySelectorAll('a').forEach(a => {
            // Avoid external links or #
            const href = a.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                // Strip existing mode arg if any to avoid duplication
                // Simpler: Just construct new URL object
                try {
                    // Create dummy base if relative
                    const url = new URL(href, window.location.origin);
                    url.searchParams.set('mode', theme);
                    // Return relative path + search
                    // If the original href was just "page.html", we want "page.html?mode=..."
                    // If it was "page.html?data=...", we want "page.html?data=...&mode=..."
                    // URL object is absolute, we need relative.
                    // Let's just use string parsing for simplicity on static file structure
                    let newHref = href;
                    if (newHref.includes('mode=')) {
                        newHref = newHref.replace(/mode=[^&]*/, `mode=${theme}`);
                    } else {
                        const sep = newHref.includes('?') ? '&' : '?';
                        newHref = `${newHref}${sep}mode=${theme}`;
                    }
                    a.setAttribute('href', newHref);
                } catch (e) {
                    // ignore invalid urls
                }
            }
        });
    }

    // Init
    const currentTheme = window.getCurrentTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateActiveState(currentTheme);

    // Delay link update slightly to ensure DOM is ready? 
    // Usually DOMContentLoaded is fine.
    setTimeout(() => updateLinks(currentTheme), 100);

    const btnDark = document.getElementById('btn-dark');
    const btnLight = document.getElementById('btn-light');

    if (btnDark) btnDark.onclick = () => applyTheme('dark');
    if (btnLight) btnLight.onclick = () => applyTheme('light');

    const form = document.getElementById('login-form');
    const input = document.getElementById('charName');
    const loggedInSection = document.getElementById('logged-in-section');
    const displayName = document.getElementById('display-name');

    // Class Colors Mapping (Standard WoW Colors)
    const CLASS_COLORS = {
        'warrior': '#C79C6E',
        'paladin': '#F58CBA',
        'hunter': '#ABD473',
        'rogue': '#FFF569',
        'priest': '#FFFFFF',
        'deathknight': '#C41F3B',
        'shaman': '#0070DE',
        'mage': '#40C7EB',
        'warlock': '#8787ED',
        'monk': '#00FF96',
        'druid': '#FF7D0A',
        'demonhunter': '#A330C9',
        'evoker': '#33937F'
    };

    function applyClassTheme(className) {
        const color = CLASS_COLORS[className] || '#ffd700'; // Default to gold
        if (color) {
            document.documentElement.style.setProperty('--current-theme-color', color);
            // Also override gold if we mean to replace the "main" accent
            document.documentElement.style.setProperty('--wow-gold', color);

            // AUTO CONTRAST CALCULATION
            const hex = color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);

            // YIQ Brightness formula
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            const contrastColor = (yiq >= 150) ? '#000000' : '#FFFFFF';

            document.documentElement.style.setProperty('--text-on-theme', contrastColor);
        }
    }
    window.applyClassTheme = applyClassTheme; // Expose for HUD

    // Try to restore theme from State or Storage
    if (typeof GameState !== 'undefined') {
        try {
            // Use the shared decoder which handles base64/URI encoding
            const state = GameState.decode();
            if (state && state.charClass) {
                applyClassTheme(state.charClass);
            }
        } catch (e) {
            console.log("Theme init restore failed", e);
        }
    }

    // Fallback to local storage if state didn't have it (or parse failed)
    if (!document.documentElement.style.getPropertyValue('--current-theme-color')) {
        const savedClass = localStorage.getItem('wow_character_class');
        if (savedClass) applyClassTheme(savedClass);
    }
    const savedName = localStorage.getItem('wow_character_name');
    if (savedName && loggedInSection && input) {
        showLoggedInState(savedName);
        input.value = savedName; // Pre-fill
    }

    // Class Selection UI Logic (Run immediately)
    // Updated for "Class Banners"
    const classBanners = document.querySelectorAll('.class-banner');
    const classInput = document.getElementById('charClass');
    const submitBtn = form ? form.querySelector('button') : null;

    if (classBanners.length > 0 && classInput) {
        classBanners.forEach(banner => {
            banner.addEventListener('click', () => {
                // Remove selected from all
                classBanners.forEach(b => b.classList.remove('selected'));
                // Add to clicked
                banner.classList.add('selected');

                // Update hidden input
                const val = banner.dataset.value;
                classInput.value = val;

                // Play sound
                if (window.SoundManager) SoundManager.playClick();

                // Dynamic Style Preview
                // Read the inline variable --banner-color directly for accuracy
                const color = banner.style.getPropertyValue('--banner-color').trim();

                if (color) {
                    // 1. Update CSS Variable for Global Theme
                    document.documentElement.style.setProperty('--current-theme-color', color);
                    document.documentElement.style.setProperty('--wow-gold', color);

                    // 2. Button Glow
                    if (submitBtn) {
                        submitBtn.style.border = `2px solid ${color}`;
                        submitBtn.style.boxShadow = `0 0 20px ${color}`;
                        submitBtn.style.color = color;

                        // Force a little pulse
                        submitBtn.animate([
                            { transform: 'scale(1)' },
                            { transform: 'scale(1.05)' },
                            { transform: 'scale(1)' }
                        ], { duration: 200 });
                    }
                }
            });
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = input.value.trim();

            if (name) {
                // Secret Access
                if (name.toLowerCase() === 'warchas') {
                    let target = 'decoder.html';
                    target = window.appendThemeParam(target);
                    window.location.href = target;
                    return;
                }

                localStorage.setItem('wow_character_name', name);

                // Save class for theme persistence
                if (classInput) {
                    localStorage.setItem('wow_character_class', classInput.value);
                }

                showLoggedInState(name);

                // New Game State Logic
                if (typeof GameState !== 'undefined') {
                    const charClass = classInput.value;
                    const encodedState = GameState.init(name, charClass);

                    // Visual feedback on button
                    const btn = form.querySelector('button');
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<span>FÜR DIE HORDE!</span>';
                    // btn.style.borderColor = 'var(--wow-gold)'; // Already colored by selection!

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.borderColor = '';
                        btn.style.boxShadow = '';
                        // Redirect with state and mode
                        let targetUrl = `quiz-1.html?data=${encodedState}`;
                        targetUrl = window.appendThemeParam(targetUrl);
                        window.location.href = targetUrl;
                    }, 1000);
                } else {
                    console.error("GameState not loaded");
                }
            }
        });
    }

    function showLoggedInState(name) {
        // If we wanted to hide the form, we could.
        // For now, we just show the pill below.
        if (!displayName || !loggedInSection) return;

        displayName.textContent = name;
        loggedInSection.classList.remove('hidden');
        loggedInSection.classList.add('animate-enter');
    }
});
