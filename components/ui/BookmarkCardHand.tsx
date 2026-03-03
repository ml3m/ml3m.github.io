"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Bookmark } from "@/lib/bookmarks";
import { ExternalLink } from "lucide-react";

// ── Palette ──────────────────────────────────────────────────────────────────
type NeonAccent = "pink" | "purple" | "lavender" | "magenta";
const A: Record<NeonAccent, { c: string; t: string; s: string }> = {
    pink: { c: "#ff4da6", t: "#ffb3d9", s: "rgba(255,77,166,.75)" },
    purple: { c: "#cc44ff", t: "#e6b3ff", s: "rgba(204,68,255,.75)" },
    lavender: { c: "#c77dff", t: "#ecd9ff", s: "rgba(199,125,255,.75)" },
    magenta: { c: "#ff00cc", t: "#ff99eb", s: "rgba(255,0,204,.75)" },
};
const SUITS = ["♠", "♥", "♦", "♣"] as const;

// ── Layout ───────────────────────────────────────────────────────────────────
const CW = 142, CH = 200, OV = 50; // card w/h, overlap
const STEP = CW - OV;

function fanAngle(pos: number, total: number, spread: number) {
    const t = total === 1 ? 0 : pos / (total - 1) - 0.5;
    return t * spread;
}
function arcY(pos: number, total: number, dip: number) {
    const t = total === 1 ? 0 : pos / (total - 1) - 0.5;
    return dip * t * t * 4;
}

// ── Score ────────────────────────────────────────────────────────────────────
function score(b: Bookmark) {
    if (b.stats?.[0]) {
        const v = b.stats[0].value; const n = parseFloat(v);
        return v.toLowerCase().includes("k") ? Math.floor(n * 1000) : Math.floor(n);
    }
    let h = 0; for (const ch of b.title) h = ((h * 31) + ch.charCodeAt(0)) & 0x7fffffff;
    return (h % 800) + 200;
}

// ── Card face ────────────────────────────────────────────────────────────────
function CardFace({ b, idx, hov, sel }: { b: Bookmark; idx: number; hov: boolean; sel: boolean }) {
    const { c, t: tc } = A[(b.accent as NeonAccent) ?? "lavender"];
    const suit = SUITS[idx % 4];
    const rank = b.title.slice(0, 2).toUpperCase();
    return (
        <div style={{
            width: "100%", height: "100%", borderRadius: 12, position: "relative", overflow: "hidden",
            background: "linear-gradient(155deg,#1e1535 0%,#0d0717 50%,#16102a 100%)",
            border: `1.5px solid ${c}${sel ? "cc" : hov ? "66" : "33"}`,
            boxShadow: sel
                ? `0 0 0 2px ${c}22,0 6px 28px ${A[(b.accent as NeonAccent) ?? "lavender"].s},0 0 50px ${c}22,inset 0 0 22px ${c}0e`
                : hov
                    ? `0 2px 12px ${A[(b.accent as NeonAccent) ?? "lavender"].s}44,inset 0 0 10px ${c}06`
                    : `0 4px 16px rgba(0,0,0,.65),inset 0 0 6px ${c}04`,
            transition: "border-color .18s,box-shadow .18s",
            userSelect: "none",
        }}>
            {/* grid */}
            <div style={{ position: "absolute", inset: 0, opacity: .05, backgroundImage: `repeating-linear-gradient(0deg,${c} 0,transparent 1px,transparent 20px,${c} 21px),repeating-linear-gradient(90deg,${c} 0,transparent 1px,transparent 20px,${c} 21px)` }} />
            {/* shimmer */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: `radial-gradient(ellipse at 30% 20%,${c}18 0%,transparent 60%)`, opacity: hov || sel ? 1 : .3, transition: "opacity .2s", pointerEvents: "none" }} />
            {/* sel inner frame */}
            {sel && <div style={{ position: "absolute", inset: 5, borderRadius: 9, border: `1px solid ${c}44`, boxShadow: `inset 0 0 16px ${c}14`, pointerEvents: "none" }} />}
            {/* ✓ pip */}
            {sel && <div style={{ position: "absolute", top: 6, right: 8, fontSize: 10, color: c, textShadow: `0 0 8px ${c}`, fontFamily: "monospace", fontWeight: 900 }}>✓</div>}
            {/* top-left corner */}
            <div style={{ position: "absolute", top: 8, left: 9, lineHeight: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 900, color: tc, textShadow: `0 0 7px ${c}` }}>{rank}</span>
                <span style={{ fontSize: 11, color: c, textShadow: `0 0 6px ${c}`, lineHeight: 1 }}>{suit}</span>
            </div>
            {/* bottom-right corner */}
            <div style={{ position: "absolute", bottom: 8, right: 9, transform: "rotate(180deg)", lineHeight: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 900, color: tc, textShadow: `0 0 7px ${c}` }}>{rank}</span>
                <span style={{ fontSize: 11, color: c, textShadow: `0 0 6px ${c}`, lineHeight: 1 }}>{suit}</span>
            </div>
            {/* center */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "30px 12px" }}>
                <div style={{ fontSize: 44, lineHeight: 1, color: c, textShadow: hov || sel ? `0 0 14px ${c},0 0 35px ${c},0 0 60px ${c}` : `0 0 9px ${c}66`, transition: "text-shadow .2s", filter: hov || sel ? `drop-shadow(0 0 9px ${c})` : "none" }}>{suit}</div>
                <div style={{ width: "68%", height: 1, background: `linear-gradient(to right,transparent,${c}88,transparent)`, boxShadow: `0 0 6px ${c}55` }} />
                <span style={{ fontFamily: "monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: tc, textShadow: hov || sel ? `0 0 10px ${c}` : `0 0 3px ${c}33`, textAlign: "center", lineHeight: 1.35, maxWidth: "100%", wordBreak: "break-word", transition: "text-shadow .2s" }}>{b.title}</span>
                <span style={{ fontSize: 7, fontFamily: "monospace", letterSpacing: ".1em", textTransform: "uppercase", color: c, background: `${c}14`, border: `1px solid ${c}33`, borderRadius: 3, padding: "1.5px 5px", textShadow: `0 0 5px ${c}` }}>{b.type}</span>
                {b.stats?.[0] && <span style={{ fontSize: 7.5, fontFamily: "monospace", color: tc, opacity: .55 }}>★ {b.stats[0].value}</span>}
            </div>
            {/* hover edge glows */}
            {hov && <>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, borderRadius: "12px 12px 0 0", background: `linear-gradient(to right,transparent,${c},transparent)`, boxShadow: `0 0 12px ${c}` }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2.5, borderRadius: "0 0 12px 12px", background: `linear-gradient(to right,transparent,${c},transparent)`, boxShadow: `0 0 12px ${c}` }} />
            </>}
        </div>
    );
}

// ── Drag overlay card (fixed on screen) ──────────────────────────────────────
function DragOverlayCard({ b, idx, overlayRef }: { b: Bookmark; idx: number; overlayRef: React.RefObject<HTMLDivElement> }) {
    return (
        <div ref={overlayRef} style={{ position: "fixed", width: CW, height: CH, pointerEvents: "none", zIndex: 9999, transformOrigin: "center center", willChange: "transform,left,top" }}>
            <CardFace b={b} idx={idx} hov sel />
        </div>
    );
}

// ── Ship It Scoring Overlay ──────────────────────────────────────────────────
function ScoringOverlay({ active, scores, onDone }: { active: boolean; scores: Array<{ b: Bookmark; idx: number; val: number }>; onDone: () => void }) {
    const [phase, setPhase] = useState<"idle" | "charge" | "fly" | "flash" | "done">("idle");

    useEffect(() => {
        if (!active) { setPhase("idle"); return; }
        setPhase("charge");
        const t1 = setTimeout(() => setPhase("fly"), 350);
        const t2 = setTimeout(() => setPhase("flash"), 350 + scores.length * 140 + 400);
        const t3 = setTimeout(() => { setPhase("done"); onDone(); }, 350 + scores.length * 140 + 1100);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

    if (phase === "idle" || !active) return null;

    return (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 8000 }}>
            {/* Score number pops */}
            {scores.map(({ b, val }, i) => {
                const { c } = A[(b.accent as NeonAccent) ?? "lavender"];
                return (
                    <div key={b.title} style={{
                        position: "fixed",
                        bottom: `calc(50% - ${CH / 2}px)`,
                        left: `calc(50% + ${(i - (scores.length - 1) / 2) * (STEP + 4)}px - ${CW / 2}px)`,
                        width: CW, textAlign: "center",
                        fontFamily: "monospace", fontSize: 22, fontWeight: 900,
                        color: c, textShadow: `0 0 20px ${c},0 0 40px ${c}`,
                        opacity: 0,
                        animation: phase === "fly" || phase === "flash" || phase === "done"
                            ? `score-pop-anim 1.3s ease-out ${i * 140}ms both`
                            : "none",
                        zIndex: 8100,
                    }}>+{val.toLocaleString()}</div>
                );
            })}
            {/* SHIPPED! flash */}
            {(phase === "flash" || phase === "done") && (
                <div style={{
                    position: "fixed", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    fontFamily: "monospace", fontSize: 56, fontWeight: 900, letterSpacing: "0.2em",
                    color: "#ff4da6", textShadow: "0 0 30px #ff4da6,0 0 70px #ff4da6,0 0 120px #cc44ff",
                    animation: "shipped-flash 1.0s ease-out both",
                    textTransform: "uppercase", whiteSpace: "nowrap",
                    zIndex: 8200,
                }}>SHIPPED!</div>
            )}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BookmarkCardHand({ bookmarks: init }: { bookmarks: Bookmark[] }) {
    const [cards, setCards] = useState<Bookmark[]>(init);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [hovered, setHovered] = useState<number | null>(null);

    // Drag state
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [insertionIdx, setInsertionIdx] = useState<number | null>(null);

    // Scoring
    const [scoring, setScoring] = useState(false);
    const [scoreItems, setScoreItems] = useState<Array<{ b: Bookmark; idx: number; val: number }>>([]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Refs for perf-critical drag
    const overlayRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef({ x: 0, y: 0, moved: false, cardIdx: -1 });
    const lastXRef = useRef<number[]>([]);
    const insertRef = useRef<number | null>(null);
    const FAN_SPREAD = Math.min(40, Math.max(18, cards.length * 4.2));
    const ARC_DIP = 16;

    // ── Display list with optional gap ─────────────────────────────────────
    const display = useMemo(() => {
        if (dragIdx === null || insertionIdx === null) {
            return cards.map((b, i) => ({ b, orig: i, gap: false }));
        }
        const without = cards.map((b, i) => ({ b, orig: i, gap: false })).filter((_, i) => i !== dragIdx);
        const at = Math.max(0, Math.min(insertionIdx, without.length));
        without.splice(at, 0, { b: cards[dragIdx], orig: dragIdx, gap: true });
        return without;
    }, [cards, dragIdx, insertionIdx]);

    // ── Document-level drag listeners ───────────────────────────────────────
    useEffect(() => {
        if (dragIdx === null) return;

        const onMove = (e: PointerEvent) => {
            // Update overlay position directly — no React re-render
            if (overlayRef.current) {
                const vel = lastXRef.current.length > 1
                    ? (lastXRef.current[lastXRef.current.length - 1] - e.clientX) * -0.5
                    : 0;
                lastXRef.current.push(e.clientX);
                if (lastXRef.current.length > 4) lastXRef.current.shift();
                const tilt = Math.max(-22, Math.min(22, vel));
                overlayRef.current.style.left = `${e.clientX - CW / 2}px`;
                overlayRef.current.style.top = `${e.clientY - CH / 2}px`;
                overlayRef.current.style.transform = `rotate(${tilt}deg)`;
            }
            // Compute insertion slot
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const total = cards.length;
                const handW = (total - 1) * STEP + CW;
                const startX = (rect.width - handW) / 2;
                const relX = e.clientX - rect.left - startX - CW / 2;
                let idx = Math.round(relX / STEP);
                idx = Math.max(0, Math.min(idx, total - 1));
                if (idx !== insertRef.current) {
                    insertRef.current = idx;
                    setInsertionIdx(idx);
                }
            }
        };

        const onUp = () => {
            const ins = insertRef.current ?? dragIdx;
            setCards(prev => {
                const arr = [...prev];
                const [item] = arr.splice(dragIdx, 1);
                arr.splice(Math.max(0, Math.min(ins, arr.length)), 0, item);
                return arr;
            });
            setSelected(prev => {
                const arr = Array.from(prev);
                const updated = arr.map(i => {
                    if (i === dragIdx) return ins;
                    if (ins < dragIdx) return i >= ins && i < dragIdx ? i + 1 : i;
                    return i > dragIdx && i <= ins ? i - 1 : i;
                });
                return new Set(updated);
            });
            setDragIdx(null); setInsertionIdx(null);
            insertRef.current = null; lastXRef.current = [];
        };

        document.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerup", onUp);
        return () => {
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
        };
    }, [dragIdx, cards]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Pointer down on card ────────────────────────────────────────────────
    const onCardDown = useCallback((e: React.PointerEvent, orig: number) => {
        e.preventDefault();
        dragStartRef.current = { x: e.clientX, y: e.clientY, moved: false, cardIdx: orig };
        lastXRef.current = [e.clientX];

        const THRESH = 6;
        const onMove = (me: PointerEvent) => {
            if (!dragStartRef.current.moved && Math.hypot(me.clientX - dragStartRef.current.x, me.clientY - dragStartRef.current.y) > THRESH) {
                dragStartRef.current.moved = true;
                setDragIdx(orig);
                setInsertionIdx(orig);
                insertRef.current = orig;
                if (overlayRef.current) {
                    overlayRef.current.style.left = `${me.clientX - CW / 2}px`;
                    overlayRef.current.style.top = `${me.clientY - CH / 2}px`;
                }
                document.removeEventListener("pointermove", onMove);
                document.removeEventListener("pointerup", onUp);
            }
        };
        const onUp = () => {
            if (!dragStartRef.current.moved) {
                // Click → toggle select
                setSelected(prev => {
                    const n = new Set(prev);
                    if (n.has(orig)) n.delete(orig); else n.add(orig);
                    return n;
                });
            }
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
        };
        document.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerup", onUp);
    }, []);

    // ── Ship It ─────────────────────────────────────────────────────────────
    const handleShipIt = useCallback(() => {
        if (scoring || selected.size === 0) return;
        const items = Array.from(selected).map(i => ({ b: cards[i], idx: i, val: score(cards[i]) }));
        setScoreItems(items);
        setScoring(true);
    }, [scoring, selected, cards]);

    const handleScoringDone = useCallback(() => {
        setScoring(false);
        setSelected(new Set());
        setScoreItems([]);
    }, []);

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col items-center w-full" style={{ userSelect: "none" }}>
            {/* Hand */}
            <div ref={containerRef} style={{ position: "relative", display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "center", paddingBottom: 80, paddingTop: 50, width: "100%", overflow: "visible" }}>
                {display.map((dc, pos) => {
                    const total = display.length;
                    const angle = fanAngle(pos, total, FAN_SPREAD);
                    const ay = arcY(pos, total, ARC_DIP);
                    const isSel = selected.has(dc.orig) && !dc.gap;
                    const isHov = hovered === dc.orig && dragIdx === null && !dc.gap;
                    const zIdx = dc.gap ? 0 : isSel ? 100 + pos : isHov ? 80 + pos : pos + 1;

                    // Outer div: fan position (rotate around bottom-center)
                    const liftY = isHov ? (isSel ? -18 : -10) : isSel ? -7 : ay;
                    const rot = isHov ? angle * 0.65 : angle;

                    if (dc.gap) {
                        return (
                            <div key={`__gap`} style={{ width: CW, height: CH, flexShrink: 0, marginLeft: pos === 0 ? 0 : -OV, opacity: 0, transition: "margin-left .18s ease,width .18s ease" }} />
                        );
                    }

                    return (
                        <div key={dc.b.title} style={{ marginLeft: pos === 0 ? 0 : -OV, position: "relative", zIndex: zIdx, flexShrink: 0, transition: "margin-left .18s ease,z-index 0s" }}>
                            {/* Score pop */}
                            {scoring && selected.has(dc.orig) && (
                                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 500, pointerEvents: "none", fontFamily: "monospace", fontSize: 20, fontWeight: 900, color: A[(dc.b.accent as NeonAccent) ?? "lavender"].c, textShadow: `0 0 18px ${A[(dc.b.accent as NeonAccent) ?? "lavender"].c}`, animation: `score-pop-anim 1.3s ease-out ${Array.from(selected).indexOf(dc.orig) * 140}ms both` }}>
                                    +{score(dc.b).toLocaleString()}
                                </div>
                            )}
                            {/* Card outer: fan rotation */}
                            <div
                                onPointerDown={(e) => onCardDown(e, dc.orig)}
                                onMouseEnter={() => setHovered(dc.orig)}
                                onMouseLeave={() => setHovered(null)}
                                style={{
                                    width: CW, height: CH, flexShrink: 0,
                                    transformOrigin: "bottom center",
                                    transform: `rotate(${rot}deg) translateY(${-liftY}px)`,
                                    transition: dragIdx !== null ? "none" : "transform .22s cubic-bezier(.22,1,.36,1)",
                                    cursor: dragIdx !== null ? "grabbing" : "grab",
                                    willChange: "transform",
                                    // scoring fly-away
                                    ...(scoring && isSel ? {
                                        transform: `rotate(${rot}deg) translateY(-380px) scale(.75)`,
                                        opacity: 0,
                                        transition: `transform .65s ease-in ${Array.from(selected).indexOf(dc.orig) * 140}ms, opacity .55s ease-in ${Array.from(selected).indexOf(dc.orig) * 140 + 80}ms`,
                                    } : {}),
                                }}
                            >
                                <CardFace b={dc.b} idx={dc.orig} hov={isHov} sel={isSel} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ship It button */}
            {selected.size > 0 && !scoring && (
                <div style={{ marginTop: -24, marginBottom: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <button
                        onClick={handleShipIt}
                        style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "12px 36px", borderRadius: 6,
                            fontFamily: "monospace", fontSize: 14, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase",
                            color: "#ff4da6", background: "rgba(255,77,166,.08)",
                            border: "1.5px solid #ff4da6",
                            boxShadow: "0 0 20px #ff4da633,0 0 50px #ff4da611",
                            cursor: "pointer",
                            transition: "box-shadow .2s,background .2s",
                            animation: "ship-pulse 2s ease-in-out infinite",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px #ff4da6bb,0 0 70px #ff4da644"; (e.currentTarget as HTMLElement).style.background = "rgba(255,77,166,.16)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px #ff4da633,0 0 50px #ff4da611"; (e.currentTarget as HTMLElement).style.background = "rgba(255,77,166,.08)"; }}
                    >
                        <span style={{ fontSize: 18, filter: "drop-shadow(0 0 6px #ff4da6)" }}>⚡</span>
                        SHIP IT · {selected.size} {selected.size === 1 ? "card" : "cards"}
                        <span style={{ fontSize: 18, filter: "drop-shadow(0 0 6px #ff4da6)" }}>⚡</span>
                    </button>
                    {/* Selected card links */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                        {Array.from(selected).map(i => {
                            const b = cards[i];
                            const { c } = A[(b.accent as NeonAccent) ?? "lavender"];
                            return (
                                <a key={b.title} href={b.href} target="_blank" rel="noopener noreferrer"
                                    style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "monospace", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: c, textDecoration: "none", padding: "3px 8px", border: `1px solid ${c}33`, borderRadius: 4, background: `${c}0a` }}>
                                    <ExternalLink size={9} /> {b.title}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Hint */}
            {selected.size === 0 && dragIdx === null && (
                <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.12)", marginTop: -16, paddingBottom: 24, userSelect: "none" }}>
                    click to select · drag to reorder
                </p>
            )}

            {/* Scoring overlay (SHIPPED!) */}
            {mounted && createPortal(
                <ScoringOverlay active={scoring} scores={scoreItems} onDone={handleScoringDone} />,
                document.body
            )}

            {/* Drag card overlay */}
            {mounted && dragIdx !== null && createPortal(
                <DragOverlayCard b={cards[dragIdx]} idx={dragIdx} overlayRef={overlayRef} />,
                document.body
            )}

            <style>{`
                @keyframes card-idle-1 { from{transform:rotate(0deg) translateY(0)} to{transform:rotate(.5deg) translateY(-2px)} }
                @keyframes card-idle-2 { from{transform:rotate(0deg) translateY(-1px)} to{transform:rotate(-.4deg) translateY(1px)} }
                @keyframes card-idle-3 { 0%{transform:rotate(0deg) translateY(0)} 50%{transform:rotate(.3deg) translateY(-1.5px)} 100%{transform:rotate(0deg) translateY(0)} }
                @keyframes card-idle-4 { from{transform:rotate(0deg) translateY(0)} to{transform:rotate(-.6deg) translateY(-2.5px)} }
                @keyframes card-idle-5 { 0%{transform:rotate(0deg) translateY(-.5px)} 60%{transform:rotate(.4deg) translateY(2px)} 100%{transform:rotate(0deg)} }

                @keyframes score-pop-anim {
                    0%   { opacity:0; transform:translateX(-50%) scale(.4) translateY(0); }
                    20%  { opacity:1; transform:translateX(-50%) scale(1.25) translateY(-25px); }
                    60%  { opacity:1; transform:translateX(-50%) scale(1.0) translateY(-55px); }
                    100% { opacity:0; transform:translateX(-50%) scale(.7) translateY(-110px); }
                }
                @keyframes shipped-flash {
                    0%   { opacity:0; transform:translate(-50%,-50%) scale(.7); }
                    15%  { opacity:1; transform:translate(-50%,-50%) scale(1.1); }
                    40%  { opacity:1; transform:translate(-50%,-50%) scale(1.0); }
                    70%  { opacity:1; transform:translate(-50%,-50%) scale(1.0); }
                    100% { opacity:0; transform:translate(-50%,-50%) scale(1.15); }
                }
                @keyframes ship-pulse {
                    0%,100% { box-shadow:0 0 20px #ff4da633,0 0 50px #ff4da611; }
                    50%     { box-shadow:0 0 28px #ff4da666,0 0 60px #ff4da622; }
                }
            `}</style>
        </div>
    );
}
