"use client";

import { ExternalLink, Github } from "lucide-react";
import dynamic from "next/dynamic";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import MagneticButton from "./MagneticButton";

const Skeleton = () => <div className="w-full h-full min-h-[100px] animate-pulse rounded bg-white/5 border border-white/10" />;

const MlemfetchCat = dynamic(() => import("./MlemfetchCat"), { ssr: false, loading: Skeleton });
const LorenzAttractor = dynamic(() => import("./LorenzAttractor"), { ssr: false, loading: Skeleton });
const FortuneVoronoi = dynamic(() => import("./FortuneVoronoi"), { ssr: false, loading: Skeleton });
const DNAAlignment = dynamic(() => import("./DNAAlignment"), { ssr: false, loading: Skeleton });

export type BentoVariant = "hero" | "tall" | "wide" | "small" | "square-sm" | "square-md";
export type NeonAccent = "pink" | "purple" | "lavender" | "magenta";

export interface BentoProject {
    name: string;
    description: string;
    tags: string[];
    href?: string;
    github?: string;
    github_private?: string;
    variant: BentoVariant;
    accent?: NeonAccent;
    stat?: string;
    statLabel?: string;
    special?: "mlemfetch-cat" | "lorenz-attractor" | "fortune-voronoi" | "dna-alignment";
}

// Tailwind span classes — complete literals for Tailwind scanner
const variantClasses: Record<BentoVariant, string> = {
    hero: "col-span-8 row-span-2",
    tall: "col-span-4 row-span-2",
    wide: "col-span-8 row-span-1",
    small: "col-span-4 row-span-1",
    "square-sm": "col-span-4 row-span-4",
    "square-md": "col-span-6 row-span-5",
};

const accentMap: Record<NeonAccent, {
    text: string; hoverBorder: string; glow: string;
    tagBorder: string; tagText: string; barBg: string; linkHover: string;
    spotlightBg: string;
}> = {
    pink: {
        text: "text-neon-pink", hoverBorder: "hover:border-neon-pink",
        glow: "hover:shadow-[0_0_20px_#ff4da6]", tagBorder: "border-neon-pink/30",
        tagText: "text-neon-pink", barBg: "bg-neon-pink", linkHover: "hover:text-neon-pink",
        spotlightBg: "rgba(255, 77, 166, 0.1)",
    },
    purple: {
        text: "text-neon-purple", hoverBorder: "hover:border-neon-purple",
        glow: "hover:shadow-[0_0_20px_#cc44ff]", tagBorder: "border-neon-purple/30",
        tagText: "text-neon-purple", barBg: "bg-neon-purple", linkHover: "hover:text-neon-purple",
        spotlightBg: "rgba(204, 68, 255, 0.1)",
    },
    lavender: {
        text: "text-neon-lavender", hoverBorder: "hover:border-neon-lavender",
        glow: "hover:shadow-[0_0_20px_#c77dff]", tagBorder: "border-neon-lavender/30",
        tagText: "text-neon-lavender", barBg: "bg-neon-lavender", linkHover: "hover:text-neon-lavender",
        spotlightBg: "rgba(199, 125, 255, 0.1)",
    },
    magenta: {
        text: "text-neon-magenta", hoverBorder: "hover:border-neon-magenta",
        glow: "hover:shadow-[0_0_20px_#ff00cc]", tagBorder: "border-neon-magenta/30",
        tagText: "text-neon-magenta", barBg: "bg-neon-magenta", linkHover: "hover:text-neon-magenta",
        spotlightBg: "rgba(255, 0, 204, 0.1)",
    },
};

/* ── Shared sub-components ───────────────────────────────────────────────── */
function TagsAndLinks({
    project, c, isSmall,
}: {
    project: BentoProject;
    c: (typeof accentMap)[NeonAccent];
    isSmall: boolean;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, isSmall ? 2 : 4).map((tag) => (
                    <span key={tag} className={`pixel-tag text-[0.58rem] px-1.5 py-0.5 rounded-sm border ${c.tagBorder} ${c.tagText}`}>
                        {tag}
                    </span>
                ))}
            </div>
            {(project.github || project.github_private || project.href) && (
                <div className="flex gap-3 items-center relative z-20">
                    {project.github && (
                        <MagneticButton>
                            <a href={project.github} target="_blank" rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 text-[0.62rem] text-text-muted ${c.linkHover} transition-colors no-underline hover:no-underline`}
                                onClick={(e) => e.stopPropagation()}>
                                <Github size={11} />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">GitHub</span>
                            </a>
                        </MagneticButton>
                    )}
                    {project.github_private && (
                        <MagneticButton>
                            <a href={project.github_private} target="_blank" rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 text-[0.62rem] text-text-muted ${c.linkHover} transition-colors no-underline hover:no-underline`}
                                onClick={(e) => e.stopPropagation()}>
                                <Github size={11} />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">GitHub (private for now)</span>
                            </a>
                        </MagneticButton>
                    )}
                    {project.href && (
                        <MagneticButton>
                            <a href={project.href} target="_blank" rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 text-[0.62rem] text-text-muted ${c.linkHover} transition-colors no-underline hover:no-underline`}
                                onClick={(e) => e.stopPropagation()}>
                                <ExternalLink size={11} />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Live</span>
                            </a>
                        </MagneticButton>
                    )}
                </div>
            )}
        </div>
    );
}

/* ── BentoCard ───────────────────────────────────────────────────────────── */
export default function BentoCard({ project }: { project: BentoProject }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const variant = project.variant;
    const accent = project.accent ?? "lavender";
    const c = accentMap[accent];
    const isSmall = variant === "small";
    const isHero = variant === "hero";
    const hasCat = project.special === "mlemfetch-cat";
    const hasLorenz = project.special === "lorenz-attractor";
    const hasFortune = project.special === "fortune-voronoi";
    const hasDNA = project.special === "dna-alignment";

    return (
        <div
            onMouseMove={handleMouseMove}
            className={[
                variantClasses[variant],
                "group relative overflow-hidden",
                "neon-card rounded-sm",
                c.hoverBorder, c.glow,
                "transition-all duration-300",
                "cursor-default",
                "flex flex-col",
                "p-4",
            ].join(" ")}
        >
            {/* Spotlight Background */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-sm opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={{
                    background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${c.spotlightBg}, transparent 80%)`,
                }}
            />

            {/* Content wrapper with relative positioning so it sits atop the spotlight */}
            <div className="relative z-10 flex flex-col flex-1 h-full w-full pointer-events-none">
                <div className="pointer-events-auto flex flex-col flex-1 h-full">

                    {/* Corner accent L-lines */}
                    <div className={`absolute top-0 left-0 w-8 h-[2px] ${c.barBg} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className={`absolute top-0 left-0 h-8 w-[2px] ${c.barBg} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* ══════════════════════════════════════════════════
                LORENZ — text left | canvas right
               ══════════════════════════════════════════════════ */}
                    {hasLorenz ? (
                        <div className="flex flex-row items-center gap-4 flex-1">
                            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                                {project.stat && (
                                    <div className="mb-0.5">
                                        <div className={`font-bold leading-none tracking-tight ${c.text} text-xl`}>
                                            {project.stat}
                                        </div>
                                        {project.statLabel && (
                                            <div className="text-text-muted text-[0.6rem] mt-0.5 tracking-widest uppercase">
                                                {project.statLabel}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <h2 className={`font-bold leading-tight ${c.text} text-sm`}>
                                    {project.name}
                                </h2>
                                <p className="text-text-secondary text-[0.7rem] leading-relaxed line-clamp-4">
                                    {project.description}
                                </p>
                                <div className="flex-1" />
                                <TagsAndLinks project={project} c={c} isSmall={false} />
                            </div>
                            <div className="flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                                <LorenzAttractor width={210} height={210} />
                            </div>
                        </div>

                        /* ══════════════════════════════════════════════════
                            FORTUNE — canvas left | text right
                           ══════════════════════════════════════════════════ */
                    ) : hasFortune ? (
                        <div className="flex flex-row items-center gap-4 flex-1">
                            <div className="flex-shrink-0 opacity-85 group-hover:opacity-100 transition-opacity duration-500">
                                <FortuneVoronoi width={150} height={150} />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                                {project.stat && (
                                    <div className="mb-0.5">
                                        <div className={`font-bold leading-none tracking-tight ${c.text} text-xl`}>
                                            {project.stat}
                                        </div>
                                        {project.statLabel && (
                                            <div className="text-text-muted text-[0.6rem] mt-0.5 tracking-widest uppercase">
                                                {project.statLabel}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <h2 className={`font-bold leading-tight ${c.text} text-sm`}>
                                    {project.name}
                                </h2>
                                <p className="text-text-secondary text-[0.7rem] leading-relaxed line-clamp-4">
                                    {project.description}
                                </p>
                                <div className="flex-1" />
                                <TagsAndLinks project={project} c={c} isSmall={false} />
                            </div>
                        </div>

                        /* ══════════════════════════════════════════════════
                            DNA ALIGNMENT — text left | canvas right
                           ══════════════════════════════════════════════════ */
                    ) : hasDNA ? (
                        <div className="flex flex-row items-center gap-4 flex-1">
                            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                                {project.stat && (
                                    <div className="mb-0.5">
                                        <div className={`font-bold leading-none tracking-tight ${c.text} text-xl`}>
                                            {project.stat}
                                        </div>
                                        {project.statLabel && (
                                            <div className="text-text-muted text-[0.6rem] mt-0.5 tracking-widest uppercase">
                                                {project.statLabel}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <h2 className={`font-bold leading-tight ${c.text} text-sm`}>
                                    {project.name}
                                </h2>
                                <p className="text-text-secondary text-[0.7rem] leading-relaxed line-clamp-4">
                                    {project.description}
                                </p>
                                <div className="flex-1" />
                                <TagsAndLinks project={project} c={c} isSmall={false} />
                            </div>
                            <div
                                id="dna-canvas-container"
                                className="flex-shrink-0 w-[240px] opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                            >
                                <DNAAlignment height={105} />
                            </div>
                        </div>

                        /* ══════════════════════════════════════════════════
                            STANDARD VERTICAL LAYOUT
                           ══════════════════════════════════════════════════ */
                    ) : (
                        <>
                            {/* Top: stat + name + description */}
                            <div className="flex flex-col gap-1.5">
                                {project.stat && !isSmall && (
                                    <div className="mb-0.5">
                                        <div className={`font-bold leading-none tracking-tight ${c.text} ${isHero ? "text-3xl" : "text-xl"}`}>
                                            {project.stat}
                                        </div>
                                        {project.statLabel && (
                                            <div className="text-text-muted text-[0.6rem] mt-0.5 tracking-widest uppercase">
                                                {project.statLabel}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <h2 className={`font-bold leading-tight ${c.text} ${isHero ? "text-sm" : isSmall ? "text-[0.68rem]" : "text-[0.78rem]"}`}>
                                    {project.name}
                                </h2>
                                {!isSmall && (
                                    <p className={`text-text-secondary text-[0.7rem] leading-relaxed ${hasCat ? "line-clamp-2" : "line-clamp-3"}`}>
                                        {project.description}
                                    </p>
                                )}
                            </div>

                            {/* Middle: mlemfetch cat (fixed-height, no card resize) */}
                            {hasCat && (
                                <div
                                    className="flex items-end overflow-hidden mt-2 mb-1"
                                    style={{ minHeight: "230px", maxHeight: "230px" }}
                                >
                                    <MlemfetchCat />
                                </div>
                            )}

                            {/* Spacer */}
                            {!hasCat && <div className="flex-1" />}

                            {/* Bottom: tags + links */}
                            <div className="mt-2">
                                <TagsAndLinks project={project} c={c} isSmall={isSmall} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
