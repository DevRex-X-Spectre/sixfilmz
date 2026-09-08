import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";

const TITLE_TOP = "Welcome to";

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
  const titleWrapperRef = useRef<HTMLDivElement | null>(null);
  const kickerRef = useRef<HTMLParagraphElement | null>(null);
  const topTextRef = useRef<HTMLSpanElement | null>(null);
  const word1Ref = useRef<HTMLSpanElement | null>(null);
  const word2Ref = useRef<HTMLSpanElement | null>(null);
  const horizonBeamRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<HTMLAnchorElement | null>(null);

  // Synchronized Master Crazy 3D Cinematic Shutter Reveal
  useEffect(() => {
    // 1. Initial Hidden 3D States (Primed for Capture Snap)
    gsap.set(horizonBeamRef.current, { scaleX: 0, opacity: 0 });
    gsap.set(cornersRef.current, { opacity: 0.3, scale: 0.95 });

    gsap.set(kickerRef.current, {
      opacity: 0,
      y: 22,
      scale: 0.95,
      filter: "blur(14px)",
    });
    gsap.set(topTextRef.current, {
      opacity: 0,
      y: -25,
      letterSpacing: "0.12em",
      filter: "blur(12px)",
    });
    gsap.set(word1Ref.current, {
      opacity: 0,
      rotationX: 45,
      rotationY: -18,
      x: -35,
      y: 45,
      scale: 0.72,
      filter: "blur(22px)",
      transformPerspective: 1200,
    });
    gsap.set(word2Ref.current, {
      opacity: 0,
      rotationX: 45,
      rotationY: 18,
      x: 35,
      y: 45,
      scale: 0.72,
      filter: "blur(22px)",
      transformPerspective: 1200,
    });
    gsap.set(chevronRef.current, { opacity: 0, y: 15 });

    let hasRevealed = false;

    const runMasterCrazyReveal = () => {
      if (hasRevealed) return;
      hasRevealed = true;

      const tl = gsap.timeline();

      // STAGE 1: Anamorphic Cyan Laser Horizon Slice across Screen
      tl.to(horizonBeamRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 0.18,
        ease: "power4.in",
      })
      .to(horizonBeamRef.current, {
        scaleY: 20,
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
      })

      // STAGE 2: Viewfinder Focus Corners Flash
      .to(
        cornersRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "back.out(2)",
        },
        "-=0.4"
      )

      // STAGE 3: 3D Kinetic Dual-Word Slams ("six" then "studio")
      .to(
        word1Ref.current,
        {
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "back.out(2)",
        },
        "-=0.3"
      )
      .to(
        word2Ref.current,
        {
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "back.out(2)",
        },
        "-=0.72"
      )

      // STAGE 4: "WELCOME TO" Editorial Expansion
      .to(
        topTextRef.current,
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.32em",
          filter: "blur(0px)",
          duration: 0.75,
          ease: "expo.out",
        },
        "-=0.75"
      )

      // STAGE 5: Disciplines Kicker & Scroll Indicator Drop
      .to(
        kickerRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.65,
          ease: "power3.out",
        },
        "-=0.6"
      )
      .to(
        chevronRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.35"
      );
    };

    // Listen for shutter capture event from CameraLensIntro
    const handleCapture = () => {
      runMasterCrazyReveal();
    };

    window.addEventListener("camera-shutter-capture", handleCapture);

    // Fallback timer if intro was skipped or already complete
    const fallbackTimer = setTimeout(() => {
      runMasterCrazyReveal();
    }, 3100);

    return () => {
      window.removeEventListener("camera-shutter-capture", handleCapture);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Fluid 3D Tilt Parallax on Pointer Move
  useEffect(() => {
    const stage = stageRef.current;
    const title = titleWrapperRef.current;
    if (!stage || !title) return;

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
      title.style.transform = `perspective(1000px) rotateX(${-currentY * 0.7}deg) rotateY(${currentX * 1.1}deg) translate3d(${currentX * 1.2}px, ${currentY * 1.2}px, 0)`;
      frame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      targetX = x * 15;
      targetY = y * 12;
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black to-transparent" />

      {/* Optical Laser Horizon Streak Layer */}
      <div
        ref={horizonBeamRef}
        className="pointer-events-none absolute top-1/2 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_45px_#22d3ee] z-30 will-change-transform"
      />

      {/* Camera Viewfinder Minimalist Framing Brackets on Hero Corners */}
      <div
        ref={cornersRef}
        className="pointer-events-none absolute inset-6 sm:inset-12 z-20 will-change-transform transition-colors duration-500"
      >
        <div className="absolute top-0 left-0 h-4 w-4 sm:h-5 sm:w-5 border-t border-l border-white/30" />
        <div className="absolute top-0 right-0 h-4 w-4 sm:h-5 sm:w-5 border-t border-r border-white/30" />
        <div className="absolute bottom-0 left-0 h-4 w-4 sm:h-5 sm:w-5 border-b border-l border-white/30" />
        <div className="absolute bottom-0 right-0 h-4 w-4 sm:h-5 sm:w-5 border-b border-r border-white/30" />
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

      {/* Hero Master Typography Stage */}
      <div className="relative z-10 px-4 sm:px-6 text-center -translate-y-3 sm:translate-y-0">
        {/* Disciplines Kicker */}
        <p
          ref={kickerRef}
          className="hero-kicker mb-4 sm:mb-6 flex flex-row flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-4 text-[9px] font-light uppercase tracking-[0.25em] text-neutral-300 sm:text-xs sm:tracking-[0.38em]"
        >
          <span>Cinematographer</span>
          <span className="text-white/40" aria-hidden="true">
            ·
          </span>
          <span>Videographer</span>
          <span className="text-white/40" aria-hidden="true">
            ·
          </span>
          <span>Photographer</span>
        </p>

        {/* 3D Kinetic Title Lockup */}
        <div ref={titleWrapperRef} className="hero-title-clean-wrapper relative">
          <h1 className="hero-title-clean relative">
            <span
              ref={topTextRef}
              className="hero-clean-top block will-change-transform"
            >
              {TITLE_TOP}
            </span>

            {/* Dual-Word 3D Kinetic Pair */}
            <div className="flex items-center justify-center gap-x-3 sm:gap-x-5 flex-wrap">
              <span
                ref={word1Ref}
                className="hero-clean-word"
              >
                six
              </span>
              <span
                ref={word2Ref}
                className="hero-clean-word"
              >
                studio
              </span>
            </div>
          </h1>
        </div>
      </div>

      {/* Scroll to Explore indicator */}
      <a
        ref={chevronRef}
        href="#identity"
        className="nav-fade absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gray-400 transition-colors duration-300 hover:text-white"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
