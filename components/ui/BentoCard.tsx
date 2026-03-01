"use client";

import { ExternalLink, Github } from "lucide-react";
import dynamic from "next/dynamic";

const MlemfetchCat = dynamic(() => import("./MlemfetchCat"), { ssr: false });

export type BentoVariant = "hero" | "tall" | "wide" | "small";
export type NeonAccent = "pink" | "purple" | "lavender" | "magenta";

export interface BentoProject {
    name: string;
    description: string;
    tags: string[];
    href?: string;
    github?: string;
    variant: BentoVariant;
    accent?: NeonAccent;
    /** Optional: a short punchy stat or label shown large in the card */
    stat?: string;
    statLabel?: string;
    /** Special card type for unique animated content */
    special?: "mlemfetch-cat";
}

const variantClasses: Record<BentoVariant, string> = {
    hero: "col-span-8 row-span-2",
    tall: "col-span-4 row-span-2",
    wide: "col-span-8 row-span-1",
    small: "col-span-4 row-span-1",
};

// All class strings are complete literals so Tailwind can detect them at build time
const accentMap: Record<
    NeonAccent,
    {
        text: string;
        hoverBorder: string;
        glow: string;
        tagBorder: string;
        tagText: string;
        barBg: string;
        linkHover: string;
    }
> = {
    pink: {
        text: "text-neon-pink",
        hoverBorder: "hover:border-neon-pink",
        glow: "hover:shadow-[0_0_20px_#ff4da6]",
        tagBorder: "border-neon-pink/30",
        tagText: "text-neon-pink",
        barBg: "bg-neon-pink",
        linkHover: "hover:text-neon-pink",
    },
    purple: {
        text: "text-neon-purple",
        hoverBorder: "hover:border-neon-purple",
        glow: "hover:shadow-[0_0_20px_#cc44ff]",
        tagBorder: "border-neon-purple/30",
        tagText: "text-neon-purple",
        barBg: "bg-neon-purple",
        linkHover: "hover:text-neon-purple",
    },
    lavender: {
        text: "text-neon-lavender",
        hoverBorder: "hover:border-neon-lavender",
        glow: "hover:shadow-[0_0_20px_#c77dff]",
        tagBorder: "border-neon-lavender/30",
        tagText: "text-neon-lavender",
        barBg: "bg-neon-lavender",
        linkHover: "hover:text-neon-lavender",
    },
    magenta: {
        text: "text-neon-magenta",
        hoverBorder: "hover:border-neon-magenta",
        glow: "hover:shadow-[0_0_20px_#ff00cc]",
        tagBorder: "border-neon-magenta/30",
        tagText: "text-neon-magenta",
        barBg: "bg-neon-magenta",
        linkHover: "hover:text-neon-magenta",
    },
};

export default function BentoCard({ project }: { project: BentoProject }) {
    const variant = project.variant;
    const accent = project.accent ?? "lavender";
    const c = accentMap[accent];
    const isHero = variant === "hero";
    const isTall = variant === "tall";
    const isSmall = variant === "small";
    const hasCat = project.special === "mlemfetch-cat";

    return (
        <div
            className={[
                variantClasses[variant],
                "group relative overflow-hidden",
                "neon-card rounded-sm",
                c.hoverBorder,
                c.glow,
                "transition-all duration-300",
                "cursor-default",
                "flex flex-col justify-between",
                "p-4",
            ].join(" ")}
        >
            {/* Corner accent lines (top-left L-shape) */}
            <div className={`absolute top-0 left-0 w-8 h-[2px] ${c.barBg} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className={`absolute top-0 left-0 h-8 w-[2px] ${c.barBg} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

            {/* ASCII cat animation — only for mlemfetch card */}
            {hasCat && (
                <div className="absolute right-0 bottom-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <MlemfetchCat />
                </div>
            )}

            {/* Main content */}
            <div className="flex flex-col gap-1.5 flex-1 min-h-0">

                {/* Stat block — only on hero / tall */}
                {project.stat && (isHero || isTall) && (
                    <div className="mb-1">
                        <div className={`font-bold leading-none tracking-tight ${c.text} ${isHero ? "text-3xl" : "text-2xl"}`}>
                            {project.stat}
                        </div>
                        {project.statLabel && (
                            <div className="text-text-muted text-[0.6rem] mt-0.5 tracking-widest uppercase">
                                {project.statLabel}
                            </div>
                        )}
                    </div>
                )}

                {/* Project name */}
                <h2 className={`font-bold leading-tight ${c.text} ${isHero ? "text-sm" : isSmall ? "text-[0.68rem]" : "text-[0.78rem]"}`}>
                    {project.name}
                </h2>

                {/* Description — only on non-small cards */}
                {!isSmall && (
                    <p className="text-text-secondary text-[0.7rem] leading-relaxed line-clamp-3">
                        {project.description}
                    </p>
                )}
            </div>

            {/* Bottom: tags + links */}
            <div className="mt-2 flex flex-col gap-1.5">
                <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, isSmall ? 2 : 4).map((tag) => (
                        <span
                            key={tag}
                            className={`pixel-tag text-[0.58rem] px-1.5 py-0.5 rounded-sm border ${c.tagBorder} ${c.tagText}`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {(project.github || project.href) && (
                    <div className="flex gap-3 items-center">
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 text-[0.62rem] text-text-muted ${c.linkHover} transition-colors no-underline hover:no-underline`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Github size={11} />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    GitHub
                                </span>
                            </a>
                        )}
                        {project.href && (
                            <a
                                href={project.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 text-[0.62rem] text-text-muted ${c.linkHover} transition-colors no-underline hover:no-underline`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink size={11} />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Live
                                </span>
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
