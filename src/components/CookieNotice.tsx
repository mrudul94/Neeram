"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { buttonClass } from "./ui";

const KEY = "neeram-notice-ok";
const listeners = new Set<() => void>();

const isDismissed = () => {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return false; // Storage is blocked: show it for this page view.
  }
};

const dismiss = () => {
  try {
    localStorage.setItem(KEY, "1");
  } catch {}
  listeners.forEach((l) => l());
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
};

/**
 * One-time notice: the site only uses what it needs to work, so there is nothing to accept
 * or reject. If analytics or ads are ever added, this must become a real consent banner.
 * On the home page on phones it waits for the first scroll, so it never covers the bottle
 * on the first screen.
 */
export function CookieNotice() {
  // The server snapshot counts as dismissed, so server and first client render match.
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(true);
    window.addEventListener("scroll", onScroll, { once: true, passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  // Hidden with CSS rather than JS, so the width check can't disagree with the layout.
  const waiting = pathname === "/" && !scrolled;

  return (
    <aside aria-label="Cookie notice" className={`cookie-notice fixed inset-x-0 bottom-0 z-30 border-t border-ink bg-sand text-ink ${waiting ? "max-md:hidden" : ""}`}>
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <p className="text-[0.8125rem] leading-snug">
          We only use what this site needs to work, like remembering your cart. No ads or tracking.{" "}
          <Link href="/privacy#browser-storage" className="tap underline underline-offset-2 hover:text-orange-text">
            Privacy policy
          </Link>
        </p>
        <button type="button" onClick={dismiss} className={buttonClass("ink", "h-11 shrink-0 px-5")}>
          OK
        </button>
      </div>
    </aside>
  );
}
