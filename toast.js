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

// Global Error Toast (Exposed for Quizzes)
window.showErrorToast = function (message) {
    if (window.SoundManager) {
        SoundManager.playError();
    }

    const container = document.createElement('div');
    container.id = 'error-toast-container'; // Separate ID to avoid conflicts or reuse same?
    // Let's reuse styling logic but separate container so it stacks on top
    container.style.position = 'fixed';
    container.style.top = '20%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '2000';
    container.style.cursor = 'pointer';

    container.innerHTML = `
        <div class="achievement-toast glass-panel error-toast">
            <div class="achievement-icon" style="border-color: #ef4444; color: #ef4444;">❌</div>
            <div class="achievement-text">
                <span class="achievement-title" style="color: #ef4444;">Das ist leider falsch</span>
                <span class="achievement-desc">${message || 'Versuche es noch einmal!'}</span>
            </div>
            <div class="achievement-glow" style="background: radial-gradient(circle, #ef4444 0%, transparent 70%);"></div>
            <div style="font-size: 0.7rem; opacity: 0.7; margin-top:0.5rem;">(Klicken zum Schließen)</div>
        </div>
    `;

    document.body.appendChild(container);

    // Dismiss Logic
    const close = () => {
        if (container.parentNode) {
            container.style.opacity = '0';
            container.style.transform = 'translate(-50%, -60%)'; // Float up
            setTimeout(() => container.remove(), 300);
        }
    };

    container.onclick = close;

    // Auto close after 10s
    setTimeout(close, 10000);
};
