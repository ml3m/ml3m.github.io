"use client";

import { useEffect, useState, useRef } from "react";

// ASCII cat frames extracted from https://github.com/ml3m/mlemfetch
// Each frame is an array of strings representing lines of the cat
const FRAMES: string[][] = [
    // frame_0 — idle
    [
        "                               ",
        "       _",
        "       `*-.",
        "        )  _`-.",
        "       .  : `. .",
        "       : _   '  \\",
        "       ; *` _.   `*-._",
        "       `-.-'          `-.",
        "         ;       `       `.",
        "         :.       .        \\",
        "         . \\  .   :   .-'   .",
        "         '  `+.;  ;  '      :",
        "         :  '  |  ,  ;       ;-.",
        "         ; '   : :`-:     _.`*  ;",
        "[bug] .*' /  .*' ; .*`- +'  `*'*",
        "      `*-*   `*-*  `*-*'       ",
    ],
    // frame_1 — slight shift
    [
        "                               ",
        "       _                        ",
        "       `*-.                    ",
        "        )  _`-.                 ",
        "       .  : `. .                ",
        "       : _   '  \\               ",
        "       / *` _.   `*-._          ",
        "       `-.-'          `-.       ",
        "         :.              \\    ",
        "         . \\      `   .-. .   ",
        "         '  ._ ;  ;  '     :   ",
        "         :  , `|  ,  ;      ;-.",
        "         ; '   : :`-:    _.`*  ;",
        "[bug] .*' /  .*' ; .*`- +'  `*' ",
        "      `*-*   `*-*  `*-*'       ",
    ],
    // frame_2 — paw raise
    [
        "                               ",
        "        _                        ",
        "        `*,.                   ",
        "        /  _ `-.                 ",
        "       .  : `, `.                ",
        "       ; _   '  |               ",
        "       / *` _,   `*-._          ",
        "       `-`'           `-.       ",
        "         : .             \\    ",
        "         ; ;      `   .-. .   ",
        "        , ; `. ;  ;  '     :   ",
        "    .*'` /    `|  ,  ;      ;-.",
        "    `*-'`      ; :`-:    _.`*  ;",
        "[bug]        .*' ; .*`- +`  `*' ",
        "             `*-*  `*-*'       ",
    ],
    // frame_3 — bug approaches mouth (1)
    [
        "                               ",
        "        _                        ",
        "        `*,.                   ",
        "        /  _ `-.                 ",
        "       .  : `, `.                ",
        "       ; _   '  |               ",
        "       / *` _,   `*-._          ",
        "       `-`'           `-.       ",
        "         : .             \\    ",
        "         ; ;      `   .-. .   ",
        " [bug]  , ; `. ;  ;  '     :   ",
        "    .*'` /    `|  ,  ;      ;-.",
        "    `*-'`      ; :`-:    _.`*  ;",
        "             .*' ; .*`- +`  `*' ",
        "             `*-*  `*-*'       ",
    ],
    // frame_4 — bug approaches mouth (2)
    [
        "                               ",
        "        _                        ",
        "        `*,.                   ",
        "        /  _ `-.                 ",
        "       .  : `, `.                ",
        "       ; _   '  |               ",
        "       / *` _,   `*-._          ",
        "       `-`'           `-.       ",
        "         : .             \\    ",
        "   [bug], ,;      `   .-. .   ",
        "    ,-'` /  `. ;  ;  '     :   ",
        "    `*-'`     `|  ,  ;      ;-.",
        "               ; :`-:    _.`*  ;",
        "             .*' ; .*`- +`  `*' ",
        "             `*-*  `*-*'       ",
    ],
    // frame_5 — bug at mouth
    [
        "                               ",
        "        _                        ",
        "        `*,.                   ",
        "        /  _ `-.                 ",
        "       .  : `, `.                ",
        "       ; _   '  |               ",
        "       / *` _,   `*-._          ",
        "       `-`'           `-.       ",
        "    [bug]: ,             \\    ",
        "    ;`'` /,;      `   .-. .   ",
        "    `*-'`   `. ;  ;  '     :   ",
        "              `|  ,  ;      ;-.",
        "               ; :`-:    _.`*  ;",
        "             .*' ; .*`- +`  `*' ",
        "             `*-*  `*-*'       ",
    ],
    // frame_6 — back to paw
    [
        "                               ",
        "        _                        ",
        "        `*,.                   ",
        "        /  _ `-.                 ",
        "       .  : `, `.                ",
        "       ; _   '  |               ",
        "       / *` _,   `*-._          ",
        "       `-`'           `-.       ",
        "         : .             \\    ",
        "         ; ;      `   .-. .   ",
        "        , ; `. ;  ;  '     :   ",
        "    .*'` /    `|  ,  ;      ;-.",
        "    `*-'`      ; :`-:    _.`*  ;",
        "             .*' ; .*`- +`  `*' ",
        "             `*-*  `*-*'       ",
    ],
];

// Neon rainbow palette (matching the site's retro-cyber vibe)
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
    const idx = (lineIndex + offset) % NEON_PALETTE.length;
    return NEON_PALETTE[(idx + NEON_PALETTE.length) % NEON_PALETTE.length];
}

export default function MlemfetchCat({ className = "" }: { className?: string }) {
    const [frameIndex, setFrameIndex] = useState(0);
    const [colorOffset, setColorOffset] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setFrameIndex((f) => (f + 1) % FRAMES.length);
            setColorOffset((o) => (o + 1) % NEON_PALETTE.length);
        }, 40);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const frame = FRAMES[frameIndex];

    return (
        <pre
            className={`font-mono text-[0.52rem] leading-[1.35] select-none pointer-events-none ${className}`}
            aria-hidden="true"
        >
            {frame.map((line, i) => (
                <span
                    key={i}
                    style={{
                        display: "block",
                        color: getLineColor(i, colorOffset),
                        textShadow: `0 0 6px ${getLineColor(i, colorOffset)}88`,
                        transition: "color 0.15s ease",
                    }}
                >
                    {line || " "}
                </span>
            ))}
        </pre>
    );
}
