import { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";
import { getGalleryPhotos } from "@/lib/gallery-server";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A curated collection of photos.",
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
        </div>

        <GalleryClient initialPhotos={photos} />
      </AnimatedSection>
    </div>
  );
}
