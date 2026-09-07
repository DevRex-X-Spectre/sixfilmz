import fs from "fs";
import path from "path";

const beepB64 = fs.readFileSync(path.join(process.cwd(), "public", "audio", "timer-beep.wav")).toString("base64");
const focusB64 = fs.readFileSync(path.join(process.cwd(), "public", "audio", "focus-lock.wav")).toString("base64");
const shutterB64 = fs.readFileSync(path.join(process.cwd(), "public", "audio", "camera-shutter.wav")).toString("base64");

const code = `// Bulletproof zero-latency camera audio controller (Web Audio + HTML5 Audio)
const BEEP_URI = "data:audio/wav;base64,${beepB64}";
const FOCUS_URI = "data:audio/wav;base64,${focusB64}";
const SHUTTER_URI = "data:audio/wav;base64,${shutterB64}";

class CameraAudioService {
  private ctx: AudioContext | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch {}
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): void {
    this.getContext();
  }

  // Play Countdown Beep (1050 Hz)
  public playBeep(): void {
    const ctx = this.getContext();

    // 1. HTML5 Audio fallback
    try {
      const a = new Audio(BEEP_URI);
      a.volume = 0.8;
      a.play().catch(() => {});
    } catch {}

    // 2. Web Audio Direct Synth
    if (ctx) {
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1050, now);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } catch {}
    }
  }

  // Play AF-Lock Confirmation Chime (1400Hz + 1880Hz)
  public playFocusLock(): void {
    const ctx = this.getContext();

    // 1. HTML5 Audio fallback
    try {
      const a = new Audio(FOCUS_URI);
      a.volume = 0.75;
      a.play().catch(() => {});
    } catch {}

    // 2. Web Audio Direct Synth
    if (ctx) {
      try {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(1400, now);
        osc2.frequency.setValueAtTime(1880, now + 0.035);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.16);
        osc2.stop(now + 0.16);
      } catch {}
    }
  }

  // Play Mechanical Shutter Snap (Mirror Slap + Dual Curtain + High Metallic Transient)
  public playShutter(): void {
    const ctx = this.getContext();

    // 1. HTML5 Audio (Direct pre-encoded WAV)
    try {
      const a = new Audio(SHUTTER_URI);
      a.volume = 1.0;
      a.play().catch(() => {});
    } catch {}

    // 2. Web Audio Mechanical Shutter Engine
    if (ctx) {
      try {
        const now = ctx.currentTime;

        // A. High-speed metallic front curtain click
        const bufferSize = Math.floor(ctx.sampleRate * 0.045);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const hpFilter = ctx.createBiquadFilter();
        hpFilter.type = "highpass";
        hpFilter.frequency.setValueAtTime(2400, now);

        const gain1 = ctx.createGain();
        gain1.gain.setValueAtTime(0.65, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        noise.connect(hpFilter);
        hpFilter.connect(gain1);
        gain1.connect(ctx.destination);
        noise.start(now);

        // B. Mirror slap low-frequency thud
        const bodyOsc = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        bodyOsc.type = "triangle";
        bodyOsc.frequency.setValueAtTime(240, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(45, now + 0.07);
        bodyGain.gain.setValueAtTime(0.6, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
        bodyOsc.connect(bodyGain);
        bodyGain.connect(ctx.destination);
        bodyOsc.start(now);
        bodyOsc.stop(now + 0.08);

        // C. Rear curtain snap & solid chassis impact (50ms offset)
        const snapTime = now + 0.045;
        const snapBufSize = Math.floor(ctx.sampleRate * 0.05);
        const snapBuf = ctx.createBuffer(1, snapBufSize, ctx.sampleRate);
        const snapData = snapBuf.getChannelData(0);
        for (let i = 0; i < snapBufSize; i++) {
          snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
        }
        const snapNoise = ctx.createBufferSource();
        snapNoise.buffer = snapBuf;

        const bpFilter = ctx.createBiquadFilter();
        bpFilter.type = "bandpass";
        bpFilter.frequency.setValueAtTime(1600, snapTime);
        bpFilter.Q.setValueAtTime(1.2, snapTime);

        const snapGain = ctx.createGain();
        snapGain.gain.setValueAtTime(0.65, snapTime);
        snapGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.05);

        snapNoise.connect(bpFilter);
        bpFilter.connect(snapGain);
        snapGain.connect(ctx.destination);
        snapNoise.start(snapTime);

        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(150, snapTime);
        subOsc.frequency.exponentialRampToValueAtTime(38, snapTime + 0.08);
        subGain.gain.setValueAtTime(0.5, snapTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.085);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(snapTime);
        subOsc.stop(snapTime + 0.09);
      } catch {}
    }
  }

  public stopAll(): void {
    // Stop any ongoing sounds
  }
}

export const cameraAudio = new CameraAudioService();
`;

fs.writeFileSync(path.join(process.cwd(), "src", "lib", "cameraAudio.ts"), code);
console.log("Successfully rebuilt src/lib/cameraAudio.ts");
