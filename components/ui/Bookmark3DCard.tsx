"use client";

import { useRef, useState, MouseEvent } from "react";
import { ExternalLink } from "lucide-react";
import { Bookmark } from "@/lib/bookmarks";

type NeonAccent = "pink" | "purple" | "lavender" | "magenta";

const accentMap: Record<NeonAccent, {
    text: string; hoverBorder: string; glow: string;
    tagBorder: string; tagText: string; barBg: string; linkHover: string;
}> = {
    pink: {
        text: "text-neon-pink", hoverBorder: "hover:border-neon-pink",
        glow: "hover:shadow-[0_0_20px_#ff4da6]", tagBorder: "border-neon-pink/30",
        tagText: "text-neon-pink", barBg: "bg-neon-pink", linkHover: "hover:text-neon-pink",
    },
    purple: {
        text: "text-neon-purple", hoverBorder: "hover:border-neon-purple",
        glow: "hover:shadow-[0_0_20px_#cc44ff]", tagBorder: "border-neon-purple/30",
        tagText: "text-neon-purple", barBg: "bg-neon-purple", linkHover: "hover:text-neon-purple",
    },
    lavender: {
        text: "text-neon-lavender", hoverBorder: "hover:border-neon-lavender",
        glow: "hover:shadow-[0_0_20px_#c77dff]", tagBorder: "border-neon-lavender/30",
        tagText: "text-neon-lavender", barBg: "bg-neon-lavender", linkHover: "hover:text-neon-lavender",
    },
    magenta: {
        text: "text-neon-magenta", hoverBorder: "hover:border-neon-magenta",
        glow: "hover:shadow-[0_0_20px_#ff00cc]", tagBorder: "border-neon-magenta/30",
        tagText: "text-neon-magenta", barBg: "bg-neon-magenta", linkHover: "hover:text-neon-magenta",
    },
};

interface Bookmark3DCardProps {
    bookmark: Bookmark;
}

export default function Bookmark3DCard({ bookmark }: Bookmark3DCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const accent = (bookmark.accent as NeonAccent) ?? "lavender";
    const c = accentMap[accent];

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Mouse position relative to the element
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate rotation (-10 to 10 degrees)
        const rotateY = ((mouseX / width) - 0.5) * 20;
        const rotateX = ((mouseY / height) - 0.5) * -20;

        // Calculate glare position mapping from 0-100%
        const glareX = (mouseX / width) * 100;
        const glareY = (mouseY / height) * 100;

        setRotate({ x: rotateX, y: rotateY });
        setGlare({ x: glareX, y: glareY, opacity: 0.15 });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
        setGlare(prev => ({ ...prev, opacity: 0 }));
    };

    return (
        <div
            className="perspective-1000 w-full h-full"
            style={{ perspective: "1000px" }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`group relative w-full h-full neon-card rounded-sm flex flex-col p-5 cursor-crosshair transition-all duration-300 ease-out outline outline-1 outline-transparent ${c.hoverBorder} ${c.glow}`}
                style={{
                    transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                    transformStyle: "preserve-3d",
                    // Reduce the transition duration when moving to make it feel responsive, but smooth when leaving
                    transitionDuration: rotate.x === 0 && rotate.y === 0 ? "500ms" : "50ms",
                }}
            >
                {/* Holographic Glare Effect */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-sm transition-opacity duration-300 ease-out"
                    style={{
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, white, transparent 50%)`,
                        opacity: glare.opacity,
                        mixBlendMode: "overlay",
                    }}
                />

                {/* Top Header */}
                <div className="flex justify-between items-start mb-4" style={{ transform: "translateZ(30px)" }}>
                    <span className={`text-[0.65rem] font-mono tracking-widest uppercase ${c.text}`}>
                        TYPE // {bookmark.type}
                    </span>
                    <ExternalLink size={14} className={`text-text-muted ${c.text} opacity-50`} />
                </div>

                {/* Title & Description */}
                <div className="flex-grow flex flex-col justify-center" style={{ transform: "translateZ(40px)" }}>
                    <h3 className={`text-xl font-bold leading-tight mb-2 ${c.text}`}>
                        {bookmark.title}
                    </h3>
                    <p className="text-text-secondary text-[0.75rem] leading-relaxed line-clamp-3">
                        {bookmark.description}
                    </p>
                </div>

                {/* Middle Stats Box (if available) */}
                {bookmark.stats && bookmark.stats.length > 0 && (
                    <div
                        className={`my-4 flex gap-4 p-2.5 rounded-sm border ${c.tagBorder} bg-bg-primary/50 backdrop-blur-sm`}
                        style={{ transform: "translateZ(35px)" }}
                    >
                        {bookmark.stats.map((stat, i) => (
                            <div key={i} className="flex flex-col">
                                <span className={`text-[0.6rem] uppercase tracking-wider text-text-muted`}>
                                    {stat.label}
                                </span>
                                <span className={`text-[0.8rem] font-bold ${c.text}`}>
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Spacer if no stats */}
                {(!bookmark.stats || bookmark.stats.length === 0) && <div className="my-4" />}

                {/* Tags & Action */}
                <div className="flex flex-col gap-3 mt-auto" style={{ transform: "translateZ(20px)" }}>
                    <div className="flex flex-wrap gap-1.5">
                        {bookmark.tags.map((tag) => (
                            <span
                                key={tag}
                                className={`text-[0.6rem] px-2 py-0.5 rounded-sm border ${c.tagBorder} ${c.text} bg-bg-primary/80`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <a
                        href={bookmark.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-widest font-bold mt-2 ${c.linkHover} transition-colors group/link w-fit`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className={`${c.text}`}>Initialize Link</span>
                        <span className={`opacity-0 group-hover/link:opacity-100 transition-opacity ${c.text}`}>
                            →
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
