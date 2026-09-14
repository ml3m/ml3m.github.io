"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MapPin, Calendar, Aperture, ExternalLink } from "lucide-react";
import { Photo, categories, categoryMeta, PhotoCategory } from "@/lib/gallery";

interface GalleryClientProps {
  initialPhotos: Photo[];
}

export default function GalleryClient({ initialPhotos }: GalleryClientProps) {
  const [filter, setFilter] = useState<PhotoCategory | "all">("all");
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  const [mounted, setMounted] = useState(false);
  const [numCols, setNumCols] = useState(3);

  // Track window size for responsive columns
  useEffect(() => {
    setMounted(true);
    const updateCols = () => {
      if (window.innerWidth < 640) setNumCols(1);
      else if (window.innerWidth < 1024) setNumCols(2);
      else setNumCols(3);
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  // Shuffle photos whenever the filter changes
  const shuffledPhotos = useMemo(() => {
    const photosToShuffle = filter === "all" 
      ? initialPhotos 
      : initialPhotos.filter(p => p.category === filter);
    
    return [...photosToShuffle].sort(() => Math.random() - 0.5);
  }, [filter, initialPhotos]);

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

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center">
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
      </div>

      {/* Masonry Grid with Spotlight Effect */}
      {!mounted ? (
        <div className="min-h-[50vh] flex items-center justify-center text-text-muted">Loading gallery...</div>
      ) : columns.some(c => c.length > 0) ? (
        <div className="flex gap-4 group">
          {columns.map((colPhotos, colIdx) => (
            <div key={colIdx} className="flex-1 flex flex-col gap-4">
              <AnimatePresence>
                {colPhotos.map((photo) => {
                  const meta = categoryMeta[photo.category];
                  return (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className={`break-inside-avoid relative overflow-hidden rounded-sm border border-border-default bg-bg-card transition-all duration-200 cursor-zoom-in group-hover:opacity-40 hover:!opacity-100 ${meta.hoverBorder} ${meta.hoverGlow}`}
                      onClick={() => setLightboxPhoto(photo)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.thumbnailSrc}
                        alt={photo.alt}
                        loading="lazy"
                        className="w-full h-auto object-cover"
                      />
                      
                      {/* Overlay Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-bg-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className={`text-[0.65rem] uppercase tracking-wider font-bold ${meta.accentText}`}>
                          {meta.label}
                        </span>
                        <p className="text-sm font-bold text-text-primary mt-1 line-clamp-1">{photo.alt}</p>
                      </div>
                    </motion.div>
                  );
                })}
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

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-full flex flex-col md:flex-row gap-6 bg-bg-card p-2 rounded-sm border overflow-y-auto"
              style={{
                borderColor: categoryMeta[lightboxPhoto.category].accent,
                boxShadow: `0 0 30px ${categoryMeta[lightboxPhoto.category].accent}25`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center min-h-[40vh] md:min-h-[70vh] bg-bg-primary rounded-sm overflow-hidden group/image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxPhoto.lightboxSrc}
                  alt={lightboxPhoto.alt}
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

                {lightboxPhoto.exif && (
                  <>
                    <div className="w-full h-px bg-border-default/50 my-2" />
                    <div className="space-y-2">
                      <div className="text-[0.65rem] uppercase tracking-widest text-text-muted/70 mb-2">Technical</div>
                      {lightboxPhoto.exif.camera && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Camera size={12} />
                          <span>{lightboxPhoto.exif.camera}</span>
                        </div>
                      )}
                      {lightboxPhoto.exif.lens && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Aperture size={12} />
                          <span>{lightboxPhoto.exif.lens}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {lightboxPhoto.exif.aperture && (
                          <span className="text-[0.65rem] bg-bg-primary px-2 py-0.5 rounded border border-border-default text-text-muted">
                            {lightboxPhoto.exif.aperture}
                          </span>
                        )}
                        {lightboxPhoto.exif.shutter && (
                          <span className="text-[0.65rem] bg-bg-primary px-2 py-0.5 rounded border border-border-default text-text-muted">
                            {lightboxPhoto.exif.shutter}
                          </span>
                        )}
                        {lightboxPhoto.exif.iso && (
                          <span className="text-[0.65rem] bg-bg-primary px-2 py-0.5 rounded border border-border-default text-text-muted">
                            ISO {lightboxPhoto.exif.iso}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
