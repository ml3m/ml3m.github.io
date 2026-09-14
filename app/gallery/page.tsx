import { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";
import { getGalleryPhotos } from "@/lib/gallery-server";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A curated collection of street photography, plants, and city exploration.",
};

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();

  return (
    <div className="max-w-[1200px] mx-auto pb-16">
      <AnimatedSection>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-neon-pink glow-pink mb-4">
            Gallery
          </h1>
          <p className="text-text-secondary max-w-[600px] mx-auto text-sm">
            street photography, plants, city exploration, and whatever else catches my eye.
          </p>
        </div>

        <GalleryClient initialPhotos={photos} />
      </AnimatedSection>
    </div>
  );
}
