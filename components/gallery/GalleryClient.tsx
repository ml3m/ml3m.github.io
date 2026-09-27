"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, MapPin, Calendar, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Photo, categories, categoryMeta, PhotoCategory, APPLE_COLORS, AppleColor } from "@/lib/gallery";
import Image from "next/image";

// 💡 TWEAK THE TILT SPEED HERE
// stiffness: Higher = faster/snappier. Lower = slower.
// damping: Higher = stops quicker. Lower = more bouncy.
// mass: Higher = heavier/slower to start. Lower = lighter/quicker.
const TILT_SPEED = { damping: 20, stiffness: 300, mass: 0.5 };

// 3D Tilt Card Component for the Grid
function PhotoCard({ photo, meta, onClick }: { photo: Photo; meta: (typeof categoryMeta)[PhotoCategory]; onClick: () => void; }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Spring animation for smooth return and movement
  const smoothX = useSpring(x, TILT_SPEED);
  const smoothY = useSpring(y, TILT_SPEED);

  // Rotate between -15 and 15 degrees
  const rotateX = useTransform(smoothY, [0, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [0, 1], [-15, 15]);

  const [isLoaded, setIsLoaded] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize mouse position from 0 to 1
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    // Reset to center
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      style={{ perspective: 1000 }} // Enables 3D space
      className={`break-inside-avoid relative transition-all duration-300 cursor-zoom-in group-hover:opacity-40 hover:!opacity-100 z-10 hover:z-20`}
      onClick={onClick}
      onPointerEnter={() => {
        // Silently preload the high-res image
        const img = new window.Image();
        img.src = photo.lightboxSrc;
      }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden rounded-sm border border-border-default bg-bg-card transition-colors duration-200 ${meta.hoverBorder} ${meta.hoverGlow}`}
      >
        <Image
          src={photo.thumbnailSrc}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-auto object-cover transition-all duration-700 ${
            isLoaded ? 'blur-0 opacity-100 scale-100' : 'blur-xl opacity-0 scale-105'
          }`}
        />
        
        {/* Subtle hover overlay for context */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
           <span className={`text-[0.65rem] uppercase tracking-wider font-bold ${meta.accentText} drop-shadow-md`}>
              {meta.label}
           </span>
        </div>
      </motion.div>
    </motion.div>
  );
}


interface GalleryClientProps {
  initialPhotos: Photo[];
}

export default function GalleryClient({ initialPhotos }: GalleryClientProps) {
  const [filter, setFilter] = useState<PhotoCategory | "all">("all");
  const [colorFilter, setColorFilter] = useState<AppleColor | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  const [mounted, setMounted] = useState(false);
  const [numCols, setNumCols] = useState(3);

  // Feature 4: Initialize deep link on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const photoId = params.get("photo");
    if (photoId) {
      const p = initialPhotos.find(x => x.id === photoId);
      if (p) setLightboxPhoto(p);
    }
  }, [initialPhotos]);

  // Track window size for responsive columns and inject custom scrollbar
  useEffect(() => {
    setMounted(true);
    
    // Inject fancy scrollbar
    document.documentElement.classList.add("gallery-scroll");
    
    const updateCols = () => {
      setNumCols(3); // User requested 3 columns even on phones
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    
    return () => {
      window.removeEventListener("resize", updateCols);
      document.documentElement.classList.remove("gallery-scroll");
    };
  }, []);

  // Shuffle photos whenever any filter changes (category + color)
  const shuffledPhotos = useMemo(() => {
    let photos = filter === "all" 
      ? initialPhotos 
      : initialPhotos.filter(p => p.category === filter);
    
    if (colorFilter) {
      photos = photos.filter(p => p.dominantColors.includes(colorFilter));
    }
    
    return [...photos].sort(() => Math.random() - 0.5);
  }, [filter, colorFilter, initialPhotos]);

  // Feature 4 & 2: Update URL State & Keyboard Navigation
  useEffect(() => {
    if (mounted) {
      if (lightboxPhoto) {
        window.history.pushState(null, '', `?photo=${lightboxPhoto.id}`);
      } else {
        window.history.pushState(null, '', window.location.pathname);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxPhoto) return;
      
      if (e.key === "Escape") {
        setLightboxPhoto(null);
      } else if (e.key === "ArrowRight") {
        const idx = shuffledPhotos.findIndex(p => p.id === lightboxPhoto.id);
        if (idx !== -1) {
          const next = (idx + 1) % shuffledPhotos.length;
          setLightboxPhoto(shuffledPhotos[next]);
        }
      } else if (e.key === "ArrowLeft") {
        const idx = shuffledPhotos.findIndex(p => p.id === lightboxPhoto.id);
        if (idx !== -1) {
          const prev = (idx - 1 + shuffledPhotos.length) % shuffledPhotos.length;
          setLightboxPhoto(shuffledPhotos[prev]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxPhoto, shuffledPhotos, mounted]);

  // Distribute photos into columns enforcing the P-L-P rule
  const columns = useMemo(() => {
    const cols: Photo[][] = Array.from({ length: numCols }, () => []);
    if (shuffledPhotos.length === 0) return cols;

    if (numCols === 3) {
      const temp = [...shuffledPhotos];
      
      // Helper to pull best matching orientation
      const pull = (isPortrait: boolean) => {
        const idx = temp.findIndex(p => isPortrait 
          ? p.height >= p.width // portrait or square
          : p.width >= p.height  // landscape or square
        );
        return idx >= 0 ? temp.splice(idx, 1)[0] : temp.shift()!;
      };

      // Rule: Col 1 Portrait, Col 2 Landscape, Col 3 Portrait
      if (temp.length > 0) cols[0].push(pull(true));
      if (temp.length > 0) cols[1].push(pull(false));
      if (temp.length > 0) cols[2].push(pull(true));

      // Distribute the rest evenly
      temp.forEach((photo, i) => {
        cols[i % 3].push(photo);
      });
    } else {
      shuffledPhotos.forEach((photo, i) => {
        cols[i % numCols].push(photo);
      });
    }
    
    return cols;
  }, [shuffledPhotos, numCols]);

  // Navigate handlers for UI buttons
  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightboxPhoto) return;
    const idx = shuffledPhotos.findIndex(p => p.id === lightboxPhoto.id);
    if (idx !== -1) {
      const next = (idx + 1) % shuffledPhotos.length;
      setLightboxPhoto(shuffledPhotos[next]);
    }
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightboxPhoto) return;
    const idx = shuffledPhotos.findIndex(p => p.id === lightboxPhoto.id);
    if (idx !== -1) {
      const prev = (idx - 1 + shuffledPhotos.length) % shuffledPhotos.length;
      setLightboxPhoto(shuffledPhotos[prev]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center items-center">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 text-sm rounded-sm border transition-all ${
            filter === "all"
              ? "border-neon-lavender bg-neon-lavender/10 text-neon-lavender"
              : "border-border-default text-text-muted hover:border-border-glow hover:text-text-secondary"
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const meta = categoryMeta[cat];
          const isActive = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 text-sm rounded-sm border transition-all ${
                isActive
                  ? `${meta.accentBorder} ${meta.accentBg} ${meta.accentText}`
                  : "border-border-default text-text-muted hover:border-border-glow hover:text-text-secondary"
              }`}
            >
              {meta.label}
            </button>
          );
        })}

        {/* Vertical divider */}
        <div className="w-px h-6 bg-border-default/50 mx-1 hidden sm:block" />

        {/* Rainbow Capsule */}
        <div className="liquid-glass rounded-full px-2 py-1.5 flex items-center gap-1.5">
          {APPLE_COLORS.map((color) => {
            const isActive = colorFilter === color.name;
            return (
              <button
                key={color.name}
                onClick={() => setColorFilter(isActive ? null : color.name)}
                className="relative rounded-full transition-all duration-300 ease-out"
                style={{
                  width: isActive ? 28 : 20,
                  height: isActive ? 28 : 20,
                  backgroundColor: color.hex,
                  opacity: colorFilter && !isActive ? 0.35 : 1,
                  boxShadow: isActive
                    ? `0 0 10px ${color.hex}, 0 0 22px ${color.hex}60, inset 0 1px 2px rgba(255,255,255,0.3)`
                    : `inset 0 1px 2px rgba(255,255,255,0.15)`,
                  border: isActive
                    ? `2px solid rgba(255,255,255,0.5)`
                    : `1px solid rgba(255,255,255,0.1)`,
                }}
                title={color.name.charAt(0).toUpperCase() + color.name.slice(1)}
              />
            );
          })}
        </div>
      </div>

      {/* Masonry Grid with Spotlight Effect */}
      {!mounted ? (
        <div className="min-h-[50vh] flex items-center justify-center text-text-muted">Loading gallery...</div>
      ) : columns.some(c => c.length > 0) ? (
        <div className="flex gap-2 sm:gap-4 group">
          {columns.map((colPhotos, colIdx) => (
            <div key={colIdx} className="flex-1 flex flex-col gap-2 sm:gap-4">
              <AnimatePresence>
                {colPhotos.map((photo) => (
                  <PhotoCard 
                    key={photo.id} 
                    photo={photo} 
                    meta={categoryMeta[photo.category]} 
                    onClick={() => setLightboxPhoto(photo)} 
                  />
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-text-muted">
          No photos found for this category.
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-6 right-6 text-text-muted hover:text-neon-pink transition-colors z-50"
            >
              <X size={28} />
            </button>

            {/* Feature 2: Navigation Arrows in UI */}
            <button 
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-neon-pink transition-colors z-50 hidden sm:flex items-center justify-center p-2 bg-bg-card/50 rounded-full border border-border-default backdrop-blur"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-neon-pink transition-colors z-50 hidden sm:flex items-center justify-center p-2 bg-bg-card/50 rounded-full border border-border-default backdrop-blur"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div
              key={lightboxPhoto.id} // Forces re-animation when changing photos
              initial={{ scale: 0.95, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.95, opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-full flex flex-col md:flex-row gap-6 bg-bg-card p-2 rounded-sm border overflow-y-auto"
              style={{
                borderColor: categoryMeta[lightboxPhoto.category].accent,
                boxShadow: `0 0 30px ${categoryMeta[lightboxPhoto.category].accent}25`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center min-h-[40vh] md:min-h-[70vh] bg-bg-primary rounded-sm overflow-hidden group/image relative">
                <Image
                  src={lightboxPhoto.lightboxSrc}
                  alt={lightboxPhoto.alt}
                  width={lightboxPhoto.width}
                  height={lightboxPhoto.height}
                  onClick={() => window.open(lightboxPhoto.src, "_blank")}
                  className="max-w-full max-h-[70vh] object-contain cursor-pointer transition-transform duration-300 group-hover/image:scale-[1.02]"
                  title="Click to open full quality image"
                />
              </div>

              {/* Meta Sidebar */}
              <div className="w-full md:w-80 flex flex-col gap-4 p-4">
                <div>
                  <span className={`text-[0.65rem] uppercase tracking-wider font-bold ${categoryMeta[lightboxPhoto.category].accentText}`}>
                    {categoryMeta[lightboxPhoto.category].label}
                  </span>
                  <h2 className="text-xl font-bold text-text-primary mt-1">{lightboxPhoto.alt}</h2>
                  
                  <button 
                    onClick={() => window.open(lightboxPhoto.src, "_blank")}
                    className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-primary bg-bg-primary hover:bg-bg-card border border-border-default px-4 py-2 rounded-sm transition-colors w-fit"
                  >
                    <ExternalLink size={14} />
                    Open Full Quality
                  </button>
                  {lightboxPhoto.caption && (
                    <p className="text-sm text-text-secondary mt-2 italic">&quot;{lightboxPhoto.caption}&quot;</p>
                  )}
                </div>

                <div className="w-full h-px bg-border-default/50" />

                <div className="space-y-3 text-sm text-text-muted">
                  {lightboxPhoto.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-neon-lavender" />
                      <span>{lightboxPhoto.location}</span>
                    </div>
                  )}
                  {lightboxPhoto.date && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-neon-lavender" />
                      <span>{lightboxPhoto.date}</span>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
