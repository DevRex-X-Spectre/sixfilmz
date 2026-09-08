import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight, Instagram, Linkedin, MessageCircle, X, Youtube } from "lucide-react";
import { artist, socials } from "../data/content";
import { useLockBody } from "../hooks/useLockBody";
import { cameraAudio } from "../lib/cameraAudio";

type Props = {
  open: boolean;
  onClose: () => void;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.06 6.49 2.06 12c0 1.76.46 3.48 1.34 5L2 22l5.15-1.35A9.93 9.93 0 0 0 12.04 22c5.49 0 9.98-4.49 9.98-10 0-2.67-1.04-5.18-2.97-7.09ZM12.04 20.15a8.17 8.17 0 0 1-4.16-1.14l-.3-.18-3.06.8.82-2.98-.2-.31a8.18 8.18 0 0 1-1.26-4.34c0-4.52 3.68-8.2 8.16-8.2 2.18 0 4.23.85 5.77 2.39a8.12 8.12 0 0 1 2.39 5.78c0 4.52-3.68 8.18-8.16 8.18Zm4.47-6.13c-.24-.12-1.45-.72-1.67-.8-.23-.08-.39-.12-.56.12-.16.24-.64.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.2 3.7.59.25 1.04.41 1.4.52.59.18 1.12.16 1.54.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ContactModal({ open, onClose }: Props) {
  useLockBody(open);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const laserBeamRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!open) return;

    // Play subtle camera focus audio chime
    void cameraAudio.playFocus();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tlRef.current = tl;

      // 1. Initial State Setups
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(laserBeamRef.current, { scaleX: 0, scaleY: 1, opacity: 1 });
      gsap.set(cardRef.current, {
        opacity: 0,
        scale: 0.75,
        rotationX: 20,
        rotationY: -10,
        y: 60,
        filter: "blur(24px)",
        transformPerspective: 1200,
      });

      // 2. Anamorphic laser streak shoots across the screen
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.45,
        ease: "power2.out",
      })
        .to(
          laserBeamRef.current,
          {
            scaleX: 1,
            duration: 0.28,
            ease: "expo.inOut",
          },
          "<"
        )
        .to(
          laserBeamRef.current,
          {
            scaleY: 30,
            opacity: 0,
            duration: 0.35,
            ease: "power3.out",
          },
          "-=0.08"
        )
        // 3. Card Explodes Open with 3D Lens Physics & Elastic Snap
        .to(
          cardRef.current,
          {
            opacity: 1,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "back.out(1.5)",
          },
          "-=0.3"
        );

      // 4. Viewfinder mechanical corner marks snap into place
      if (cardRef.current) {
        const cornerTL = cardRef.current.querySelector(".corner-tl");
        const cornerTR = cardRef.current.querySelector(".corner-tr");
        const cornerBL = cardRef.current.querySelector(".corner-bl");
        const cornerBR = cardRef.current.querySelector(".corner-br");

        tl.fromTo(
          [cornerTL, cornerTR, cornerBL, cornerBR],
          { scale: 2.2, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: "expo.out", stagger: 0.04 },
          "-=0.5"
        );

        // 5. Stagger in all internal content with cinematic momentum
        const elements = cardRef.current.querySelectorAll(".crazy-stagger");
        tl.fromTo(
          elements,
          { opacity: 0, y: 24, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.4"
        );
      }
    }, containerRef);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleClose = () => {
    if (cardRef.current && backdropRef.current) {
      const exitTl = gsap.timeline({ onComplete: onClose });
      exitTl
        .to(cardRef.current, {
          scale: 0.88,
          opacity: 0,
          y: 30,
          filter: "blur(16px)",
          duration: 0.3,
          ease: "power3.in",
        })
        .to(
          backdropRef.current,
          {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
          },
          "-=0.15"
        );
    } else {
      onClose();
    }
  };

  if (!open) return null;

  const whatsappSocial = socials.find((s) => s.id === "whatsapp");
  const otherSocials = socials.filter((s) => s.id !== "whatsapp");

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      {/* High-density cinematic backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/94 backdrop-blur-2xl"
      />

      {/* Anamorphic Optical Laser Beam */}
      <div
        ref={laserBeamRef}
        className="pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_25px_#22d3ee] z-10"
      />

      {/* Cinematic Modal Slate */}
      <div
        ref={cardRef}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#161616] via-[#0c0c0c] to-black p-8 sm:p-12 shadow-[0_35px_120px_rgba(0,0,0,0.98)] will-change-transform z-20"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Viewfinder Corner Crosshairs */}
        <span className="corner-tl pointer-events-none absolute top-4 left-4 h-4 w-4 border-t-2 border-l-2 border-white/40" />
        <span className="corner-tr pointer-events-none absolute top-4 right-4 h-4 w-4 border-t-2 border-r-2 border-white/40" />
        <span className="corner-bl pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-white/40" />
        <span className="corner-br pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-white/40" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-gray-400 transition-all duration-300 hover:scale-110 hover:border-white/40 hover:bg-white/15 hover:text-white cursor-pointer z-30"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Content */}
        <div className="text-center">
          <p className="crazy-stagger mb-3 text-[10px] uppercase font-mono tracking-[0.35em] text-gray-400">
            Start a Conversation
          </p>

          <h2
            id="contact-modal-title"
            className="crazy-stagger font-cinematic text-3xl sm:text-5xl font-light tracking-wider text-white"
          >
            LET&apos;S CREATE
          </h2>

          <p className="crazy-stagger mt-4 text-sm font-light text-gray-400 leading-relaxed max-w-sm mx-auto">
            Direct communication with {artist.name}. Available worldwide for commercial productions, brand films, and photography.
          </p>
        </div>

        {/* Primary Priority WhatsApp Direct Card */}
        {whatsappSocial && (
          <div className="crazy-stagger mt-8">
            <a
              href={whatsappSocial.href}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center justify-between rounded-2xl border border-white/20 bg-white/[0.04] p-5 transition-all duration-500 hover:scale-[1.02] hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_35px_rgba(255,255,255,0.08)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <WhatsAppIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white tracking-wide">
                      WhatsApp Direct
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">{artist.whatsapp}</p>
                </div>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white group-hover:border-white">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </a>
          </div>
        )}

        {/* Official Social Channels */}
        <div className="crazy-stagger mt-8">
          <p className="text-center text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-4">
            Official Channels
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {otherSocials.map((social) => {
              let Icon = MessageCircle;
              if (social.id === "instagram") Icon = Instagram;
              if (social.id === "youtube") Icon = Youtube;
              if (social.id === "linkedin") Icon = Linkedin;
              if (social.id === "x") Icon = XIcon as any;

              return (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center transition-all duration-300 hover:border-white/35 hover:bg-white/10 hover:scale-105"
                >
                  <Icon className="h-5 w-5 text-gray-400 transition-colors duration-300 group-hover:text-white" />
                  <span className="text-[11px] font-light text-gray-400 transition-colors duration-300 group-hover:text-white">
                    {social.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
