const GameState = {
    init(playerName, charClass = 'warrior') {
        const state = {
            player: playerName,
            charClass: charClass,
            startTime: Date.now(),
            scores: {}, // { quizId: { points: 100, time: 20, status: 'completed' | 'skipped' } }
            totalScore: 0,
            visited: ['quiz1'] // Track unlocked pages
        };
        return this.encode(state);
    },

    encode(state) {
        try {
            const json = JSON.stringify(state);
            return btoa(encodeURIComponent(json));
        } catch (e) {
            console.error("Encoding error", e);
            return "";
        }
    },

    decode() {
        try {
            const params = new URLSearchParams(window.location.search);
            const data = params.get('data');
            if (!data) return null;

            const json = decodeURIComponent(atob(data));
            return JSON.parse(json);
        } catch (e) {
            console.error("Decoding error", e);
            return null;
        }
    },

    // Get config for a quiz
    getConfig(quizId) {
        // Global config from settings.js
        if (typeof window.QUIZ_CONFIG !== 'undefined') {
            return window.QUIZ_CONFIG.find(q => q.id === quizId);
        }
        return null;
    },

    calculateScore(quizId, timeTakenSeconds) {
        const config = this.getConfig(quizId);
        if (!config) return 0;

        const maxPoints = config.maxPoints || 1000;
        const maxTime = 300; // Default 5 mins if not specified

        if (timeTakenSeconds >= maxTime) return Math.floor(maxPoints * 0.1);
        const score = Math.floor(maxPoints * (1 - (timeTakenSeconds / maxTime)));
        return Math.max(score, Math.floor(maxPoints * 0.1));
    },

    // Mark as completed with score
    update(currentState, quizId, timeTaken) {
        const score = this.calculateScore(quizId, timeTaken);

        currentState.scores[quizId] = {
            time: timeTaken,
            points: score,
            status: 'completed'
        };

        this._updateTotal(currentState);
        this._unlockNext(currentState, quizId);

        return this.encode(currentState);
    },

    // Mark as skipped (0 points)
    skip(currentState, quizId) {
        currentState.scores[quizId] = {
            time: 0,
            points: 0,
            status: 'skipped'
        };

        this._updateTotal(currentState);
        this._unlockNext(currentState, quizId);

        return this.encode(currentState);
    },

    getNextQuizUrl(currentState, currentQuizId) {
        const config = window.QUIZ_CONFIG;
        if (!config) return 'index.html';

        const currentIdx = config.findIndex(q => q.id === currentQuizId);
        if (currentIdx === -1) return 'index.html';

        // Determine last action for Toast
        let toastParam = '';
        const currentScore = currentState.scores[currentQuizId];
        if (currentScore) {
            if (currentScore.status === 'completed') toastParam = '&toast=completed';
            // Skipped quests do not trigger toasts
        }

        // Helper to append toast
        const withToast = (url) => {
            return toastParam ? (url + (url.includes('?') ? '&' : '?') + toastParam.substring(1)) : url;
        };

        // 1. Look ahead for the first non-completed quiz (Standard flow)
        for (let i = currentIdx + 1; i < config.length; i++) {
            const quiz = config[i];
            if (quiz.id === 'result') continue; // Don't jump to result yet

            const scoreData = currentState.scores[quiz.id];
            const isCompleted = scoreData && scoreData.status === 'completed';

            if (!isCompleted) {
                return withToast(`${quiz.file}?data=${this.encode(currentState)}`);
            }
        }

        // 2. Wrap around: Look from the start for any missed/skipped quizzes
        for (let i = 0; i < currentIdx; i++) {
            const quiz = config[i];
            if (quiz.id === 'result') continue;

            const scoreData = currentState.scores[quiz.id];
            const isCompleted = scoreData && scoreData.status === 'completed';

            if (!isCompleted) {
                return withToast(`${quiz.file}?data=${this.encode(currentState)}`);
            }
        }

        // 3. Check CURRENT quiz (Edge case: If I skipped the ONLY remaining quiz, stay here)
        {
            const scoreData = currentState.scores[currentQuizId];
            const isCompleted = scoreData && scoreData.status === 'completed';

            // If I am skipped (or somehow not completed), and valid, stay here.
            if (!isCompleted) {
                // We are the last open quest!
                // Don't toast if we stay on same page? Or maybe we do?
                return withToast(`${window.QUIZ_CONFIG[currentIdx].file}?data=${this.encode(currentState)}`);
            }
        }

        // 4. Only if ALL quizzes (including current) are completed, go to result
        return withToast(`result.html?data=${this.encode(currentState)}`);
    },

    _updateTotal(state) {
        state.totalScore = Object.values(state.scores)
            .reduce((sum, s) => sum + s.points, 0);
    },

    _unlockNext(state, currentQuizId) {
        const config = window.QUIZ_CONFIG;
        if (!config) return;

        const idx = config.findIndex(q => q.id === currentQuizId);
        if (idx >= 0 && idx < config.length - 1) {
            const nextId = config[idx + 1].id;
            if (!state.visited.includes(nextId)) {
                state.visited.push(nextId);
            }
        }
    },

    // Leveling Logic (18,500 total possible roughly)
    // 0 -> Lvl 1
    // 500 -> Lvl 2
    // 1500 -> Lvl 3 (Gap 1000)
    // 3000 -> Lvl 4 (Gap 1500)
    // 5000 -> Lvl 5 (Gap 2000)
    // 7500 -> Lvl 6 (Gap 2500)
    // 10500 -> Lvl 7 (Gap 3000)
    // 14000 -> Lvl 8 (Gap 3500)
    // 18000 -> Lvl 9 (Gap 4000) - Basic Max
    // 25000 -> Lvl 10 (Titan)
    getLevelData(points) {
        const thresholds = [0, 500, 1500, 3000, 5000, 7500, 10500, 14000, 18000, 25000];

        // Find current level
        let level = 1;
        for (let i = 0; i < thresholds.length; i++) {
            if (points >= thresholds[i]) {
                level = i + 1;
            } else {
                break;
            }
        }

        // Cap at Max Level
        if (level >= thresholds.length) {
            return {
                level: thresholds.length,
                current: points,
                max: points, // Full bar
                percent: 100,
                label: 'MAX'
            };
        }

        const startXP = thresholds[level - 1]; // XP at start of this level
        const nextXP = thresholds[level];     // XP needed for next level
        const range = nextXP - startXP;
        const currentXP = points - startXP;
        const percent = Math.min(100, Math.max(0, (currentXP / range) * 100));

        return {
            level: level,
            current: currentXP,
            max: range,
            percent: percent,
            label: `${currentXP} / ${range} XP`
        };
    }
};
