import { useEffect, useRef, useState } from "react";
import { VolumeX } from "lucide-react";

const STORAGE_KEY = "musicPlaying";
const AUDIO_SRC = "/audio/calm-ambient.wav";

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    // Auto-resume if user explicitly enabled music in previous session
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      audio.muted = false;
      playPromiseRef.current = audio.play();
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            setPlaying(true);
          })
          .catch(() => {
            // Autoplay policy prevented immediate playback
            setPlaying(false);
          });
      }
    }

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Immediately mute and pause ambient music
    audio.muted = true;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    localStorage.setItem(STORAGE_KEY, "false");

    // If a play promise is resolving, ensure it pauses as soon as resolved
    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          audio.muted = true;
          audio.pause();
        })
        .catch(() => {});
    }
  };

  const startAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio.volume = 0.4;
    playPromiseRef.current = audio.play();
    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          setPlaying(true);
          localStorage.setItem(STORAGE_KEY, "true");
        })
        .catch((err) => {
          console.warn("Audio play prevented:", err);
          setPlaying(false);
        });
    }
  };

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const audio = audioRef.current;
    if (!audio) return;

    // If currently playing or not paused, stop immediately
    if (playing || (!audio.paused && audio.currentTime > 0)) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[110] flex items-center gap-3 select-none pointer-events-auto">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Mute soundtrack" : "Play soundtrack"}
          title={playing ? "Mute Sound" : "Play Soundtrack"}
          className={`group relative flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full transition-all duration-300 shadow-2xl cursor-pointer ${
            playing
              ? "bg-zinc-900 text-white hover:bg-zinc-800"
              : "bg-black/90 text-gray-400 hover:bg-zinc-900 hover:text-white"
          } backdrop-blur-md`}
        >
          {playing ? (
            <div className="flex items-center gap-[3px] px-1 pointer-events-none">
              <span className="h-3.5 w-[2.5px] rounded-full bg-white animate-pulse" style={{ animationDuration: "0.8s" }} />
              <span className="h-5 w-[2.5px] rounded-full bg-white animate-pulse" style={{ animationDuration: "1.1s", animationDelay: "0.2s" }} />
              <span className="h-4 w-[2.5px] rounded-full bg-white animate-pulse" style={{ animationDuration: "0.9s", animationDelay: "0.4s" }} />
              <span className="h-2.5 w-[2.5px] rounded-full bg-white animate-pulse" style={{ animationDuration: "1.3s", animationDelay: "0.1s" }} />
            </div>
          ) : (
            <VolumeX className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 pointer-events-none" />
          )}

          {playing && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-white/10 opacity-75 pointer-events-none" />
          )}
        </button>

        {/* Ambient music status badge */}
        <div
          onClick={toggle}
          className="hidden cursor-pointer items-center gap-2 rounded-full bg-black/85 px-3.5 py-1.5 text-[11px] font-light tracking-wider text-gray-300 backdrop-blur-md transition-all duration-300 sm:flex opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${playing ? "bg-emerald-400 animate-ping" : "bg-gray-500"}`} />
          <span>{playing ? "Sound: ON" : "Sound: OFF"}</span>
        </div>
      </div>

      <audio ref={audioRef} loop preload="auto" src={AUDIO_SRC} />
    </>
  );
}

