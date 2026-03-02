"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Projects", href: "/projects" },
  { title: "Yapping", href: "/yapping" },
  { title: "Garden", href: "/garden" },
  { title: "Bookmarks", href: "/bookmarks" },
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
}: {
  title: string;
  href: string;
  isActive: boolean;
}) {
  const { displayed, startScramble, stopScramble } = useGlitch(title, isActive);

  return (
    <Link
      href={href}
      className={`transition-colors duration-200 select-none ${isActive
          ? "text-neon-pink glow-pink"
          : "text-neon-lavender hover:text-neon-pink"
        }`}
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
    >
      {displayed}
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
          />
          {i < navLinks.length - 1 && (
            <span className="text-text-muted mx-2">|</span>
          )}
        </span>
      ))}
    </nav>
  );
}
