import NeonCard from "@/components/ui/NeonCard";
import type { YappingPost } from "@/lib/yapping";

function renderInline(text: string, keyPrefix: string): React.ReactNode {
  const parts = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g
  );
  return parts.map((part, k) => {
    const pid = `${keyPrefix}-${k}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={pid} className="text-neon-lavender font-bold">
          {renderInline(part.slice(2, -2), pid)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={pid}
          href={linkMatch[2]}
          className="text-neon-pink underline underline-offset-2 hover:text-neon-lavender transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkMatch[1]}
        </a>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      return (
        <em key={pid} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={pid}
          className="text-neon-purple bg-bg-card px-1 py-0.5 rounded text-[0.8em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={pid}>{part}</span>;
  });
}

function renderContent(content: string): React.ReactNode[] {
  return content.split("\n\n").map((para, i) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="text-neon-pink font-bold text-[0.95rem] mt-4 mb-0 tracking-wide"
        >
          {trimmed.slice(3)}
        </h2>
      );
    }

    if (trimmed === "---") {
      return (
        <div key={i} className="border-t border-border-glow opacity-20 my-2" />
      );
    }

    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      return (
        <figure key={i} className="my-3 relative z-0 hover:z-10">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1]}
            className="w-full rounded border border-border-glow/40 object-cover transition-transform duration-300 ease-in-out hover:scale-[1.5]"
          />
          {imgMatch[1] && (
            <figcaption className="text-text-muted text-[0.73rem] text-center mt-1 italic">
              {imgMatch[1]}
            </figcaption>
          )}
        </figure>
      );
    }

    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="list-disc list-inside space-y-1">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item.replace(/^- /, ""), `${i}-${j}`)}</li>
          ))}
        </ul>
      );
    }

    return <p key={i}>{renderInline(trimmed, `${i}`)}</p>;
  });
}

export default function PostContent({ post }: { post: YappingPost }) {
  return (
    <NeonCard>
      <div className="space-y-3 text-[0.85rem] leading-relaxed text-text-secondary">
        {renderContent(post.content)}
      </div>
    </NeonCard>
  );
}
