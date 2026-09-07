import { useEffect, useRef, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";

const DEPTH = 12;
const TITLE_TOP = "Welcome to";
const TITLE_MAIN = "sixfilmz";

export function Hero() {
  const stageRef = useRef<HTMLElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      tilt.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(40px)`;
      frame = window.requestAnimationFrame(render);
    };

    const onMove = (event: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 18;
      targetY = -y * 12;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 6;
    };

    targetY = 6;
    frame = window.requestAnimationFrame(render);
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      id="top"
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      <div className="vignette absolute inset-0">
        <video
          className="hero-image h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/posters/IMG_0176.jpg"
          aria-label="Aerial cinematography reel"
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero-blur pointer-events-none absolute inset-0 bg-black/50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />

      <div className="hero-stage relative z-10 px-6 text-center">
        <p className="hero-kicker mb-6 flex flex-col items-center justify-center gap-y-1 text-[10px] font-light uppercase tracking-[0.28em] text-gray-300 sm:flex-row sm:gap-x-3 md:text-xs md:tracking-[0.35em]">
          <span>Cinematographer</span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span>Videographer</span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span>Photographer</span>
        </p>

        <div ref={tiltRef} className="hero-3d">
          <h1 className="hero-3d-stack">
            {Array.from({ length: DEPTH }, (_, index) => (
              <span
                key={index}
                className="hero-3d-layer"
                style={{ "--z": index + 1 } as CSSProperties}
                aria-hidden="true"
              >
                <span className="hero-3d-top">{TITLE_TOP}</span>
                <span className="hero-3d-main">{TITLE_MAIN}</span>
              </span>
            ))}
            <span className="hero-3d-face">
              <span className="hero-3d-top">{TITLE_TOP}</span>
              <span className="hero-3d-main">{TITLE_MAIN}</span>
            </span>
          </h1>
        </div>
      </div>

      <a
        href="#identity"
        className="nav-fade absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gray-500"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
