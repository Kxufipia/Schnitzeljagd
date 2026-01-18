
// Sidebar Navigation Logic
// Depends on settings.js (QUIZ_CONFIG) and gamestate.js (GameState) being loaded

(function () {
    // Styles for the sidebar
    const css = `
        /* Remove Toggle */
        #sidebar-toggle { display: none; }
        
        #sidebar-container {
            position: fixed;
            top: 50%;
            left: 1.5rem;
            transform: translateY(-50%);
            width: 250px; /* Always expanded */
            
            /* Use Global Variables for Theming */
            background: var(--wow-glass);
            border: 1px solid var(--wow-border);
            color: var(--text-main);
            
            border-radius: 1.5rem;
            z-index: 100;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 1rem 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
            overflow: hidden;
            overflow-y: auto; /* Allow scroll if list is long */
            max-height: 80vh;
        }

        /* No Hover Expansion needed anymore */
        #sidebar-container:hover {
            box-shadow: 0 20px 50px -10px rgba(0,0,0,0.6);
            border-color: var(--wow-border);
        }
            box-shadow: 0 20px 50px -10px rgba(0,0,0,0.6);
            border-color: var(--wow-border);
        }
        
        /* Mobile adjust */
        @media (max-width: 768px) {
            #sidebar-container {
                left: 0.5rem;
                width: 3.5rem;
                padding: 0.5rem;
            }
            #sidebar-container:hover {
                width: 220px;
            }
        }

        .sidebar-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
            border-radius: 1rem;
            text-decoration: none;
            
            /* Variable Colors */
            color: var(--text-muted);
            
            font-size: 0.95rem;
            white-space: nowrap;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            height: 3.5rem;
            border: 1px solid transparent; /* Prepare for hover border */
        }

        .sidebar-item span:first-child {
            font-size: 1.5rem;
            min-width: 2rem;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }

        .sidebar-item:hover span:first-child {
            transform: scale(1.2);
        }
        
        /* Status Colors */
        .sidebar-item.locked {
            opacity: 0.5;
            cursor: not-allowed;
            filter: grayscale(1);
        }
        
        .sidebar-item.completed {
            /* Keep functional green but ensure readability? 
               Maybe use variable if we defined it, otherwise hardcoded is okay for status. 
               But let's stick to accessible green. */
            color: #22c55e;
        }
        
        .sidebar-item.completed:hover {
            background: rgba(34, 197, 94, 0.1);
            color: #15803d; 
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.1);
        }
        
        .sidebar-item.skipped {
            color: #d97706; /* Darker amber for contrast */
        }
        
        .sidebar-item.skipped:hover {
            background: rgba(234, 179, 8, 0.1);
            box-shadow: 0 0 20px rgba(234, 179, 8, 0.1);
        }
        
        /* Current Item - Theme Color */
        .sidebar-item.current {
            background: linear-gradient(90deg, var(--current-theme-color), transparent); /* Wait, heavy gradient. */
            /* User wants Neutral Core. Let's make it Outline style or very subtle. */
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--current-theme-color);
            color: var(--text-main);
            border-left: 4px solid var(--current-theme-color);
            border-radius: 4px;
        }

        .sidebar-item.current span:first-child {
            color: var(--current-theme-color);
            text-shadow: 0 0 10px var(--current-theme-color);
        }
        
        .sidebar-item:hover:not(.locked) {
            background: rgba(255,255,255,0.1);
            padding-left: 1rem;
            border-color: var(--wow-border);
            color: var(--text-main);
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
                icon = '!'; // Quest Available
            }

            // Override if completed/skipped
            if (scoreData) {
                if (scoreData.status === 'completed') {
                    status = 'completed';
                    icon = '✓';
                } else if (scoreData.status === 'skipped') {
                    status = 'skipped';
                    icon = '⏭️';
                }
            }

            // Is Current?
            if (quiz.file === currentPath) {
                status = 'current';
                icon = '?'; // Active Quest
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
