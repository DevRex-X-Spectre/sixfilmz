import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Volume2, VolumeX } from "lucide-react";
import { socials } from "../data/content";
import { cameraAudio } from "../lib/cameraAudio";

type Props = {
  onOpenContact: () => void;
};

export function AboutPage({ onOpenContact }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lensCurtainRef = useRef<HTMLDivElement | null>(null);
  const lens3DRigRef = useRef<HTMLDivElement | null>(null);
  const irisBladesRef = useRef<SVGGElement | null>(null);
  const glintArcRef = useRef<SVGPathElement | null>(null);
  const flashOverlayRef = useRef<HTMLDivElement | null>(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playIntroSequence = () => {
    void cameraAudio.playCinemaWhoosh();

    if (lensCurtainRef.current) {
      lensCurtainRef.current.style.display = "flex";
      gsap.set(lensCurtainRef.current, { opacity: 1, pointerEvents: "auto" });
    }
    if (flashOverlayRef.current) {
      gsap.set(flashOverlayRef.current, { opacity: 0 });
    }

    // Reset Content State (hidden behind lens)
    gsap.set(".about-content-wrapper", {
      opacity: 0,
      scale: 0.94,
      y: 35,
      filter: "blur(24px)",
    });

    // Reset 3D Lens Rig in Isometric Oblique Angle (Just like 3D render)
    gsap.set(lens3DRigRef.current, {
      transformPerspective: 1200,
      rotateX: 58,
      rotateY: -28,
      rotateZ: 32,
      y: 30,
      z: -40,
      scale: 0.92,
      opacity: 1,
      filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.98))",
    });

    gsap.set(glintArcRef.current, { opacity: 0.4, strokeDashoffset: 120 });
    gsap.set(irisBladesRef.current, { scale: 0.82, rotation: -20 });

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // STAGE 1: Light Sweep across 3D Oblique Glass (0.0s - 1.1s)
    tl.to(glintArcRef.current, {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 1.1,
      ease: "power2.out",
    })
      // STAGE 2: 3D Gimbal Realignment from Oblique to Centered Top-Down (0.9s - 2.1s)
      .to(
        lens3DRigRef.current,
        {
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          y: 0,
          z: 0,
          scale: 1.05,
          duration: 1.25,
          ease: "power3.inOut",
        },
        "-=0.7"
      )
      .call(() => {
        void cameraAudio.playFocus();
      }, undefined, "-=0.3")

      // STAGE 3: Aperture Iris Dilation & Zoom Through Optical Barrel (2.1s - 2.85s)
      .to(
        irisBladesRef.current,
        {
          scale: 1.4,
          rotation: 45,
          opacity: 0.1,
          duration: 0.45,
          ease: "power2.inOut",
        },
        "+=0.05"
      )
      .to(
        lens3DRigRef.current,
        {
          scale: 10.5,
          opacity: 0,
          filter: "blur(28px)",
          duration: 0.75,
          ease: "power4.in",
        },
        "-=0.3"
      )
      .call(() => {
        void cameraAudio.playShutter();
      }, undefined, "-=0.25")

      // STAGE 4: Optical Exposure Pulse
      .to(
        flashOverlayRef.current,
        {
          opacity: 0.95,
          duration: 0.08,
          ease: "power1.in",
        },
        "-=0.25"
      )
      .to(flashOverlayRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      })

      // STAGE 5: Focus-Pull Reveal of Director Story
      .to(
        lensCurtainRef.current,
        {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            if (lensCurtainRef.current) {
              lensCurtainRef.current.style.display = "none";
            }
          },
        },
        "-=0.4"
      )
      .to(
        ".about-content-wrapper",
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
        },
        "-=0.4"
      );
  };

  useEffect(() => {
    playIntroSequence();
  }, []);

  const skipIntro = () => {
    gsap.killTweensOf([
      lensCurtainRef.current,
      lens3DRigRef.current,
      flashOverlayRef.current,
      irisBladesRef.current,
      glintArcRef.current,
      ".about-content-wrapper",
    ]);
    if (lensCurtainRef.current) {
      lensCurtainRef.current.style.display = "none";
    }
    gsap.set(".about-content-wrapper", {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
    });
  };

  const handleContactClick = () => {
    void cameraAudio.playFocus();
    onOpenContact();
  };

  const toggleVideoAudio = () => {
    if (videoRef.current) {
      const nextMuted = !videoMuted;
      videoRef.current.muted = nextMuted;
      setVideoMuted(nextMuted);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden"
    >
      {/* 3D CUSTOM CAMERA LENS OPENING INTRO (Pure Custom 3D Geometry & Shading) */}
      <div
        ref={lensCurtainRef}
        onClick={skipIntro}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer overflow-hidden select-none"
      >
        {/* Ambient Radial Vignette & Studio Lighting Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.07)_0%,_rgba(10,12,16,0.95)_50%,_rgba(0,0,0,1)_85%)] pointer-events-none" />

        {/* 3D PERSPECTIVE RIG (Responsive sizing for all mobile & desktop screens) */}
        <div
          ref={lens3DRigRef}
          className="relative w-[290px] h-[290px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] flex items-center justify-center will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Layered 3D Metallic Extrusion Depth Rings */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              transform: "translateZ(-45px)",
              background: "radial-gradient(circle, #0b0c0e 60%, #1e2025 85%, #050607 100%)",
              boxShadow: "0 50px 80px rgba(0,0,0,0.95), inset 0 0 40px rgba(0,0,0,0.9)",
            }}
          />
          <div
            className="absolute inset-4 rounded-full pointer-events-none border border-white/10"
            style={{
              transform: "translateZ(-25px)",
              background: "radial-gradient(circle, #121418 50%, #2b2e35 80%, #0d0f12 100%)",
            }}
          />

          {/* Master 3D Vector Shading & Optical Iris SVG */}
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full relative z-10 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
          >
            <defs>
              {/* Outer Anodized Aluminum Barrel */}
              <radialGradient id="barrelChassis" cx="42%" cy="38%" r="62%">
                <stop offset="0%" stopColor="#5a5e66" />
                <stop offset="35%" stopColor="#2e3138" />
                <stop offset="65%" stopColor="#181a1f" />
                <stop offset="90%" stopColor="#0d0e12" />
                <stop offset="100%" stopColor="#050608" />
              </radialGradient>

              {/* Diamond-Pattern Knurled Grip */}
              <linearGradient id="knurledPattern" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6e737d" />
                <stop offset="25%" stopColor="#22252a" />
                <stop offset="50%" stopColor="#484d57" />
                <stop offset="75%" stopColor="#17191d" />
                <stop offset="100%" stopColor="#585c66" />
              </linearGradient>

              {/* Multi-Coated Sapphire Optical Glass */}
              <radialGradient id="sapphireOptics" cx="36%" cy="34%" r="66%">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.92" />
                <stop offset="30%" stopColor="#0f172a" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#064e3b" stopOpacity="0.88" />
                <stop offset="82%" stopColor="#4c1d95" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
              </radialGradient>

              {/* Specular Curved Light Glint */}
              <linearGradient id="lensGlintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="25%" stopColor="#93c5fd" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.5" />
                <stop offset="75%" stopColor="#d8b4fe" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              {/* Gold Bayonet Electronic Pins */}
              <linearGradient id="goldBayonet" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>

              {/* Aperture Blade Metallic Shader */}
              <linearGradient id="bladeShader" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#33373e" />
                <stop offset="50%" stopColor="#1a1c20" />
                <stop offset="100%" stopColor="#0a0b0d" />
              </linearGradient>
            </defs>

            {/* 1. Outer Chassis & Heavy Bezel */}
            <circle cx="300" cy="300" r="284" fill="url(#barrelChassis)" stroke="#717680" strokeWidth="2.5" />
            <circle cx="300" cy="300" r="270" fill="none" stroke="url(#knurledPattern)" strokeWidth="14" strokeDasharray="3, 3" />
            <circle cx="300" cy="300" r="252" fill="#14171c" stroke="#3b404a" strokeWidth="3.5" />

            {/* 2. Stepped Focus Ribs */}
            <circle cx="300" cy="300" r="236" fill="none" stroke="#2a2e36" strokeWidth="6" />
            <circle cx="300" cy="300" r="220" fill="#0f1115" stroke="#505663" strokeWidth="2" />
            <circle cx="300" cy="300" r="202" fill="none" stroke="url(#knurledPattern)" strokeWidth="12" strokeDasharray="2.5, 3.5" />

            {/* 3. Gold Electronic Communication Pins (As in 3D Render) */}
            <g transform="rotate(-36 300 300)">
              <rect x="278" y="98" width="6.5" height="15" rx="2" fill="url(#goldBayonet)" />
              <rect x="289" y="98" width="6.5" height="15" rx="2" fill="url(#goldBayonet)" />
              <rect x="300" y="98" width="6.5" height="15" rx="2" fill="url(#goldBayonet)" />
              <rect x="311" y="98" width="6.5" height="15" rx="2" fill="url(#goldBayonet)" />
              <rect x="322" y="98" width="6.5" height="15" rx="2" fill="url(#goldBayonet)" />
              <rect x="333" y="98" width="6.5" height="15" rx="2" fill="url(#goldBayonet)" />
              <rect x="344" y="98" width="6.5" height="15" rx="2" fill="url(#goldBayonet)" />
              <rect x="355" y="98" width="6.5" height="15" rx="2" fill="url(#goldBayonet)" />
            </g>

            {/* 4. Auteur Custom Engravings */}
            <path id="aboutLensPath" d="M 125 300 A 175 175 0 0 1 475 300" fill="none" />
            <text fill="#9aa0ab" fontSize="10.5" fontFamily="monospace" letterSpacing="4.5" fontWeight="600">
              <textPath href="#aboutLensPath" startOffset="14%">
                SIXFILMZ CINEMA OPTICS · 50MM F/1.4 · SIX STUDIO
              </textPath>
            </text>

            {/* 5. Inner Stepped Cylindrical Baffles */}
            <circle cx="300" cy="300" r="168" fill="#0b0c0f" stroke="#2d323b" strokeWidth="3" />
            <circle cx="300" cy="300" r="148" fill="#07080a" stroke="#1f232a" strokeWidth="2.5" />
            <circle cx="300" cy="300" r="128" fill="#030405" stroke="#17191e" strokeWidth="2" />

            {/* 6. Multi-Coated Sapphire Optical Glass Core */}
            <circle cx="300" cy="300" r="114" fill="url(#sapphireOptics)" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.5" />

            {/* 7. Mechanical Aperture Iris Blades */}
            <g ref={irisBladesRef} transform-origin="300 300">
              <circle cx="300" cy="300" r="80" fill="none" stroke="url(#bladeShader)" strokeWidth="18" strokeDasharray="24 6" />
              <circle cx="300" cy="300" r="52" fill="#000000" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.6" />
              <circle cx="300" cy="300" r="28" fill="#000000" stroke="#34d399" strokeWidth="1" strokeOpacity="0.7" />
            </g>

            {/* 8. Dynamic Specular Light Glint & Anamorphic Sweep */}
            <path
              ref={glintArcRef}
              d="M 225 210 A 105 105 0 0 1 375 210"
              fill="none"
              stroke="url(#lensGlintGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              filter="blur(1.5px)"
            />
            <circle cx="265" cy="235" r="10" fill="#ffffff" opacity="0.85" filter="blur(2.5px)" />
            <circle cx="275" cy="240" r="4.5" fill="#ffffff" opacity="0.95" />
            <circle cx="335" cy="260" r="14" fill="#60a5fa" opacity="0.45" filter="blur(5px)" />
          </svg>
        </div>

        {/* Optical Shutter Flash Overlay */}
        <div
          ref={flashOverlayRef}
          className="absolute inset-0 bg-white pointer-events-none opacity-0 z-30"
        />
      </div>

      {/* SUBTLE AMBIENT GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-neutral-900/40 blur-[150px] rounded-full" />
      </div>

      {/* MAIN ABOUT PAGE CONTENT */}
      <div className="about-content-wrapper relative z-10 mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pt-32 sm:pt-40 pb-24">


        {/* Title Header */}
        <header className="mb-12 sm:mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
            Founder & Director
          </p>
          <h1 className="font-cinematic text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white">
            Emmanuel
          </h1>
          <p className="mt-3 text-sm sm:text-base font-light text-neutral-300 tracking-wide">
            Cinematographer & Photographer · Founder of{" "}
            <span className="text-white font-medium">SixFilmz</span>
          </p>
        </header>

        {/* The Core Story & Portrait */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start mb-16 sm:mb-20">
          {/* SIX STUDIO Brand Emblem Column */}
          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/80 p-8 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center backdrop-blur-xl group">
              <div className="relative aspect-square w-44 sm:w-52 md:w-56 overflow-hidden rounded-full border border-white/20 bg-black p-3 shadow-2xl transition-transform duration-700 group-hover:scale-105">
                <img
                  src="/channels4_profile.jpg"
                  alt="SIX STUDIO Official Emblem"
                  className="h-full w-full rounded-full object-cover object-center filter brightness-105 contrast-110"
                />
              </div>

              <div className="mt-6 w-full pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-neutral-400">
                <span>SIX STUDIO</span>
                <span>SIXFILMZ // ARCHIVE</span>
              </div>
            </div>
          </div>

          {/* Story Text Column */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-6">
            <p className="text-xl sm:text-2xl font-light leading-relaxed text-white/95">
              I’m Emmanuel, founder of SixFilmz, a cinematographer and photographer with an eye
              for detail and a passion for storytelling.
            </p>

            <p className="text-base sm:text-lg font-light leading-relaxed text-neutral-300">
              My background in video editing and media production shapes how I shoot:{" "}
              <span className="text-white font-medium">
                always thinking about pacing, emotion, and what a moment truly needs.
              </span>
            </p>

            <p className="text-base sm:text-lg font-light leading-relaxed text-neutral-300">
              Through SixFilmz, I’ve captured weddings, portraits, product work, and landscapes,
              bringing a filmmaker’s sensibility to stills and a photographer’s discipline to motion.
            </p>

            <p className="text-base sm:text-lg font-light leading-relaxed text-neutral-300">
              With skills spanning motion graphics, graphic design, and audio mixing, I approach
              every shoot as a complete story —{" "}
              <span className="text-white font-medium">
                honest, deliberate, and built to be remembered.
              </span>
            </p>
          </div>
        </div>

        {/* Spotlight Motion Frame (Typography Reel) */}
        <div className="mb-16 sm:mb-20">
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 shadow-2xl group">
            <div className="aspect-video w-full relative bg-black">
              <video
                ref={videoRef}
                src="/videos/typography.mp4"
                poster="/posters/typography.jpg"
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover object-center filter brightness-95"
              />

              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleVideoAudio}
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                aria-label={videoMuted ? "Unmute video" : "Mute video"}
              >
                {videoMuted ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    <span>Unmute Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Minimalist Closing & Direct Contact */}
        <footer className="border-t border-white/10 pt-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleContactClick}
              className="rounded-full bg-white px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-black transition-all hover:bg-neutral-200 hover:scale-105 cursor-pointer shadow-md"
            >
              Start a Project
            </button>

            <a
              href={socials[0].href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-white/40 cursor-pointer"
            >
              WhatsApp
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
