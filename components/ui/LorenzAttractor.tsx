"use client";

import { useEffect, useRef } from "react";
import { useIntersectionPause } from "@/lib/useIntersectionPause";

/* ── Lorenz system parameters ─────────────────────────────────────────────── */
const SIGMA = 10, RHO = 28, BETA = 8 / 3, DT = 0.005;
const TOTAL = 9000;

/* Pre-compute the full trajectory once at module load (not per component) */
function computeLorenz(): Float32Array {
    const buf = new Float32Array(TOTAL * 3);
    let x = 0.1, y = 0, z = 0;
    for (let i = 0; i < TOTAL; i++) {
        buf[i * 3] = x; buf[i * 3 + 1] = y; buf[i * 3 + 2] = z;
        const dx = SIGMA * (y - x);
        const dy = x * (RHO - z) - y;
        const dz = x * y - BETA * z;
        x += dx * DT; y += dy * DT; z += dz * DT;
    }
    return buf;
}
const BUF = computeLorenz();

/* Bounding box for normalization */
let mnX = Infinity, mxX = -Infinity;
let mnY = Infinity, mxY = -Infinity;
let mnZ = Infinity, mxZ = -Infinity;
for (let i = 0; i < TOTAL; i++) {
    const x = BUF[i * 3], y = BUF[i * 3 + 1], z = BUF[i * 3 + 2];
    if (x < mnX) mnX = x; if (x > mxX) mxX = x;
    if (y < mnY) mnY = y; if (y > mxY) mxY = y;
    if (z < mnZ) mnZ = z; if (z > mxZ) mxZ = z;
}
const CX = (mnX + mxX) / 2, CY = (mnY + mxY) / 2, CZ = (mnZ + mxZ) / 2;
const RANGE = Math.max(mxX - mnX, mxY - mnY, mxZ - mnZ) / 2;

/* ── 3-D → 2-D projection ────────────────────────────────────────────────── */
// Bake cos/sin for the fixed X-tilt (≈16°)
const TILT = 0.28;
const cosTilt = Math.cos(TILT), sinTilt = Math.sin(TILT);

function project(
    x: number, y: number, z: number,
    angleY: number, w: number, h: number
): [number, number] {
    const nx = (x - CX) / RANGE;
    const ny = (y - CY) / RANGE;
    const nz = (z - CZ) / RANGE;

    // Rotate around Y-axis
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const rx = cosY * nx + sinY * nz;
    const rz = -sinY * nx + cosY * nz;

    // Fixed X-tilt
    const ry = cosTilt * ny - sinTilt * rz;

    const scale = Math.min(w, h) * 0.44;
    return [w / 2 + rx * scale, h / 2 - ry * scale];
}

/* ── Trail color (t = 0 → tail/dim, t = 1 → head/bright) ───────────────── */
// dark-purple → neon-lavender → neon-magenta → neon-pink
function trailColor(t: number): string {
    if (t < 0.35) {
        const u = t / 0.35;
        return `rgb(${Math.round(28 + u * 199)},${Math.round(4 + u * 125)},${Math.round(60 + u * 195)})`;
    } else if (t < 0.70) {
        const u = (t - 0.35) / 0.35;
        return `rgb(${Math.round(199 + u * 5)},${Math.round(125 - u * 57)},${Math.round(255)})`;
    } else {
        const u = (t - 0.70) / 0.30;
        return `rgb(${Math.round(204 + u * 51)},${Math.round(68 + u * 9)},${Math.round(255 - u * 89)})`;
    }
}

/* Pre-bake the color strings so we don't recompute them on every frame */
const SEGMENTS = 180; // number of color bands
const SEG_SIZE = Math.ceil(TOTAL / SEGMENTS);
const COLORS = Array.from({ length: SEGMENTS }, (_, i) =>
    trailColor(i / (SEGMENTS - 1))
);

/* ── Component ───────────────────────────────────────────────────────────── */
export interface LorenzAttractorProps {
    width?: number;
    height?: number;
}

export default function LorenzAttractor({
    width = 220,
    height = 220,
}: LorenzAttractorProps) {
    const [canvasRef, isVisible] = useIntersectionPause<HTMLCanvasElement>();
    const isVisibleRef = useRef(isVisible);
    isVisibleRef.current = isVisible;
    const drawRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (isVisible && drawRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(drawRef.current);
        }
    }, [isVisible]);

    const rafRef = useRef<number>(0);
    const stateRef = useRef({
        count: 0,
        angle: -0.25,   // starting Y-rotation
        done: false,
    });
    // Drag interaction state (kept in a ref — no re-renders needed)
    const dragRef = useRef({
        active: false,
        startX: 0,
        angleAtStart: 0,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // HiDPI / Retina support
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d")!;
        ctx.scale(dpr, dpr);

        const w = width, h = height;
        const DRAW_PER_FRAME = 100;
        const ROT_SPEED = 0.005;
        const DRAG_SENS = 0.008; // radians per pixel dragged

        /* ── render loop ── */
        function draw() {
            if (!isVisibleRef.current) return;
            ctx.clearRect(0, 0, w, h);

            const s = stateRef.current;
            const d = dragRef.current;

            if (!s.done) {
                s.count = Math.min(s.count + DRAW_PER_FRAME, TOTAL);
                if (s.count >= TOTAL) s.done = true;
            } else if (!d.active) {
                // Only auto-rotate when the user isn't dragging
                s.angle += ROT_SPEED;
            }

            const count = s.count;
            const angle = s.angle;

            for (let seg = 0; seg < SEGMENTS; seg++) {
                const start = seg * SEG_SIZE;
                if (start >= count - 1) break;
                const end = Math.min(start + SEG_SIZE, count - 1);

                ctx.beginPath();
                ctx.strokeStyle = COLORS[seg];
                ctx.lineWidth = seg > SEGMENTS * 0.7 ? 1.1 : 0.65;
                ctx.globalAlpha = 0.45 + (seg / SEGMENTS) * 0.55;

                const [x0, y0] = project(BUF[start * 3], BUF[start * 3 + 1], BUF[start * 3 + 2], angle, w, h);
                ctx.moveTo(x0, y0);
                for (let i = start + 1; i <= end; i++) {
                    const [sx, sy] = project(BUF[i * 3], BUF[i * 3 + 1], BUF[i * 3 + 2], angle, w, h);
                    ctx.lineTo(sx, sy);
                }
                ctx.stroke();
            }

            // Glowing head dot during build-up
            if (!s.done && count > 1) {
                const hi = count - 1;
                const [hx, hy] = project(BUF[hi * 3], BUF[hi * 3 + 1], BUF[hi * 3 + 2], angle, w, h);
                ctx.globalAlpha = 1;
                ctx.shadowColor = "#ff4da6";
                ctx.shadowBlur = 10;
                ctx.fillStyle = "#ff4da6";
                ctx.beginPath();
                ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            rafRef.current = requestAnimationFrame(draw);
        }

        /* ── drag / pointer handlers ── */
        const onDown = (e: PointerEvent) => {
            dragRef.current.active = true;
            dragRef.current.startX = e.clientX;
            dragRef.current.angleAtStart = stateRef.current.angle;
            canvas.setPointerCapture(e.pointerId);
            canvas.style.cursor = "grabbing";
        };

        const onMove = (e: PointerEvent) => {
            if (!dragRef.current.active) return;
            const dx = e.clientX - dragRef.current.startX;
            stateRef.current.angle = dragRef.current.angleAtStart + dx * DRAG_SENS;
        };

        const onUp = () => {
            dragRef.current.active = false;
            canvas.style.cursor = "grab";
        };

        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerup", onUp);
        canvas.addEventListener("pointerleave", onUp);
        canvas.style.cursor = "grab";

        drawRef.current = draw;
        rafRef.current = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(rafRef.current);
            canvas.removeEventListener("pointerdown", onDown);
            canvas.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerup", onUp);
            canvas.removeEventListener("pointerleave", onUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ display: "block", background: "transparent", touchAction: "none" }}
            aria-label="Interactive Lorenz attractor — drag to rotate"
        />
    );
}
