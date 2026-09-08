export type MediaKind = "video" | "photo";
export type Aspect = "wide" | "portrait" | "ultrawide" | "square";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  title: string;
  category: string;
  src: string;
  poster?: string;
  duration?: string;
  aspect: Aspect;
  playAffordance?: boolean;
};

export const artist = {
  name: "SIX STUDIO",
  shortName: "SIX",
  role: "Cinematographer · Videographer · Photographer",
  email: "hello@sixstudio.com",
  year: 2026,
  whatsapp: "0708 673 7375",
  whatsappE164: "2347086737375",
};

export const inquiryMessage =
  "Hello SIX STUDIO, I would like to create something timeless with you.";

export const socials = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: `https://wa.me/2347086737375?text=${encodeURIComponent(inquiryMessage)}`,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: `https://instagram.com/?utm_source=sixfilmz&text=${encodeURIComponent(inquiryMessage)}`,
  },
  {
    id: "x",
    label: "X",
    href: `https://x.com/intent/post?text=${encodeURIComponent(inquiryMessage)}`,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@SixFilmz",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: `https://linkedin.com/?utm_source=sixfilmz&text=${encodeURIComponent(inquiryMessage)}`,
  },
] as const;

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "#services-section", label: "Services" },
  { href: "#results-section", label: "Selected Works" },
  { href: "/gallery", label: "Gallery" },
  { href: "#contact-section", label: "Contact" },
] as const;

// 1. UNIQUE PRODUCTION VIDEOS (7 Real Videos)
export const uniqueVideos: MediaItem[] = [
  {
    id: "cinematic-promotion",
    kind: "video",
    title: "Cinematic Promotion",
    category: "Brand Film",
    src: "/videos/cinematic-promotion.mp4",
    poster: "/posters/cinematic-promotion.jpg",
    duration: "0:29",
    aspect: "wide",
  },
  {
    id: "above-the-blue",
    kind: "video",
    title: "Above the Blue",
    category: "Aerial Cinema",
    src: "/videos/IMG_0176.MP4",
    poster: "/posters/IMG_0176.jpg",
    duration: "1:00",
    aspect: "wide",
  },
  {
    id: "resort-light",
    kind: "video",
    title: "Resort Light",
    category: "Cinematography",
    src: "/videos/IMG_0177.MP4",
    poster: "/posters/IMG_0177.jpg",
    duration: "1:00",
    aspect: "square",
  },
  {
    id: "the-grand-floor",
    kind: "video",
    title: "The Grand Floor",
    category: "Event Cinema",
    src: "/videos/IMG_0477.MP4",
    poster: "/posters/IMG_0477.jpg",
    duration: "1:34",
    aspect: "wide",
  },
  {
    id: "held-in-frame",
    kind: "video",
    title: "Held in Frame",
    category: "Documentary",
    src: "/videos/IMG_0479.MP4",
    poster: "/posters/IMG_0479.jpg",
    duration: "1:17",
    aspect: "square",
  },
  {
    id: "signal-earth",
    kind: "video",
    title: "Signal Earth",
    category: "Motion Cinema",
    src: "/videos/IMG_8913.MP4",
    poster: "/posters/IMG_8913.jpg",
    duration: "0:12",
    aspect: "wide",
  },
  {
    id: "paj-commercial",
    kind: "video",
    title: "Paj Commercial",
    category: "Commercial",
    src: "/videos/IMG_8914.MP4",
    poster: "/posters/IMG_8914.jpg",
    duration: "0:43",
    aspect: "wide",
  },
  {
    id: "hologram-effect",
    kind: "video",
    title: "Hologram Effect",
    category: "Motion Cinema",
    src: "/videos/hologram-effect.mp4",
    poster: "/posters/hologram-effect.jpg",
    duration: "1:39",
    aspect: "wide",
  },  {
    id: "typography",
    kind: "video",
    title: "Typography",
    category: "Motion Cinema",
    src: "/videos/typography.mp4",
    poster: "/posters/typography.jpg",
    duration: "0:13",
    aspect: "wide",
  },

];

// 2. UNIQUE PHOTOGRAPHS (6 Real Photographs)
export const uniquePhotos: MediaItem[] = [
  {
    id: "studio-portrait",
    kind: "photo",
    title: "Studio Portrait",
    category: "Portrait",
    src: "/images/IMG_4726.jpg",
    aspect: "portrait",
  },
  {
    id: "editorial-presence",
    kind: "photo",
    title: "Editorial Presence",
    category: "Editorial",
    src: "/images/IMG_0467.jpg",
    aspect: "portrait",
  },
  {
    id: "golden-hour",
    kind: "photo",
    title: "Golden Hour Silhouette",
    category: "Portrait",
    src: "/images/IMG_1013.jpg",
    aspect: "portrait",
  },
  {
    id: "intimate-contrast",
    kind: "photo",
    title: "Intimate Contrast",
    category: "Fine Art",
    src: "/images/IMG_0229.jpg",
    aspect: "portrait",
  },
  {
    id: "atmospheric-shadow",
    kind: "photo",
    title: "Atmospheric Shadow",
    category: "Portrait",
    src: "/images/IMG_0827.jpg",
    aspect: "portrait",
  },
  {
    id: "creative-form",
    kind: "photo",
    title: "Creative Form",
    category: "Creative",
    src: "/images/IMG_0254.png",
    aspect: "square",
  },
];

// 3. CURATED SELECTED WORKS (Only 4 Classic Pieces on Landing Page)
export const selectedWorks: MediaItem[] = [
  uniqueVideos[0], // Cinematic Promotion (Brand Film)
  uniquePhotos[2], // Golden Hour Silhouette (Portrait)
  uniquePhotos[1], // Editorial Presence (Editorial)
  uniqueVideos[1], // Above the Blue (Aerial Cinema)
];

// 4. SUB-COLLECTION ALIASES
export const cinematographyFeatured: MediaItem = uniqueVideos[1];
export const cinematographyWorks: MediaItem[] = [uniqueVideos[2], uniqueVideos[5], uniqueVideos[7]];
export const videographyWorks: MediaItem[] = [uniqueVideos[0], uniqueVideos[6], uniqueVideos[3], uniqueVideos[4]];
export const photographyWorks: MediaItem[] = uniquePhotos;

// 5. SERVICES
export const services = [
  {
    id: "cinematography",
    href: "/gallery",
    title: "Cinematography",
    description:
      "Aerial and ground cinema. Light, movement, and place composed as film.",
    image: "/posters/IMG_0176.jpg",
    glow: "from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10",
    icon: "clapperboard" as const,
    reveal: "fade-in-left" as const,
    delay: 0.1,
  },
  {
    id: "photography",
    href: "/gallery",
    title: "Photography",
    description:
      "Captured moments that tell powerful stories through light and composition.",
    image: "/images/IMG_1013.jpg",
    glow: "from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10",
    icon: "camera" as const,
    reveal: "fade-in" as const,
    delay: 0.2,
  },
  {
    id: "videography",
    href: "/gallery",
    title: "Videography",
    description:
      "Motion and emotion combined to create cinematic visual experiences.",
    image: "/posters/cinematic-promotion.jpg",
    glow: "from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10",
    icon: "video" as const,
    reveal: "fade-in-right" as const,
    delay: 0.3,
  },
];

// 6. MASTER GALLERY ARCHIVE (13 Unique Items, 0 Repetitions)
export const galleryItems: MediaItem[] = [
  ...uniqueVideos,
  ...uniquePhotos,
];
