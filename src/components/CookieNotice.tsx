"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { rectsOverlap } from "@/lib/rects";
import { Eyebrow, buttonClass } from "./ui";

const KEY = "neeram-notice-ok";
const SHOW_AFTER_MS = 1200;
const LEAVE_MS = 150;
/** The bottle's scrub keeps it moving after the scroll stops. */
const SETTLE_MS = 750;
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
 * It stays out of the way of anything marked data-keep-clear (the bottle, the checkout
 * button): it waits, or fades out, while its corner of the screen would cover one.
 */
export function CookieNotice() {
  // The server snapshot counts as dismissed, so server and first client render match.
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  const pathname = usePathname();
  const card = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [clear, setClear] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Waits a moment after the page loads, so it doesn't compete with the hero.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const start = () => {
      timer = setTimeout(() => setReady(true), SHOW_AFTER_MS);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, []);

  useEffect(() => {
    let settle: ReturnType<typeof setTimeout>;
    const check = () => {
      if (!card.current) return;
      const box = card.current.getBoundingClientRect();
      const blocked = [...document.querySelectorAll("[data-keep-clear]")].some((el) => rectsOverlap(box, el.getBoundingClientRect(), 16));
      setClear(!blocked);
    };
    const onMove = () => {
      check();
      clearTimeout(settle);
      settle = setTimeout(check, SETTLE_MS);
    };
    onMove();
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove);
    return () => {
      clearTimeout(settle);
      window.removeEventListener("scroll", onMove);
      window.removeEventListener("resize", onMove);
    };
  }, [dismissed, pathname, ready]);

  if (dismissed) return null;

  const close = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return dismiss();
    setLeaving(true);
    setTimeout(dismiss, LEAVE_MS);
  };
  const shown = ready && clear && !leaving;

  return (
    <aside
      ref={card}
      aria-label="Cookie notice"
      data-shown={shown || undefined}
      inert={!shown}
      className="cookie-notice fixed inset-x-4 bottom-4 z-30 flex gap-3 rounded-[6px] border border-gold/45 bg-ink p-4 text-cream shadow-[0_12px_32px_rgb(22_19_15/0.35)] md:inset-x-auto md:bottom-6 md:left-6 md:w-[22.5rem]"
    >
      <svg aria-hidden viewBox="0 0 24 32" className="mt-0.5 h-8 w-6 shrink-0">
        <defs>
          <linearGradient id="notice-oil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6db8c" />
            <stop offset="0.45" stopColor="#e4b04a" />
            <stop offset="1" stopColor="#a8701c" />
          </linearGradient>
        </defs>
        <path d="M12 1C12 1 2 13.5 2 20.5a10 10 0 0 0 20 0C22 13.5 12 1 12 1Z" fill="url(#notice-oil)" />
      </svg>
      <div className="min-w-0 flex-1">
        <Eyebrow className="text-[0.6875rem]">Good to know</Eyebrow>
        <p className="mt-2 font-sans text-sm leading-snug">We only remember what&rsquo;s in your cart. No ads, no tracking.</p>
        <div className="mt-3 flex items-center gap-5">
          <button type="button" onClick={close} className={buttonClass("orange", "h-11! shrink-0 px-5!")}>
            Got it
          </button>
          <Link href="/privacy#browser-storage" className="tap text-[0.8125rem] underline underline-offset-4 hover:text-orange">
            Privacy policy
          </Link>
        </div>
      </div>
    </aside>
  );
}
