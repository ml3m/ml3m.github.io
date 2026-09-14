export type PhotoCategory = "street" | "nature" | "events" | "architecture" | "souls" | "other";
export type PhotoOrientation = "portrait" | "landscape" | "square";

export interface Photo {
  id: string;
  src: string; // The original full-res source for downloading
  thumbnailSrc: string; // 800px width webp for grid
  lightboxSrc: string; // 2400px width webp for modal
  alt: string;
  category: PhotoCategory;
  orientation: PhotoOrientation;
  /** width in px (used for masonry aspect ratio) */
  width: number;
  /** height in px (used for masonry aspect ratio) */
  height: number;
  location?: string;
  date?: string;
  caption?: string;
  exif?: {
    camera?: string;
    lens?: string;
    iso?: string;
    aperture?: string;
    shutter?: string;
  };
}

export const categoryMeta: Record<
  PhotoCategory,
  { label: string; accent: string; accentBorder: string; accentText: string; accentBg: string; hoverBorder: string; hoverGlow: string }
> = {
  street: {
    label: "Street",
    accent: "#f59e0b",
    accentBorder: "border-amber-400/40",
    accentText: "text-amber-400",
    accentBg: "bg-amber-400/10",
    hoverBorder: "hover:border-amber-400",
    hoverGlow: "hover:shadow-[0_0_20px_#f59e0b]",
  },
  nature: {
    label: "Nature",
    accent: "#34d399",
    accentBorder: "border-emerald-400/40",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-400/10",
    hoverBorder: "hover:border-emerald-400",
    hoverGlow: "hover:shadow-[0_0_20px_#34d399]",
  },
  events: {
    label: "Events",
    accent: "#fb7185",
    accentBorder: "border-rose-400/40",
    accentText: "text-rose-400",
    accentBg: "bg-rose-400/10",
    hoverBorder: "hover:border-rose-400",
    hoverGlow: "hover:shadow-[0_0_20px_#fb7185]",
  },
  architecture: {
    label: "Architecture",
    accent: "#60a5fa",
    accentBorder: "border-blue-400/40",
    accentText: "text-blue-400",
    accentBg: "bg-blue-400/10",
    hoverBorder: "hover:border-blue-400",
    hoverGlow: "hover:shadow-[0_0_20px_#60a5fa]",
  },
  souls: {
    label: "Souls",
    accent: "#e879f9",
    accentBorder: "border-fuchsia-400/40",
    accentText: "text-fuchsia-400",
    accentBg: "bg-fuchsia-400/10",
    hoverBorder: "hover:border-fuchsia-400",
    hoverGlow: "hover:shadow-[0_0_20px_#e879f9]",
  },
  other: {
    label: "Other",
    accent: "#c77dff",
    accentBorder: "border-neon-lavender/40",
    accentText: "text-neon-lavender",
    accentBg: "bg-neon-lavender/10",
    hoverBorder: "hover:border-neon-lavender",
    hoverGlow: "hover:shadow-[0_0_20px_#c77dff]",
  },
};

export const categories = Object.keys(categoryMeta) as PhotoCategory[];
