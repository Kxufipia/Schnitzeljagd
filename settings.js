// Define the flow of the game
window.QUIZ_CONFIG = [
    { id: 'quiz1', file: 'quiz-1.html', title: 'Quest 1: Der Anfang', maxPoints: 500 },
    { id: 'quiz2', file: 'quiz-2.html', title: 'Quest 2', maxPoints: 600 },
    { id: 'quiz3', file: 'quiz-3.html', title: 'Quest 3', maxPoints: 700 },
    { id: 'quiz4', file: 'quiz-4.html', title: 'Quest 4', maxPoints: 800 },
    { id: 'quiz5', file: 'quiz-5.html', title: 'Quest 5', maxPoints: 1000 },
    { id: 'quiz6', file: 'quiz-6.html', title: 'Quest 6', maxPoints: 1000 },
    { id: 'quiz7', file: 'quiz-7.html', title: 'Quest 7', maxPoints: 1000 },
    { id: 'quiz8', file: 'quiz-8.html', title: 'Quest 8', maxPoints: 1200 },
    { id: 'quiz9', file: 'quiz-9.html', title: 'Quest 9', maxPoints: 1200 },
    { id: 'quiz10', file: 'quiz-10.html', title: 'Quest 10', maxPoints: 1200 },
    { id: 'quiz11', file: 'quiz-11.html', title: 'Quest 11', maxPoints: 1500 },
    { id: 'quiz12', file: 'quiz-12.html', title: 'Quest 12', maxPoints: 1500 },
    { id: 'quiz13', file: 'quiz-13.html', title: 'Quest 13', maxPoints: 1800 },
    { id: 'quiz14', file: 'quiz-14.html', title: 'Quest 14', maxPoints: 2000 },
    { id: 'quiz15', file: 'quiz-15.html', title: 'Quest 15', maxPoints: 2500 },
    { id: 'result', file: 'result.html', title: 'Ergebnis', maxPoints: 0 }
];

// Fallback for direct access if needed (though window.QUIZ_CONFIG covers it)
const QUIZ_CONFIG = window.QUIZ_CONFIG;

const SETTINGS = {
    // Legacy support if needed, but QUIZ_CONFIG should be primary now
};
