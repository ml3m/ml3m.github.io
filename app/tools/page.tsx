import { Metadata } from "next";
import { tools } from "@/lib/tools";
import ToolCard from "@/components/tools/ToolCard";
import GlowText from "@/components/ui/GlowText";

export const metadata: Metadata = {
  title: "Tools",
};

export default function ToolsPage() {
  return (
    <div className="max-w-[500px] mx-auto px-4 py-6">
      <div className="neon-card rounded-sm p-6 flex flex-col items-center gap-3">
        <GlowText as="h1" color="pink" className="text-xl font-bold">
          Tools
        </GlowText>
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            title={tool.title}
            description={tool.description}
            href={`/tools/${tool.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
