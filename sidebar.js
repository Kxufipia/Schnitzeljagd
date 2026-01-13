
// Sidebar Navigation Logic
// Depends on settings.js (QUIZ_CONFIG) and gamestate.js (GameState) being loaded

(function () {
    // Styles for the sidebar
    const css = `
        /* Remove Toggle */
        #sidebar-toggle { display: none; }
        
        #sidebar-container {
            position: fixed;
            top: 0;
            left: 0; /* Always visible */
            width: 280px;
            height: 100vh;
            background: rgba(10, 10, 15, 0.95);
            border-right: 1px solid #333;
            z-index: 99;
            backdrop-filter: blur(10px);
            padding-top: 2rem;
            padding-left: 1rem;
            padding-right: 1rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        /* Shift Main Content */
        body {
            padding-left: 300px; /* Make room for sidebar */
            transition: padding-left 0.3s;
        }
        
        /* Mobile adjust? Keep it simple for now as requested */
        @media (max-width: 768px) {
            #sidebar-container {
                width: 200px;
            }
            body {
                padding-left: 210px;
            }
        }

        .sidebar-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            border-radius: 0.25rem;
            text-decoration: none;
            color: #888;
            font-size: 0.9rem;
            border: 1px solid transparent;
            transition: all 0.2s;
        }
        
        /* Status Colors */
        .sidebar-item.locked {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .sidebar-item.completed {
            border-color: #225522;
            background: rgba(34, 85, 34, 0.2);
            color: #8f8;
        }
        
        .sidebar-item.skipped {
            border-color: #555522;
            background: rgba(85, 85, 34, 0.2);
            color: #ff8;
        }
        
        .sidebar-item.current {
            border-color: var(--wow-gold);
            background: rgba(198, 155, 109, 0.1);
            color: white;
            font-weight: bold;
        }
        
        .sidebar-item:hover:not(.locked) {
            background: rgba(255,255,255,0.05);
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Create Sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar-container';
    document.body.appendChild(sidebar);

    // No Toggle Logic needed

    // Render Items
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for State to be decoded by main script potentially
        // Or decode clean here
        const state = GameState.decode();
        if (!state) return; // No state, maybe login page

        // Import CONFIG
        // If using modules this is clean, but here we rely on global/window
        // We added export update to settings.js but main file might not treat it as module
        // Let's assume global script loading order or fallback
        const config = (typeof QUIZ_CONFIG !== 'undefined') ? QUIZ_CONFIG : [];
        if (!config.length) return;

        // Current Page ID
        const currentPath = window.location.pathname.split('/').pop();
        const currentQuiz = config.find(q => q.file === currentPath) || {};

        config.forEach((quiz, index) => {
            if (quiz.id === 'result') return; // Skip result link

            const item = document.createElement('div');
            item.className = 'sidebar-item';

            // Determine Status
            const scoreData = state.scores[quiz.id];
            let status = 'locked';
            let icon = '🔒';

            // Is visited/unlocked?
            if (state.visited && state.visited.includes(quiz.id)) {
                status = 'unlocked';
            }

            // Override if completed/skipped
            if (scoreData) {
                if (scoreData.status === 'completed') {
                    status = 'completed';
                    icon = '✅';
                } else if (scoreData.status === 'skipped') {
                    status = 'skipped';
                    icon = '⏭️';
                }
            }

            // Is Current?
            if (quiz.file === currentPath) {
                status = 'current';
                icon = '📍';
            }

            item.classList.add(status);

            const title = document.createElement('span');
            title.textContent = `${index + 1}. ${quiz.title}`;

            item.innerHTML = `<span>${icon}</span> ${title.outerHTML}`;

            // Link Logic
            if (status !== 'locked' && status !== 'current') {
                item.style.cursor = 'pointer';
                item.onclick = () => {
                    // Navigate
                    let url = `${quiz.file}?data=${GameState.encode(state)}`;
                    if (window.appendThemeParam) {
                        url = window.appendThemeParam(url);
                    }
                    window.location.href = url;
                };
            }

            sidebar.appendChild(item);
        });
    });

})();

// Expose Skip Helper Globally so pages can use it easily
window.skipQuiz = function (quizId) {
    const currentState = GameState.decode();
    if (currentState) {
        const encoded = GameState.skip(currentState, quizId);

        // Find next url
        const nextUrl = GameState.getNextQuizUrl(currentState, quizId);

        // Redirect
        let finalUrl = nextUrl; // already has data params
        if (window.appendThemeParam) {
            // Need to be careful not to double param if getNextQuizUrl adds one?
            // getNextQuizUrl adds ?data=...
            // appendThemeParam adds &mode=...
            finalUrl = window.appendThemeParam(finalUrl);
        }
        window.location.href = finalUrl;
    }
};
