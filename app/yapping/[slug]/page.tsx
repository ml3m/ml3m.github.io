import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import GlowText from "@/components/ui/GlowText";
import NeonCard from "@/components/ui/NeonCard";
import { posts, getPost } from "@/lib/yapping";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug);
  return { title: post?.title ?? "Post Not Found" };
}

export default function YappingPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) return notFound();

  return (
    <div className="max-w-[680px] mx-auto px-4 py-6 space-y-4">
      <Link
        href="/yapping"
        className="text-text-muted text-[0.8rem] hover:text-neon-lavender transition-colors"
      >
        &larr; back to yapping
      </Link>

      <GlowText as="h1" color="pink" className="text-xl font-bold">
        {post.title}
      </GlowText>
      <p className="text-text-muted text-[0.8rem]">{post.date}</p>

      <NeonCard>
        <div className="prose-neon space-y-4 text-[0.85rem] leading-relaxed text-text-secondary">
          {post.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("- ")) {
              const items = paragraph.split("\n").filter((l) => l.startsWith("- "));
              return (
                <ul key={i} className="list-disc list-inside space-y-1">
                  {items.map((item, j) => {
                    const text = item.replace(/^- /, "");
                    const parts = text.split(/(\*\*[^*]+\*\*)/g);
                    return (
                      <li key={j}>
                        {parts.map((part, k) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={k} className="text-neon-lavender">
                              {part.slice(2, -2)}
                            </strong>
                          ) : (
                            <span key={k}>{part}</span>
                          )
                        )}
                      </li>
                    );
                  })}
                </ul>
              );
            }
            const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i}>
                {parts.map((part, k) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={k} className="text-neon-lavender">
                      {part.slice(2, -2)}
                    </strong>
                  ) : (
                    <span key={k}>{part}</span>
                  )
                )}
              </p>
            );
          })}
        </div>
      </NeonCard>
    </div>
  );
}
