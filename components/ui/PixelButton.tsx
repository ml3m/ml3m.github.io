import Link from "next/link";

interface PixelButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
}

export default function PixelButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  external = false,
}: PixelButtonProps) {
  const base =
    "inline-flex items-center gap-2 px-4 py-2 font-mono text-[0.8rem] border rounded-sm transition-all cursor-pointer no-underline";
  const variants = {
    primary:
      "border-neon-purple text-neon-purple hover:bg-neon-purple/10 hover:shadow-[0_0_12px_#cc44ff44]",
    secondary:
      "border-border-default text-text-secondary hover:border-border-glow hover:text-text-primary hover:shadow-[0_0_12px_#7b35cc44]",
  };

  const cls = `${base} ${variants[variant]} ${className}`;

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
