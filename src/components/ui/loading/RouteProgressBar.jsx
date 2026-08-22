"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When path or query changes, trigger a brief micro-transition bar
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent overflow-hidden pointer-events-none">
      <div className="h-full w-full bg-gradient-to-r from-[#5B60F6] via-[#A855F7] to-[#EC4899] shadow-[0_0_12px_rgba(168,85,247,0.8)] animate-pulse" />
    </div>
  );
}

export default function RouteProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressIndicator />
    </Suspense>
  );
}
