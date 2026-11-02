"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders its children only as they come near the screen. Native lazy loading starts far too
 * early on slow connections, so off-screen images would compete with the first screen's. The
 * parent must reserve the space, so nothing moves when they appear.
 */
export function NearView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        setNear(true);
      },
      { rootMargin: "600px" },
    );
    seen.observe(ref.current!);
    return () => seen.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {near && children}
    </div>
  );
}
