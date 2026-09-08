import { useEffect, useState } from "react";
import type { MediaItem } from "./data/content";
import { AboutPage } from "./components/AboutPage";
import { CameraLensIntro } from "./components/CameraLensIntro";
import { ContactModal } from "./components/ContactModal";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { GalleryPage } from "./components/GalleryPage";
import { Hero } from "./components/Hero";
import { Identity } from "./components/Identity";
import { Viewer } from "./components/Viewer";
import { MusicToggle } from "./components/MusicToggle";
import { Navbar } from "./components/Navbar";
import { SelectedWorks } from "./components/SelectedWorks";
import { Services } from "./components/Services";

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      return p === "/gallery" ? "/gallery" : p === "/about" ? "/about" : "/";
    }
    return "/";
  });
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      setCurrentPath(p === "/gallery" ? "/gallery" : p === "/about" ? "/about" : "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path === "/gallery" ? "/gallery" : path === "/about" ? "/about" : "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="overflow-x-hidden bg-black text-white">
      {currentPath === "/" && <CameraLensIntro />}
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <MusicToggle />

      {currentPath === "/about" ? (
        <AboutPage onOpenContact={() => setContactOpen(true)} />
      ) : currentPath === "/gallery" ? (
        <GalleryPage
          onOpenMedia={setMedia}
          onNavigateHome={() => navigate("/")}
        />
      ) : (
        <main>
          <Hero />
          <Identity />
          <Services />
          <SelectedWorks onOpen={setMedia} />
          <CTA onOpenContact={() => setContactOpen(true)} />
        </main>
      )}

      {(currentPath === "/" || currentPath === "/about") && <Footer />}
      <Viewer item={media} onClose={() => setMedia(null)} onOpen={setMedia} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
