import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const TITLE_TOP = "Welcome to";
const TITLE_MAIN = "sixfilmz";

// Subtle ambient particle motes
const PARTICLES = [
  { top: "18%", left: "15%", size: "3px", delay: "0s", duration: "7s" },
  { top: "25%", left: "82%", size: "4px", delay: "1.5s", duration: "9s" },
  { top: "68%", left: "12%", size: "3px", delay: "3s", duration: "8s" },
  { top: "75%", left: "85%", size: "2px", delay: "0.8s", duration: "6s" },
  { top: "40%", left: "6%", size: "3px", delay: "2.2s", duration: "10s" },
  { top: "30%", left: "92%", size: "4px", delay: "4s", duration: "7.5s" },
];

export function Hero() {
  const stageRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const title = titleRef.current;
    if (!stage || !title) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      title.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      frame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      targetX = x * 14; // Subtle clean parallax
      targetY = y * 10;
    };

    const onMouseMove = (event: MouseEvent) => {
      handlePointerMove(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        handlePointerMove(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    frame = window.requestAnimationFrame(render);
    stage.addEventListener("mousemove", onMouseMove);
    stage.addEventListener("mouseleave", onLeave);
    stage.addEventListener("touchmove", onTouchMove, { passive: true });
    stage.addEventListener("touchend", onLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      stage.removeEventListener("mousemove", onMouseMove);
      stage.removeEventListener("mouseleave", onLeave);
      stage.removeEventListener("touchmove", onTouchMove);
      stage.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      id="top"
      className="relative flex h-screen items-center justify-center overflow-hidden select-none"
    >
      {/* Background Cinematic Reel */}
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

      <div className="hero-blur pointer-events-none absolute inset-0 bg-black/45" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />

      {/* Camera Viewfinder Minimalist Framing Brackets on Hero Corners */}
      <div className="pointer-events-none absolute inset-6 sm:inset-12 z-20">
        <div className="absolute top-0 left-0 h-4 w-4 sm:h-5 sm:w-5 border-t border-l border-white/25" />
        <div className="absolute top-0 right-0 h-4 w-4 sm:h-5 sm:w-5 border-t border-r border-white/25" />
        <div className="absolute bottom-0 left-0 h-4 w-4 sm:h-5 sm:w-5 border-b border-l border-white/25" />
        <div className="absolute bottom-0 right-0 h-4 w-4 sm:h-5 sm:w-5 border-b border-r border-white/25" />
      </div>

      {/* Floating ambient particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="hero-particle"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Hero Clean Typography Stage */}
      <div className="relative z-10 px-6 text-center">
        <p className="hero-kicker mb-6 flex flex-col items-center justify-center gap-y-1 text-[10px] font-light uppercase tracking-[0.32em] text-gray-300 sm:flex-row sm:gap-x-3 md:text-xs md:tracking-[0.4em]">
          <span>Cinematographer</span>
          <span className="hidden sm:inline text-white/40" aria-hidden="true">
            ·
          </span>
          <span>Videographer</span>
          <span className="hidden sm:inline text-white/40" aria-hidden="true">
            ·
          </span>
          <span>Photographer</span>
        </p>

        <div ref={titleRef} className="hero-title-clean-wrapper">
          <h1 className="hero-title-clean">
            <span className="hero-clean-top">{TITLE_TOP}</span>
            <span className="hero-clean-main">{TITLE_MAIN}</span>
          </h1>
        </div>
      </div>

      {/* Scroll to Explore indicator */}
      <a
        href="#identity"
        className="nav-fade absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gray-400 transition-colors duration-300 hover:text-white"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
