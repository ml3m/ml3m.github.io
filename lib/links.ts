import { Github, Mail, MessageCircle, Gamepad2, Twitter } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface SocialLink {
  label: string;
  href: string;
  badgeColor: string;
  icon?: LucideIcon;
}

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/ml3m", badgeColor: "#24292e", icon: Github },
  { label: "Email", href: "mailto:ml3ml3m@proton.me", badgeColor: "#6d4aff", icon: Mail },
  { label: "Twitter", href: "https://x.com/ml3ml3m", badgeColor: "#000000", icon: Twitter },
  { label: "Discord", href: "#", badgeColor: "#5865f2", icon: MessageCircle },
  { label: "Steam", href: "https://steamcommunity.com/id/ml3ml3m/", badgeColor: "#1b2838", icon: Gamepad2 },
];

export const linkTable = [
  { label: "GitHub", href: "https://github.com/ml3m" },
  { label: "GitLab", href: "https://gitlab.com/ml3ml3m" },
  { label: "Email", href: "mailto:ml3ml3m@proton.me" },
  { label: "Twitter", href: "https://x.com/ml3ml3m" },
  { label: "Mastodon", href: "https://mastodon.social/@ml3m" },
  { label: "Bluesky", href: "https://bsky.app/profile/ml3ml3m.bsky.social" },
  { label: "Matrix", href: "https://matrix.to/#/@ml3mml3mml3m:matrix.org" },
  { label: "Steam", href: "https://steamcommunity.com/id/ml3ml3m/" },
  { label: "Discord", href: "@m13w" },
];
