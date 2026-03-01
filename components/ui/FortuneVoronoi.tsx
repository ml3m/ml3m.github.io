"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════════════════════════ */
interface Pt { x: number; y: number; }
interface Tri { a: Pt; b: Pt; c: Pt; cx: number; cy: number; r2: number; }
interface VEdge { x1: number; y1: number; x2: number; y2: number; revealY: number; }

/* ═══════════════════════════════════════════════════════════════════════════
   Fixed sites (normalized 0-1) — handpicked for nice visual coverage
═══════════════════════════════════════════════════════════════════════════ */
const SITES_N: [number, number][] = [
    [0.15, 0.10], [0.52, 0.06], [0.83, 0.15], [0.91, 0.44],
    [0.75, 0.74], [0.51, 0.89], [0.23, 0.81], [0.07, 0.57],
    [0.19, 0.31], [0.57, 0.49], [0.37, 0.61], [0.71, 0.29],
];

// Neon palette — one colour per Voronoi cell / beach arc
const NEON = [
    "#ff4da6", "#cc44ff", "#c77dff", "#ff00cc",
    "#ff6eb4", "#e040fb", "#b388ff", "#ff80ab",
    "#aa44ff", "#ff44aa", "#dd88ff", "#cc00ff",
];

/* ═══════════════════════════════════════════════════════════════════════════
   Bowyer-Watson Delaunay triangulation
═══════════════════════════════════════════════════════════════════════════ */
function circumscribe(a: Pt, b: Pt, c: Pt): { cx: number; cy: number; r2: number } | null {
    const ax = b.x - a.x, ay = b.y - a.y;
    const bx = c.x - a.x, by = c.y - a.y;
    const D = 2 * (ax * by - ay * bx);
    if (Math.abs(D) < 1e-8) return null;
    const ux = (by * (ax * ax + ay * ay) - ay * (bx * bx + by * by)) / D;
    const uy = (ax * (bx * bx + by * by) - bx * (ax * ax + ay * ay)) / D;
    return { cx: a.x + ux, cy: a.y + uy, r2: ux * ux + uy * uy };
}

const sameP = (a: Pt, b: Pt) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) < 1e-5;

function bowyerWatson(pts: Pt[], w: number, h: number): Tri[] {
    const M = Math.max(w, h) * 20;
    const sv0: Pt = { x: w / 2 - M, y: -M };
    const sv1: Pt = { x: w / 2 + M, y: -M };
    const sv2: Pt = { x: w / 2, y: h + M };
    const cs0 = circumscribe(sv0, sv1, sv2)!;
    let tris: Tri[] = [{ a: sv0, b: sv1, c: sv2, ...cs0 }];

    for (const p of pts) {
        // Find bad triangles (circumcircle contains p)
        const bad = tris.filter(t => {
            const dx = p.x - t.cx, dy = p.y - t.cy;
            return dx * dx + dy * dy < t.r2 + 1e-6;
        });
        // Find boundary polygon (edges not shared between two bad triangles)
        const boundary: [Pt, Pt][] = [];
        for (const t of bad) {
            for (const [e0, e1] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]] as [Pt, Pt][]) {
                const shared = bad.some(u => u !== t &&
                    (sameP(u.a, e0) || sameP(u.b, e0) || sameP(u.c, e0)) &&
                    (sameP(u.a, e1) || sameP(u.b, e1) || sameP(u.c, e1)));
                if (!shared) boundary.push([e0, e1]);
            }
        }
        tris = tris.filter(t => !bad.includes(t));
        for (const [e0, e1] of boundary) {
            const cs = circumscribe(p, e0, e1);
            if (cs) tris.push({ a: p, b: e0, c: e1, ...cs });
        }
    }

    // Remove triangles that touch the super-triangle vertices
    const sv = (p: Pt) => sameP(p, sv0) || sameP(p, sv1) || sameP(p, sv2);
    return tris.filter(t => !sv(t.a) && !sv(t.b) && !sv(t.c));
}

/* ═══════════════════════════════════════════════════════════════════════════
   Extract vector Voronoi edges from Delaunay (dual graph)
═══════════════════════════════════════════════════════════════════════════ */
function buildVoronoiEdges(tris: Tri[], w: number, h: number): VEdge[] {
    const edges: VEdge[] = [];

    // ── Interior edges: connect circumcenters of two triangles sharing an edge ──
    for (let i = 0; i < tris.length; i++) {
        for (let j = i + 1; j < tris.length; j++) {
            const ti = tris[i], tj = tris[j];
            const shared = [ti.a, ti.b, ti.c].filter(v =>
                sameP(tj.a, v) || sameP(tj.b, v) || sameP(tj.c, v));
            if (shared.length < 2) continue;
            const revealY = (shared[0].y + shared[1].y) / 2;
            edges.push({ x1: ti.cx, y1: ti.cy, x2: tj.cx, y2: tj.cy, revealY });
        }
    }

    // ── Hull edges: extend from circumcenter to canvas boundary ──────────────
    for (const t of tris) {
        for (const [e0, e1] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]] as [Pt, Pt][]) {
            // Hull edge = not shared with any other triangle
            const isHull = !tris.some(other => other !== t &&
                (sameP(other.a, e0) || sameP(other.b, e0) || sameP(other.c, e0)) &&
                (sameP(other.a, e1) || sameP(other.b, e1) || sameP(other.c, e1)));
            if (!isHull) continue;

            // Third vertex of this triangle (not on the hull edge)
            const third = [t.a, t.b, t.c].find(v => !sameP(v, e0) && !sameP(v, e1))!;

            // Outward perpendicular: perpendicular to (e1-e0), pointing away from third
            const ex = e1.x - e0.x, ey = e1.y - e0.y;
            const mx = (e0.x + e1.x) / 2, my = (e0.y + e1.y) / 2;
            let dx = -ey, dy = ex;
            // Flip if needed so it points away from the interior
            if (dx * (mx - third.x) + dy * (my - third.y) < 0) { dx = -dx; dy = -dy; }

            const len = Math.hypot(dx, dy);
            if (len < 1e-8) continue;
            dx /= len; dy /= len;

            // Extend ray from circumcenter to canvas boundary (with padding)
            let tMax = Math.max(w, h) * 4;
            if (dx > 1e-8) tMax = Math.min(tMax, (w + 20 - t.cx) / dx);
            if (dx < -1e-8) tMax = Math.min(tMax, (-20 - t.cx) / dx);
            if (dy > 1e-8) tMax = Math.min(tMax, (h + 20 - t.cy) / dy);
            if (dy < -1e-8) tMax = Math.min(tMax, (-20 - t.cy) / dy);

            edges.push({
                x1: t.cx, y1: t.cy,
                x2: t.cx + tMax * dx,
                y2: t.cy + tMax * dy,
                revealY: Math.max(e0.y, e1.y),
            });
        }
    }

    return edges.sort((a, b) => a.revealY - b.revealY);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Cell fills: nearest-site scan → RGBA ImageData (runs once)
   This correctly fills ALL cells, including open boundary ones.
═══════════════════════════════════════════════════════════════════════════ */
const CELL_RGB: [number, number, number][] = [
    [255, 77, 166], [204, 68, 255], [199, 125, 255], [255, 0, 204],
    [255, 110, 180], [224, 64, 251], [179, 136, 255], [255, 128, 171],
    [170, 68, 255], [255, 68, 170], [221, 136, 255], [204, 0, 255],
];

function buildFillCanvas(sites: Pt[], w: number, h: number): HTMLCanvasElement {
    const data = new ImageData(w, h);
    const n = sites.length;
    for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
            let minD = Infinity, nearest = 0;
            for (let i = 0; i < n; i++) {
                const dx = px - sites[i].x, dy = py - sites[i].y;
                const d = dx * dx + dy * dy;
                if (d < minD) { minD = d; nearest = i; }
            }
            const [r, g, b] = CELL_RGB[nearest % CELL_RGB.length];
            const idx = 4 * (py * w + px);
            data.data[idx] = r;
            data.data[idx + 1] = g;
            data.data[idx + 2] = b;
            data.data[idx + 3] = 28; // subtle tint
        }
    }
    const off = document.createElement("canvas");
    off.width = w; off.height = h;
    off.getContext("2d")!.putImageData(data, 0, 0);
    return off;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Beach line: for each x, which site "owns" it? (O(n·w) per frame, fast for n=12)
═══════════════════════════════════════════════════════════════════════════ */
interface Arc { siteIdx: number; xL: number; xR: number; }

function beachArcs(sites: Pt[], sweepY: number, w: number): Arc[] {
    const active = sites.map((s, i) => ({ s, i })).filter(({ s }) => s.y < sweepY - 0.5);
    if (!active.length) return [];

    const result: Arc[] = [];
    let cur = -1, startX = 0;

    for (let x = 0; x <= w; x++) {
        let maxY = -1e9, maxI = -1;
        for (const { s, i } of active) {
            const d = sweepY - s.y;
            const py = (sweepY + s.y) / 2 - (x - s.x) * (x - s.x) / (2 * d);
            if (py > maxY) { maxY = py; maxI = i; }
        }
        if (maxI !== cur) {
            if (cur >= 0) result.push({ siteIdx: cur, xL: startX, xR: x });
            cur = maxI; startX = x;
        }
    }
    if (cur >= 0) result.push({ siteIdx: cur, xL: startX, xR: w });
    return result;
}

function arcY(s: Pt, sweepY: number, x: number): number {
    const d = sweepY - s.y;
    return (sweepY + s.y) / 2 - (x - s.x) * (x - s.x) / (2 * d);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component
═══════════════════════════════════════════════════════════════════════════ */
export interface FortuneVoronoiProps { width?: number; height?: number; }

export default function FortuneVoronoi({ width = 210, height = 210 }: FortuneVoronoiProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext("2d")!;
        ctx.scale(dpr, dpr);
        const w = width, h = height;

        // Scale sites to pixel coords
        const sites: Pt[] = SITES_N.map(([nx, ny]) => ({ x: nx * w, y: ny * h }));

        // Pre-compute (runs once at mount)
        const tris = bowyerWatson(sites, w, h);
        const vedges = buildVoronoiEdges(tris, w, h);
        const fillOff = buildFillCanvas(sites, w, h); // pixel-based fills

        const SPEED = h / 200; // px/frame → ~3.3 s sweep at 60 fps
        let sweepY = 0;
        let pauseUntil = 0;

        function draw(now: number) {
            ctx.clearRect(0, 0, w, h);

            if (now < pauseUntil) {
                // Pause: show complete static diagram
                ctx.drawImage(fillOff, 0, 0);
                renderEdges(ctx, vedges, h + 50, w, h);
                renderSites(ctx, sites, h + 1);
                rafRef.current = requestAnimationFrame(draw);
                return;
            }

            sweepY += SPEED;
            if (sweepY >= h + 20) { sweepY = 0; pauseUntil = now + 1500; }

            const sy = sweepY;

            // Cell fills — clip-reveal up to sweep line
            ctx.save();
            ctx.beginPath(); ctx.rect(0, 0, w, Math.min(sy, h)); ctx.clip();
            ctx.drawImage(fillOff, 0, 0);
            ctx.restore();

            // Voronoi edges revealed progressively
            renderEdges(ctx, vedges, sy, w, h);

            // Beach line arcs — coloured per site
            renderBeach(ctx, sites, sy, w, h);

            // Sweep line
            if (sy < h + 5) {
                ctx.save();
                ctx.strokeStyle = "#ff4da6";
                ctx.lineWidth = 1.5;
                ctx.shadowColor = "#ff4da6";
                ctx.shadowBlur = 8;
                ctx.globalAlpha = 0.9;
                ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(w, sy); ctx.stroke();
                ctx.restore();
            }

            renderSites(ctx, sites, sy);
            rafRef.current = requestAnimationFrame(draw);
        }

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ display: "block", background: "transparent" }}
            aria-label="Fortune's algorithm — Voronoi sweep line animation"
        />
    );
}

function renderEdges(
    ctx: CanvasRenderingContext2D,
    vedges: VEdge[],
    sweepY: number,
    w: number,
    h: number,
) {
    ctx.save();
    // Clip so hull-ray extensions are trimmed at the canvas boundary
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();

    ctx.strokeStyle = "#c77dff";
    ctx.lineWidth = 1.3;
    ctx.shadowColor = "#c77dff";
    ctx.shadowBlur = 4;
    ctx.globalAlpha = 0.88;
    ctx.beginPath();
    for (const e of vedges) {
        if (e.revealY > sweepY) break; // sorted by revealY
        ctx.moveTo(e.x1, e.y1);
        ctx.lineTo(e.x2, e.y2);
    }
    ctx.stroke();
    ctx.restore();
}

function renderBeach(
    ctx: CanvasRenderingContext2D,
    sites: Pt[],
    sweepY: number,
    w: number,
    h: number,
) {
    if (sweepY < 2) return;
    const arcs = beachArcs(sites, sweepY, w);

    ctx.save();
    for (const { siteIdx, xL, xR } of arcs) {
        const s = sites[siteIdx];
        const color = NEON[siteIdx % NEON.length];
        const x0 = Math.max(0, xL);
        const x1 = Math.min(w, xR);
        if (x1 <= x0) continue;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 4;
        ctx.globalAlpha = 0.75;

        let pen = false;
        for (let x = x0; x <= x1; x += 0.6) {
            const py = arcY(s, sweepY, x);
            if (py < 0 || py > h) { pen = false; continue; }
            if (pen) {
                ctx.lineTo(x, py);
            } else {
                ctx.moveTo(x, py);
            }
            pen = true;
        }
        ctx.stroke();
    }
    ctx.restore();
}

function renderSites(ctx: CanvasRenderingContext2D, sites: Pt[], sweepY: number) {
    for (const s of sites) {
        const active = s.y < sweepY;
        ctx.save();
        ctx.globalAlpha = active ? 1 : 0.4;
        if (active) { ctx.shadowColor = "#ff4da6"; ctx.shadowBlur = 10; }
        ctx.fillStyle = active ? "#ff4da6" : "#7a5f99";
        ctx.beginPath();
        ctx.arc(s.x, s.y, active ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
