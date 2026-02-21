"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RedirectInner() {
  const params = useSearchParams();

  useEffect(() => {
    const url = params.get("url");
    if (url) {
      window.location.replace(url);
    }
  }, [params]);

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
