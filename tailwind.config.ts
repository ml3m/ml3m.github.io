import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'Space Mono'", "monospace"],
      },
      colors: {
        "bg-primary": "#100c1a",
        "bg-secondary": "#16102a",
        "bg-card": "#1a1230",
        "border-default": "#3d2060",
        "border-glow": "#7b35cc",
        "neon-pink": "#ff4da6",
        "neon-purple": "#cc44ff",
        "neon-magenta": "#ff00cc",
        "neon-lavender": "#c77dff",
        "text-primary": "#e8d5ff",
        "text-secondary": "#b08acc",
        "text-muted": "#7a5f99",
        "link-color": "#d966ff",
        "link-hover": "#ff4da6",
      },
    },
  },
  plugins: [],
};
export default config;
