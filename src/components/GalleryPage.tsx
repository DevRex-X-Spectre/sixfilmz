import { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowLeft } from "lucide-react";
import type { MediaItem } from "../data/content";
import { galleryItems } from "../data/content";
import { WorkCard } from "./WorkCard";
import { cameraAudio } from "../lib/cameraAudio";

type Props = {
  onOpenMedia: (item: MediaItem) => void;
  onNavigateHome: () => void;
};

type Category = "All" | "Cinematography" | "Videography" | "Photography";

export function GalleryPage({ onOpenMedia, onNavigateHome }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Camera Lens & Transition Refs
  const lensCurtainRef = useRef<HTMLDivElement | null>(null);
  const lensRigRef = useRef<HTMLDivElement | null>(null);
  const lensGlassRef = useRef<SVGGElement | null>(null);
  const lensIrisRef = useRef<SVGCircleElement | null>(null);
  const lensGlintRef = useRef<SVGGElement | null>(null);
  const flashOverlayRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const categories: Category[] = ["All", "Cinematography", "Videography", "Photography"];

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return galleryItems;
    if (selectedCategory === "Cinematography") {
      return galleryItems.filter(
        (item) =>
          item.category.toLowerCase().includes("cinematic") ||
          item.category.toLowerCase().includes("aerial") ||
          item.category.toLowerCase().includes("motion")
      );
    }
    if (selectedCategory === "Videography") {
      return galleryItems.filter(
        (item) =>
          item.kind === "video" ||
          item.category.toLowerCase().includes("commercial") ||
          item.category.toLowerCase().includes("documentary") ||
          item.category.toLowerCase().includes("event")
      );
    }
    if (selectedCategory === "Photography") {
      return galleryItems.filter((item) => item.kind === "photo");
    }
    return galleryItems;
  }, [selectedCategory]);

  // Master Camera Lens 50mm Opening Sequence on Mount
  useEffect(() => {
    // 1. Play high-impact cinematic audio
    void cameraAudio.playCinemaWhoosh();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial States
      gsap.set(lensCurtainRef.current, { opacity: 1 });
      gsap.set(flashOverlayRef.current, { opacity: 0 });
      gsap.set(lensRigRef.current, { scale: 0.88, rotation: -14, opacity: 1 });
      gsap.set(lensIrisRef.current, { attr: { r: 12 } });
      gsap.set(lensGlintRef.current, { opacity: 0.85, scale: 0.95 });
      gsap.set(".gallery-content-wrap", {
        opacity: 0,
        scale: 0.8,
        rotationX: 18,
        y: 60,
        transformPerspective: 1400,
        filter: "blur(28px) brightness(1.6)",
      });

      // --- STAGE 1: Lens Focus Ring Micro-Calibration & Specular Glint ---
      tl.to(lensRigRef.current, {
        rotation: 0,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      })
      .to(lensGlintRef.current, {
        opacity: 1,
        scale: 1.05,
        duration: 0.2,
        ease: "sine.inOut",
      }, "<")

      // --- STAGE 2: Aperture Iris Dilation & Deep Zoom through Glass ---
      .to(lensIrisRef.current, {
        attr: { r: 110 },
        duration: 0.5,
        ease: "expo.out",
      }, "-=0.1")
      .to(lensRigRef.current, {
        scale: 4.8,
        opacity: 0,
        duration: 0.75,
        ease: "expo.inOut",
      }, "-=0.35")
      .to(lensCurtainRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      }, "-=0.4")

      // --- STAGE 3: Optical Flash & High-Impact Canvas Focus Pull ---
      .to(flashOverlayRef.current, {
        opacity: 0.5,
        duration: 0.08,
        ease: "power2.in",
      }, "-=0.55")
      .to(flashOverlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power3.out",
      })
      .to(".gallery-content-wrap", {
        opacity: 1,
        scale: 1,
        rotationX: 0,
        y: 0,
        filter: "blur(0px) brightness(1)",
        duration: 0.85,
        ease: "expo.out",
      }, "-=0.6")

      // --- STAGE 4: Header & Cards Cascade ---
      .fromTo(
        ".gallery-anim-item",
        {
          opacity: 0,
          y: 35,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .fromTo(
        ".gallery-work-card",
        {
          opacity: 0,
          y: 60,
          scale: 0.92,
          filter: "blur(14px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.45"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Filter Refresh Animation
  useEffect(() => {
    if (!gridContainerRef.current) return;
    const cards = gridContainerRef.current.querySelectorAll(".gallery-work-card");
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.04,
          ease: "expo.out",
        }
      );
    }
  }, [selectedCategory]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-white selection:text-black">


      {/* 2. Anamorphic Optical Flash Overlay */}
      <div
        ref={flashOverlayRef}
        className="pointer-events-none fixed inset-0 z-[95] bg-gradient-to-r from-cyan-400/20 via-white to-cyan-400/20 mix-blend-screen will-change-transform"
      />

      {/* 3. Ultra-Detailed 50mm Camera Lens Curtain Layer */}
      <div
        ref={lensCurtainRef}
        className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-black will-change-transform"
      >
        <div
          ref={lensRigRef}
          className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] flex items-center justify-center will-change-transform"
        >
          {/* Custom SVG Precision Camera Lens Barrel (Canon EF 50mm f/1.4 Cinema Edition) */}
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full drop-shadow-[0_0_80px_rgba(255,255,255,0.12)]"
          >
            <defs>
              {/* Outer Metallic Bevel Gradient */}
              <linearGradient id="metalRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3a3a3a" />
                <stop offset="25%" stopColor="#1a1a1a" />
                <stop offset="50%" stopColor="#4a4a4a" />
                <stop offset="75%" stopColor="#141414" />
                <stop offset="100%" stopColor="#2e2e2e" />
              </linearGradient>

              {/* Inner Barrel Stepped Shadow */}
              <radialGradient id="barrelDepth" cx="50%" cy="50%" r="50%">
                <stop offset="60%" stopColor="#080808" />
                <stop offset="85%" stopColor="#141414" />
                <stop offset="100%" stopColor="#252525" />
              </radialGradient>

              {/* Glass Element Gradient */}
              <radialGradient id="glassSphere" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#181e24" />
                <stop offset="40%" stopColor="#0a0d10" />
                <stop offset="85%" stopColor="#030406" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>

              {/* Specular Glint Blur */}
              <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id="sharpGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" />
              </filter>

              {/* Circular Text Paths for Engraved Ring Markings */}
              <path
                id="topTextPath"
                d="M 120,300 A 180,180 0 0,1 480,300"
                fill="none"
              />
              <path
                id="bottomTextPath"
                d="M 480,300 A 180,180 0 0,1 120,300"
                fill="none"
              />
            </defs>

            {/* 1. Outer Chassis Rim */}
            <circle cx="300" cy="300" r="288" fill="url(#metalRim)" stroke="#555555" strokeWidth="2" />
            <circle cx="300" cy="300" r="278" fill="#0d0d0d" stroke="#222222" strokeWidth="3" />

            {/* 2. Fine Threaded Ribbed Grip Rings (Concentric Stepped Ridges) */}
            <circle cx="300" cy="300" r="268" fill="none" stroke="#2a2a2a" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx="300" cy="300" r="262" fill="none" stroke="#1c1c1c" strokeWidth="2" />
            <circle cx="300" cy="300" r="256" fill="none" stroke="#333333" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="300" cy="300" r="248" fill="#111111" stroke="#000000" strokeWidth="4" />

            {/* 3. Engraved Matte Text Ring */}
            <circle cx="300" cy="300" r="236" fill="#080808" stroke="#222222" strokeWidth="1.5" />

            {/* Circular Engraved Text Matching the Reference Photo */}
            <text fill="#d4d4d4" fontSize="13.5" fontFamily="'Space Mono', monospace" letterSpacing="0.22em" opacity="0.92">
              <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
                SIX STUDIO LENS EF 50mm 1:1.4
              </textPath>
            </text>
            <text fill="#a3a3a3" fontSize="12" fontFamily="'Space Mono', monospace" letterSpacing="0.28em" opacity="0.85">
              <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
                AUTEUR CINEMA // 8K MASTER
              </textPath>
            </text>

            {/* 4. Stepped Inner Barrel Grooves */}
            <circle cx="300" cy="300" r="200" fill="url(#barrelDepth)" stroke="#000000" strokeWidth="4" />
            <circle cx="300" cy="300" r="190" fill="none" stroke="#252525" strokeWidth="1.5" />
            <circle cx="300" cy="300" r="182" fill="none" stroke="#171717" strokeWidth="2" strokeDasharray="4,2" />
            <circle cx="300" cy="300" r="174" fill="none" stroke="#2a2a2a" strokeWidth="1" />
            <circle cx="300" cy="300" r="166" fill="none" stroke="#121212" strokeWidth="2.5" />
            <circle cx="300" cy="300" r="156" fill="none" stroke="#222222" strokeWidth="1" strokeDasharray="3,3" />

            {/* 5. Deep Curved Optical Front Glass Element */}
            <g ref={lensGlassRef}>
              <circle cx="300" cy="300" r="146" fill="url(#glassSphere)" stroke="#1a202c" strokeWidth="1.5" />

              {/* 6. Central Dilating Aperture Iris */}
              <circle
                ref={lensIrisRef}
                cx="300"
                cy="300"
                r="14"
                fill="#000000"
                stroke="#404040"
                strokeWidth="2"
              />

              {/* 7. Realistic Curved Specular Light Reflections (Matching Image) */}
              <g ref={lensGlintRef} className="pointer-events-none">
                {/* Upper Left Specular Reflection */}
                <ellipse
                  cx="256"
                  cy="274"
                  rx="16"
                  ry="12"
                  fill="#ffffff"
                  opacity="0.85"
                  filter="url(#sharpGlow)"
                  transform="rotate(-25 256 274)"
                />
                <ellipse
                  cx="256"
                  cy="274"
                  rx="28"
                  ry="20"
                  fill="#ffffff"
                  opacity="0.35"
                  filter="url(#softGlow)"
                  transform="rotate(-25 256 274)"
                />
                <circle cx="268" cy="286" r="6" fill="#ffffff" opacity="0.9" filter="url(#sharpGlow)" />

                {/* Lower Right Secondary Specular Flare */}
                <ellipse
                  cx="354"
                  cy="350"
                  rx="34"
                  ry="22"
                  fill="#e2e8f0"
                  opacity="0.7"
                  filter="url(#softGlow)"
                  transform="rotate(35 354 350)"
                />
                <ellipse
                  cx="354"
                  cy="350"
                  rx="18"
                  ry="12"
                  fill="#ffffff"
                  opacity="0.9"
                  filter="url(#sharpGlow)"
                  transform="rotate(35 354 350)"
                />
                <circle cx="340" cy="336" r="8" fill="#ffffff" opacity="0.8" filter="url(#sharpGlow)" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* 4. Main Gallery Canvas */}
      <div className="gallery-content-wrap mx-auto max-w-7xl px-4 pt-32 pb-32 sm:px-6 sm:pt-36 sm:pb-40 relative z-10 will-change-transform">
        {/* Title Header with Return Button at Right End */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="gallery-anim-item text-4xl font-light tracking-tight text-white md:text-6xl lg:text-7xl font-cinematic">
              The Gallery
            </p>
            <p className="gallery-anim-item mt-4 max-w-2xl text-base font-light text-neutral-400 md:text-lg">
              Every auteur production, cinematic motion film, and editorial photograph presented in uncompressed master fidelity.
            </p>
          </div>

          <div className="gallery-anim-item shrink-0 hidden sm:block">
            <button
              type="button"
              onClick={onNavigateHome}
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-xl text-xs uppercase tracking-widest text-neutral-200 transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 text-neutral-300 group-hover:text-white" />
              <span className="font-light">Return to Reel</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="gallery-anim-item mb-14 flex flex-wrap items-center gap-3 border-b border-white/10 pb-6">
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  active
                    ? "bg-white text-black font-semibold shadow-[0_0_25px_rgba(255,255,255,0.3)] scale-[1.02]"
                    : "border border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Gallery Dynamic Grid with Creative 2-Col Mobile Bento Rhythm */}
        <div ref={gridContainerRef} className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {filteredItems.map((item, index) => {
            const isPhotography = selectedCategory === "Photography";
            const isHero = index === 0;
            const isMidFeature = index === 3 || index === 6;
            const isMobileSpan2 = !isPhotography && (isHero || isMidFeature || index === 9);
            const isLgSpan2 = !isPhotography && (isHero || index === 3 || index === 6);

            const spanClass = isPhotography
              ? "col-span-1"
              : `${isMobileSpan2 ? "col-span-2" : "col-span-1"} ${isLgSpan2 ? "sm:col-span-2 lg:col-span-2" : "sm:col-span-1 lg:col-span-1"}`;

            return (
              <div key={item.id} className={`gallery-work-card ${spanClass}`}>
                <WorkCard
                  item={item}
                  onOpen={onOpenMedia}
                  overlay="bottom-sm"
                  featured={isMobileSpan2 || isLgSpan2}
                />
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-neutral-400 font-light">No productions cataloged in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
