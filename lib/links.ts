import { Github, Mail, Coffee, MessageCircle, Globe } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface SocialLink {
  label: string;
  href: string;
  badgeColor: string;
  icon?: LucideIcon;
}

export const socialLinks: SocialLink[] = [
  // TODO: replace with your real links
  { label: "GitHub", href: "https://github.com/TODO-your-username", badgeColor: "#24292e", icon: Github },
  { label: "Email", href: "mailto:TODO@example.com", badgeColor: "#4a4a8a", icon: Mail },
  { label: "Ko-Fi", href: "https://ko-fi.com/TODO", badgeColor: "#ff5e5b", icon: Coffee },
  { label: "Discord", href: "https://discord.gg/TODO", badgeColor: "#5865f2", icon: MessageCircle },
  { label: "Website", href: "https://mlem.vi", badgeColor: "#7b35cc", icon: Globe },
];

export const linkTable = [
  // TODO: replace with your real links
  { label: "GitHub", href: "https://github.com/TODO-your-username" },
  { label: "Email", href: "mailto:TODO@example.com" },
  { label: "Ko-Fi", href: "https://ko-fi.com/TODO" },
  { label: "Discord", href: "https://discord.gg/TODO" },
  { label: "LinkedIn", href: "https://linkedin.com/in/TODO" },
];
