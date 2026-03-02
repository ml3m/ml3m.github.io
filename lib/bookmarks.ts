export interface Bookmark {
  title: string;
  description: string;
  href: string;
  tags: string[];
  category: string;
  type: "Tool" | "Repository" | "Website" | "Article";
  stats?: { label: string; value: string }[];
  accent?: "pink" | "purple" | "lavender" | "magenta";
}

export const bookmarks: Bookmark[] = [
  {
    title: "Next.js",
    description: "The React Framework for the Web. Enable React-based web applications with server-side rendering and generating static websites.",
    href: "https://nextjs.org/",
    tags: ["React", "Framework", "SSR"],
    category: "Frameworks",
    type: "Tool",
    stats: [
      { label: "Stars", value: "118k" },
      { label: "Forks", value: "25k" }
    ],
    accent: "pink"
  },
  {
    title: "Framer Motion",
    description: "An open source, production-ready motion library for React on the web.",
    href: "https://www.framer.com/motion/",
    tags: ["Animation", "React", "Library"],
    category: "Libraries",
    type: "Repository",
    stats: [
      { label: "Stars", value: "21k" },
      { label: "Downloads", value: "2M/wk" }
    ],
    accent: "purple"
  },
  {
    title: "D3.js",
    description: "Bring data to life with SVG, Canvas and HTML. D3 helps you bring data to life using HTML, SVG, and CSS.",
    href: "https://d3js.org/",
    tags: ["Data Viz", "JavaScript", "SVG"],
    category: "Libraries",
    type: "Tool",
    stats: [
      { label: "Stars", value: "107k" },
      { label: "Dependents", value: "1.4M" }
    ],
    accent: "lavender"
  },
  {
    title: "Godot Engine",
    description: "Multi-platform 2D and 3D game engine. Godot provides a huge set of common tools, so you can just focus on making your game.",
    href: "https://godotengine.org/",
    tags: ["Game Dev", "C++", "Open Source"],
    category: "Tools",
    type: "Tool",
    stats: [
      { label: "Stars", value: "76k" }
    ],
    accent: "magenta"
  },
  {
    title: "Awwwards",
    description: "The awards that recognize the talent and effort of the best web designers, developers and agencies in the world.",
    href: "https://www.awwwards.com/",
    tags: ["Inspiration", "Design", "CSS"],
    category: "Inspiration",
    type: "Website",
    accent: "pink"
  }
];
