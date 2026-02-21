import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
}

export default function ToolCard({ title, description, href }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="neon-card block rounded-sm p-4 text-center no-underline hover:-translate-y-0.5 w-full max-w-[320px]"
    >
      <h2 className="text-neon-lavender text-[0.95rem] font-bold m-0">
        {title}
      </h2>
      <p className="text-text-secondary text-[0.8rem] mt-1 mb-0">{description}</p>
    </Link>
  );
}
