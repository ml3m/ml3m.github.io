"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Projects", href: "/projects" },
  { title: "Yapping", href: "/yapping" },
  { title: "Bookmarks", href: "/bookmarks" },
  { title: "Garden", href: "/garden", accent: "green" as const },
  { title: "Gallery", href: "/gallery", accent: "amber" as const },
  { title: "Tools", href: "/tools" },
];

// Characters used for the scramble effect
const GLITCH_CHARS = "▓░▒█▄▀■□▪▫◆◇●○◉◎⊗⊘⊙⊚";

/** Lightly corrupt a string — keeps ~60% of real chars, scrambles the rest */
function corruptText(text: string, intensity: number): string {
  return text
    .split("")
    .map((char) => {
      if (char === " ") return " ";
      if (Math.random() < intensity) {
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }
      return char;
    })
    .join("");
}

/** Hook that drives the scramble animation */
function useGlitch(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iterRef = useRef(0);
  const hoveringRef = useRef(false);

  /* Persistent low-level glitch for the active link */
  const slowGlitchRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopEffects = useCallback(() => {
    if (frameRef.current) clearTimeout(frameRef.current);
    if (slowGlitchRef.current) clearInterval(slowGlitchRef.current);
    frameRef.current = null;
    slowGlitchRef.current = null;
  }, []);

  /* Active-page subtle permanent glitch */
  useEffect(() => {
    if (!active) {
      if (slowGlitchRef.current) {
        clearInterval(slowGlitchRef.current);
        slowGlitchRef.current = null;
      }
      if (!hoveringRef.current) setDisplayed(text);
      return;
    }
    slowGlitchRef.current = setInterval(() => {
      if (!hoveringRef.current) {
        // randomly glitch 1-2 chars at low intensity, then snap back
        setDisplayed(corruptText(text, 0.25));
        setTimeout(() => {
          if (!hoveringRef.current) setDisplayed(text);
        }, 80);
      }
    }, 2200);
    return () => {
      if (slowGlitchRef.current) clearInterval(slowGlitchRef.current);
    };
  }, [active, text]);

  const startScramble = useCallback(() => {
    hoveringRef.current = true;
    iterRef.current = 0;
    if (slowGlitchRef.current) clearInterval(slowGlitchRef.current);

    const TOTAL_ITERS = 14;
    const FRAME_MS = 38;

    const tick = () => {
      const progress = iterRef.current / TOTAL_ITERS;
      if (iterRef.current <= TOTAL_ITERS) {
        // Intensity ramps up then down: peak chaos in the middle
        const intensity = Math.sin(progress * Math.PI) * 0.85;
        setDisplayed(corruptText(text, intensity));
        iterRef.current++;
        frameRef.current = setTimeout(tick, FRAME_MS);
      } else {
        setDisplayed(text);
      }
    };
    tick();
  }, [text]);

  const stopScramble = useCallback(() => {
    hoveringRef.current = false;
    if (frameRef.current) {
      clearTimeout(frameRef.current);
      frameRef.current = null;
    }
    setDisplayed(text);
    // re-attach persistent glitch for active links
    if (active) {
      slowGlitchRef.current = setInterval(() => {
        if (!hoveringRef.current) {
          setDisplayed(corruptText(text, 0.25));
          setTimeout(() => {
            if (!hoveringRef.current) setDisplayed(text);
          }, 80);
        }
      }, 2200);
    }
  }, [text, active]);

  useEffect(() => {
    return () => stopEffects();
  }, [stopEffects]);

  return { displayed, startScramble, stopScramble };
}

function GlitchLink({
  title,
  href,
  isActive,
  accent,
}: {
  title: string;
  href: string;
  isActive: boolean;
  accent?: "green" | "amber";
}) {
  const { displayed, startScramble, stopScramble } = useGlitch(title, isActive);

  const isGreen = accent === "green";
  const isAmber = accent === "amber";
  
  const activeClass = isGreen
    ? "text-emerald-400 drop-shadow-[0_0_6px_#34d399]"
    : isAmber
    ? "text-amber-400 drop-shadow-[0_0_6px_#fbbf24]"
    : "text-neon-pink glow-pink";
    
  const inactiveClass = isGreen
    ? "text-emerald-400/70 hover:text-emerald-300"
    : isAmber
    ? "text-amber-400/70 hover:text-amber-300"
    : "text-neon-lavender hover:text-neon-pink";

  const getBorderColor = () => {
    if (isGreen) return "bg-emerald-400/10 border border-emerald-400/30";
    if (isAmber) return "bg-amber-400/10 border border-amber-400/30";
    return "bg-neon-pink/10 border border-neon-pink/30";
  };

  return (
    <Link
      href={href}
      className={`relative px-3 py-1.5 transition-colors duration-200 select-none ${isActive
        ? activeClass
        : inactiveClass
        }${!isActive && (isGreen || isAmber) ? ` animate-[${isGreen ? 'garden' : 'gallery'}-pulse_3s_ease-in-out_infinite]` : ""}`}
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className={`absolute inset-0 ${getBorderColor()} rounded flex-shrink-0`}
          style={{ zIndex: -1 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <span className="relative z-10">{displayed}</span>
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="text-center my-2 text-[0.85rem] tracking-wide">
      {navLinks.map((link, i) => (
        <span key={link.href}>
          <GlitchLink
            title={link.title}
            href={link.href}
            isActive={pathname === link.href}
            accent={(link as { accent?: "green" }).accent}
          />
          {i < navLinks.length - 1 && (
            <span className="text-text-muted mx-2">|</span>
          )}
        </span>
      ))}
    </nav>
  );
}
