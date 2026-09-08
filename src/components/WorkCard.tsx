import { useRef, useState } from "react";
import type { Aspect, MediaItem } from "../data/content";
import { Play } from "lucide-react";
import { Reveal } from "./Reveal";

const aspectClass: Record<Aspect, string> = {
  wide: "aspect-[16/9]",
  portrait: "aspect-[4/5]",
  ultrawide: "aspect-[21/9]",
  square: "aspect-square",
};

type WorkCardProps = {
  item: MediaItem;
  delay?: number;
  overlay?: "bottom-lg" | "bottom-sm";
  onOpen: (item: MediaItem) => void;
  className?: string;
  framed?: boolean;
  fill?: boolean;
  tilt?: "left" | "right";
  featured?: boolean;
};

export function WorkCard({
  item,
  delay = 0,
  overlay = "bottom-sm",
  onOpen,
  className = "",
  framed = false,
  fill = false,
  tilt,
  featured = false,
}: WorkCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const image = item.poster ?? item.src;
  const pad =
    overlay === "bottom-lg"
      ? "bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-10 md:left-10"
      : "bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-5 md:left-5";

  const titleSize = featured
    ? "text-base sm:text-2xl md:text-4xl"
    : item.aspect === "wide" || item.aspect === "ultrawide"
      ? "text-xs sm:text-lg md:text-2xl"
      : "text-xs sm:text-base md:text-xl";

  const showPlay = item.kind === "video" || item.playAffordance;

  const handleMouseEnter = () => {
    if (item.kind === "video" && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay silently handled
          });
      }
    }
  };

  const handleMouseLeave = () => {
    if (item.kind === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <Reveal variant="scale-in" delay={delay} className={className}>
      <button
        type="button"
        onClick={() => onOpen(item)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`work-card group relative w-full cursor-pointer border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
          framed ? "work-card-framed" : ""
        } ${tilt === "left" ? "md:origin-bottom-right md:rotate-[-1.6deg]" : ""} ${
          tilt === "right" ? "md:origin-bottom-left md:rotate-[1.6deg]" : ""
        }`}
      >
        <div
          className={`relative overflow-hidden bg-neutral-950 border border-white/[0.06] transition-colors duration-500 group-hover:border-white/25 ${
            framed ? "rounded-[4px]" : "rounded-2xl sm:rounded-3xl"
          } ${fill ? "h-full min-h-[180px] sm:min-h-[240px] md:min-h-[280px]" : aspectClass[item.aspect]}`}
        >
          {/* Base Poster Image */}
          <img
            src={image}
            alt={item.title}
            className={`work-image h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              isPlaying ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
            decoding="async"
          />

          {/* Muted Auto-Play Video on Hover */}
          {item.kind === "video" && (
            <video
              ref={videoRef}
              src={item.src}
              muted
              loop
              playsInline
              preload="metadata"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 pointer-events-none ${
                isPlaying ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="work-shine pointer-events-none absolute inset-0" />

          {/* Play Badge Icon */}
          {showPlay && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`flex h-9 w-9 sm:h-12 sm:w-12 md:h-16 md:w-16 items-center justify-center rounded-full border border-white/25 bg-black/40 backdrop-blur-md transition-all duration-300 shadow-lg ${
                  isPlaying
                    ? "scale-90 bg-white/20 border-white/60 opacity-80"
                    : "group-hover:scale-110 group-hover:bg-white/20 group-hover:border-white/50"
                }`}
              >
                <Play className="h-3.5 w-3.5 sm:h-5 sm:w-5 md:h-6 md:w-6 fill-white text-white translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Details Overlay */}
          <div className={`absolute ${pad} right-3`}>
            <p className="mb-0.5 sm:mb-1 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-400 font-mono">
              {item.category}
              {item.duration ? ` · ${item.duration}` : ""}
            </p>
            <h3 className={`${titleSize} font-medium tracking-tight text-white line-clamp-1`}>
              {item.title}
            </h3>
          </div>
        </div>
      </button>
    </Reveal>
  );
}
