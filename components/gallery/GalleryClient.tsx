"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MapPin, Calendar, Aperture } from "lucide-react";
import { Photo, categories, categoryMeta, PhotoCategory } from "@/lib/gallery";

interface GalleryClientProps {
  initialPhotos: Photo[];
}

export default function GalleryClient({ initialPhotos }: GalleryClientProps) {
  const [filter, setFilter] = useState<PhotoCategory | "all">("all");
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  const filteredPhotos = filter === "all" 
    ? initialPhotos 
    : initialPhotos.filter(p => p.category === filter);

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
      {/* 
        The 'group' class on the container enables the spotlight effect. 
        When the container is hovered, all children get opacity-40.
        When a specific child is hovered, it gets opacity-100.
      */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 group">
        <AnimatePresence>
          {filteredPhotos.map((photo) => {
            const meta = categoryMeta[photo.category];
            return (
              <motion.div
                layout
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid relative overflow-hidden rounded-sm border border-border-default bg-bg-card transition-all duration-500 cursor-zoom-in group-hover:opacity-40 hover:!opacity-100 hover:border-border-glow hover:shadow-[0_0_15px_rgba(123,53,204,0.3)]"
                onClick={() => setLightboxPhoto(photo)}
              >
                {/* 
                  Using standard img for the mock remote unsplash URLs to avoid 
                  next/image remotePatterns issues in static export. 
                  In a real app with local images, <Image> would be used.
                */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-bg-primary to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
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

      {filteredPhotos.length === 0 && (
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
              className="relative max-w-5xl w-full max-h-full flex flex-col md:flex-row gap-6 bg-bg-card p-2 rounded-sm border border-border-glow shadow-[0_0_30px_rgba(123,53,204,0.15)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center min-h-[40vh] md:min-h-[70vh] bg-bg-primary rounded-sm overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxPhoto.src}
                  alt={lightboxPhoto.alt}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>

              {/* Meta Sidebar */}
              <div className="w-full md:w-80 flex flex-col gap-4 p-4">
                <div>
                  <span className={`text-[0.65rem] uppercase tracking-wider font-bold ${categoryMeta[lightboxPhoto.category].accentText}`}>
                    {categoryMeta[lightboxPhoto.category].label}
                  </span>
                  <h2 className="text-xl font-bold text-text-primary mt-1">{lightboxPhoto.alt}</h2>
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
