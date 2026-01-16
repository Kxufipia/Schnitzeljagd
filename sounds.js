// Basic Audio Synthesizer for UI Sounds
// No external assets required!

const SoundManager = {
    ctx: null,

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
    },

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playHover() {
        // High, short metallic ping
        this.playTone(800, 'sine', 0.1, 0.05);
    },

    playClick() {
        // Deeper click
        this.playTone(400, 'square', 0.1, 0.05);
    },

    playAchievement() {
        // Achievement Chord!
        if (!this.ctx) this.init();
        const now = this.ctx.currentTime;

        // C Majorish drum roll finish
        this.note(523.25, now);       // C5
        this.note(659.25, now + 0.1); // E5
        this.note(783.99, now + 0.2); // G5
        this.note(1046.50, now + 0.4); // C6
    },

    playError() {
        if (!this.ctx) this.init();
        // Low downward slide
        this.playTone(150, 'sawtooth', 0.4, 0.2); // Start Low
        // Pitch bend down logic is in playTone? No, playTone is static.
        // Let's make a custom error sound here
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3); // Slide down

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    },

    note(freq, time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.5);
    }
};

// Global Listeners for Buttons - REMOVED per user request
// document.addEventListener('mouseover', ...);
// document.addEventListener('click', ...);
