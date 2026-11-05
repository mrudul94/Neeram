"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { rectsOverlap } from "@/lib/rects";
import { buttonClass } from "./ui";

const KEY = "neeram-notice-ok";
const SHOW_AFTER_MS = 1200;
const LEAVE_MS = 150;
/** The bottle's scrub keeps it moving after the scroll stops. */
const SETTLE_MS = 750;
const listeners = new Set<() => void>();
/** Three buttons fit one row on a 360 px phone with slightly tighter lettering. */
const narrow = "w-full text-[0.6875rem]! tracking-[0.08em]! md:text-xs!";

const isDismissed = () => {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return false; // Storage is blocked: show it for this page view.
  }
};

/** The site has no optional cookies yet, so both choices behave the same; analytics or ads would have to honour this. */
type Choice = "all" | "necessary";

const save = (choice: Choice) => {
  try {
    localStorage.setItem(KEY, choice);
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
 * One-time cookie notice. It stays out of the way of anything marked data-keep-clear (the bottle, the checkout
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
  const [managing, setManaging] = useState(false);

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
      // Its resting place, not where the entrance slide has it right now.
      const { offsetLeft: left, offsetTop: top, offsetWidth: width, offsetHeight: height } = card.current;
      const box = { left, top, width, height, right: left + width, bottom: top + height };
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

  const close = (choice: Choice) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return save(choice);
    setLeaving(true);
    setTimeout(() => save(choice), LEAVE_MS);
  };
  // Stays put while someone is reading Manage, even if the taller card now meets a keep-clear item.
  const shown = ready && (clear || managing) && !leaving;
  const outline = `eyebrow inline-flex h-11 items-center justify-center border border-ink px-1 transition-colors hover:bg-ink hover:text-cream ${narrow}`;

  return (
    <aside
      ref={card}
      aria-label="Cookie notice"
      data-shown={shown || undefined}
      inert={!shown}
      className="cookie-notice fixed inset-x-4 bottom-4 z-30 rounded-[6px] border border-ink/15 border-t-2 border-t-orange bg-cream p-4 text-ink shadow-[0_12px_32px_rgb(22_19_15/0.3)] md:right-6 md:bottom-6 md:left-auto md:w-[34rem] md:p-5"
    >
      <h2 className="eyebrow text-[0.8125rem]">Cookies on this website</h2>
      <p className="mt-2 font-sans text-sm leading-snug text-muted">
        We only store what the site needs: your cart and this choice. No analytics or marketing cookies.{" "}
        <Link href="/privacy#browser-storage" className="tap text-orange-text underline underline-offset-2 hover:text-orange">
          Privacy policy
        </Link>
      </p>
      {managing && (
        <dl id="cookie-details" className="mt-3 space-y-2 border-t border-ink/20 pt-3 text-[0.8125rem] leading-snug">
          <div>
            <dt className="font-semibold">Strictly necessary: always on</dt>
            <dd className="text-muted">Your cart and this choice. The site can&rsquo;t work without them.</dd>
          </div>
          <div>
            <dt className="font-semibold">Analytics and marketing: not used</dt>
            <dd className="text-muted">This site has none, so there is nothing to switch on or off.</dd>
          </div>
        </dl>
      )}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button type="button" aria-expanded={managing} aria-controls="cookie-details" onClick={() => setManaging((m) => !m)} className={outline}>
          Manage
        </button>
        <button type="button" onClick={() => close("necessary")} className={outline}>
          Reject all
        </button>
        <button type="button" onClick={() => close("all")} className={buttonClass("orange", `h-11! px-1! ${narrow}`)}>
          Accept all
        </button>
      </div>
    </aside>
  );
}
