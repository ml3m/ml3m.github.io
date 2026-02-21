import { LucideIcon } from "lucide-react";

interface NeonBadgeProps {
  label: string;
  href: string;
  bgColor: string;
  icon?: LucideIcon;
}

export default function NeonBadge({
  label,
  href,
  bgColor,
  icon: Icon,
}: NeonBadgeProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[0.75rem] font-bold no-underline uppercase tracking-wider transition-all hover:brightness-125 hover:scale-105"
      style={{
        backgroundColor: bgColor,
        boxShadow: `0 0 8px ${bgColor}44`,
      }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </a>
  );
}
