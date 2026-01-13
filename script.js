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

    // Check Local Storage (Only if elements exist)
    const savedName = localStorage.getItem('wow_character_name');
    if (savedName && loggedInSection && input) {
        showLoggedInState(savedName);
        input.value = savedName; // Pre-fill
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
                showLoggedInState(name);

                // New Game State Logic
                if (typeof GameState !== 'undefined') {
                    const encodedState = GameState.init(name);

                    // Visual feedback on button
                    const btn = form.querySelector('button');
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<span>FÜR DIE HORDE!</span>';
                    btn.style.borderColor = 'var(--wow-gold)';

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.borderColor = '';
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
