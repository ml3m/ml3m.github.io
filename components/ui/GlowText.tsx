import { createElement } from "react";

interface GlowTextProps {
  children: React.ReactNode;
  color?: "pink" | "purple" | "lavender";
  as?: "h1" | "h2" | "h3" | "span" | "p";
  className?: string;
}

const glowClasses = {
  pink: "text-neon-pink glow-pink",
  purple: "text-neon-purple glow-purple",
  lavender: "text-neon-lavender glow-lavender",
};

export default function GlowText({
  children,
  color = "pink",
  as = "span",
  className = "",
}: GlowTextProps) {
  return createElement(
    as,
    { className: `${glowClasses[color]} ${className}` },
    children
  );
}
