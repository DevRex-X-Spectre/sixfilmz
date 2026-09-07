import { useState } from "react";
import type { MediaItem } from "./data/content";
import { CameraLensIntro } from "./components/CameraLensIntro";
import { Cinematography } from "./components/Cinematography";
import { ContactModal } from "./components/ContactModal";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Identity } from "./components/Identity";
import { Viewer } from "./components/Viewer";
import { MusicToggle } from "./components/MusicToggle";
import { Navbar } from "./components/Navbar";
import { Photography } from "./components/Photography";
import { SelectedWorks } from "./components/SelectedWorks";
import { Services } from "./components/Services";
import { Videography } from "./components/Videography";

export default function App() {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="overflow-x-hidden bg-black text-white">
      <CameraLensIntro />
      <Navbar />
      <MusicToggle />
      <main>
        <Hero />
        <Identity />
        <Services />
        <SelectedWorks onOpen={setMedia} />
        <Cinematography onOpen={setMedia} />
        <Photography onOpen={setMedia} />
        <Videography onOpen={setMedia} />
        <CTA onOpenContact={() => setContactOpen(true)} />
      </main>
      <Footer />
      <Viewer item={media} onClose={() => setMedia(null)} onOpen={setMedia} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
