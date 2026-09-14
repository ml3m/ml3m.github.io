"use client";

import { usePathname } from "next/navigation";

/**
 * CRT scanline overlay. Disabled on /gallery so photos display cleanly.
 */
export default function Scanlines() {
  const pathname = usePathname();
  const isGallery = pathname === "/gallery";

  if (isGallery) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        background:
          "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.1) 50%)",
        backgroundSize: "100% 4px",
      }}
    />
  );
}
