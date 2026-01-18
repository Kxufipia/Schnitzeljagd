// Game HUD Component
// Renders the right-side stats panel
(function () {
    const HUD_ID = 'game-hud';

    function initHUD() {
        // Always remove old one to ensure fresh render if called multiple times
        const oldHud = document.getElementById(HUD_ID);
        if (oldHud) oldHud.remove();

        // Decode State
        let state = null;
        if (typeof GameState !== 'undefined') {
            state = GameState.decode();
        }

        state = state || {}; // Default empty if null

        // 1. Resolve Player Name
        // Try State -> LocalStorage -> Default
        const playerName = state.player || localStorage.getItem('wow_character_name') || "Held";
        // Resolve Class Color
        const charClass = state.charClass || 'warrior';

        // Ensure Global Theme matches (Double check)
        // Since HUD loads late, this catches cases where script.js might have missed it
        if (window.applyClassTheme) {
            window.applyClassTheme(charClass);
        } else {
            // Manual fallback if function not exposed
            // checking CLASS_COLORS from global scope?
            // Safest is to rely on script.js doing it, but let's be safe.
        }

        // 2. Calculate Stats
        const totalScore = Math.round(state.totalScore || 0);

        // Get Config for Quest Counts
        const config = window.QUIZ_CONFIG || [];
        // If config is missing, we can't calculate open count accurately
        const totalQuests = config.length ? config.filter(q => q.id !== 'result').length : 0;

        // Parse Scores
        const scores = state.scores || {};
        const completedCount = Object.values(scores).filter(s => s.status === 'completed').length;
        const skippedCount = Object.values(scores).filter(s => s.status === 'skipped').length;

        let openCount = 0;
        if (totalQuests > 0) {
            openCount = totalQuests - completedCount - skippedCount;
            if (openCount < 0) openCount = 0;
        }

        // Calculate Level Data
        const lvlData = GameState.getLevelData(totalScore);

        // Calculate Max Score dynamically
        let maxPossibleScore = 0;
        if (config.length) {
            maxPossibleScore = config.reduce((sum, q) => {
                if (q.id === 'result') return sum;
                return sum + (q.maxPoints || 1000);
            }, 0);
        }

        // Prevent Divide by Zero
        if (maxPossibleScore === 0) maxPossibleScore = 15000; // Fallback estimate

        const xpPercent = Math.min(100, Math.max(0, (totalScore / maxPossibleScore) * 100));

        // Create or Hydrate Container
        let hud = document.getElementById(HUD_ID);

        if (!hud) {
            hud = document.createElement('div');
            hud.id = HUD_ID;
            hud.className = 'glass-panel';
            document.body.appendChild(hud);
        }

        // Always update content (Hydration)
        hud.innerHTML = `
            <div class="hud-row header">
                <span class="hud-label">Held</span>
                <span class="hud-value name class-color-${charClass}">${playerName}</span>
            </div>
            
            <div class="hud-divider"></div>

            <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: baseline;">
                <span class="hud-accent" style="font-size: 0.9rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Stufe ${lvlData.level}</span>
                <span class="hud-subtext" style="font-size: 0.75rem;">${lvlData.percent.toFixed(0)}%</span>
            </div>
            
            <div class="xp-container" style="margin-top: 0.25rem; margin-bottom: 0.25rem;">
                <div class="xp-bar">
                    <div class="xp-fill" style="width: ${lvlData.percent}%"></div>
                    <div class="xp-text">${lvlData.label}</div>
                </div>
            </div>

            <div style="text-align: right; margin-bottom: 1rem;">
                <span class="hud-muted" style="font-size: 0.8rem; font-weight: 400;">Total: ${totalScore} Pkt.</span>
            </div>

            <div class="hud-divider"></div>
            
            <div class="hud-stats-grid">
                <div class="stat-item completed">
                    <span class="stat-label">Erledigt</span>
                    <span class="stat-val">⚔ ${completedCount}</span>
                </div>
                <div class="stat-item skipped">
                    <span class="stat-label">Skipped</span>
                    <span class="stat-val">⏭️ ${skippedCount}</span>
                </div>
                <div class="stat-item open">
                    <span class="stat-label">Offen</span>
                    <span class="stat-val">! ${openCount}</span>
                </div>
            </div>
        `;
    }

    // Run immediately (Script is at bottom of body, so body exists)
    // This ensures HUD is present for View Transitions snapshots
    initHUD();
})();
