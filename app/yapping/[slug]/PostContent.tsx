import Image from "next/image";
import NeonCard from "@/components/ui/NeonCard";
import type { YappingPost } from "@/lib/yapping";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function PostContent({ post }: { post: YappingPost }) {
  return (
    <NeonCard>
      <div className="space-y-3 text-[0.85rem] leading-relaxed text-text-secondary">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            img: (props) => (
              <figure className="my-3 relative z-0 hover:z-10 block">
                <Image
                  src={props.src || ""}
                  alt={props.alt || ""}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto rounded border border-border-glow/40 object-cover transition-transform duration-300 ease-in-out hover:scale-[1.5]"
                />
                {props.alt && (
                  <figcaption className="text-text-muted text-[0.73rem] text-center mt-1 italic">
                    {props.alt}
                  </figcaption>
                )}
              </figure>
            ),
            a: (props) => (
              <a
                href={props.href}
                className="text-neon-pink underline underline-offset-2 hover:text-neon-lavender transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {props.children}
              </a>
            ),
            h2: (props) => (
              <h2 className="text-neon-pink font-bold text-[0.95rem] mt-4 mb-0 tracking-wide">
                {props.children}
              </h2>
            ),
            hr: () => (
              <div className="border-t border-border-glow opacity-20 my-2" />
            ),
            strong: (props) => (
              <strong className="text-neon-lavender font-bold">
                {props.children}
              </strong>
            ),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            code: (props: any) => {
              const { className, children, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              if (!match) {
                return (
                  <code
                    className="text-neon-purple bg-bg-card px-1 py-0.5 rounded text-[0.8em]"
                    {...rest}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            },
            em: (props) => <em className="italic">{props.children}</em>,
            ul: (props) => (
              <ul className="list-disc list-inside space-y-1">
                {props.children}
              </ul>
            ),
            p: (props) => <p>{props.children}</p>,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </NeonCard>
  );
}
