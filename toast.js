// Toast Manager
// Checks URL for triggers and displays Achievements

(function () {
    function checkToast() {
        const params = new URLSearchParams(window.location.search);
        const toastId = params.get('toast');

        if (toastId) {
            showAchievement(toastId);

            // Clean URL
            const url = new URL(window.location);
            url.searchParams.delete('toast');
            window.history.replaceState({}, '', url);
        }
    }

    const WOW_QUOTES = [
        "Lok'tar Ogar!",
        "For the Alliance!",
        "Work Work!",
        "Zug Zug!",
        "Time is money, friend!",
        "Elune guide you.",
        "Victory or Death!",
        "May your blades never dull.",
        "The Elements guide me.",
        "Did someone say Thunderfury?",
        "For Azeroth!",
        "Strength and Honor.",
        "You are not prepared!",
        "Anu belore dela'na.",
        "Walk with the Earth Mother.",
        "Dark Lady watch over you.",
        "Stay away from the Voodoo!",
        "Leeeeeeeroy Jenkins!",
        "More work?",
        "Frostmourne hungers.",
        "Job's done!"
    ];

    function showAchievement(id) {
        // Play Sound
        if (window.SoundManager) {
            setTimeout(() => SoundManager.playAchievement(), 500);
        }

        const container = document.createElement('div');
        container.id = 'toast-container';

        // Content
        let title = "Quest Complete";
        let sub = "";

        if (id === 'completed') {
            // Random Quote
            sub = WOW_QUOTES[Math.floor(Math.random() * WOW_QUOTES.length)];
        } else {
            // Fallback for other potential toasts
            sub = "Well done!";
        }

        container.innerHTML = `
            <div class="achievement-toast glass-panel">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <span class="achievement-title">${title}</span>
                    <span class="achievement-desc">${sub}</span>
                </div>
                <div class="achievement-glow"></div>
            </div>
        `;

        document.body.appendChild(container);

        // Remove after animation (5s to be safe)
        setTimeout(() => {
            if (container.parentNode) container.remove();
        }, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkToast);
    } else {
        checkToast();
    }
})();
