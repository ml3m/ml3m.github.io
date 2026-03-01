"use client";

import { useEffect, useRef } from "react";

/* ── Aligned sequences (Needleman-Wunsch style) ─────────────────────────── */
const SEQ1_RAW =
    "GCTAGCTAGGCTA-GCTAGGCTAGCTAGGCTA-GCTAGGCTAGCTATGCTAGGCTAGCTATGCTAGGCTATGCT";
const SEQ2_RAW =
    "GCTAGCTAGGCTAGGCTAGGCTAGCAAGACTAG-CTAGGCTAGCTATGCAAGACTAGCTATGCTAGGCTATGCT";

const ALEN = Math.max(SEQ1_RAW.length, SEQ2_RAW.length);
const SEQ1 = SEQ1_RAW.padEnd(ALEN, "-");
const SEQ2 = SEQ2_RAW.padEnd(ALEN, "-");

const MATCH_ROW = Array.from({ length: ALEN }, (_, i) => {
    const a = SEQ1[i], b = SEQ2[i];
    if (a === "-" || b === "-") return " ";
    return a === b ? "|" : "·";
}).join("");

/* ── Neon palette ────────────────────────────────────────────────────────── */
const BASE_COL: Record<string, string> = {
    A: "#ff4da6",   // neon pink     (adenine)
    T: "#c77dff",   // neon lavender (thymine)
    G: "#cc44ff",   // neon purple   (guanine)
    C: "#e040fb",   // electric magenta (cytosine)
    "-": "#6b4e9b", // muted purple  (gap)
};
const MATCH_COL = "#ff4da6"; // neon pink  — match
const MISMATCH_COL = "#c77dff"; // lavender   — mismatch

const LABEL_W = 30;  // px for "Seq1" label
const CH_W = 8;   // px per glyph
const LINE_H = 14;  // px between rows

function gcContent(seq: string, s: number, e: number): number {
    let gc = 0, t = 0;
    for (let i = s; i < Math.min(e, seq.length); i++) {
        const c = seq[i];
        if (c !== "-") { t++; if (c === "G" || c === "C") gc++; }
    }
    return t > 0 ? gc / t : 0;
}

function render(
    ctx: CanvasRenderingContext2D,
    offset: number,
    w: number,
    h: number,
    visible: number,
) {
    const start = Math.floor(offset);
    const shiftX = -(offset - start) * CH_W;

    ctx.fillStyle = "#1A1230"; // dark purple matching card bg
    ctx.fillRect(0, 0, w, h);

    // Calculate vertical centering
    const contentHeight = 65; // Ruler to Stats is roughly 65px
    const offsetY = Math.max(0, (h - contentHeight) / 2);

    // Clip the scrolling area so chars don't bleed left of labels
    ctx.save();
    ctx.beginPath();
    ctx.rect(LABEL_W, 0, w - LABEL_W, h);
    ctx.clip();

    /* ruler */
    const rulerY = offsetY + 8;
    ctx.font = '7px "Courier New", monospace';
    ctx.textAlign = "left";
    for (let i = 0; i <= visible + 1; i++) {
        const pos = start + i;
        if (pos >= ALEN) break;
        if (pos % 10 === 0 && pos > 0) {
            ctx.fillStyle = "#7a5f99";
            ctx.fillText(String(pos), LABEL_W + shiftX + i * CH_W - 3, rulerY);
        }
    }

    const seq1Y = rulerY + LINE_H;
    const matchY = rulerY + LINE_H * 2;
    const seq2Y = rulerY + LINE_H * 3;

    /* sequence rows */
    for (const [seq, y, isMatch] of [
        [SEQ1, seq1Y, false],
        [MATCH_ROW, matchY, true],
        [SEQ2, seq2Y, false],
    ] as [string, number, boolean][]) {
        ctx.font = '10px "Courier New", monospace';
        for (let i = 0; i <= visible + 1; i++) {
            const pos = start + i;
            if (pos >= seq.length) break;
            const ch = seq[pos];
            if (!ch || ch === " ") continue;
            const x = LABEL_W + shiftX + i * CH_W;
            if (isMatch) {
                ctx.fillStyle = ch === "|" ? MATCH_COL : MISMATCH_COL;
                ctx.globalAlpha = ch === "|" ? 0.6 : 1;
                ctx.shadowBlur = 0;
            } else {
                const col = BASE_COL[ch] ?? "#fff";
                ctx.fillStyle = col;
                ctx.globalAlpha = ch === "-" ? 0.4 : 1;
                ctx.shadowColor = col;
                ctx.shadowBlur = ch === "-" ? 0 : 3;
            }
            ctx.fillText(ch, x, y);
        }
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }
    ctx.restore();

    /* labels */
    ctx.font = '8px "Courier New", monospace';
    ctx.textAlign = "left";
    ctx.fillStyle = "#8b6cb5";
    ctx.fillText("Seq1", 0, rulerY + LINE_H);
    ctx.fillText("Seq2", 0, rulerY + LINE_H * 3);

    /* scan cursor */
    const curX = LABEL_W + visible * 0.6 * CH_W;
    ctx.save();
    ctx.strokeStyle = "#ff4da6"; ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35; ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(curX, rulerY); ctx.lineTo(curX, seq2Y + 4); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();

    /* stats */
    let matches = 0, mismatches = 0, gaps = 0;
    for (let i = start; i < Math.min(start + visible, ALEN); i++) {
        const m = MATCH_ROW[i];
        if (m === "|") matches++;
        else if (m === "·") mismatches++;
        else if (SEQ1[i] === "-" || SEQ2[i] === "-") gaps++;
    }
    const gc = Math.round(gcContent(SEQ1, start, start + visible) * 100);
    const pct = visible > 0 ? Math.round(matches / visible * 100) : 0;
    const statsY = seq2Y + 13;
    ctx.font = '7px "Courier New", monospace'; ctx.textAlign = "left";
    let sx = 0;
    ctx.fillStyle = "#ff4da6"; ctx.fillText(`M:${matches}(${pct}%)`, sx, statsY); sx += 65;
    ctx.fillStyle = "#ff4da6"; ctx.fillText(`X:${mismatches}`, sx, statsY); sx += 30;
    ctx.fillStyle = "#ff4da6"; ctx.fillText(`G:${gaps}`, sx, statsY); sx += 28;
    ctx.fillStyle = "#ff4da6"; ctx.fillText(`GC:${gc}%`, sx, statsY);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component — auto-sizes to its container via ResizeObserver
═══════════════════════════════════════════════════════════════════════════ */
export interface DNAAlignmentProps {
    /** Explicit width override — omit to auto-fill container */
    width?: number;
    height?: number;
}

export default function DNAAlignment({ width: widthProp, height = 105 }: DNAAlignmentProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const stateRef = useRef({ offset: 0, pauseUntil: 0 });
    const dimsRef = useRef({ w: widthProp ?? 300, h: height, visible: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;

        function resize(w: number) {
            const h = height;
            dimsRef.current.w = w;
            dimsRef.current.h = h;
            dimsRef.current.visible = Math.floor((w - LABEL_W) / CH_W);
            canvas!.width = w * dpr;
            canvas!.height = h * dpr;
            canvas!.style.width = `${w}px`;
            canvas!.style.height = `${h}px`;
            const ctx = canvas!.getContext("2d")!;
            ctx.scale(dpr, dpr);
        }

        // Initial size: either the prop or the parent's clientWidth
        const initW = widthProp ?? (canvas.parentElement?.clientWidth || 300);
        resize(initW);

        // Auto-resize when the container changes width
        const ro = new ResizeObserver(entries => {
            for (const entry of entries) {
                const newW = Math.floor(entry.contentRect.width);
                if (newW > 0 && newW !== dimsRef.current.w) resize(newW);
            }
        });
        if (canvas.parentElement) ro.observe(canvas.parentElement);

        const ctx = canvas.getContext("2d")!;

        function draw() {
            const { w, h, visible } = dimsRef.current;
            const s = stateRef.current;

            s.offset += 0.28;
            if (s.offset + visible >= ALEN) s.offset = 0; // instant loop

            render(ctx, s.offset, w, h, visible);
            rafRef.current = requestAnimationFrame(draw);
        }

        rafRef.current = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(rafRef.current);
            ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ display: "block", borderRadius: 3 }}
            aria-label="DNA sequence alignment — Needleman-Wunsch"
        />
    );
}
