import { BookOpen, LucideIcon } from "lucide-react";

export interface SocialLink {
  label: string;
  href: string;
  badgeColor: string;
  icon?: LucideIcon;
}

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/ml3m", badgeColor: "#24292e" },
  { label: "Email", href: "mailto:ml3ml3m@proton.me", badgeColor: "#6d4aff" },
  { label: "Twitter", href: "https://x.com/ml3ml3m", badgeColor: "#000000" },
  { label: "Discord", href: "#", badgeColor: "#5865f2" },
  { label: "Steam", href: "https://steamcommunity.com/id/ml3ml3m/", badgeColor: "#1b2838" },
  { label: "ORCID", href: "https://orcid.org/0009-0007-7033-1832", badgeColor: "#A6CE39", icon: BookOpen },
];

export const linkTable = [
  { label: "GitHub", href: "https://github.com/ml3m" },
  { label: "GitLab", href: "https://gitlab.com/ml3ml3m" },
  { label: "Email", href: "mailto:ml3ml3m@proton.me" },
  { label: "Twitter", href: "https://twitter.com/ml3ml3m" },
  { label: "Mastodon", href: "https://mastodon.social/@ml3m" },
  { label: "Bluesky", href: "https://bsky.app/profile/ml3ml3m.bsky.social" },
  { label: "Matrix", href: "https://matrix.to/#/@ml3mml3mml3m:matrix.org" },
  { label: "Steam", href: "https://steamcommunity.com/id/ml3ml3m/" },
  { label: "Discord", href: "@m13w" },
  { label: "ORCID", href: "https://orcid.org/0009-0007-7033-1832" },
];
