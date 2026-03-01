import { Metadata } from "next";
import GlowText from "@/components/ui/GlowText";
import BentoCard, { BentoProject } from "@/components/ui/BentoCard";

export const metadata: Metadata = { title: "Projects" };

const projects: BentoProject[] = [
  // ── Rows 1-2: hero(8×2) | tall(4×2) ─────────────────────────────────────
  {
    name: "mlem.vi",
    description:
      "this website. a retro-cyber neon personal site built with next.js and tailwind. the canvas where everything else lives.",
    tags: ["next.js", "tailwind", "typescript"],
    github: "https://github.com/ml3m/ml3m.github.io",
    variant: "hero",
    accent: "pink",
    stat: "v2.0",
    statLabel: "current build",
  },
  {
    name: "Whitted-style RayTracer",
    description:
      "C++ implementation of a Whitted-style ray tracer, inspired by Dr Peter Shirley's works. Reflections, refractions, shadows.",
    tags: ["c++", "graphics", "ray tracing"],
    github: "https://github.com/ml3m/Whitted-style-RayTracer",
    variant: "tall",
    accent: "purple",
    stat: "∞",
    statLabel: "ray depth",
  },

  // ── Rows 3-6: square-sm(4×4) | hero(8×2) + hero(8×2) ────────────────────
  {
    name: "mlemfetch",
    description:
      "colorful terminal system info tool — neofetch-inspired, with a rainbow ASCII cat animation.",
    tags: ["shell", "terminal", "neofetch"],
    github: "https://github.com/ml3m/mlemfetch",
    variant: "square-sm",
    accent: "lavender",
    stat: "$ mlemfetch",
    statLabel: "run it",
    special: "mlemfetch-cat",
  },
  {
    name: "PINN Framework",
    description:
      "physics-informed neural networks for solving differential equations by embedding governing physical laws directly into the loss function.",
    tags: ["python", "pytorch", "physics", "neural networks"],
    github_private: "https://github.com/ml3m/pinn",
    variant: "hero",
    accent: "magenta",
    stat: "PINN Framework",
    statLabel: "Bachelor Thesis",
    special: "lorenz-attractor",
  },
  {
    name: "QuickHull Convex Layers",
    description:
      "computation and animation of convex hull layers using a QuickHull-based algorithm. left: Fortune's sweep-line algorithm building a Voronoi diagram in real time.",
    tags: ["python", "computational geometry", "visualization"],
    github: "https://github.com/ml3m/QuickHull_Convex_Layers_Study",
    variant: "hero",
    accent: "lavender",
    special: "fortune-voronoi",
  },

  // ── Rows 7-11: square-md(6×5) | square-md(6×5) ───────────────────────────
  {
    name: "TuneType",
    description:
      "music genre classification system using ML and audio signal processing to identify the genre of any track from raw audio.",
    tags: ["python", "ml", "audio", "classification"],
    github: "https://github.com/ml3m/TuneType",
    variant: "square-md",
    accent: "pink",
    stat: "~92%",
    statLabel: "accuracy",
  },
  {
    name: "Smart Railway Network Simulation",
    description:
      "multi-agent railway network simulation built with MESA — intelligent trains, dynamic signaling, centralized dispatching, passenger behavior, and real-time analytics.",
    tags: ["python", "mesa", "multi-agent", "simulation"],
    github: "https://github.com/ml3m/smart-railway-network-simulation",
    variant: "square-md",
    accent: "purple",
    stat: "20+ agents",
    statLabel: "concurrent",
  },

  // ── Row 12: small(4) × 3 ─────────────────────────────────────────────────
  {
    name: "ETH-Sui Bridge",
    description:
      "bridge for transferring IBTs between Ethereum and Sui using burn/mint mechanics.",
    tags: ["javascript", "blockchain", "ethereum"],
    github: "https://github.com/ml3m/eth-sui-bridge",
    variant: "small",
    accent: "purple",
  },
  {
    name: "MlemHouse",
    description:
      "real-time IoT dashboard. smart bulbs, thermostats, cameras via WebSocket.",
    tags: ["python", "fastapi", "iot"],
    github: "https://github.com/ml3m/MlemHouse",
    variant: "small",
    accent: "pink",
  },
  {
    name: "PINN Diff. Equations",
    description:
      "physics-informed neural networks for solving ODEs and PDEs.",
    tags: ["python", "pytorch", "physics"],
    github: "https://github.com/ml3m/PINN_DE_playground",
    variant: "small",
    accent: "lavender",
  },

  // ── Rows 13-14: tall(4×2) | hero(8×2) ────────────────────────────────────
  {
    name: "Huffman Encoding Study",
    description:
      "benchmark comparing Huffman, Burrows-Wheeler, and Run-Length encoding in Go.",
    tags: ["go", "compression", "benchmarking"],
    github: "https://github.com/ml3m/huffman_encoding_study",
    variant: "tall",
    accent: "magenta",
  },
  {
    name: "Genomic Data Processing",
    description:
      "analyzes FASTA genomic data — GC content, Needleman-Wunsch sequence alignment, variant calling. right: live alignment view.",
    tags: ["c++", "bioinformatics", "genomics"],
    github:
      "https://github.com/ml3m/Genomic-Data-Processing-and-Analysis-Algorithms-for-DNA-Sequences",
    variant: "hero",
    accent: "lavender",
    special: "dna-alignment",
  },

  // ── Row 15: small(4) × 3 ─────────────────────────────────────────────────
  {
    name: "SHA256 in ASM",
    description: "SHA256 hashing in x86-64 assembly using NASM syntax.",
    tags: ["assembly", "x86-64", "crypto"],
    github: "https://github.com/ml3m/SHA256-ASM-X86-64",
    variant: "small",
    accent: "purple",
  },
  {
    name: "Huffman Visualizer",
    description: "Huffman encoding visualizer in Go with tree drawing.",
    tags: ["go", "visualization"],
    github: "https://github.com/ml3m/Huffman-encoding-visualizer",
    variant: "small",
    accent: "pink",
  },
  {
    name: "Map of Computer Science",
    description: "a comprehensive CS knowledge map built in Obsidian.",
    tags: ["obsidian", "knowledge", "cs"],
    github: "https://github.com/ml3m/Map_Of_Computer_Science",
    variant: "small",
    accent: "lavender",
  },

  // ── Row 16: small(4) | wide(8×1) ─────────────────────────────────────────
  {
    name: "Legacy of Brok",
    description: "a full game built in Pygame. OOP & game dev exercise.",
    tags: ["python", "pygame", "game dev"],
    github: "https://github.com/ml3m/Legacy_of_Brok",
    variant: "small",
    accent: "magenta",
  },
  {
    name: "Comp Arch CTF",
    description:
      "capture-the-flag inspired challenges from computer architecture course. binary exploration and low-level systems programming.",
    tags: ["python", "ctf", "assembly", "security"],
    github: "https://github.com/ml3m/comp_arch_ctf_like",
    variant: "wide",
    accent: "pink",
  },

  // ── Row 17: small(4) × 3 ─────────────────────────────────────────────────
  {
    name: "DutchBuddy",
    description: "Android app for learning Dutch vocabulary via flashcards.",
    tags: ["java", "android", "language"],
    github: "https://github.com/ml3m/DutchBuddy",
    variant: "small",
    accent: "purple",
  },
  {
    name: "WanderPath",
    description: "travel management iOS app — built it because I needed one.",
    tags: ["swift", "ios", "travel"],
    github: "https://github.com/ml3m/WanderPath",
    variant: "small",
    accent: "lavender",
  },
  {
    name: "Sorting Visualizer",
    description: "sorting algorithm visualizer with Pygame.",
    tags: ["python", "pygame", "algorithms"],
    github: "https://github.com/ml3m/sorting_visualizer",
    variant: "small",
    accent: "pink",
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <GlowText as="h1" color="pink" className="text-xl font-bold">
          Projects
        </GlowText>
        <p className="text-text-secondary text-[0.85rem] mt-1">
          things i&apos;ve built, am building, or have abandoned
        </p>
      </div>

      {/*
        Bento grid — 12-column, auto rows of min 70px.
        Every row of projects sums to exactly 12 columns → no gaps, solid rectangle.
        Variants: hero(8×2), tall(4×2), wide(8×1), small(4×1),
                  square-sm(4×4), square-md(6×5)
      */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(12, 1fr)",
          gridAutoRows: "minmax(70px, auto)",
        }}
      >
        {projects.map((project) => (
          <BentoCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
