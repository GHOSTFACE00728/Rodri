// Simple synthesizer for UI sounds using Web Audio API
// This avoids external asset dependencies and ensures offline functionality.

let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) => {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
  
  gain.gain.setValueAtTime(vol, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const playSuccess = () => {
  // Pleasant ascending chime (C major triad)
  playTone(523.25, 'sine', 0.3, 0);       // C5
  playTone(659.25, 'sine', 0.3, 0.1);     // E5
  playTone(783.99, 'sine', 0.4, 0.2);     // G5
};

export const playError = () => {
  // Low dissonant buzz
  playTone(150, 'sawtooth', 0.3, 0, 0.15);
  playTone(140, 'sawtooth', 0.3, 0.1, 0.15);
};

export const playClick = () => {
  // Subtle high blip
  playTone(800, 'sine', 0.1, 0, 0.05);
};

export const playWin = () => {
  // Fanfare
  const now = 0;
  playTone(523.25, 'triangle', 0.2, now);
  playTone(523.25, 'triangle', 0.2, now + 0.2);
  playTone(523.25, 'triangle', 0.2, now + 0.4);
  playTone(783.99, 'triangle', 0.6, now + 0.6);
};
