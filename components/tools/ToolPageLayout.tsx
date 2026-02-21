import Link from "next/link";
import GlowText from "@/components/ui/GlowText";
import NeonCard from "@/components/ui/NeonCard";

interface ToolPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function ToolPageLayout({
  title,
  description,
  children,
}: ToolPageLayoutProps) {
  return (
    <div className="max-w-[680px] mx-auto px-4 py-6 space-y-4">
      <Link
        href="/tools"
        className="text-text-muted text-[0.85rem] hover:text-neon-lavender"
      >
        &larr; Tools
      </Link>

      <GlowText as="h1" color="pink" className="text-xl font-bold">
        {title}
      </GlowText>

      {description && (
        <p className="text-text-secondary text-[0.85rem]">{description}</p>
      )}

      <NeonCard className="w-full">{children}</NeonCard>
    </div>
  );
}
