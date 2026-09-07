import { Instagram, Linkedin, Youtube } from "lucide-react";
import { artist, socials } from "../data/content";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.06 6.49 2.06 12c0 1.76.46 3.48 1.34 5L2 22l5.15-1.35A9.93 9.93 0 0 0 12.04 22c5.49 0 9.98-4.49 9.98-10 0-2.67-1.04-5.18-2.97-7.09ZM12.04 20.15a8.17 8.17 0 0 1-4.16-1.14l-.3-.18-3.06.8.82-2.98-.2-.31a8.18 8.18 0 0 1-1.26-4.34c0-4.52 3.68-8.2 8.16-8.2 2.18 0 4.23.85 5.77 2.39a8.12 8.12 0 0 1 2.39 5.78c0 4.52-3.68 8.18-8.16 8.18Zm4.47-6.13c-.24-.12-1.45-.72-1.67-.8-.23-.08-.39-.12-.56.12-.16.24-.64.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.2 3.7.59.25 1.04.41 1.4.52.59.18 1.12.16 1.54.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
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

export function Footer() {
  return (
    <footer className="border-t border-gray-900 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <p className="text-xs font-light text-gray-600">
            © {artist.year} {artist.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 sm:gap-8">
            {socials.map((social) => {
              const Icon = icons[social.id];
              return (
                <a
                  key={social.id}
                  href={social.href}
                  className="text-gray-500 transition-colors duration-500 hover:text-white"
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
