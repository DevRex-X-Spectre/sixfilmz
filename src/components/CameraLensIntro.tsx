import { useEffect, useState, useRef } from "react";
import { cameraAudio } from "../lib/cameraAudio";

const SEQUENCE_AUDIO_SRC = "/audio/camera-sequence.wav";

export function CameraLensIntro() {
  const [countdown, setCountdown] = useState<number | null>(3);
  const [phase, setPhase] = useState<
    "counting" | "locked" | "shutter" | "flash" | "revealed" | "done"
  >("counting");
  const [active, setActive] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isDoneRef = useRef(false);

  // Instant shutter trigger if user taps/clicks early
  const triggerShutterImmediate = () => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;

    // Pause sequence audio and fire immediate shutter sound
    if (audioRef.current) {
      audioRef.current.pause();
    }
    cameraAudio.playShutter();

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
    // 1. Start audio playback immediately on mount
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1.0;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Autoplay policy fallback: unlock on any user touch/gesture
      });
    }

    // Also trigger Web Audio unlock/playback
    cameraAudio.unlock();

    // Global listener so any user touch/click/key resumes audio instantly
    const resumeAudioOnGesture = () => {
      if (audio && audio.paused && !isDoneRef.current) {
        audio.play().catch(() => {});
      }
      cameraAudio.unlock();
    };

    window.addEventListener("pointerdown", resumeAudioOnGesture, { once: true });
    window.addEventListener("touchstart", resumeAudioOnGesture, { once: true });
    window.addEventListener("click", resumeAudioOnGesture, { once: true });
    window.addEventListener("keydown", resumeAudioOnGesture, { once: true });

    const onMuteAll = () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      cameraAudio.stopAll();
    };
    window.addEventListener("sixfilmz:mute-all", onMuteAll);

    // 2. High-precision visual & audio clock
    const startTime = performance.now();

    const loop = () => {
      if (isDoneRef.current) return;

      const elapsed = (performance.now() - startTime) / 1000;

      if (elapsed < 1.0) {
        // [0.0s - 1.0s] -> Count 3
        setCountdown(3);
        setPhase("counting");
      } else if (elapsed < 2.0) {
        // [1.0s - 2.0s] -> Count 2
        setCountdown(2);
        setPhase("counting");
      } else if (elapsed < 3.0) {
        // [2.0s - 3.0s] -> Count 1 (Focus locked chime)
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
      window.removeEventListener("pointerdown", resumeAudioOnGesture);
      window.removeEventListener("touchstart", resumeAudioOnGesture);
      window.removeEventListener("click", resumeAudioOnGesture);
      window.removeEventListener("keydown", resumeAudioOnGesture);
      window.removeEventListener("sixfilmz:mute-all", onMuteAll);
      if (audio) {
        audio.pause();
      }
      cameraAudio.stopAll();
    };
  }, []);

  if (!active && phase === "done") return null;

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        src={SEQUENCE_AUDIO_SRC}
      />

      <div
        onClick={phase === "counting" || phase === "locked" ? triggerShutterImmediate : undefined}
        onTouchStart={phase === "counting" || phase === "locked" ? triggerShutterImmediate : undefined}
        className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden transition-all duration-700 select-none ${
          phase === "revealed" || phase === "done"
            ? "pointer-events-none opacity-0 scale-105"
            : "opacity-100 scale-100 cursor-pointer"
        }`}
        aria-label="Camera Viewfinder"
      >
        <div
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            phase === "counting"
              ? "backdrop-blur-md bg-black/60"
              : phase === "locked"
                ? "backdrop-blur-none bg-black/20"
                : "backdrop-blur-none bg-transparent"
          }`}
        />

        <div
          className={`pointer-events-none absolute inset-0 bg-white transition-opacity ${
            phase === "shutter" || phase === "flash"
              ? "opacity-95 duration-75"
              : "opacity-0 duration-700"
          }`}
        />

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

        <main className="relative z-10 flex flex-1 items-center justify-center p-4">
          <div className="pointer-events-none absolute inset-6 sm:inset-16 grid grid-cols-3 grid-rows-3 opacity-15">
            <div className="border-r border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-r border-b border-white" />
            <div />
          </div>

          <div className="relative flex flex-col items-center justify-center">
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
    </>
  );
}
