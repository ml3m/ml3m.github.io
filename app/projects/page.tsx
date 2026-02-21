import { Metadata } from "next";
import GlowText from "@/components/ui/GlowText";
import NeonCard from "@/components/ui/NeonCard";
import PixelButton from "@/components/ui/PixelButton";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Projects" };

interface Project {
  name: string;
  description: string;
  tags: string[];
  href?: string;
  github?: string;
}

// TODO: replace with your real projects
const projects: Project[] = [
  {
    name: "mlem.vi",
    description:
      "this website. a retro-cyber neon personal site built with next.js and tailwind.",
    tags: ["next.js", "tailwind", "typescript"],
    github: "https://github.com/TODO-your-username/mlem.vi",
  },
  {
    name: "TODO: project name",
    description: "a cool project that does cool things. replace this with your real stuff.",
    tags: ["rust", "wasm"],
    href: "https://example.com",
  },
  {
    name: "TODO: another project",
    description: "another project placeholder. add your real projects here.",
    tags: ["python", "ml"],
    github: "https://github.com/TODO",
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-[680px] mx-auto px-4 py-6 space-y-4">
      <GlowText as="h1" color="pink" className="text-xl font-bold text-center">
        Projects
      </GlowText>
      <p className="text-text-secondary text-center text-[0.85rem]">
        things i&apos;ve built, am building, or have abandoned
      </p>

      <div className="space-y-4">
        {projects.map((project) => (
          <NeonCard key={project.name}>
            <h2 className="text-neon-lavender font-bold text-[0.95rem] mb-1">
              {project.name}
            </h2>
            <p className="text-text-secondary text-[0.85rem] mb-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.7rem] text-neon-purple border border-neon-purple/30 rounded-sm px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              {project.github && (
                <PixelButton href={project.github} external variant="secondary">
                  GitHub
                </PixelButton>
              )}
              {project.href && (
                <PixelButton href={project.href} external>
                  <ExternalLink size={14} />
                  Live
                </PixelButton>
              )}
            </div>
          </NeonCard>
        ))}
      </div>
    </div>
  );
}
