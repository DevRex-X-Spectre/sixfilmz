import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "../data/content";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const left = navLinks.slice(0, 2);
  const right = navLinks.slice(2);

  return (
    <nav
      className="nav-fade fixed top-0 right-0 left-0 z-50"
      style={{
        background: scrolled || open ? "rgba(0, 0, 0, 0.8)" : "transparent",
        backdropFilter: scrolled || open ? "blur(20px)" : "none",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-4 font-semibold sm:px-6 sm:pt-6 sm:pb-6 lg:px-12">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-3">
          <div className="hidden items-center gap-8 lg:flex lg:gap-12">
            {left.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-light text-gray-300 transition-colors duration-500 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#top"
            className="group flex items-center justify-start lg:justify-center transition-transform duration-300 hover:scale-105"
            aria-label="SIX FILMZ Home"
          >
            <img
              src="/channels4_profile.jpg"
              alt="SIX FILMZ Logo"
              className="h-14 w-14 sm:h-18 sm:w-18 lg:h-20 lg:w-20 rounded-full object-cover transition-all duration-300"
            />
          </a>

          <div className="flex items-center justify-end gap-8 lg:gap-12">
            {right.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hidden text-sm font-light text-gray-300 transition-colors duration-500 hover:text-white lg:inline"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              className="rounded-full p-2 text-gray-300 transition-colors hover:text-white lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-900 bg-black/95 px-6 py-8 lg:hidden">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg font-light text-gray-300 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact-section"
              onClick={() => setOpen(false)}
              className="text-lg font-light text-gray-300 transition-colors hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
