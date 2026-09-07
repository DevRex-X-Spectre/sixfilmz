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
}: WorkCardProps) {
  const image = item.kind === "video" ? (item.poster ?? item.src) : (item.poster ?? item.src);
  const pad = overlay === "bottom-lg" ? "bottom-6 left-6 md:bottom-10 md:left-10" : "bottom-5 left-5";
  const titleSize =
    item.aspect === "wide" || item.aspect === "ultrawide"
      ? "text-2xl md:text-4xl"
      : "text-xl md:text-2xl";
  const showPlay = item.kind === "video" || item.playAffordance;

  return (
    <Reveal variant="scale-in" delay={delay} className={className}>
      <button
        type="button"
        onClick={() => onOpen(item)}
        className={`work-card group relative w-full cursor-pointer border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${framed ? "work-card-framed" : ""} ${tilt === "left" ? "md:origin-bottom-right md:rotate-[-1.6deg]" : ""} ${tilt === "right" ? "md:origin-bottom-left md:rotate-[1.6deg]" : ""}`}
      >
        <div
          className={`relative overflow-hidden bg-gray-900 ${framed ? "rounded-[4px]" : "rounded-3xl"} ${fill ? "h-full min-h-[240px] md:min-h-[280px]" : aspectClass[item.aspect]}`}
        >
          <img
            src={image}
            alt={item.title}
            className="work-image h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="work-shine pointer-events-none absolute inset-0" />

          {showPlay && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20 md:h-20 md:w-20">
                <Play className="h-7 w-7 fill-white text-white md:h-8 md:w-8" />
              </div>
            </div>
          )}

          <div className={`absolute ${pad}`}>
            <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-gray-300 md:mb-2 md:text-xs md:tracking-widest">
              {item.category}
              {item.duration ? ` · ${item.duration}` : ""}
            </p>
            <h3 className={`${titleSize} font-medium tracking-tight`}>{item.title}</h3>
          </div>
        </div>
      </button>
    </Reveal>
  );
}
