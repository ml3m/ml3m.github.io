"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function RedirectInner() {
  const params = useSearchParams();
  const [warningUrl, setWarningUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = params.get("url");
    if (url) {
      try {
        const parsedUrl = new URL(url, window.location.origin);
        if (
          parsedUrl.hostname === window.location.hostname ||
          parsedUrl.hostname === "ml3m.github.io"
        ) {
          window.location.replace(url);
        } else {
          setWarningUrl(url);
        }
      } catch {
        // ignore invalid URL
      }
    }
  }, [params]);

  if (warningUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-text-secondary">You are being redirected to</p>
        <p className="text-neon-pink font-bold break-all max-w-[80%] text-center">
          {warningUrl}
        </p>
        <a
          href={warningUrl}
          className="neon-input text-neon-lavender hover:border-border-glow"
        >
          Click to continue
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-text-muted animate-pulse">redirecting...</p>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-text-muted animate-pulse">redirecting...</p>
        </div>
      }
    >
      <RedirectInner />
    </Suspense>
  );
}
