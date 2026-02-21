import { Metadata } from "next";
import dynamic from "next/dynamic";
import GlowText from "@/components/ui/GlowText";
import { nodes, edges, GROUP_COLORS, GROUP_LABELS, type NodeGroup } from "@/lib/garden";

const ForceGraph = dynamic(
  () => import("@/components/garden/ForceGraph"),
  { ssr: false }
);

export const metadata: Metadata = { title: "Garden" };

const statusLegend = [
  { label: "seedling", size: 4 },
  { label: "sprout", size: 6 },
  { label: "evergreen", size: 9 },
];

export default function GardenPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-6 space-y-4">
      <GlowText as="h1" color="pink" className="text-xl font-bold text-center">
        Garden
      </GlowText>
      <p className="text-text-secondary text-center text-[0.85rem]">
        a map of things i know, am learning, or want to explore. nodes grow as i
        learn more.
      </p>

      <ForceGraph nodes={nodes} edges={edges} />

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[0.7rem] pt-2">
        <div className="flex items-center gap-3">
          <span className="text-text-muted">growth:</span>
          {statusLegend.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <svg width={s.size * 2 + 4} height={s.size * 2 + 4}>
                <circle
                  cx={s.size + 2}
                  cy={s.size + 2}
                  r={s.size}
                  fill="var(--neon-lavender)"
                  fillOpacity={0.7}
                />
              </svg>
              <span className="text-text-secondary">{s.label}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-text-muted">topics:</span>
          {(Object.entries(GROUP_COLORS) as [NodeGroup, string][]).map(
            ([group, color]) => (
              <span key={group} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-text-secondary">{GROUP_LABELS[group]}</span>
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
