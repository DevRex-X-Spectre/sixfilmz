import { useEffect } from "react";
import { Instagram, Linkedin, X, Youtube } from "lucide-react";
import { artist, socials } from "../data/content";
import { useLockBody } from "../hooks/useLockBody";

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

const icons = {
  whatsapp: WhatsAppIcon,
  instagram: Instagram,
  x: XIcon,
  youtube: Youtube,
  linkedin: Linkedin,
};

export function ContactModal({ open, onClose }: Props) {
  useLockBody(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="contact-overlay fixed inset-0 z-[90] flex items-center justify-center px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        className="contact-panel relative w-full max-w-lg px-6 py-10 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 right-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="contact-kicker mb-3 text-[10px] uppercase tracking-[0.35em] text-gray-400">
          Start a conversation
        </p>
        <h2 id="contact-title" className="contact-title font-cinematic mb-10 text-3xl font-light tracking-wider md:text-4xl text-white">
          Let&apos;s create
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
          {socials.map((social, index) => {
            const Icon = icons[social.id];
            return (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={
                  social.id === "whatsapp"
                    ? `WhatsApp ${artist.whatsapp}`
                    : social.label
                }
                style={{ animationDelay: `${120 + index * 90}ms` }}
                className="contact-icon group flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-500 hover:scale-110 hover:border-white/40 hover:bg-white hover:text-black sm:h-[72px] sm:w-[72px]"
              >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
