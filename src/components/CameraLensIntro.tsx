import { useEffect, useState, useRef } from "react";

// Robust Hybrid Audio Engine for Camera Sounds (HTML5 Audio + Web Audio fallback)
class CameraSoundController {
  private ctx: AudioContext | null = null;
  private beepAudio: HTMLAudioElement | null = null;
  private focusAudio: HTMLAudioElement | null = null;
  private shutterAudio: HTMLAudioElement | null = null;
  private isUnlocked = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.beepAudio = new Audio("/audio/timer-beep.wav");
        this.beepAudio.preload = "auto";
        this.beepAudio.volume = 0.5;

        this.focusAudio = new Audio("/audio/focus-lock.wav");
        this.focusAudio.preload = "auto";
        this.focusAudio.volume = 0.45;

        this.shutterAudio = new Audio("/audio/camera-shutter.wav");
        this.shutterAudio.preload = "auto";
        this.shutterAudio.volume = 0.85;
      } catch {}
    }
  }

  // Unlock AudioContext and HTML5 Audio upon first user interaction
  unlock(): AudioContext | null {
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

    // Prime HTML5 audio elements with silent play
    if (!this.isUnlocked && this.shutterAudio) {
      this.isUnlocked = true;
      try {
        const p1 = this.beepAudio?.play();
        if (p1) {
          p1.then(() => this.beepAudio?.pause()).catch(() => {});
        }
        const p2 = this.shutterAudio?.play();
        if (p2) {
          p2.then(() => this.shutterAudio?.pause()).catch(() => {});
        }
      } catch {}
    }

    return this.ctx;
  }

  private isMuted(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("musicPlaying") === "false";
  }

  // Play Countdown Beep
  playBeep() {
    if (this.isMuted()) return;
    this.unlock();

    // 1. Play preloaded HTML5 Audio
    if (this.beepAudio) {
      try {
        const sound = this.beepAudio.cloneNode(true) as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play().catch(() => {});
      } catch {}
    }

    // 2. Synthesize via Web Audio oscillator
    if (this.ctx && this.ctx.state === "running") {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1050, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.07);
      } catch {}
    }
  }

  // Play Focus Lock Confirmation Chime
  playFocusLock() {
    if (this.isMuted()) return;
    this.unlock();

    if (this.focusAudio) {
      try {
        const sound = this.focusAudio.cloneNode(true) as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play().catch(() => {});
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

        gain.gain.setValueAtTime(0.18, now);
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

  // Play Mechanical Camera Shutter Release (Immediate)
  playShutter() {
    if (this.isMuted()) return;
    const ctx = this.unlock();

    // 1. Play realistic mechanical shutter WAV
    if (this.shutterAudio) {
      try {
        const sound = this.shutterAudio.cloneNode(true) as HTMLAudioElement;
        sound.volume = 0.9;
        sound.play().catch(() => {});
      } catch {}
    }

    // 2. Synthesize mechanical transient snap in Web Audio
    if (ctx && ctx.state === "running") {
      try {
        const now = ctx.currentTime;
        // High-speed metallic click
        const bufferSize = Math.floor(ctx.sampleRate * 0.04);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const hpFilter = ctx.createBiquadFilter();
        hpFilter.type = "highpass";
        hpFilter.frequency.setValueAtTime(2200, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        noise.connect(hpFilter);
        hpFilter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);

        // Body thud
        const bodyOsc = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        bodyOsc.type = "triangle";
        bodyOsc.frequency.setValueAtTime(220, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(45, now + 0.07);
        bodyGain.gain.setValueAtTime(0.4, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
        bodyOsc.connect(bodyGain);
        bodyGain.connect(ctx.destination);
        bodyOsc.start(now);
        bodyOsc.stop(now + 0.08);
      } catch {}
    }
  }

  stopAll() {
    if (this.beepAudio) {
      this.beepAudio.pause();
      this.beepAudio.currentTime = 0;
    }
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

const cameraSound = new CameraSoundController();

export function CameraLensIntro() {
  const [countdown, setCountdown] = useState<number | null>(3);
  const [phase, setPhase] = useState<
    "counting" | "locked" | "shutter" | "flash" | "revealed" | "done"
  >("counting");
  const [active, setActive] = useState(true);
  const animFrameRef = useRef<number | null>(null);
  const isDoneRef = useRef(false);
  const playedCountsRef = useRef<Set<number>>(new Set());

  const triggerShutterImmediate = () => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;

    // Immediately trigger camera shutter sound
    cameraSound.playShutter();

    setCountdown(null);
    setPhase("shutter");

    setTimeout(() => {
      setPhase("flash");
    }, 60);

    setTimeout(() => {
      setPhase("revealed");
    }, 320);

    setTimeout(() => {
      setPhase("done");
      setActive(false);
    }, 1100);
  };

  useEffect(() => {
    // Unlock sound on any initial interaction
    const unlockOnGesture = () => {
      cameraSound.unlock();
    };

    window.addEventListener("pointerdown", unlockOnGesture, { once: true });
    window.addEventListener("touchstart", unlockOnGesture, { once: true });
    window.addEventListener("click", unlockOnGesture, { once: true });
    window.addEventListener("keydown", unlockOnGesture, { once: true });

    const onMuteAll = () => {
      cameraSound.stopAll();
    };
    window.addEventListener("sixfilmz:mute-all", onMuteAll);

    // High-precision visual master clock with synchronized real-time audio triggers
    const startTime = performance.now();

    const loop = () => {
      if (isDoneRef.current) return;

      const elapsed = (performance.now() - startTime) / 1000;

      if (elapsed < 1.0) {
        // [0.0s - 1.0s] -> Count 3
        setCountdown(3);
        setPhase("counting");
        if (!playedCountsRef.current.has(3)) {
          playedCountsRef.current.add(3);
          cameraSound.playBeep();
        }
      } else if (elapsed < 2.0) {
        // [1.0s - 2.0s] -> Count 2
        setCountdown(2);
        setPhase("counting");
        if (!playedCountsRef.current.has(2)) {
          playedCountsRef.current.add(2);
          cameraSound.playBeep();
        }
      } else if (elapsed < 3.0) {
        // [2.0s - 3.0s] -> Count 1 (Focus locked chime)
        setCountdown(1);
        setPhase("locked");
        if (!playedCountsRef.current.has(1)) {
          playedCountsRef.current.add(1);
          cameraSound.playFocusLock();
        }
      } else if (elapsed < 3.08) {
        // [3.0s - 3.08s] -> Shutter snap!
        setCountdown(null);
        setPhase("shutter");
        if (!playedCountsRef.current.has(0)) {
          playedCountsRef.current.add(0);
          cameraSound.playShutter();
        }
      } else if (elapsed < 3.32) {
        // [3.08s - 3.32s] -> Aperture flash
        setCountdown(null);
        setPhase("flash");
      } else if (elapsed < 4.1) {
        // [3.32s - 4.1s] -> Viewfinder smooth reveal
        setCountdown(null);
        setPhase("revealed");
      } else {
        // [4.1s+] -> Unmount overlay
        isDoneRef.current = true;
        setPhase("done");
        setActive(false);
        return;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener("pointerdown", unlockOnGesture);
      window.removeEventListener("touchstart", unlockOnGesture);
      window.removeEventListener("click", unlockOnGesture);
      window.removeEventListener("keydown", unlockOnGesture);
      window.removeEventListener("sixfilmz:mute-all", onMuteAll);
      cameraSound.stopAll();
    };
  }, []);

  if (!active && phase === "done") return null;

  return (
    <div
      onClick={phase === "counting" || phase === "locked" ? triggerShutterImmediate : undefined}
      className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden transition-all duration-700 select-none ${
        phase === "revealed" || phase === "done"
          ? "pointer-events-none opacity-0 scale-105"
          : "opacity-100 scale-100 cursor-pointer"
      }`}
      aria-label="Camera Viewfinder - Tap to capture photo immediately"
    >
      {/* 1. Optical Lens Blur Layer */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          phase === "counting"
            ? "backdrop-blur-md bg-black/60"
            : phase === "locked"
              ? "backdrop-blur-none bg-black/20"
              : "backdrop-blur-none bg-transparent"
        }`}
      />

      {/* 2. Photographic Aperture Flash */}
      <div
        className={`pointer-events-none absolute inset-0 bg-white transition-opacity ${
          phase === "shutter" || phase === "flash"
            ? "opacity-95 duration-75"
            : "opacity-0 duration-700"
        }`}
      />

      {/* 3. Top Viewfinder HUD */}
      <header
        className={`relative z-10 flex items-center justify-between px-4 pt-4 sm:px-10 sm:pt-8 font-mono text-[10px] sm:text-xs tracking-widest text-white/80 transition-transform duration-500 ${
          phase === "revealed" ? "-translate-y-10 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-950/40 px-2.5 py-0.5 text-red-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold text-[9px] sm:text-[10px]">REC</span>
          </div>
          <span className="text-white/60 font-medium">4K 24FPS</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-light tracking-[0.2em] text-white">
          <span className="text-amber-300 font-medium">50mm</span>
          <span className="text-white/40">·</span>
          <span>F/1.2</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-white/70">
          <span className="hidden xs:inline text-white/60">ISO 100</span>
          <div className="flex items-center gap-1 rounded border border-white/20 px-1.5 py-0.5 text-[9px] sm:text-[10px]">
            <span>BAT</span>
            <span className="font-bold text-emerald-400">99%</span>
          </div>
        </div>
      </header>

      {/* 4. Center Viewfinder Focus Reticle with Synchronized Countdown */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4">
        {/* Rule of Thirds Grid */}
        <div className="pointer-events-none absolute inset-6 sm:inset-16 grid grid-cols-3 grid-rows-3 opacity-15">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-white" />
          <div className="border-r border-white" />
          <div />
        </div>

        {/* Framing Box & Bold Synchronized Countdown Unit */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Corner Viewfinder Brackets */}
          <div
            className={`absolute -inset-8 sm:-inset-12 transition-colors duration-300 pointer-events-none ${
              phase === "locked" || phase === "shutter"
                ? "border-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                : "border-white/50"
            }`}
          >
            <div className="absolute top-0 left-0 h-5 w-5 sm:h-7 sm:w-7 border-t-2 border-l-2 border-inherit" />
            <div className="absolute top-0 right-0 h-5 w-5 sm:h-7 sm:w-7 border-t-2 border-r-2 border-inherit" />
            <div className="absolute bottom-0 left-0 h-5 w-5 sm:h-7 sm:w-7 border-b-2 border-l-2 border-inherit" />
            <div className="absolute bottom-0 right-0 h-5 w-5 sm:h-7 sm:w-7 border-b-2 border-r-2 border-inherit" />
          </div>

          {/* Bold Cinematic Countdown Number */}
          <div className="relative flex h-32 w-32 sm:h-44 sm:w-44 items-center justify-center">
            {countdown !== null && countdown > 0 && (
              <span
                key={countdown}
                className="font-display text-8xl sm:text-9xl font-extrabold tracking-tighter text-white animate-in zoom-in-75 duration-150 select-none drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                {countdown}
              </span>
            )}
          </div>

          {/* Tap to Shoot interactive prompt badge */}
          {(phase === "counting" || phase === "locked") && (
            <div className="mt-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 font-mono text-[10px] tracking-widest text-white/90 backdrop-blur-md animate-pulse">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span>TAP ANYWHERE TO CAPTURE</span>
            </div>
          )}
        </div>
      </main>

      {/* 5. Bottom Viewfinder HUD */}
      <footer
        className={`relative z-10 flex items-center justify-between px-4 pb-4 sm:px-10 sm:pb-8 font-mono text-[10px] sm:text-xs tracking-widest text-white/80 transition-transform duration-500 ${
          phase === "revealed" ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-center gap-2 text-white/60">
          <span>1/250s</span>
          <span>·</span>
          <span>RAW</span>
        </div>

        <div className="hidden xs:flex items-center gap-2 text-[10px] text-white/50">
          <span>-1</span>
          <span>·</span>
          <span className="font-bold text-white bg-white/20 px-1.5 py-0.5 rounded">
            0.0 EV
          </span>
          <span>·</span>
          <span>+1</span>
        </div>

        <div className="font-cinematic text-xs tracking-[0.2em] font-semibold text-white">
          SIX FILMZ
        </div>
      </footer>
    </div>
  );
}
