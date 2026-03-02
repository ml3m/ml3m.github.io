"use client";

import { useState } from "react";
import { Bookmark } from "@/lib/bookmarks";
import { ExternalLink, X } from "lucide-react";

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
const SCENE_W = 340;      // width of the floor plan
const ROW_STRIDE = 110;   // Y distance between shelf tops (scene space)
const SCENE_TOP_PAD = 16;

const BOOK_W = 50;        // book footprint width
const BOOK_H = 64;        // book footprint depth  
const BOOK_Z = 20;        // book height (Z, vertical in scene)
const BOOK_GAP = 6;       // gap between books

const PLANK_THICK = 8;    // shelf plank Z thickness
const PLANK_FACE = 6;     // front face of plank (visible depth)

// ─── Single 3-D book ─────────────────────────────────────────────────────────
function IsoBook({
    bookmark,
    posX,
    onClick,
}: {
    bookmark: Bookmark;
    posX: number;
    onClick: () => void;
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
            >
                <div
                    className="absolute inset-0 transition-transform duration-300 ease-out group-hover:-translate-y-2"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Top face */}
                    <div
                        className="absolute inset-0 border border-black/20"
                        style={{
                            background: c.top,
                            transform: `translateZ(${BOOK_Z}px)`,
                            boxShadow: `0 0 18px ${c.glow}88`,
                        }}
                    />
                    {/* Front face */}
                    <div
                        className="absolute bottom-0 left-0 w-full border border-black/20 flex items-center justify-center overflow-hidden origin-bottom"
                        style={{
                            height: `${BOOK_Z}px`,
                            background: c.front,
                            transform: "rotateX(-90deg)",
                        }}
                    >
                        <span className="text-[0.28rem] font-bold text-black/70 uppercase tracking-widest truncate w-full text-center select-none px-0.5">
                            {bookmark.title}
                        </span>
                    </div>
                    {/* Right face */}
                    <div
                        className="absolute top-0 right-0 h-full border border-black/20 origin-right"
                        style={{
                            width: `${BOOK_Z}px`,
                            background: c.side,
                            transform: "rotateY(90deg)",
                        }}
                    />
                    {/* Glow on hover */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                            transform: `translateZ(${BOOK_Z}px)`,
                            boxShadow: `0 0 28px ${c.glow}bb`,
                        }}
                    />
                </div>
            </button>
        </div>
    );
}

// ─── One shelf (plank + books + category label) ───────────────────────────────
function IsoShelfRow({
    category,
    items,
    rowY,
    onBookClick,
}: {
    category: string;
    items: Bookmark[];
    rowY: number;
    onBookClick: (b: Bookmark) => void;
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
                    width: SCENE_W,
                    height: BOOK_H + 4,
                    background:
                        "linear-gradient(135deg,rgba(130,60,220,0.18) 0%,rgba(70,20,140,0.10) 100%)",
                    border: "1px solid rgba(123,53,204,0.28)",
                    boxShadow: "inset 0 0 20px rgba(100,30,200,0.14)",
                    borderRadius: "1px",
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

            {/* Category label — counter-rotated back to face the viewer */}
            <div
                className="absolute"
                style={{
                    left: 4,
                    bottom: PLANK_THICK + 2,
                    transformStyle: "preserve-3d",
                    // Undo the isometric projection to make the label readable
                    transform:
                        "rotateZ(45deg) rotateX(-60deg) translateX(-85%) translateY(4px)",
                    transformOrigin: "right bottom",
                }}
            >
                <span className="block text-neon-lavender text-[0.58rem] font-bold uppercase tracking-widest whitespace-nowrap opacity-75 select-none bg-bg-card/80 px-2 py-0.5 border border-border-glow/25 rounded-sm">
                    {category}
                </span>
            </div>

            {/* Books */}
            {items.map((bookmark, i) => (
                <IsoBook
                    key={bookmark.title}
                    bookmark={bookmark}
                    posX={6 + i * (BOOK_W + BOOK_GAP)}
                    onClick={() => onBookClick(bookmark)}
                />
            ))}
        </div>
    );
}

// ─── Popup modal ─────────────────────────────────────────────────────────────
function BookPopup({
    bookmark,
    onClose,
}: {
    bookmark: Bookmark;
    onClose: () => void;
}) {
    const accent = (bookmark.accent as NeonAccent) ?? "lavender";
    const c = accentColors[accent];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <div
                className={`relative z-10 w-full max-w-sm neon-card rounded-sm border ${c.borderClass} bg-bg-card p-6 flex flex-col gap-4`}
                style={{ boxShadow: `0 0 48px ${c.glow}55, 0 24px 48px rgba(0,0,0,0.6)` }}
                onClick={(e) => e.stopPropagation()}
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
                    <h3 className={`text-xl font-bold leading-tight ${c.textClass}`}>
                        {bookmark.title}
                    </h3>
                </div>

                <p className="text-text-secondary text-[0.78rem] leading-relaxed">
                    {bookmark.description}
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
        </div>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function BookmarkBookshelf({ bookmarks }: BookmarkBookshelfProps) {
    const [selected, setSelected] = useState<Bookmark | null>(null);

    if (bookmarks.length === 0) return null;

    const categories = [...new Set(bookmarks.map((b) => b.category))];
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

    const C45 = Math.SQRT1_2; // cos(45°) = sin(45°) = 0.7071

    const visW = (SCENE_W + SCENE_H) * C45;
    const topClip = SCENE_W * C45 * 0.5;     // how much TR corner goes above 0
    const visH = (SCENE_W + SCENE_H) * C45 * 0.5 + BOOK_Z + PLANK_THICK + 32;

    // ── Centering: position the scene so its visual midpoint = container center ──
    // The visual horizontal span after the iso transform is visW = (W+H)*C45.
    // We want: scene_left + visW/2 = 50% of container.
    // → scene_left = calc(50% - visW/2)
    // But add labelOverhang so counter-rotated labels on the left aren't clipped.
    const halfVisW = Math.round(visW / 2);

    return (
        <>
            {/* 
        Outer container: exactly visW × visH, overflow hidden.
        The scene is absolutely positioned inside it.
      */}
            <div
                className="relative w-full"
                style={{
                    maxWidth: "100%",
                    height: `${visH + topClip}px`,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: topClip,
                        // Center the visual output on the container midpoint
                        left: `calc(50% - ${halfVisW + 50}px)`,
                        width: `${SCENE_W}px`,
                        height: `${SCENE_H}px`,
                        transformStyle: "preserve-3d",
                        transformOrigin: "top left",
                        transform: "rotateX(60deg) rotateZ(-45deg)",
                    }}
                >
                    {categories.map((category, idx) => {
                        const items = bookmarks.filter((b) => b.category === category);
                        return (
                            <IsoShelfRow
                                key={category}
                                category={category}
                                items={items}
                                rowY={SCENE_TOP_PAD + idx * ROW_STRIDE}
                                onBookClick={setSelected}
                            />
                        );
                    })}
                </div>
            </div>

            {selected && (
                <BookPopup bookmark={selected} onClose={() => setSelected(null)} />
            )}
        </>
    );
}
