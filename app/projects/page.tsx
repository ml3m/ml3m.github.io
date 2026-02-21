import { Metadata } from "next";
import GlowText from "@/components/ui/GlowText";
import NeonCard from "@/components/ui/NeonCard";
import PixelButton from "@/components/ui/PixelButton";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Projects" };

interface Project {
  name: string;
  description: string;
  tags: string[];
  href?: string;
  github?: string;
}

const projects: Project[] = [
  {
    name: "mlem.vi",
    description:
      "this website. a retro-cyber neon personal site built with next.js and tailwind.",
    tags: ["next.js", "tailwind", "typescript"],
    github: "https://github.com/ml3m/ml3m.github.io",
  },
  {
    name: "Whitted-style RayTracer",
    description:
      "an implementation in C++ of a Whitted-style ray tracer inspired by Dr Peter Shirley's works.",
    tags: ["c++", "graphics", "ray tracing"],
    github: "https://github.com/ml3m/Whitted-style-RayTracer",
  },
  {
    name: "Genomic Data Processing",
    description:
      "analyzes genomic data in FASTA format, calculates GC content per sequence, and computes overall GC content. built for sequence alignment, variant calling, and genome assembly.",
    tags: ["c++", "bioinformatics", "genomics"],
    github:
      "https://github.com/ml3m/Genomic-Data-Processing-and-Analysis-Algorithms-for-DNA-Sequences",
  },
  {
    name: "Smart Railway Network Simulation",
    description:
      "a multi-agent railway network simulation built with MESA, modeling intelligent trains, dynamic signaling, centralized dispatching, passenger behavior, and real-time analytics.",
    tags: ["python", "mesa", "multi-agent", "simulation"],
    github: "https://github.com/ml3m/smart-railway-network-simulation",
  },
  {
    name: "ETH-Sui Bridge",
    description:
      "bridge for transferring IBTs between Ethereum and Sui using burn/mint mechanics.",
    tags: ["javascript", "blockchain", "ethereum", "sui"],
    github: "https://github.com/ml3m/eth-sui-bridge",
  },
  {
    name: "MlemHouse",
    description:
      "real-time IoT dashboard for smart home simulation. monitor smart bulbs, thermostats, cameras & water meters with live WebSocket updates.",
    tags: ["python", "fastapi", "iot", "websocket"],
    github: "https://github.com/ml3m/MlemHouse",
  },
  {
    name: "PINN Differential Equations",
    description:
      "physics-informed neural networks for solving ordinary and partial differential equations with automatic differentiation and comparative studies.",
    tags: ["python", "pytorch", "physics", "neural networks"],
    github: "https://github.com/ml3m/PINN_DE_playground",
  },
  {
    name: "TuneType",
    description:
      "music genre classification system that leverages machine learning and audio signal processing to identify the genre of any music track.",
    tags: ["python", "ml", "audio", "classification"],
    github: "https://github.com/ml3m/TuneType",
  },
  {
    name: "Cryptography Algorithms Exploration",
    description:
      "implementations of various cryptographic algorithms, including symmetric and asymmetric encryption, hashing, and key exchange techniques.",
    tags: ["rust", "cryptography", "security"],
    github: "https://github.com/ml3m/cryptography-algorithms-exploration",
  },
  {
    name: "SHA256 in x86-64 Assembly",
    description:
      "implementation of the SHA256 hashing algorithm in x86-64 assembly language using NASM syntax.",
    tags: ["assembly", "x86-64", "cryptography"],
    github: "https://github.com/ml3m/SHA256-ASM-X86-64",
  },
  {
    name: "QuickHull Convex Layers",
    description:
      "computation and animation of convex hull layers using a QuickHull-based algorithm with detailed visualization for 2D point sets.",
    tags: ["python", "computational geometry", "visualization"],
    github: "https://github.com/ml3m/QuickHull_Convex_Layers_Study",
  },
  {
    name: "Huffman Encoding Study",
    description:
      "benchmark for comparing data compression algorithms including Huffman encoding, Burrows-Wheeler transform, and Run-Length encoding.",
    tags: ["go", "compression", "benchmarking"],
    github: "https://github.com/ml3m/huffman_encoding_study",
  },
  {
    name: "Huffman Encoding Visualizer",
    description:
      "a Huffman encoding visualizer in Go with tree drawing, great for learning about data compression techniques.",
    tags: ["go", "visualization", "compression"],
    github: "https://github.com/ml3m/Huffman-encoding-visualizer",
  },
  {
    name: "Map of Computer Science",
    description:
      "a comprehensive computer science knowledge map built in Obsidian, covering core CS topics and their connections.",
    tags: ["obsidian", "knowledge base", "cs"],
    github: "https://github.com/ml3m/Map_Of_Computer_Science",
  },
  {
    name: "Legacy of Brok",
    description:
      "a game crafted entirely in Pygame. an exercise in game development, Python, and object-oriented programming.",
    tags: ["python", "pygame", "game dev"],
    github: "https://github.com/ml3m/Legacy_of_Brok",
  },
  {
    name: "DutchBuddy",
    description:
      "beginner-friendly Android app for learning Dutch vocabulary with flashcards and quizzes.",
    tags: ["java", "android", "language learning"],
    github: "https://github.com/ml3m/DutchBuddy",
  },
  {
    name: "mlemfetch",
    description:
      "a colorful terminal system info tool. because sometimes the best projects come from moments of creative boredom.",
    tags: ["shell", "terminal", "neofetch"],
    github: "https://github.com/ml3m/mlemfetch",
  },
  {
    name: "Sorting Visualizer",
    description:
      "sorting algorithm visualizer built with Pygame for watching algorithms do their thing in real time.",
    tags: ["python", "pygame", "algorithms", "visualization"],
    github: "https://github.com/ml3m/sorting_visualizer",
  },
  {
    name: "WanderPath",
    description:
      "a travel management app for iOS because I couldn't find a good one, so I built my own.",
    tags: ["swift", "ios", "travel"],
    github: "https://github.com/ml3m/WanderPath",
  },
  {
    name: "Comp Arch CTF",
    description:
      "capture-the-flag inspired challenges from the computer architecture course. binary exploration and low-level systems.",
    tags: ["python", "ctf", "assembly", "security"],
    github: "https://github.com/ml3m/comp_arch_ctf_like",
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-[680px] mx-auto px-4 py-6 space-y-4">
      <GlowText
        as="h1"
        color="pink"
        className="text-xl font-bold text-center"
      >
        Projects
      </GlowText>
      <p className="text-text-secondary text-center text-[0.85rem]">
        things i&apos;ve built, am building, or have abandoned
      </p>

      <div className="space-y-4">
        {projects.map((project) => (
          <NeonCard key={project.name}>
            <h2 className="text-neon-lavender font-bold text-[0.95rem] mb-1">
              {project.name}
            </h2>
            <p className="text-text-secondary text-[0.85rem] mb-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.7rem] text-neon-purple border border-neon-purple/30 rounded-sm px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              {project.github && (
                <PixelButton
                  href={project.github}
                  external
                  variant="secondary"
                >
                  GitHub
                </PixelButton>
              )}
              {project.href && (
                <PixelButton href={project.href} external>
                  <ExternalLink size={14} />
                  Live
                </PixelButton>
              )}
            </div>
          </NeonCard>
        ))}
      </div>
    </div>
  );
}
