import { Github, Mail, MessageCircle, Gamepad2, Twitter, type LucideIcon } from "lucide-react";
import NeonBadge from "@/components/ui/NeonBadge";
import { socialLinks } from "@/lib/links";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  GitHub: Github,
  Email: Mail,
  Twitter: Twitter,
  Discord: MessageCircle,
  Steam: Gamepad2,
};

export default function BadgesSection() {
  return (
    <div className="space-y-3">
      <p className="text-center text-text-secondary">
        links as badges so it looks cooler
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        {socialLinks.map((link) => (
          <NeonBadge
            key={link.label}
            label={link.label}
            href={link.href}
            bgColor={link.badgeColor}
            icon={SOCIAL_ICONS[link.label]}
          />
        ))}
      </div>
    </div>
  );
}
