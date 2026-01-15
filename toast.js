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

    function showAchievement(id) {
        // Play Sound
        if (window.SoundManager) {
            setTimeout(() => SoundManager.playAchievement(), 500);
        }

        const container = document.createElement('div');
        container.id = 'toast-container';

        // Title lookup could be in config, for now generic or dynamic
        let title = "Quest Completed";
        let sub = "You are one step closer...";

        // Simple Lookup
        if (id === 'completed') {
            title = "Quest Complete!";
            sub = "Victory for the Horde!";
        } else if (id === 'skipped') {
            title = "Tactical Retreat";
            sub = "There is no shame in survival.";
        }

        container.innerHTML = `
            <div class="achievement-toast">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <span class="achievement-title">${title}</span>
                    <span class="achievement-desc">${sub}</span>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Auto remove handled by CSS animation fade out, but clean DOM later
        setTimeout(() => {
            container.remove();
        }, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkToast);
    } else {
        checkToast();
    }
})();
