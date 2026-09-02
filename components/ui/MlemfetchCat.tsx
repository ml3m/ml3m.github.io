"use client";

import { useEffect, useRef } from "react";
import { useIntersectionPause } from "@/lib/useIntersectionPause";

// ASCII cat frames from https://github.com/ml3m/mlemfetch
// ALL frames normalized to exactly 16 lines so the <pre> never changes height.
// Lines are left-padded with spaces to a consistent width (35 chars visible) to
// prevent the container from resizing between frames.
const FRAMES: string[][] = [
    // frame_0 — idle / bug far left
    [
        "                                   ",
        "       _                           ",
        "       `*-.                        ",
        "        )  _`-.                    ",
        "       .  : `. .                   ",
        "       : _   '  \\                  ",
        "       ; *` _.   `*-._             ",
        "       `-.-'          `-.          ",
        "         ;       `       `.        ",
        "         :.       .        \\       ",
        "         . \\  .   :   .-'   .      ",
        "         '  `+.;  ;  '      :      ",
        "         :  '  |  ,  ;       ;-.   ",
        "         ; '   : :`-:     _.`*  ;  ",
        "[bug] .*' /  .*' ; .*`- +'  `*'*   ",
        "      `*-*   `*-*  `*-*'           ",
    ],
    // frame_1 — slight shift
    //
    [
        "                                   ",
        "                                   ",
        "       _                           ",
        "       `*-.                        ",
        "        )  _`-.                    ",
        "       .  : `. .                   ",
        "       : _   '  \\                  ",
        "       / *` _.   `*-._             ",
        "       `-.-'          `-.          ",
        "         :.              \\         ",
        "         . \\      `   .-. .        ",
        "         '  ._ ;  ;  '     :       ",
        "         :  , `|  ,  ;      ;-.    ",
        "         ; '   : :`-:    _.`*  ;   ",
        "[bug] .*' /  .*' ; .*`- +'  `*'    ",
        "      `*-*   `*-*  `*-*'           ",
    ],
    // frame_2 — paw raise / bug far right
    [
        "                                   ",
        "                                   ",
        "        _                          ",
        "        `*,.                       ",
        "        /  _ `-.                   ",
        "       .  : `, `.                  ",
        "       ; _   '  |                  ",
        "       / *` _,   `*-._             ",
        "       `-`'           `-.          ",
        "         : .             \\         ",
        "         ; ;      `   .-. .        ",
        "        , ; `. ;  ;  '     :       ",
        "    .*'` /    `|  ,  ;      ;-.    ",
        "    `*-'`      ; :`-:    _.`*  ;   ",
        "[bug]        .*' ; .*`- +`  `*'    ",
        "             `*-*  `*-*'           ",
    ],
    // frame_3 — bug approaches mouth (1)
    [
        "                                   ",
        "                                   ",
        "        _                          ",
        "        `*,.                       ",
        "        /  _ `-.                   ",
        "       .  : `, `.                  ",
        "       ; _   '  |                  ",
        "       / *` _,   `*-._             ",
        "       `-`'           `-.          ",
        "         : .             \\         ",
        "         ; ;      `   .-. .        ",
        " [bug]  , ; `. ;  ;  '     :       ",
        "    .*'` /    `|  ,  ;      ;-.    ",
        "    `*-'`      ; :`-:    _.`*  ;   ",
        "             .*' ; .*`- +`  `*'    ",
        "             `*-*  `*-*'           ",
    ],
    // frame_4 — bug approaches mouth (2)
    [
        "                                   ",
        "                                   ",
        "        _                          ",
        "        `*,.                       ",
        "        /  _ `-.                   ",
        "       .  : `, `.                  ",
        "       ; _   '  |                  ",
        "       / *` _,   `*-._             ",
        "       `-`'           `-.          ",
        "         : .             \\         ",
        "   [bug], ,;      `   .-. .        ",
        "    ,-'` /  `. ;  ;  '     :       ",
        "    `*-'`     `|  ,  ;      ;-.    ",
        "               ; :`-:    _.`*  ;   ",
        "             .*' ; .*`- +`  `*'    ",
        "             `*-*  `*-*'           ",
    ],
    // frame_5 — bug at mouth (eaten!)
    [
        "                                   ",
        "                                   ",
        "        _                          ",
        "        `*,.                       ",
        "        /  _ `-.                   ",
        "       .  : `, `.                  ",
        "       ; _   '  |                  ",
        "       / *` _,   `*-._             ",
        "       `-`'           `-.          ",
        "    [bug]: ,             \\         ",
        "    ;`'` /,;      `   .-. .        ",
        "    `*-'`   `. ;  ;  '     :       ",
        "              `|  ,  ;      ;-.    ",
        "               ; :`-:    _.`*  ;   ",
        "             .*' ; .*`- +`  `*'    ",
        "             `*-*  `*-*'           ",
    ],
    // frame_6 — back to paw (loop)
    [
        "                                   ",
        "                                   ",
        "        _                          ",
        "        `*,.                       ",
        "        /  _ `-.                   ",
        "       .  : `, `.                  ",
        "       ; _   '  |                  ",
        "       / *` _,   `*-._             ",
        "       `-`'           `-.          ",
        "         : .             \\         ",
        "         ; ;      `   .-. .        ",
        "        , ; `. ;  ;  '     :       ",
        "    .*'` /    `|  ,  ;      ;-.    ",
        "    `*-'`      ; :`-:    _.`*  ;   ",
        "             .*' ; .*`- +`  `*'    ",
        "             `*-*  `*-*'           ",
    ],
];

// Neon rainbow palette
const NEON_PALETTE = [
    "#ff4da6", // neon-pink
    "#cc44ff", // neon-purple
    "#c77dff", // neon-lavender
    "#ff00cc", // neon-magenta
    "#ff6eb4", // lighter pink
    "#e040fb", // electric purple
    "#b388ff", // soft violet
    "#ff80ab", // pastel pink
];

function getLineColor(lineIndex: number, offset: number): string {
    return NEON_PALETTE[(lineIndex + offset + NEON_PALETTE.length) % NEON_PALETTE.length];
}

export default function MlemfetchCat({ className = "" }: { className?: string }) {
    // Store frame + color in a ref to avoid stale closure in the interval
    const frameRef = useRef(0);
    const colorRef = useRef(0);
    const [containerRef, isVisible] = useIntersectionPause<HTMLDivElement>();
    const isVisibleRef = useRef(isVisible);
    isVisibleRef.current = isVisible;
    const preRef = useRef<HTMLPreElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const tickRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (isVisible && tickRef.current) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => tickRef.current!(), 350);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, [isVisible]);

    useEffect(() => {
        // Render the initial frame immediately
        renderFrame(frameRef.current, colorRef.current);

        tickRef.current = () => {
            if (!isVisibleRef.current) return;
            frameRef.current = (frameRef.current + 1) % FRAMES.length;
            colorRef.current = (colorRef.current + 1) % NEON_PALETTE.length;
            renderFrame(frameRef.current, colorRef.current);
        };

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Directly mutate the DOM span colors — zero React re-renders, zero layout recalc */
    function renderFrame(fi: number, co: number) {
        const pre = preRef.current;
        if (!pre) return;
        const spans = pre.querySelectorAll("span");
        const lines = FRAMES[fi];
        spans.forEach((span, i) => {
            const color = getLineColor(i, co);
            (span as HTMLElement).textContent = lines[i] ?? " ";
            (span as HTMLElement).style.color = color;
            (span as HTMLElement).style.textShadow = `0 0 5px ${color}99`;
        });
    }

    // Render spans for all 16 lines once — content is updated imperatively via renderFrame
    const initialFrame = FRAMES[0];

    return (
        // Fixed-size wrapper so card dimensions never change between frames
        <div
            ref={containerRef}
            className={`overflow-hidden flex-shrink-0 ${className}`}
            style={{ width: "35ch", lineHeight: "2.35" }}
            aria-hidden="true"
        >
            <pre
                ref={preRef}
                className="font-mono text-[0.7rem] leading-[1.35] select-none pointer-events-none m-0 p-0"
                style={{ whiteSpace: "pre" }}
            >
                {initialFrame.map((line, i) => (
                    <span
                        key={i}
                        style={{
                            display: "block",
                            color: getLineColor(i, 0),
                            textShadow: `0 0 5px ${getLineColor(i, 0)}99`,
                        }}
                    >
                        {line || " "}
                    </span>
                ))}
            </pre>
        </div>
    );
}
