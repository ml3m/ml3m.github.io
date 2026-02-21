import { Metadata } from "next";
import Link from "next/link";
import GlowText from "@/components/ui/GlowText";
import NeonCard from "@/components/ui/NeonCard";
import { posts } from "@/lib/yapping";

export const metadata: Metadata = { title: "Yapping" };

export default function YappingPage() {
  return (
    <div className="max-w-[680px] mx-auto px-4 py-6 space-y-4">
      <GlowText as="h1" color="pink" className="text-xl font-bold text-center">
        Yapping
      </GlowText>
      <p className="text-text-secondary text-center text-[0.85rem]">
        where i ramble about projects, tools, things i found on the internet,
        and whatever else is on my mind.
      </p>

      {posts.length === 0 ? (
        <p className="text-text-muted text-center text-[0.85rem]">
          nothing here yet. check back later.
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/yapping/${post.slug}`}
              className="block no-underline"
            >
              <NeonCard className="hover:border-border-glow transition-all">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-neon-lavender font-bold text-[0.95rem]">
                    {post.title}
                  </h2>
                  <span className="text-text-muted text-[0.75rem] whitespace-nowrap shrink-0">
                    {post.date}
                  </span>
                </div>
                <p className="text-text-secondary text-[0.85rem] mt-1">
                  {post.summary}
                </p>
              </NeonCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
