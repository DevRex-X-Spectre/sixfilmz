import { useEffect, useRef, useState } from "react";
import { VolumeX } from "lucide-react";

const STORAGE_KEY = "musicPlaying";
const AUDIO_SRC = "/audio/calm-ambient.wav";

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  // Fade volume helper for calm transitions
  const fadeVolume = (targetVolume: number, durationMs = 800, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    const stepMs = 40;
    const steps = Math.max(1, Math.floor(durationMs / stepMs));
    const startVolume = audio.volume;
    const diff = targetVolume - startVolume;
    let step = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      step++;
      const current = startVolume + diff * (step / steps);
      audio.volume = Math.max(0, Math.min(1, current));

      if (step >= steps) {
        if (fadeIntervalRef.current) {
          window.clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        audio.volume = targetVolume;
        if (onComplete) onComplete();
      }
    }, stepMs);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio.load();

    if (localStorage.getItem(STORAGE_KEY) === "true") {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          fadeVolume(0.45, 1200);
        })
        .catch(() => {
          // Autoplay policy prevented playback
        });
    }

    return () => {
      if (fadeIntervalRef.current) {
        window.clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      fadeVolume(0, 500, () => {
        audio.pause();
        setPlaying(false);
        localStorage.setItem(STORAGE_KEY, "false");
      });
    } else {
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          setPlaying(true);
          localStorage.setItem(STORAGE_KEY, "true");
          fadeVolume(0.45, 900);
        })
        .catch((err) => {
          console.warn("Audio play prevented:", err);
        });
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Mute calm ambient soundtrack" : "Play calm ambient soundtrack"}
          className={`group relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 shadow-xl ${
            playing
              ? "bg-zinc-900/95 text-white"
              : "bg-black/85 text-gray-400 hover:bg-zinc-900 hover:text-white"
          } backdrop-blur-md`}
        >
          {playing ? (
            <div className="flex items-center gap-[3px] px-1">
              <span className="h-3.5 w-[2.5px] rounded-full bg-white animate-pulse" style={{ animationDuration: "0.8s" }} />
              <span className="h-5 w-[2.5px] rounded-full bg-white animate-pulse" style={{ animationDuration: "1.1s", animationDelay: "0.2s" }} />
              <span className="h-4 w-[2.5px] rounded-full bg-white animate-pulse" style={{ animationDuration: "0.9s", animationDelay: "0.4s" }} />
              <span className="h-2.5 w-[2.5px] rounded-full bg-white animate-pulse" style={{ animationDuration: "1.3s", animationDelay: "0.1s" }} />
            </div>
          ) : (
            <VolumeX className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          )}

          {playing && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-white/10 opacity-75" />
          )}
        </button>

        {/* Ambient music status badge on hover */}
        <div className="pointer-events-none hidden items-center gap-2 rounded-full bg-black/85 px-3.5 py-1.5 text-[11px] font-light tracking-wider text-gray-300 backdrop-blur-md transition-all duration-300 sm:flex opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
          <span className={`h-1.5 w-1.5 rounded-full ${playing ? "bg-emerald-400 animate-ping" : "bg-gray-500"}`} />
          <span>{playing ? "Calm Ambient · Playing" : "Play Calm Ambient"}</span>
        </div>
      </div>

      <audio ref={audioRef} loop preload="auto">
        <source src={AUDIO_SRC} type="audio/wav" />
      </audio>
    </>
  );
}

