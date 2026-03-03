"use client";

import { useState, useEffect, useRef } from "react";
import { Bookmark } from "@/lib/bookmarks";
import { ExternalLink, X } from "lucide-react";

// ─── Glitch Typing Hook ──────────────────────────────────────────────────────
function useGlitchText(text: string, speedMs: number = 400, glitchChars: string = "!<>-_\\\\/[]{}—=+*^?#________") {
    const [displayText, setDisplayText] = useState("");
    const iterationRef = useRef(0);

    useEffect(() => {
        iterationRef.current = 0;
        setDisplayText("");

        const length = text.length;
        if (!length) return;

        const interval = setInterval(() => {
            setDisplayText(() => {
                let newText = "";
                // Base increment based on word length for a smooth but quick reveal
                const increment = Math.max(1, text.length / 30);
                iterationRef.current += increment;

                let isDone = true;
                for (let i = 0; i < length; i++) {
                    if (i < iterationRef.current) {
                        newText += text[i];
                    } else if (i < iterationRef.current + 8) {
                        // Glitch trail
                        isDone = false;
                        newText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    } else {
                        isDone = false;
                        // Leave the rest empty instead of fully glitching the whole unseen string
                    }
                }

                if (isDone) {
                    clearInterval(interval);
                    return text;
                }
                return newText;
            });
        }, speedMs);

        return () => clearInterval(interval);
    }, [text, speedMs, glitchChars]);

    return displayText;
}

interface BookmarkBookshelfProps {
    bookmarks: Bookmark[];
}

type NeonAccent = "pink" | "purple" | "lavender" | "magenta";

const accentColors: Record<
    NeonAccent,
    {
        top: string;
        front: string;
        side: string;
        glow: string;
        textClass: string;
        borderClass: string;
        badgeBg: string;
        tagBorder: string;
    }
> = {
    pink: {
        top: "#ffb3d9",
        front: "#ff4da6",
        side: "#cc0066",
        glow: "#ff4da6",
        textClass: "text-neon-pink",
        borderClass: "border-neon-pink/40",
        badgeBg: "bg-neon-pink/10",
        tagBorder: "border-neon-pink/30",
    },
    purple: {
        top: "#e6b3ff",
        front: "#cc44ff",
        side: "#8800cc",
        glow: "#cc44ff",
        textClass: "text-neon-purple",
        borderClass: "border-neon-purple/40",
        badgeBg: "bg-neon-purple/10",
        tagBorder: "border-neon-purple/30",
    },
    lavender: {
        top: "#ecd9ff",
        front: "#c77dff",
        side: "#9933ff",
        glow: "#c77dff",
        textClass: "text-neon-lavender",
        borderClass: "border-neon-lavender/40",
        badgeBg: "bg-neon-lavender/10",
        tagBorder: "border-neon-lavender/30",
    },
    magenta: {
        top: "#ff99eb",
        front: "#ff00cc",
        side: "#b3008f",
        glow: "#ff00cc",
        textClass: "text-neon-magenta",
        borderClass: "border-neon-magenta/40",
        badgeBg: "bg-neon-magenta/10",
        tagBorder: "border-neon-magenta/30",
    },
};

// ─── Scene and book layout constants ────────────────────────────────────────
const SCENE_W = 350;      // width of the floor plan
const ROW_STRIDE = 85;   // Y distance between shelf tops (scene space)
const SCENE_TOP_PAD = 16;

const BOOK_W = 50;        // book footprint width
const BOOK_H = 50;        // book footprint depth  
const BOOK_Z = 60;        // book height (Z, vertical in scene)
const BOOK_GAP = 8;       // gap between books

const PLANK_THICK = 8;    // shelf plank Z thickness
const PLANK_FACE = 10;     // front face of plank (visible depth)
const PLANK_HEIGHT = 10;
const PLANK_LENGTH_OFFSET = 40;
const PLANK_WIDTH = SCENE_W - PLANK_LENGTH_OFFSET;

// ─── Single 3-D book ─────────────────────────────────────────────────────────
function IsoBook({
    bookmark,
    posX,
    onClick,
    isSelected,
}: {
    bookmark: Bookmark;
    posX: number;
    onClick: () => void;
    isSelected: boolean;
}) {
    const accent = (bookmark.accent as NeonAccent) ?? "lavender";
    const c = accentColors[accent];

    return (
        <div
            className="absolute"
            style={{
                left: posX,
                bottom: PLANK_THICK,
                width: BOOK_W,
                height: BOOK_H,
                transformStyle: "preserve-3d",
            }}
        >
            <button
                onClick={onClick}
                title={bookmark.title}
                className="group relative w-full h-full focus:outline-none cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
                data-selected={isSelected}
            >
                <div
                    className={`absolute inset-0 transition-transform duration-300 ease-out ${isSelected ? "-translate-y-2" : "group-hover:-translate-y-2"}`}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Top face */}
                    <div
                        className="absolute inset-0 border border-white/30"
                        style={{
                            background: `linear-gradient(135deg, ${c.top}cc 0%, ${c.top}88 60%, ${c.top}44 100%)`,
                            transform: `translateZ(${BOOK_Z}px)`,
                            boxShadow: `0 0 10px ${c.glow}50`,
                        }}
                    >
                        {/* Glass specular on top */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 40%, transparent 65%)",
                                mixBlendMode: "screen",
                            }}
                        />
                        {/* Lit top face overlay */}
                        <div
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-none ${isSelected ? "opacity-100 delay-0" : "opacity-0 group-hover:opacity-100 delay-0"
                                }`}
                            style={{
                                background: `linear-gradient(135deg, ${c.glow}bb 0%, ${c.glow}66 100%)`,
                                mixBlendMode: "screen",
                            }}
                        />
                    </div>
                    {/* Front face */}
                    <div
                        className="absolute bottom-0 left-0 w-full border border-white/20 flex items-center justify-center overflow-hidden origin-bottom"
                        style={{
                            height: `${BOOK_Z}px`,
                            background: `linear-gradient(to bottom, ${c.front}ee 0%, ${c.front}99 100%)`,
                            transform: "rotateX(-90deg)",
                        }}
                    >
                        {/* Lit front face overlay */}
                        <div
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-none z-0 ${isSelected ? "opacity-100 delay-500" : "opacity-0 group-hover:opacity-100 delay-0"
                                }`}
                            style={{
                                background: `linear-gradient(to top, ${c.glow}ff 0%, ${c.glow}88 50%, transparent 100%)`,
                                mixBlendMode: "screen",
                            }}
                        />
                        {/* Gloss stripe on front */}
                        <div
                            className="absolute top-0 left-0 w-full pointer-events-none z-0"
                            style={{
                                height: "40%",
                                background: "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)",
                            }}
                        />
                        <span className="text-[0.50rem] font-bold text-white/90 uppercase tracking-widest truncate w-full text-center select-none px-0.5 relative z-10" style={{ textShadow: `0 0 8px ${c.glow}` }}>
                            {bookmark.title}
                        </span>
                    </div>
                    {/* Right face */}
                    <div
                        className="absolute top-0 right-0 h-full border border-white/10 origin-right overflow-hidden"
                        style={{
                            width: `${BOOK_Z}px`,
                            background: `linear-gradient(to right, ${c.side}cc, ${c.side}ff)`,
                            transform: "rotateY(90deg)",
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 w-1/2 h-full pointer-events-none"
                            style={{ background: "linear-gradient(to right, rgba(255,255,255,0.2), transparent)" }}
                        />
                        <div
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-none ${isSelected ? "opacity-100 delay-150" : "opacity-0 group-hover:opacity-100 delay-0"
                                }`}
                            style={{
                                background: `linear-gradient(to left, ${c.glow}ff 0%, ${c.glow}88 50%, transparent 100%)`,
                                mixBlendMode: "screen",
                            }}
                        />
                    </div>
                    {/* Left face */}
                    <div
                        className="absolute top-0 left-0 h-full border border-white/10 origin-left overflow-hidden"
                        style={{
                            width: `${BOOK_Z}px`,
                            background: `linear-gradient(to left, ${c.side}99, ${c.side}cc)`,
                            transform: "rotateY(-90deg)",
                        }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: "rgba(0,0,0,0.15)" }}
                        />
                        <div
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-none ${isSelected ? "opacity-100 delay-150" : "opacity-0 group-hover:opacity-100 delay-0"
                                }`}
                            style={{
                                background: `linear-gradient(to right, ${c.glow}ff 0%, ${c.glow}88 50%, transparent 100%)`,
                                mixBlendMode: "screen",
                            }}
                        />
                    </div>
                    {/* Inner Neon Core */}
                    <div
                        className={`absolute transition-opacity duration-500 ease-in-out pointer-events-none border border-white/50 ${isSelected ? "opacity-100 delay-200" : "opacity-0 group-hover:opacity-100 delay-0"
                            }`}
                        style={{
                            left: "5%",
                            top: "5%",
                            width: "90%",
                            height: "90%",
                            transform: `translateZ(2px)`,
                            boxShadow: `0 0 60px 20px ${c.glow}, inset 0 0 30px 10px ${c.glow}ff`,
                            background: `${c.glow}ee`,
                            borderRadius: "4px",
                        }}
                    />
                    {/* Outer ambient glow */}
                    <div
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none ${isSelected ? "opacity-100 delay-200" : "opacity-0 group-hover:opacity-100 delay-0"
                            }`}
                        style={{
                            transform: `translateZ(0px)`,
                            boxShadow: `0 0 100px 40px ${c.glow}cc`,
                        }}
                    />
                </div>
            </button>
        </div>
    );
}

// ─── One shelf (plank + books) ───────────────────────────────────────────────
function IsoShelfRow({
    items,
    rowY,
    onBookClick,
    selectedBookmark,
}: {
    items: Bookmark[];
    rowY: number;
    onBookClick: (b: Bookmark) => void;
    selectedBookmark: Bookmark | null;
}) {
    return (
        <div
            className="absolute"
            style={{
                top: rowY,
                left: 0,
                width: SCENE_W,
                // height encompasses books + plank
                height: BOOK_H + PLANK_THICK + PLANK_FACE + 4,
                transformStyle: "preserve-3d",
            }}
        >
            {/* Shelf plank — top surface */}
            <div
                className="absolute left-0 bottom-0"
                style={{
                    width: PLANK_WIDTH,
                    height: BOOK_H + PLANK_HEIGHT,
                    background:
                        "linear-gradient(135deg,rgba(130,60,220,0.18) 0%,rgba(70,20,140,0.10) 100%)",
                    border: "1px solid rgba(123,53,204,0.28)",
                    boxShadow: "inset 0 0 20px rgba(100,30,200,0.14)",
                    borderRadius: "4px",
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Plank front face */}
                <div
                    className="absolute bottom-0 left-0 origin-bottom"
                    style={{
                        width: "100%",
                        height: `${PLANK_FACE}px`,
                        background:
                            "linear-gradient(to bottom,rgba(100,40,200,0.55),rgba(50,15,100,0.72))",
                        borderLeft: "1px solid rgba(123,53,204,0.3)",
                        borderRight: "1px solid rgba(123,53,204,0.3)",
                        borderBottom: "1px solid rgba(123,53,204,0.3)",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.6)",
                        transform: "rotateX(-90deg)",
                    }}
                />
            </div>

            {/* Books */}
            {items.map((bookmark, i) => (
                <IsoBook
                    key={bookmark.title}
                    bookmark={bookmark}
                    posX={6 + i * (BOOK_W + BOOK_GAP)}
                    onClick={() => onBookClick(bookmark)}
                    isSelected={selectedBookmark?.title === bookmark.title}
                />
            ))}
        </div>
    );
}

// ─── Inline Information Card ──────────────────────────────────────────────────
function BookInfoCard({
    bookmark,
    onClose,
}: {
    bookmark: Bookmark;
    onClose: () => void;
}) {
    const accent = (bookmark.accent as NeonAccent) ?? "lavender";
    const c = accentColors[accent];

    // Apply glitch effect to title and description
    const glitchedTitle = useGlitchText(bookmark.title, 150);
    const glitchedDesc = useGlitchText(bookmark.description, 80);

    return (
        <div
            className={`relative w-full neon-card rounded-sm border ${c.borderClass} bg-bg-card p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300`}
            style={{ boxShadow: `0 0 32px ${c.glow}22, 0 16px 32px rgba(0,0,0,0.4)` }}
        >
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-text-muted hover:text-white transition-colors"
                aria-label="Close"
            >
                <X size={15} />
            </button>

            <div className="flex flex-col gap-1.5 pr-6">
                <span
                    className={`text-[0.58rem] font-mono tracking-widest uppercase ${c.textClass} ${c.badgeBg} border ${c.tagBorder} px-2 py-0.5 rounded-sm w-fit`}
                >
                    {bookmark.type}
                </span>
                <h3 className={`text-xl font-bold leading-tight ${c.textClass} font-mono mix-blend-plus-lighter`}>
                    {glitchedTitle}
                </h3>
            </div>

            <p className="text-text-secondary text-[0.78rem] leading-relaxed font-mono min-h-[4rem]">
                {glitchedDesc}
            </p>

            {bookmark.stats && bookmark.stats.length > 0 && (
                <div className={`flex gap-4 p-3 rounded-sm border ${c.tagBorder} bg-bg-primary/50`}>
                    {bookmark.stats.map((stat, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-[0.58rem] uppercase tracking-wider text-text-muted">
                                {stat.label}
                            </span>
                            <span className={`text-[0.82rem] font-bold ${c.textClass}`}>
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {bookmark.tags.map((tag) => (
                        <span
                            key={tag}
                            className={`text-[0.58rem] px-2 py-0.5 rounded-sm border ${c.tagBorder} ${c.textClass} bg-bg-primary/80`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <a
                href={bookmark.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-widest font-bold transition-all px-4 py-2.5 rounded-sm border ${c.borderClass} ${c.textClass} ${c.badgeBg} hover:brightness-125 w-full justify-center`}
                style={{ boxShadow: `0 0 12px ${c.glow}44` }}
            >
                <ExternalLink size={12} />
                Visit {bookmark.title}
            </a>
        </div>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function BookmarkBookshelf({ bookmarks }: BookmarkBookshelfProps) {
    const [selected, setSelected] = useState<Bookmark | null>(() => {
        return bookmarks.find(b => b.title === "Rosé Pine") || null;
    });

    const scrollToFixedPosition = () => {
        const el = document.getElementById("bookmark-bookshelf-container");
        if (el) {
            // we scroll to exactly where the container starts, plus some offset
            const rect = el.getBoundingClientRect();
            // Negative offset stops slightly above the container
            const offset = -200;
            const targetY = window.scrollY + rect.top + offset;

            window.scrollTo({
                top: targetY,
                behavior: "smooth"
            });
        }
    };

    const handleBookClick = (b: Bookmark) => {
        setSelected(b);
        // Wait for rendering and text glitch animation initialization (which changes layout)
        setTimeout(() => {
            scrollToFixedPosition();
        }, 150);
    };

    useEffect(() => {
        // Scroll once on initial load (since the first book is usually pre-selected)
        if (selected) {
            setTimeout(() => {
                scrollToFixedPosition();
            }, 300); // slightly longer wait on initial render
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (bookmarks.length === 0) return null;

    // Define your desired rendering order here
    const CATEGORY_ORDER = ["Workflow", "Terminal", "Customization", "Browsers", "Editors"];
    const categories = [...new Set(bookmarks.map((b) => b.category))].sort((a, b) => {
        const indexA = CATEGORY_ORDER.indexOf(a ?? "");
        const indexB = CATEGORY_ORDER.indexOf(b ?? "");

        // If both are in the array, sort by array order
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only A is in array, it comes first
        if (indexA !== -1) return -1;
        // If only B is in array, it comes first
        if (indexB !== -1) return 1;
        // If neither are in array, sort alphabetically as a fallback
        return (a ?? "").localeCompare(b ?? "");
    });
    const numRows = categories.length;
    const SCENE_H = SCENE_TOP_PAD + numRows * ROW_STRIDE + 48;

    // ── Visual bounding box after rotateX(60deg) rotateZ(-45deg) ──────────────
    // With transform-origin: top left, the scene's top-left corner stays at (0,0).
    // The four scene corners map to screen coordinates (using COS45=0.7071):
    //
    //   TL (0,0)       → screen (0, 0)
    //   TR (W,0)       → screen ( W·c45,  -W·c45·cos60)  = (W·0.707, -W·0.354)
    //   BL (0,H)       → screen ( H·c45,   H·c45·cos60)  = (H·0.707,  H·0.354)
    //   BR (W,H)       → screen ((W+H)·c45, (H-W)·c45·cos60)
    //
    // So:
    //   screen x range = [0, (W+H)·0.707]       → vis_w = (W+H)·0.707
    //   screen y range = [-W·0.354, H·0.354]    → total = (W+H)·0.354
    //   The scene top-left is at screen y = 0, but TR corner is at -W·0.354 (above!)
    //   So we need to translate the whole scene DOWN by W·0.354 to avoid clipping top.
    //
    // Additionally books extrude Z, adding +BOOK_Z more to the bottom.

    const SCALE = 1.35; // Size multiplier
    const C45 = Math.SQRT1_2; // cos(45°) = sin(45°) = 0.7071
    const COS60 = 0.5; // cos(60°)

    // The scene is rotated Z -45deg, then X 60deg.
    // Length along the screen Y axis for a line on the floor plane is scaled by COS60.
    const visW = (SCENE_W + SCENE_H) * C45 * SCALE;
    const topClip = (SCENE_W * C45 * COS60) * SCALE;

    // Total vertical span is the projected diagonal (SCENE_W + SCENE_H)*C45*COS60,
    // plus the unscaled vertical height of the books/planks (BOOK_Z + PLANK_THICK).
    const visH = ((SCENE_W + SCENE_H) * C45 * COS60 + BOOK_Z + PLANK_THICK - 170) * SCALE;

    // ── Centering: position the scene so its visual midpoint = container center ──
    const halfVisW = Math.round(visW / 2);

    return (
        <div id="bookmark-bookshelf-container" className="flex flex-col items-center w-full">
            {/* 
                Outer container: exactly visW × visH, overflow hidden.
                The scene is absolutely positioned inside it.
            */}
            <div
                className="relative w-full overflow-visible"
                style={{
                    maxWidth: "100%",
                    height: `${visH + topClip}px`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: topClip,
                        // Center the visual output on the container midpoint
                        left: `calc(50% - ${halfVisW - 34 * SCALE}px)`, // change int value for allignment of shelf left-right
                        width: `${SCENE_W}px`,
                        height: `${SCENE_H}px`,
                        transformStyle: "preserve-3d",
                        transformOrigin: "top left",
                        transform: `scale(${SCALE}) rotateX(60deg) rotateZ(-45deg)`,
                    }}
                >
                    {categories.map((category, idx) => {
                        const items = bookmarks.filter((b) => b.category === category);
                        return (
                            <IsoShelfRow
                                key={category}
                                items={items}
                                rowY={SCENE_TOP_PAD + idx * ROW_STRIDE}
                                onBookClick={handleBookClick}
                                selectedBookmark={selected}
                            />
                        );
                    })}
                </div>
            </div>

            {selected && (
                <div id="bookmark-info-card" className="w-full max-w-2xl px-4 pb-12 mt-[-2rem] relative z-20">
                    <BookInfoCard bookmark={selected} onClose={() => setSelected(null)} />
                </div>
            )}
        </div>
    );
}
