import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import GlowText from "@/components/ui/GlowText";
import PostContent from "./PostContent";
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

      <PostContent post={post} />
    </div>
  );
}
