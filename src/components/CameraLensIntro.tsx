import { useEffect, useState, useRef } from "react";

// Web Audio API synthesizer fallback
function getAudioContext(): AudioContext | null {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch {
    return null;
  }
}

function playTimerBeepFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1050, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
}

function playFocusChimeFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(1400, ctx.currentTime);
    osc2.frequency.setValueAtTime(1850, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.14);
    osc2.stop(ctx.currentTime + 0.14);
  } catch {}
}

function playShutterFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Transient A
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {}
}

// Zero-latency audio player with preloading
function playSound(file: string, fallback: () => void) {
  try {
    const audio = new Audio(file);
    audio.volume = 0.9;
    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => fallback());
    }
  } catch {
    fallback();
  }
}

export function playCameraShutterSound() {
  playSound("/audio/camera-shutter.wav", playShutterFallback);
}

export function CameraLensIntro() {
  const [countdown, setCountdown] = useState<number | null>(3);
  const [phase, setPhase] = useState<
    "counting" | "locked" | "shutter" | "flash" | "revealed" | "done"
  >("counting");
  const [active, setActive] = useState(true);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const triggerShutter = () => {
    // Clear pending timers
    timerRef.current.forEach((t) => clearTimeout(t));

    setPhase("locked");
    playSound("/audio/focus-lock.wav", playFocusChimeFallback);

    // After 240ms focus lock -> Fire shutter sound & white flash
    const t1 = setTimeout(() => {
      setPhase("shutter");
      playCameraShutterSound();
    }, 240);

    const t2 = setTimeout(() => {
      setPhase("flash");
    }, 310);

    // Reveal viewfinder
    const t3 = setTimeout(() => {
      setPhase("revealed");
    }, 560);

    // Unmount
    const t4 = setTimeout(() => {
      setPhase("done");
      setActive(false);
    }, 1400);

    timerRef.current = [t1, t2, t3, t4];
  };

  useEffect(() => {
    // Synchronized 3-second countdown: 3 -> 2 -> 1 -> SNAP!
    // Second 3:
    setCountdown(3);
    playSound("/audio/timer-beep.wav", playTimerBeepFallback);

    // Second 2:
    const t3 = setTimeout(() => {
      setCountdown(2);
      playSound("/audio/timer-beep.wav", playTimerBeepFallback);
    }, 1000);

    // Second 1 (Focus Lock chime):
    const t2 = setTimeout(() => {
      setCountdown(1);
      playSound("/audio/focus-lock.wav", playFocusChimeFallback);
    }, 2000);

    // Second 0 (Shutter release):
    const t1 = setTimeout(() => {
      setCountdown(null);
      triggerShutter();
    }, 3000);

    timerRef.current = [t3, t2, t1];

    return () => {
      timerRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  if (!active && phase === "done") return null;

  return (
    <div
      onClick={phase === "counting" ? triggerShutter : undefined}
      className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden transition-all duration-700 select-none ${
        phase === "revealed" || phase === "done"
          ? "pointer-events-none opacity-0 scale-105"
          : "opacity-100 scale-100 cursor-pointer"
      }`}
      aria-label="Camera Viewfinder Intro - Tap anywhere to capture photo"
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

      {/* 4. Center Viewfinder Focus Reticle with Bold Synchronized Countdown */}
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

        {/* Framing Box & Bold Countdown Unit */}
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
