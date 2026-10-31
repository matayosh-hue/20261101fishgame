/**
 * Audio synthesis & Japanese Speech Synthesis helper
 */

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

// Initialize or resume AudioContext on user interaction
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isAudioMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('mojitsuri_muted', muted ? 'true' : 'false');
  }
}

export function getMuted(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mojitsuri_muted') === 'true';
  }
  return isAudioMuted;
}

/**
 * Play a rod casting whoosh sound
 */
export function playCast() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch {
    // Ignore
  }
}

/**
 * Play a high-pitched bubble pop sound
 */
export function playBubble() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Water splash sound when hook drops into the water
 */
export function playSplash() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Bubbly chord
    [320, 480, 640].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.02);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.02 + 0.08);

      gain.gain.setValueAtTime(0.12, now + idx * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.02 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.02);
      osc.stop(now + idx * 0.02 + 0.13);
    });
  } catch {
    // Ignore
  }
}

/**
 * Rod reel sound (rapid clicking)
 */
export function playReel() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const time = now + i * 0.04;
      osc.frequency.setValueAtTime(900 + (i % 2) * 200, time);
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.03);
    }
  } catch {
    // Ignore
  }
}

/**
 * Cheerful success chime chord when catching a correct letter fish!
 */
export function playCatchSuccess() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // C5, E5, G5, C6 arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      const time = now + i * 0.07;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.38);
    });
  } catch {
    // Ignore
  }
}

/**
 * Triumphant fanfare for completing a full word or bonus fish
 */
export function playFanfare() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // C5, E5, G5, C6 chord held, then vibrant fanfare
    const chords = [
      { notes: [523.25, 659.25], start: 0, dur: 0.12 },
      { notes: [659.25, 783.99], start: 0.12, dur: 0.12 },
      { notes: [783.99, 1046.5], start: 0.24, dur: 0.15 },
      { notes: [1046.5, 1318.51, 1567.98], start: 0.42, dur: 0.5 },
    ];

    chords.forEach((c) => {
      c.notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';

        const time = now + c.start;
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + c.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + c.dur + 0.02);
      });
    });
  } catch {
    // Ignore
  }
}

/**
 * Gentle soft boing for non-matching attempt
 */
export function playMiss() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch {
    // Ignore
  }
}

/**
 * Japanese Speech Synthesis
 */
let cachedJaVoice: SpeechSynthesisVoice | null = null;

function getJapaneseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (cachedJaVoice) return cachedJaVoice;

  const voices = window.speechSynthesis.getVoices();
  // Find ja-JP voice
  const jaVoice = voices.find((v) => v.lang.startsWith('ja') || v.lang === 'ja_JP' || v.lang === 'ja-JP');
  if (jaVoice) {
    cachedJaVoice = jaVoice;
    return jaVoice;
  }
  return null;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedJaVoice = null;
    getJapaneseVoice();
  };
}

export function speakJapanese(text: string, rate: number = 0.9, pitch: number = 1.1) {
  if (getMuted()) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = rate; // slightly slower for clear learning
    utterance.pitch = pitch; // friendly higher pitch for kids

    const voice = getJapaneseVoice();
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech errors
  }
}

export function speakLetter(char: string) {
  speakJapanese(char, 0.85, 1.15);
}

export function speakWordWithKana(word: string, reading?: string) {
  speakJapanese(reading || word, 0.9, 1.1);
}
