import fs from "fs";
import path from "path";

const beepB64 = fs.readFileSync(path.join(process.cwd(), "public", "audio", "timer-beep.wav")).toString("base64");
const focusB64 = fs.readFileSync(path.join(process.cwd(), "public", "audio", "focus-lock.wav")).toString("base64");
const shutterB64 = fs.readFileSync(path.join(process.cwd(), "public", "audio", "camera-shutter.wav")).toString("base64");

const code = `// Embedded zero-latency base64 camera audio assets & dual-engine controller
const BEEP_URI = "data:audio/wav;base64,${beepB64}";
const FOCUS_URI = "data:audio/wav;base64,${focusB64}";
const SHUTTER_URI = "data:audio/wav;base64,${shutterB64}";

class CameraAudioService {
  private ctx: AudioContext | null = null;
  private beepPool: HTMLAudioElement[] = [];
  private focusAudio: HTMLAudioElement | null = null;
  private shutterAudio: HTMLAudioElement | null = null;
  private poolIdx = 0;
  private unlocked = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        for (let i = 0; i < 3; i++) {
          const a = new Audio(BEEP_URI);
          a.preload = "auto";
          a.volume = 0.7;
          this.beepPool.push(a);
        }

        this.focusAudio = new Audio(FOCUS_URI);
        this.focusAudio.preload = "auto";
        this.focusAudio.volume = 0.65;

        this.shutterAudio = new Audio(SHUTTER_URI);
        this.shutterAudio.preload = "auto";
        this.shutterAudio.volume = 1.0;
      } catch {}
    }
  }

  public unlock(): void {
    if (typeof window === "undefined") return;

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

    if (!this.unlocked && this.shutterAudio) {
      this.unlocked = true;
      try {
        const p1 = this.beepPool[0]?.play();
        if (p1) p1.then(() => this.beepPool[0]?.pause()).catch(() => {});
        const p2 = this.shutterAudio?.play();
        if (p2) p2.then(() => this.shutterAudio?.pause()).catch(() => {});
      } catch {}
    }
  }

  public playBeep(): void {
    this.unlock();

    // 1. HTML5 Audio (Zero-latency base64 memory buffer)
    if (this.beepPool.length > 0) {
      try {
        const audio = this.beepPool[this.poolIdx % this.beepPool.length];
        this.poolIdx++;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch {}
    }

    // 2. Web Audio Oscillator Synth
    if (this.ctx && this.ctx.state === "running") {
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1050, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } catch {}
    }
  }

  public playFocusLock(): void {
    this.unlock();

    if (this.focusAudio) {
      try {
        this.focusAudio.currentTime = 0;
        this.focusAudio.play().catch(() => {});
      } catch {}
    }

    if (this.ctx && this.ctx.state === "running") {
      try {
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(1400, now);
        osc2.frequency.setValueAtTime(1880, now + 0.035);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.16);
        osc2.stop(now + 0.16);
      } catch {}
    }
  }

  public playShutter(): void {
    this.unlock();

    // 1. HTML5 Base64 mechanical shutter
    if (this.shutterAudio) {
      try {
        this.shutterAudio.currentTime = 0;
        this.shutterAudio.play().catch(() => {});
      } catch {}
    }

    // 2. Web Audio mechanical transient synthesis
    if (this.ctx && this.ctx.state === "running") {
      try {
        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.006));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const hpFilter = this.ctx.createBiquadFilter();
        hpFilter.type = "highpass";
        hpFilter.frequency.setValueAtTime(2200, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.55, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        noise.connect(hpFilter);
        hpFilter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);

        const bodyOsc = this.ctx.createOscillator();
        const bodyGain = this.ctx.createGain();
        bodyOsc.type = "triangle";
        bodyOsc.frequency.setValueAtTime(220, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(45, now + 0.07);
        bodyGain.gain.setValueAtTime(0.5, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
        bodyOsc.connect(bodyGain);
        bodyGain.connect(this.ctx.destination);
        bodyOsc.start(now);
        bodyOsc.stop(now + 0.08);
      } catch {}
    }
  }

  public stopAll(): void {
    this.beepPool.forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
    if (this.focusAudio) {
      this.focusAudio.pause();
      this.focusAudio.currentTime = 0;
    }
    if (this.shutterAudio) {
      this.shutterAudio.pause();
      this.shutterAudio.currentTime = 0;
    }
  }
}

export const cameraAudio = new CameraAudioService();
`;

fs.writeFileSync(path.join(process.cwd(), "src", "lib", "cameraAudio.ts"), code);
console.log("Successfully generated src/lib/cameraAudio.ts");
