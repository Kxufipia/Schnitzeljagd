
const ps = [
    { name: "Thrall", score: 14500 },
    { name: "Jaina", score: 14200 },
    { name: "Sylvanas", score: 13800 },
    { name: "Anduin", score: 12500 },
    { name: "Garrosh", score: 9000 }
];

ps.forEach(p => {
    const state = {
        player: p.name,
        startTime: Date.now() - 3600000,
        scores: {},
        totalScore: p.score,
        visited: Array.from({ length: 15 }, (_, i) => `quiz${i + 1}`).concat(['result'])
    };

    // Fill dummy scores
    const pts = Math.floor(p.score / 15);
    for (let i = 1; i <= 15; i++) {
        state.scores[`quiz${i}`] = { points: pts, time: 30, status: 'completed' };
    }

    // Encode: btoa(encodeURIComponent(JSON.stringify(state)))
    const json = JSON.stringify(state);
    const code = btoa(encodeURIComponent(json));

    console.log(`Name: ${p.name} (Score: ${p.score})`);
    console.log(`Code: ${code}`);
    console.log('---');
});
