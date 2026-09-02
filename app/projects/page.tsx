import { Metadata } from "next";
import GlowText from "@/components/ui/GlowText";
import BentoCard from "@/components/ui/BentoCard";
import { projects } from "@/lib/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <GlowText as="h1" color="pink" className="text-xl font-bold">
          Projects
        </GlowText>
        <p className="text-text-secondary text-[0.85rem] mt-1">
          things i&apos;ve built, am building, or have abandoned
        </p>
      </div>

      {/*
        Bento grid — 12-column, auto rows of min 70px.
        Every row of projects sums to exactly 12 columns → no gaps, solid rectangle.
        Variants: hero(8×2), tall(4×2), wide(8×1), small(4×1),
                  square-sm(4×4), square-md(6×5)
      */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(12, 1fr)",
          gridAutoRows: "minmax(70px, auto)",
        }}
      >
        {projects.map((project) => (
          <BentoCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
