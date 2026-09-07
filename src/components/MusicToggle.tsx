import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "musicPlaying";

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "true") return;
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        /* autoplay blocked */
      });
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      localStorage.setItem(STORAGE_KEY, "false");
      return;
    }

    audio
      .play()
      .then(() => {
        setPlaying(true);
        localStorage.setItem(STORAGE_KEY, "true");
      })
      .catch(() => {
        /* play failed */
      });
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute background music" : "Play background music"}
        className="group fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gray-800/50 bg-gray-900/80 backdrop-blur-sm transition-all duration-500 hover:border-gray-700/50 hover:bg-gray-800/80"
      >
        {playing ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400 transition-colors duration-300 group-hover:text-white"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
        {playing && (
          <span className="absolute inset-0 animate-ping rounded-full border border-white/20" />
        )}
      </button>
      <audio ref={audioRef} loop preload="none">
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mp3"
        />
      </audio>
    </>
  );
}
