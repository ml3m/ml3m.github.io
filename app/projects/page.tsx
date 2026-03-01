import { Metadata } from "next";
import GlowText from "@/components/ui/GlowText";
import BentoCard, { BentoProject } from "@/components/ui/BentoCard";

export const metadata: Metadata = { title: "Projects" };

const projects: BentoProject[] = [
  // ── Row 1-2: hero(8×2) | tall(4×2) ──────────────────────────────────────
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

  // ── Row 3: wide(8×1) | small(4×1) ────────────────────────────────────────
  {
    name: "Genomic Data Processing",
    description:
      "analyzes FASTA genomic data, calculates GC content per sequence, built for alignment, variant calling & genome assembly.",
    tags: ["c++", "bioinformatics", "genomics"],
    github:
      "https://github.com/ml3m/Genomic-Data-Processing-and-Analysis-Algorithms-for-DNA-Sequences",
    variant: "wide",
    accent: "lavender",
  },
  {
    name: "Smart Railway Sim",
    description:
      "multi-agent railway simulation with MESA — intelligent trains, signaling, dispatching.",
    tags: ["python", "mesa", "multi-agent"],
    github: "https://github.com/ml3m/smart-railway-network-simulation",
    variant: "small",
    accent: "magenta",
  },

  // ── Row 4: small(4×1) | small(4×1) | small(4×1) ──────────────────────────
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
      "real-time IoT dashboard. smart bulbs, thermostats, cameras & meters via WebSocket.",
    tags: ["python", "fastapi", "iot"],
    github: "https://github.com/ml3m/MlemHouse",
    variant: "small",
    accent: "pink",
  },
  {
    name: "PINN Diff. Equations",
    description:
      "physics-informed neural networks for solving ODEs and PDEs with auto-diff.",
    tags: ["python", "pytorch", "physics"],
    github: "https://github.com/ml3m/PINN_DE_playground",
    variant: "small",
    accent: "lavender",
  },

  // ── Row 5-6: tall(4×2) | hero(8×2) ───────────────────────────────────────
  {
    name: "TuneType",
    description:
      "music genre classification using ML and audio signal processing to identify the genre of any track.",
    tags: ["python", "ml", "audio"],
    github: "https://github.com/ml3m/TuneType",
    variant: "tall",
    accent: "pink",
    stat: "~92%",
    statLabel: "accuracy",
  },
  {
    name: "Cryptography Algorithms Exploration",
    description:
      "implementations of symmetric & asymmetric encryption, hashing, and key exchange techniques — all in Rust.",
    tags: ["rust", "cryptography", "security"],
    github: "https://github.com/ml3m/cryptography-algorithms-exploration",
    variant: "hero",
    accent: "magenta",
    stat: "AES·RSA·SHA",
    statLabel: "and more",
  },

  // ── Row 7: small(4×1) | wide(8×1) ────────────────────────────────────────
  {
    name: "SHA256 in ASM",
    description:
      "SHA256 hashing algorithm in x86-64 assembly using NASM syntax.",
    tags: ["assembly", "x86-64", "crypto"],
    github: "https://github.com/ml3m/SHA256-ASM-X86-64",
    variant: "small",
    accent: "purple",
  },
  {
    name: "QuickHull Convex Layers",
    description:
      "computation and animation of convex hull layers using a QuickHull-based algorithm with detailed 2D visualization.",
    tags: ["python", "computational geometry", "visualization"],
    github: "https://github.com/ml3m/QuickHull_Convex_Layers_Study",
    variant: "wide",
    accent: "lavender",
  },

  // ── Row 8: wide(8×1) | small(4×1) ────────────────────────────────────────
  {
    name: "Huffman Encoding Study",
    description:
      "benchmark comparing Huffman encoding, Burrows-Wheeler transform, and Run-Length encoding in Go.",
    tags: ["go", "compression", "benchmarking"],
    github: "https://github.com/ml3m/huffman_encoding_study",
    variant: "wide",
    accent: "pink",
  },
  {
    name: "Huffman Visualizer",
    description:
      "Huffman encoding visualizer in Go with tree drawing.",
    tags: ["go", "visualization"],
    github: "https://github.com/ml3m/Huffman-encoding-visualizer",
    variant: "small",
    accent: "magenta",
  },

  // ── Row 9: small | small | small ─────────────────────────────────────────
  {
    name: "Map of Computer Science",
    description:
      "a comprehensive CS knowledge map built in Obsidian.",
    tags: ["obsidian", "knowledge", "cs"],
    github: "https://github.com/ml3m/Map_Of_Computer_Science",
    variant: "small",
    accent: "purple",
  },
  {
    name: "Legacy of Brok",
    description:
      "a full game crafted in Pygame. OOP & game dev exercise.",
    tags: ["python", "pygame", "game dev"],
    github: "https://github.com/ml3m/Legacy_of_Brok",
    variant: "small",
    accent: "pink",
  },
  {
    name: "DutchBuddy",
    description:
      "Android app for learning Dutch vocabulary via flashcards & quizzes.",
    tags: ["java", "android", "language"],
    github: "https://github.com/ml3m/DutchBuddy",
    variant: "small",
    accent: "lavender",
  },

  // ── Row 10-11: hero(8×2) | tall(4×2) ────────────────────────────────────
  {
    name: "mlemfetch",
    description:
      "a colorful terminal system info tool — because the best projects come from creative boredom. neofetch-inspired, fully custom.",
    tags: ["shell", "terminal", "neofetch"],
    github: "https://github.com/ml3m/mlemfetch",
    variant: "hero",
    accent: "lavender",
    stat: "$ mlemfetch",
    statLabel: "run it",
    special: "mlemfetch-cat",
  },
  {
    name: "Sorting Visualizer",
    description:
      "sorting algorithm visualizer with Pygame — watch algorithms work in real time.",
    tags: ["python", "pygame", "algorithms"],
    github: "https://github.com/ml3m/sorting_visualizer",
    variant: "tall",
    accent: "purple",
    stat: "O(n²)",
    statLabel: "worst case",
  },

  // ── Row 12: small(4×1) | wide(8×1) ───────────────────────────────────────
  {
    name: "WanderPath",
    description:
      "travel management app for iOS — built it because I couldn't find a good one.",
    tags: ["swift", "ios", "travel"],
    github: "https://github.com/ml3m/WanderPath",
    variant: "small",
    accent: "magenta",
  },
  {
    name: "Comp Arch CTF",
    description:
      "capture-the-flag inspired challenges from the computer architecture course. binary exploration and low-level systems programming.",
    tags: ["python", "ctf", "assembly", "security"],
    github: "https://github.com/ml3m/comp_arch_ctf_like",
    variant: "wide",
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

      {/* Bento grid — always a solid rectangle, no gaps */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
      >
        {projects.map((project) => (
          <BentoCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
