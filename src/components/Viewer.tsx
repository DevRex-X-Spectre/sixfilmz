import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import type { MediaItem } from "../data/content";
import { galleryItems } from "../data/content";
import { useLockBody } from "../hooks/useLockBody";
import { formatTime } from "../lib/time";

type Props = {
  item: MediaItem | null;
  onClose: () => void;
  onOpen: (item: MediaItem) => void;
};

export function Viewer({ item, onClose, onOpen }: Props) {
  useLockBody(Boolean(item));
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const hideTimer = useRef<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ui, setUi] = useState(true);

  const index = item ? galleryItems.findIndex((entry) => entry.id === item.id) : -1;
  const hasNav = index >= 0 && galleryItems.length > 1;

  const go = (direction: -1 | 1) => {
    if (index < 0) return;
    const next = (index + direction + galleryItems.length) % galleryItems.length;
    onOpen(galleryItems[next]);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  useEffect(() => {
    setPlaying(true);
    setTime(0);
    setDuration(0);
    setUi(true);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && hasNav) go(1);
      if (event.key === "ArrowLeft" && hasNav) go(-1);
      if (event.key === " " && item.kind === "video") {
        event.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  if (!item) return null;

  const seek = (clientX: number) => {
    const bar = barRef.current;
    const video = videoRef.current;
    if (!bar || !video || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
  };

  const revealUi = () => {
    setUi(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (playing && item.kind === "video") setUi(false);
    }, 2200);
  };

  const image = item.kind === "video" ? (item.poster ?? item.src) : item.src;

  return (
    <div
      className="viewer-root fixed inset-0 z-[90] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onMouseMove={revealUi}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

      <button
        type="button"
        onClick={onClose}
        className={`absolute top-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition-opacity md:top-6 md:right-6 ${ui ? "opacity-100" : "opacity-0"}`}
        aria-label="Close viewer"
      >
        <X className="h-5 w-5" />
      </button>

      {hasNav && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            className={`absolute left-3 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white md:left-6 ${ui ? "opacity-100" : "opacity-0"}`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            className={`absolute right-3 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white md:right-6 ${ui ? "opacity-100" : "opacity-0"}`}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        className="relative z-10 flex w-full max-w-6xl flex-col px-4 md:px-20"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="viewer-frame relative overflow-hidden bg-black">
          <span className="viewer-corner viewer-corner-tl" />
          <span className="viewer-corner viewer-corner-tr" />
          <span className="viewer-corner viewer-corner-bl" />
          <span className="viewer-corner viewer-corner-br" />

          {item.kind === "video" ? (
            <video
              key={item.src}
              ref={videoRef}
              className="mx-auto max-h-[72vh] w-full object-contain md:max-h-[78vh]"
              autoPlay
              playsInline
              poster={item.poster}
              onClick={togglePlay}
              onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
              onDurationChange={(event) => setDuration(event.currentTarget.duration)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            >
              <source src={item.src} type="video/mp4" />
            </video>
          ) : (
            <img
              src={image}
              alt={item.title}
              className="mx-auto max-h-[72vh] w-auto max-w-full object-contain md:max-h-[78vh]"
            />
          )}

          {item.kind === "video" && !playing && (
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center"
              onClick={togglePlay}
              aria-label="Play"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                <Play className="h-8 w-8 fill-white text-white" />
              </span>
            </button>
          )}

          {item.kind === "video" && (
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-16 transition-opacity md:px-6 ${ui ? "opacity-100" : "opacity-0"}`}
            >
              <div
                ref={barRef}
                className="group mb-3 h-1.5 cursor-pointer rounded-full bg-white/20"
                onClick={(event) => seek(event.clientX)}
              >
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: duration ? `${(time / duration) * 100}%` : "0%" }}
                />
              </div>
              <div className="flex items-center justify-between gap-3 text-xs tracking-wide text-white/80">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const video = videoRef.current;
                      if (!video) return;
                      video.muted = !video.muted;
                      setMuted(video.muted);
                    }}
                    aria-label={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <span className="tabular-nums">
                    {formatTime(time)} / {formatTime(duration)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const node = videoRef.current;
                    if (!node) return;
                    if (document.fullscreenElement) {
                      void document.exitFullscreen();
                    } else {
                      void node.requestFullscreen();
                    }
                  }}
                  aria-label="Fullscreen"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 px-1">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-gray-400">
              {item.category}
              {item.duration ? ` · ${item.duration}` : ""}
            </p>
            <h3 className="mt-1 text-xl font-medium tracking-tight md:text-2xl">{item.title}</h3>
          </div>
          <p className="hidden text-[10px] uppercase tracking-[0.28em] text-gray-600 sm:block">
            SIX STUDIO
          </p>
        </div>
      </div>
    </div>
  );
}
