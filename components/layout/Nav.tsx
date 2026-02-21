"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Tools", href: "/tools" },
  { title: "Projects", href: "/projects" },
  { title: "Hastebin", href: "https://hastebin.com", external: true },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="text-center my-2 text-[0.85rem]">
      {navLinks.map((link, i) => (
        <span key={link.href}>
          {link.external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-lavender hover:text-neon-pink hover:glow-pink transition-all"
            >
              {link.title}
            </a>
          ) : (
            <Link
              href={link.href}
              className={`transition-all ${
                pathname === link.href
                  ? "text-neon-pink glow-pink"
                  : "text-neon-lavender hover:text-neon-pink hover:glow-pink"
              }`}
            >
              {link.title}
            </Link>
          )}
          {i < navLinks.length - 1 && (
            <span className="text-text-muted mx-2">|</span>
          )}
        </span>
      ))}
    </nav>
  );
}
