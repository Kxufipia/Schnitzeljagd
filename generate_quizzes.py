
import os

template = """<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HSB Schnitzeljagd 2.0 - Rätsel {id}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="background-effects">
        <canvas id="campfire"></canvas>
    </div>

    <div id="theme-controls" class="glass-panel"
        style="position: fixed; top: 1rem; right: 1rem; z-index: 50; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.9rem; display:flex; gap: 0.5rem; color: #ccc;">
        <span id="btn-dark" style="cursor: pointer;">Dark</span> / <span id="btn-light"
            style="cursor: pointer;">Light</span>
    </div>

    <main>
        <div class="container animate-enter" style="max-width: 54rem;">
            <h1 style="margin-bottom: 1.5rem;">Rätsel {id}</h1>

            <div class="glass-panel card">
                <h2 style="text-align: center; margin-bottom: 1.5rem; color: #ccc;">Coming Soon...</h2>
                <p style="text-align: center; margin-bottom: 2rem;">Dieses Rätsel ist noch nicht verfügbar.</p>
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button id="skip-btn" class="btn-primary" style="flex: 1; border-color: #666; opacity: 0.8;" onclick="skipQuiz('quiz{id}')">
                        <span>⏭️ Skip / Weiter</span>
                    </button>
                </div>
            </div>
        </div>
    </main>

    <script src="campfire.js"></script>
    <script src="stars.js"></script>
    <script type="module" src="settings.js"></script>
    <script src="settings.js" type="module"></script>
    <script src="gamestate.js"></script>
    <script src="sidebar.js"></script>
    <script src="script.js"></script>
    <script>
        const QUIZ_ID = 'quiz{id}';
        
        // Init State Check
        try {
            const state = GameState.decode();
            if (!state) throw new Error("No state");
        } catch (e) {
            // alert("Fehler: Kein Spielstand.");
            // window.location.href = 'index.html';
        }
    </script>
</body>
</html>
"""

base_path = r"c:/Users/aherd/.gemini/antigravity/scratch/schnitzeljagd"

for i in range(2, 16):
    filename = f"quiz-{i}.html"
    content = template.replace("{id}", str(i))
    with open(os.path.join(base_path, filename), "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {filename}")
