import { useEffect, useState, useRef } from "react";

// Web Audio API Sample-Accurate Engine for Camera Sounds
class CameraAudioEngine {
  private ctx: AudioContext | null = null;
  private nodes: (AudioNode | number)[] = [];

  init(): AudioContext | null {
    if (!this.ctx) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch {
        return null;
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Schedule a clean camera countdown interval beep at exact hardware time
  scheduleBeep(time: number, freq = 1050, duration = 0.065) {
    const ctx = this.init();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
      this.nodes.push(osc, gain);
    } catch {}
  }

  // Schedule focus lock confirmation chime at exact hardware time
  scheduleFocusLock(time: number) {
    const ctx = this.init();
    if (!ctx) return;

    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(1400, time);
      osc2.frequency.setValueAtTime(1880, time + 0.035);

      gain.gain.setValueAtTime(0.16, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.15);
      osc2.stop(time + 0.15);
      this.nodes.push(osc1, osc2, gain);
    } catch {}
  }

  // Schedule authentic mechanical camera shutter release at exact hardware time
  scheduleShutter(time: number) {
    const ctx = this.init();
    if (!ctx) return;

    try {
      // 1. Pre-shutter mirror-lift & front curtain high-speed metallic transient
      const bufferSize = Math.floor(ctx.sampleRate * 0.035);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] =
          (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const hpFilter = ctx.createBiquadFilter();
      hpFilter.type = "highpass";
      hpFilter.frequency.setValueAtTime(2400, time);

      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0.4, time);
      gain1.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

      noise.connect(hpFilter);
      hpFilter.connect(gain1);
      gain1.connect(ctx.destination);
      noise.start(time);

      // 2. Mirror slap thud
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = "triangle";
      bodyOsc.frequency.setValueAtTime(240, time);
      bodyOsc.frequency.exponentialRampToValueAtTime(45, time + 0.06);

      bodyGain.gain.setValueAtTime(0.35, time);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.065);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);
      bodyOsc.start(time);
      bodyOsc.stop(time + 0.07);

      // 3. Rear curtain snap & solid chassis impact (50ms later)
      const snapTime = time + 0.05;
      const snapBufSize = Math.floor(ctx.sampleRate * 0.045);
      const snapBuf = ctx.createBuffer(1, snapBufSize, ctx.sampleRate);
      const snapData = snapBuf.getChannelData(0);
      for (let i = 0; i < snapBufSize; i++) {
        snapData[i] =
          (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
      }
      const snapNoise = ctx.createBufferSource();
      snapNoise.buffer = snapBuf;

      const bpFilter = ctx.createBiquadFilter();
      bpFilter.type = "bandpass";
      bpFilter.frequency.setValueAtTime(1600, snapTime);
      bpFilter.Q.setValueAtTime(1.2, snapTime);

      const snapGain = ctx.createGain();
      snapGain.gain.setValueAtTime(0.42, snapTime);
      snapGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.045);

      snapNoise.connect(bpFilter);
      bpFilter.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapNoise.start(snapTime);

      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(150, snapTime);
      subOsc.frequency.exponentialRampToValueAtTime(38, snapTime + 0.08);

      subGain.gain.setValueAtTime(0.3, snapTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.085);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(snapTime);
      subOsc.stop(snapTime + 0.09);

      this.nodes.push(
        noise,
        hpFilter,
        gain1,
        bodyOsc,
        bodyGain,
        snapNoise,
        bpFilter,
        snapGain,
        subOsc,
        subGain
      );
    } catch {}
  }

  // Fire shutter sound immediately on user interaction
  playShutterNow() {
    const ctx = this.init();
    if (!ctx) return;
    this.scheduleShutter(ctx.currentTime);
  }

  stopAll() {
    this.nodes.forEach((node) => {
      try {
        if (typeof node === "object" && "stop" in node && typeof (node as AudioScheduledSourceNode).stop === "function") {
          (node as AudioScheduledSourceNode).stop();
        }
      } catch {}
    });
    this.nodes = [];
  }
}

const audioEngine = new CameraAudioEngine();

export function CameraLensIntro() {
  const [countdown, setCountdown] = useState<number | null>(3);
  const [phase, setPhase] = useState<
    "counting" | "locked" | "shutter" | "flash" | "revealed" | "done"
  >("counting");
  const [active, setActive] = useState(true);
  const animFrameRef = useRef<number | null>(null);
  const isDoneRef = useRef(false);

  const triggerShutterImmediate = () => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;

    audioEngine.stopAll();
    audioEngine.playShutterNow();

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
    // Check if user previously muted/disabled sound
    const isMuted = localStorage.getItem("musicPlaying") === "false";

    // 1. Initialize Audio Context and schedule unified audio events (only if not muted)
    if (!isMuted) {
      const ctx = audioEngine.init();
      const audioStart = ctx ? ctx.currentTime : 0;

      if (ctx) {
        // Schedule exact audio events:
        // T+0.0s: 3 (beep)
        audioEngine.scheduleBeep(audioStart + 0.02, 1050);
        // T+1.0s: 2 (beep)
        audioEngine.scheduleBeep(audioStart + 1.0, 1050);
        // T+2.0s: 1 (focus chime)
        audioEngine.scheduleFocusLock(audioStart + 2.0);
        // T+3.0s: 0 (mechanical shutter snap)
        audioEngine.scheduleShutter(audioStart + 3.0);
      }
    }

    const onMuteAll = () => {
      audioEngine.stopAll();
    };
    window.addEventListener("sixfilmz:mute-all", onMuteAll);

    // 2. High-precision visual master clock using requestAnimationFrame
    const startTime = performance.now();

    const loop = () => {
      if (isDoneRef.current) return;

      const elapsed = (performance.now() - startTime) / 1000;

      if (elapsed < 1.0) {
        // [0.0s - 1.0s] -> 3
        setCountdown(3);
        setPhase("counting");
      } else if (elapsed < 2.0) {
        // [1.0s - 2.0s] -> 2
        setCountdown(2);
        setPhase("counting");
      } else if (elapsed < 3.0) {
        // [2.0s - 3.0s] -> 1 (Focus locked)
        setCountdown(1);
        setPhase("locked");
      } else if (elapsed < 3.08) {
        // [3.0s - 3.08s] -> Shutter snap!
        setCountdown(null);
        setPhase("shutter");
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
      window.removeEventListener("sixfilmz:mute-all", onMuteAll);
      audioEngine.stopAll();
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
      {/* 1. Optical Lens Blur Layer (Racks focus into sharp 4K) */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          phase === "counting"
            ? "backdrop-blur-md bg-black/60"
            : phase === "locked"
              ? "backdrop-blur-none bg-black/20"
              : "backdrop-blur-none bg-transparent"
        }`}
      />

      {/* 2. Photographic Aperture Flash (Crisp white flash on shutter release) */}
      <div
        className={`pointer-events-none absolute inset-0 bg-white transition-opacity ${
          phase === "shutter" || phase === "flash"
            ? "opacity-95 duration-75"
            : "opacity-0 duration-700"
        }`}
      />

      {/* 3. Top Viewfinder HUD (Clean & mobile-responsive) */}
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

        {/* Center Optical Lens Calibration */}
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

      {/* 4. Center Viewfinder Focus Reticle with Perfectly Coordinated Countdown */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4">
        {/* Rule of Thirds Grid (Subtle) */}
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
        </div>
      </main>

      {/* 5. Bottom Viewfinder HUD (Exposure, Shutter speed) */}
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

        {/* Center Exposure Value */}
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
