import { useEffect, useState } from "react";
import { Menu, X, ArrowLeft } from "lucide-react";
import { navLinks } from "../data/content";

type Props = {
  currentPath?: string;
  onNavigate?: (path: string) => void;
};

export function Navbar({ currentPath = "/", onNavigate }: Props) {
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);

    if (href === "/about" || href === "/gallery") {
      if (onNavigate) {
        onNavigate(href);
      } else {
        window.history.pushState({}, "", href);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
      return;
    }

    if (href === "/" || href === "#top") {
      if (currentPath !== "/") {
        if (onNavigate) onNavigate("/");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentPath !== "/") {
      if (onNavigate) onNavigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const left = navLinks.slice(0, 2);
  const right = navLinks.slice(2);

  return (
    <nav
      className="nav-fade fixed top-0 right-0 left-0 z-50"
      style={{
        background: scrolled || open ? "rgba(0, 0, 0, 0.85)" : "transparent",
        backdropFilter: scrolled || open ? "blur(20px)" : "none",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-4 font-semibold sm:px-6 sm:pt-6 sm:pb-6 lg:px-12">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-3">
          <div className="hidden items-center gap-8 lg:flex lg:gap-12">
            {left.map((link) => {
              const isActive = (link.href === "/gallery" && currentPath === "/gallery") ||
                               (link.href === "/about" && currentPath === "/about");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm tracking-wide transition-all duration-300 ${
                    isActive
                      ? "text-white font-medium border-b-2 border-white pb-0.5"
                      : "font-light text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <a
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="group flex items-center justify-start lg:justify-center transition-transform duration-300 hover:scale-105"
            aria-label="SIX STUDIO Home"
          >
            <img
              src="/channels4_profile.jpg"
              alt="SIX STUDIO Logo"
              className="h-14 w-14 sm:h-18 sm:w-18 lg:h-20 lg:w-20 rounded-full object-cover transition-all duration-300 shadow-md"
            />
          </a>

          <div className="flex items-center justify-end gap-8 lg:gap-12">
            {right.map((link) => {
              const isActive = (link.href === "/gallery" && currentPath === "/gallery") ||
                               (link.href === "/about" && currentPath === "/about");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`hidden text-sm transition-all duration-300 lg:inline tracking-wide ${
                    isActive
                      ? "text-white font-medium border-b-2 border-white pb-0.5"
                      : "font-light text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <button
              type="button"
              className="rounded-full p-2 text-gray-300 transition-colors hover:text-white lg:hidden cursor-pointer"
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
            {(currentPath === "/gallery" || currentPath === "/about") && (
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, "/")}
                className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs uppercase tracking-widest text-white transition-all hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Reel</span>
              </a>
            )}
            {navLinks.map((link) => {
              const isActive = (link.href === "/gallery" && currentPath === "/gallery") ||
                               (link.href === "/about" && currentPath === "/about");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-lg transition-colors hover:text-white ${
                    isActive
                      ? "text-white font-medium underline underline-offset-4"
                      : "font-light text-gray-300"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
