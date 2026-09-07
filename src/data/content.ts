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
  name: "SIX FILMZ",
  shortName: "SIX",
  role: "Cinematographer · Videographer · Photographer",
  email: "hello@sixfilmz.com",
  year: 2026,
  whatsapp: "0708 673 7375",
  whatsappE164: "2347086737375",
};

export const inquiryMessage =
  "Hello SIX FILMZ, I would like to create something timeless with you.";

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
    href: `https://www.linkedin.com/messaging/compose/?body=${encodeURIComponent(inquiryMessage)}`,
  },
] as const;

export const navLinks = [
  { href: "#cinematography-section", label: "Cinematography" },
  { href: "#results-section", label: "Works" },
  { href: "#photography-section", label: "Photography" },
  { href: "#videography-section", label: "Videography" },
] as const;

export const videos = {
  aerialPark: {
    id: "aerial-park",
    kind: "video",
    title: "Above the Blue",
    category: "Cinematic",
    src: "/videos/IMG_0176.MP4",
    poster: "/posters/IMG_0176.jpg",
    duration: "1:00",
    aspect: "wide",
  },
  resortLight: {
    id: "resort-light",
    kind: "video",
    title: "Resort Light",
    category: "Cinematic",
    src: "/videos/IMG_0177.MP4",
    poster: "/posters/IMG_0177.jpg",
    duration: "1:00",
    aspect: "square",
  },
  redGround: {
    id: "red-ground",
    kind: "video",
    title: "Red Ground",
    category: "Event",
    src: "/videos/IMG_0477.MP4",
    poster: "/posters/IMG_0477.jpg",
    duration: "1:34",
    aspect: "wide",
  },
  heldInFrame: {
    id: "held-in-frame",
    kind: "video",
    title: "Held in Frame",
    category: "Documentary",
    src: "/videos/IMG_0479.MP4",
    poster: "/posters/IMG_0479.jpg",
    duration: "1:17",
    aspect: "square",
  },
  signalEarth: {
    id: "signal-earth",
    kind: "video",
    title: "Signal Earth",
    category: "Motion",
    src: "/videos/IMG_8913.MP4",
    poster: "/posters/IMG_8913.jpg",
    duration: "0:12",
    aspect: "wide",
  },
  paj: {
    id: "paj",
    kind: "video",
    title: "Paj",
    category: "Commercial",
    src: "/videos/IMG_8914.MP4",
    poster: "/posters/IMG_8914.jpg",
    duration: "0:43",
    aspect: "wide",
  },
} satisfies Record<string, MediaItem>;

export const brandFilm: MediaItem = {
  id: "brand-film",
  kind: "photo",
  title: "Brand Film",
  category: "Commercial",
  src: "/images/brand-film.jpg",
  poster: "/images/brand-film.jpg",
  aspect: "wide",
  playAffordance: true,
};

export const behindTheScenes: MediaItem = {
  id: "behind-the-scenes",
  kind: "photo",
  title: "Behind The Scenes",
  category: "Documentary",
  src: "/images/behind-the-scenes.jpg",
  aspect: "wide",
  playAffordance: true,
};

export const selectedWorks: MediaItem[] = [
  { ...videos.signalEarth, aspect: "wide" },
  {
    id: "afternoon-light",
    kind: "photo",
    title: "Afternoon Light",
    category: "Lifestyle",
    src: "/stills/IMG_0176_b.jpg",
    aspect: "portrait",
  },
  {
    id: "desk-side",
    kind: "photo",
    title: "Desk Side",
    category: "Portrait",
    src: "/stills/IMG_8914_a.jpg",
    aspect: "portrait",
  },
  { ...brandFilm },
];

export const cinematographyWorks: MediaItem[] = [
  { ...videos.aerialPark, aspect: "square", category: "Aerial" },
  { ...videos.resortLight, aspect: "square", category: "Aerial" },
];

export const cinematographyFeatured: MediaItem = {
  ...videos.signalEarth,
  aspect: "wide",
};

export const videographyWorks: MediaItem[] = [
  brandFilm,
  behindTheScenes,
  { ...videos.paj, aspect: "wide" },
  { ...videos.redGround, aspect: "wide", title: "The Grand Floor" },
  { ...videos.heldInFrame, aspect: "wide" },
];

export const photographyWorks: MediaItem[] = [
  {
    id: "from-above",
    kind: "photo",
    title: "From Above",
    category: "Aerial",
    src: "/posters/IMG_0176.jpg",
    aspect: "square",
  },
  {
    id: "in-the-water",
    kind: "photo",
    title: "In the Water",
    category: "Lifestyle",
    src: "/stills/IMG_0177_a.jpg",
    aspect: "square",
  },
  {
    id: "afternoon-light-photo",
    kind: "photo",
    title: "Afternoon Light",
    category: "Portrait",
    src: "/stills/IMG_0176_b.jpg",
    aspect: "portrait",
  },
  {
    id: "long-table",
    kind: "photo",
    title: "Long Table",
    category: "Event",
    src: "/stills/IMG_0177_b.jpg",
    aspect: "square",
  },
  {
    id: "the-greeting-photo",
    kind: "photo",
    title: "The Greeting",
    category: "Portrait",
    src: "/posters/IMG_0479.jpg",
    aspect: "portrait",
  },
  {
    id: "holiday-spirit",
    kind: "photo",
    title: "Holiday Spirit",
    category: "Portrait",
    src: "/stills/IMG_0479_a.jpg",
    aspect: "square",
  },
  {
    id: "the-court",
    kind: "photo",
    title: "The Court",
    category: "Event",
    src: "/stills/IMG_0479_b.jpg",
    aspect: "square",
  },
  {
    id: "white-tents",
    kind: "photo",
    title: "White Tents",
    category: "Aerial",
    src: "/posters/IMG_0477.jpg",
    aspect: "square",
  },
  {
    id: "desk-side-photo",
    kind: "photo",
    title: "Desk Side",
    category: "Portrait",
    src: "/stills/IMG_8914_a.jpg",
    aspect: "wide",
  },
  {
    id: "open-market",
    kind: "photo",
    title: "Open Market",
    category: "Documentary",
    src: "/stills/IMG_8914_c.jpg",
    aspect: "wide",
  },
  {
    id: "signal-still",
    kind: "photo",
    title: "Signal Earth",
    category: "Motion",
    src: "/stills/IMG_8913_a.jpg",
    aspect: "wide",
  },
  {
    id: "the-network",
    kind: "photo",
    title: "The Network",
    category: "Motion",
    src: "/posters/IMG_8913.jpg",
    aspect: "wide",
  },
];

export const services = [
  {
    id: "cinematography",
    href: "#cinematography-section",
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
    href: "#photography-section",
    title: "Photography",
    description:
      "Captured moments that tell powerful stories through light and composition.",
    image: "/stills/IMG_0176_b.jpg",
    glow: "from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10",
    icon: "camera" as const,
    reveal: "fade-in" as const,
    delay: 0.2,
  },
  {
    id: "videography",
    href: "#videography-section",
    title: "Videography",
    description:
      "Motion and emotion combined to create cinematic visual experiences.",
    image: "/images/brand-film.jpg",
    glow: "from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10",
    icon: "video" as const,
    reveal: "fade-in-right" as const,
    delay: 0.3,
  },
];

export const galleryItems: MediaItem[] = [
  ...selectedWorks,
  cinematographyFeatured,
  ...cinematographyWorks,
  ...photographyWorks,
  ...videographyWorks,
].filter((item, index, list) => list.findIndex((entry) => entry.id === item.id) === index);
