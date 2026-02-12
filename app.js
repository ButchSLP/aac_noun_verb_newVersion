/**
 * AAC Sentence Builder - Enhanced Edition
 * Main Application Logic
 */

// ============================
// CONSTANTS
// ============================
const CONFIG = {
    TOTAL_TRIALS: 10,
    HIGH_SCORE_THRESHOLD: 8,
    CELEBRATION_DURATION: 5000,
    AUDIO_FADE_DURATION: 1000,
    SPEECH_RATE: 0.9,
    DROP_SOUND_VOLUME: 0.2,
    STORAGE_KEY: 'aac_progress'
};

// ============================
// STATE MANAGEMENT
// ============================
const GameState = {
    currentIndex: 0,
    score: 0,
    trialLog: [],
    isMuted: false,
    
    reset() {
        this.currentIndex = 0;
        this.score = 0;
        this.trialLog = [];
    },
    
    saveProgress() {
        try {
            const progress = {
                currentIndex: this.currentIndex,
                score: this.score,
                trialLog: this.trialLog,
                timestamp: Date.now()
            };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {
            console.warn('Could not save progress:', e);
        }
    },
    
    loadProgress() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                const progress = JSON.parse(saved);
                // Only restore if less than 1 hour old
                if (Date.now() - progress.timestamp < 3600000) {
                    return progress;
                }
            }
        } catch (e) {
            console.warn('Could not load progress:', e);
        }
        return null;
    },
    
    clearProgress() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
};

// ============================
// DOM CACHE
// ============================
const DOM = {
    // Overlays
    audioUnlockOverlay: null,
    loadingOverlay: null,
    celebrationOverlay: null,
    
    // Containers
    gameContainer: null,
    resultScreen: null,
    dropZone: null,
    wordBank: null,
    gifContainer: null,
    
    // Elements
    trialGif: null,
    imageLoading: null,
    currentTrialSpan: null,
    totalTrialsSpan: null,
    scoreSpan: null,
    feedback: null,
    progressBar: null,
    celebrationGif: null,
    finalPct: null,
    logBody: null,
    
    // Buttons
    startBtn: null,
    fullscreenBtn: null,
    volumeBtn: null,
    checkBtn: null,
    nextBtn: null,
    restartBtn: null,
    
    init() {
        // Overlays
        this.audioUnlockOverlay = document.getElementById('audio-unlock-overlay');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.celebrationOverlay = document.getElementById('celebration-overlay');
        
        // Containers
        this.gameContainer = document.getElementById('game-container');
        this.resultScreen = document.getElementById('result-screen');
        this.dropZone = document.getElementById('drop-zone');
        this.wordBank = document.getElementById('word-bank');
        this.gifContainer = document.getElementById('gif-container');
        
        // Elements
        this.trialGif = document.getElementById('trial-gif');
        this.imageLoading = document.getElementById('image-loading');
        this.currentTrialSpan = document.getElementById('current-trial');
        this.totalTrialsSpan = document.getElementById('total-trials');
        this.scoreSpan = document.getElementById('score-val');
        this.feedback = document.getElementById('feedback');
        this.progressBar = document.getElementById('progress-bar');
        this.celebrationGif = document.getElementById('celebration-gif');
        this.finalPct = document.getElementById('final-pct');
        this.logBody = document.getElementById('log-body');
        
        // Buttons
        this.startBtn = document.getElementById('start-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.volumeBtn = document.getElementById('volume-btn');
        this.checkBtn = document.getElementById('check-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.restartBtn = document.getElementById('restart-btn');
    }
};

// ============================
// AUDIO MANAGER
// ============================
const AudioManager = {
    sounds: {
        drop: null,
        celebration: null,
        incorrect: null,
        heartbeat: null
    },
    
    init() {
        this.sounds.drop = new Audio('sounds/drop.mp3');
        this.sounds.celebration = new Audio('sounds/celebration_song.mp3');
        this.sounds.incorrect = new Audio('sounds/incorrect_answer.mp3');
        
        // Silent heartbeat for iOS audio unlock
        this.sounds.heartbeat = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A/w==");
        this.sounds.heartbeat.loop = true;
        
        // Add error handlers
        Object.values(this.sounds).forEach(sound => {
            sound.addEventListener('error', (e) => {
                console.warn('Audio loading error:', e);
            });
        });
    },
    
    async unlock() {
        const promises = Object.values(this.sounds).map(sound => 
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
            }).catch(() => {})
        );
        
        await Promise.all(promises);
        
        // Start heartbeat
        try {
            await this.sounds.heartbeat.play();
        } catch (e) {
            console.warn('Could not start heartbeat:', e);
        }
    },
    
    play(soundName, volume = 1.0) {
        if (GameState.isMuted) return;
        
        const sound = this.sounds[soundName];
        if (!sound) return;
        
        try {
            sound.volume = volume;
            sound.currentTime = 0;
            sound.play().catch(e => console.warn('Play error:', e));
        } catch (e) {
            console.warn('Audio play error:', e);
        }
    },
    
    stop(soundName) {
        const sound = this.sounds[soundName];
        if (!sound) return;
        
        sound.pause();
        sound.currentTime = 0;
    },
    
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    },
    
    toggleMute() {
        GameState.isMuted = !GameState.isMuted;
        
        if (GameState.isMuted) {
            this.stopAll();
            DOM.volumeBtn.textContent = '🔇';
            DOM.volumeBtn.setAttribute('aria-label', 'Unmute sounds');
        } else {
            DOM.volumeBtn.textContent = '🔊';
            DOM.volumeBtn.setAttribute('aria-label', 'Mute sounds');
        }
    }
};

// ============================
// SPEECH SYNTHESIS
// ============================
const Speech = {
    speak(text) {
        if (GameState.isMuted) return;
        
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = CONFIG.SPEECH_RATE;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('Speech synthesis error:', e);
        }
    },
    
    cancel() {
        window.speechSynthesis.cancel();
    }
};

// ============================
// IMAGE PRELOADER
// ============================
const ImagePreloader = {
    loadedImages: new Set(),
    
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            if (this.loadedImages.has(src)) {
                resolve(src);
                return;
            }
            
            const img = new Image();
            img.onload = () => {
                this.loadedImages.add(src);
                resolve(src);
            };
            img.onerror = () => reject(new Error(`Failed to load: ${src}`));
            img.src = src;
        });
    },
    
    async preloadTrialAssets(trial) {
        const images = [
            trial.gif,
            trial.whoImg,
            trial.doingImg,
            trial.distWhoImg,
            trial.distDoingImg
        ];
        
        try {
            await Promise.all(images.map(src => this.preloadImage(src)));
        } catch (e) {
            console.warn('Some images failed to preload:', e);
        }
    }
};

// ============================
// DRAG AND DROP HANDLER
// ============================
const DragDropHandler = {
    init() {
        [DOM.dropZone, DOM.wordBank].forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver.bind(this));
            zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            zone.addEventListener('drop', this.handleDrop.bind(this));
        });
    },
    
    handleDragOver(e) {
        e.preventDefault();
        if (e.currentTarget === DOM.dropZone) {
            DOM.dropZone.classList.add('drag-over');
        }
    },
    
    handleDragLeave(e) {
        if (e.currentTarget === DOM.dropZone) {
            DOM.dropZone.classList.remove('drag-over');
        }
    },
    
    handleDrop(e) {
        e.preventDefault();
        DOM.dropZone.classList.remove('drag-over');
        
        const dragging = document.querySelector('.dragging');
        if (dragging && e.currentTarget) {
            e.currentTarget.appendChild(dragging);
            
            if (e.currentTarget === DOM.dropZone) {
                AudioManager.play('drop', CONFIG.DROP_SOUND_VOLUME);
            }
        }
    }
};

// ============================
// GAME LOGIC
// ============================
const Game = {
    async loadTrial() {
        const trial = TRIALS_DATA[GameState.currentIndex];
        
        // Update UI
        DOM.currentTrialSpan.textContent = GameState.currentIndex + 1;
        DOM.totalTrialsSpan.textContent = CONFIG.TOTAL_TRIALS;
        
        // Update progress bar
        const progress = ((GameState.currentIndex) / CONFIG.TOTAL_TRIALS) * 100;
        DOM.progressBar.style.width = `${progress}%`;
        
        // Clear previous state
        DOM.dropZone.innerHTML = "";
        DOM.feedback.textContent = "";
        DOM.feedback.className = "";
        DOM.checkBtn.classList.remove('hidden');
        DOM.nextBtn.classList.add('hidden');
        DOM.nextBtn.textContent = "Next Trial →";
        
        // Show loading spinner
        DOM.imageLoading.classList.remove('hidden');
        DOM.trialGif.classList.remove('loaded');
        
        // Preload current trial assets
        await ImagePreloader.preloadTrialAssets(trial);
        
        // Load GIF
        DOM.trialGif.src = trial.gif;
        DOM.trialGif.onload = () => {
            DOM.trialGif.classList.add('loaded');
            DOM.imageLoading.classList.add('hidden');
        };
        
        // Preload next trial if available
        if (GameState.currentIndex + 1 < CONFIG.TOTAL_TRIALS) {
            ImagePreloader.preloadTrialAssets(TRIALS_DATA[GameState.currentIndex + 1]);
        }
        
        // Build word bank
        this.buildWordBank(trial);
    },
    
    buildWordBank(trial) {
        DOM.wordBank.innerHTML = "";
        
        const items = [
            { text: trial.correctWho, type: "who", img: trial.whoImg },
            { text: trial.correctDoing, type: "doing", img: trial.doingImg },
            { text: trial.distWho, type: "who", img: trial.distWhoImg },
            { text: trial.distDoing, type: "doing", img: trial.distDoingImg }
        ];
        
        // Shuffle items
        items.sort(() => Math.random() - 0.5);
        
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = `symbol ${item.type}`;
            div.draggable = true;
            div.tabIndex = 0;
            div.setAttribute('role', 'button');
            div.setAttribute('aria-label', `${item.text} symbol`);
            div.dataset.type = item.type;
            div.dataset.text = item.text;
            div.innerHTML = `<img src="${item.img}" alt="${item.text}"><span>${item.text}</span>`;
            
            // Touch/Click to speak
            div.addEventListener('pointerdown', () => {
                Speech.speak(item.text);
                div.classList.add('touch-active');
                setTimeout(() => div.classList.remove('touch-active'), 200);
            });
            
            // Keyboard support
            div.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    Speech.speak(item.text);
                }
            });
            
            // Drag events
            div.addEventListener('dragstart', (e) => {
                e.target.classList.add('dragging');
            });
            
            div.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
            
            DOM.wordBank.appendChild(div);
        });
    },
    
    checkAnswer() {
        const placed = Array.from(DOM.dropZone.children);
        const trial = TRIALS_DATA[GameState.currentIndex];
        
        // Validate placement
        if (placed.length < 2) {
            DOM.feedback.textContent = "Please drag both words to the sentence area!";
            DOM.feedback.className = "";
            return;
        }
        
        // Check correctness
        const isCorrect = 
            placed[0].dataset.type === 'who' && 
            placed[1].dataset.type === 'doing' && 
            placed[0].dataset.text === trial.correctWho && 
            placed[1].dataset.text === trial.correctDoing;
        
        // Speak the answer
        const sentence = `${placed[0].dataset.text} ${placed[1].dataset.text}`;
        Speech.speak(sentence);
        
        // Log result
        GameState.trialLog.push({
            trialNum: GameState.currentIndex + 1,
            sentence: `${trial.correctWho} ${trial.correctDoing}`,
            userAnswer: sentence,
            status: isCorrect ? "Pass" : "Fail"
        });
        
        // Update UI and state
        if (isCorrect) {
            DOM.feedback.textContent = "✔ Correct!";
            DOM.feedback.className = "correct";
            GameState.score++;
            DOM.scoreSpan.textContent = GameState.score;
            
            AudioManager.play('celebration');
            
            // Let celebration music play in its entirety
            // (No timeout - only stops when user clicks next or on final celebration)
        } else {
            DOM.feedback.textContent = "✘ Incorrect - Try again next time!";
            DOM.feedback.className = "incorrect";
            AudioManager.play('incorrect');
        }
        
        // Update buttons
        DOM.checkBtn.classList.add('hidden');
        DOM.nextBtn.classList.remove('hidden');
        
        // Update next button text for last trial
        if (GameState.currentIndex === CONFIG.TOTAL_TRIALS - 1) {
            DOM.nextBtn.textContent = "See Results!";
        }
        
        // Save progress
        GameState.saveProgress();
    },
    
    nextTrial() {
        // Stop any playing audio
        AudioManager.stop('celebration');
        Speech.cancel();
        
        GameState.currentIndex++;
        
        if (GameState.currentIndex < CONFIG.TOTAL_TRIALS) {
            this.loadTrial();
        } else {
            this.showResults();
        }
    },
    
    showResults() {
        AudioManager.stop('heartbeat');
        GameState.clearProgress();
        
        // Hide game, show results
        DOM.gameContainer.classList.add('hidden');
        DOM.resultScreen.classList.remove('hidden');
        
        // Calculate and display score
        const percentage = (GameState.score / CONFIG.TOTAL_TRIALS * 100).toFixed(0);
        DOM.finalPct.textContent = `${percentage}%`;
        
        // Build results table
        DOM.logBody.innerHTML = "";
        GameState.trialLog.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.trialNum}</td>
                <td>${item.sentence}</td>
                <td class="${item.status.toLowerCase()}">${item.status}</td>
            `;
            DOM.logBody.appendChild(row);
        });
        
        // Show celebration if high score
        if (GameState.score >= CONFIG.HIGH_SCORE_THRESHOLD) {
            this.showCelebration();
        }
    },
    
    showCelebration() {
        DOM.celebrationOverlay.classList.add('active');
        
        // Play celebration music and let it play completely
        AudioManager.play('celebration');
        
        // Hide overlay after duration, but let music continue
        setTimeout(() => {
            DOM.celebrationOverlay.classList.remove('active');
            // Music will continue playing until it ends naturally or user restarts
        }, CONFIG.CELEBRATION_DURATION);
    }
};

// ============================
// UI HANDLERS
// ============================
const UI = {
    async startApp() {
        // Unlock audio
        await AudioManager.unlock();
        
        // Hide start overlay
        DOM.audioUnlockOverlay.style.display = 'none';
        
        // Auto-enter fullscreen mode
        try {
            await document.documentElement.requestFullscreen();
        } catch (e) {
            console.warn('Could not enter fullscreen automatically:', e);
            // Fullscreen may be blocked by browser - user can still click button
        }
        
        // Check for saved progress
        const saved = GameState.loadProgress();
        if (saved && confirm('Continue from where you left off?')) {
            GameState.currentIndex = saved.currentIndex;
            GameState.score = saved.score;
            GameState.trialLog = saved.trialLog;
            DOM.scoreSpan.textContent = GameState.score;
        }
        
        // Load first/current trial
        await Game.loadTrial();
    },
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => {
                console.warn('Fullscreen error:', e);
            });
        } else {
            document.exitFullscreen();
        }
    },
    
    restart() {
        GameState.reset();
        GameState.clearProgress();
        location.reload();
    }
};

// ============================
// EVENT LISTENERS
// ============================
function initEventListeners() {
    DOM.startBtn.addEventListener('click', () => UI.startApp());
    DOM.fullscreenBtn.addEventListener('click', () => UI.toggleFullscreen());
    DOM.volumeBtn.addEventListener('click', () => AudioManager.toggleMute());
    DOM.checkBtn.addEventListener('click', () => Game.checkAnswer());
    DOM.nextBtn.addEventListener('click', () => Game.nextTrial());
    DOM.restartBtn.addEventListener('click', () => UI.restart());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f' && e.ctrlKey) {
            e.preventDefault();
            UI.toggleFullscreen();
        }
        if (e.key === 'm' && e.ctrlKey) {
            e.preventDefault();
            AudioManager.toggleMute();
        }
    });
}

// ============================
// INITIALIZATION
// ============================
function init() {
    // Validate trials data
    if (!TRIALS_DATA || TRIALS_DATA.length === 0) {
        console.error('No trial data available!');
        alert('Error: Game data not loaded properly. Please refresh the page.');
        return;
    }
    
    // Initialize modules
    DOM.init();
    AudioManager.init();
    DragDropHandler.init();
    initEventListeners();
    
    console.log('AAC App initialized successfully');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
