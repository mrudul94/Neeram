"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

/** Set at build time. Without it the widget renders nothing (and the server skips the check). */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export const turnstileEnabled = !!SITE_KEY;

type TurnstileApi = {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let script: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  script ??= new Promise<TurnstileApi>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = SCRIPT_URL;
    el.async = true;
    el.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile didn't start")));
    el.onerror = () => {
      script = null;
      reject(new Error("Turnstile didn't load"));
    };
    document.head.appendChild(el);
  });
  return script;
}

/**
 * The token once Turnstile has one, waiting up to `ms`; "" if it doesn't arrive in time.
 * Usually about a second, but more than 10 s has been seen, so the wait is generous.
 */
export async function waitForToken(read: () => string, ms = 15_000) {
  for (let waited = 0; !read() && waited < ms; waited += 100) await new Promise((r) => setTimeout(r, 100));
  return read();
}

export type TurnstileHandle = {
  /** Asks for a fresh token: each one can be checked only once. */
  reset(): void;
};

/**
 * Cloudflare Turnstile bot check. Stays invisible unless Cloudflare wants the visitor to
 * click; reports each token (or "" once it expires or fails) through `onToken`.
 */
export function Turnstile({ onToken, ref, className }: { onToken: (token: string) => void; ref?: Ref<TurnstileHandle>; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<{ api: TurnstileApi; id: string } | null>(null);
  const report = useRef(onToken);

  useEffect(() => {
    report.current = onToken;
  }, [onToken]);

  useImperativeHandle(ref, () => ({
    reset() {
      report.current("");
      if (widget.current) widget.current.api.reset(widget.current.id);
    },
  }));

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !box.current) return;
        const id = api.render(box.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          "refresh-expired": "auto",
          callback: (token: string) => report.current(token),
          "expired-callback": () => report.current(""),
          "error-callback": () => report.current(""),
        });
        widget.current = { api, id };
      })
      .catch(() => report.current(""));
    return () => {
      cancelled = true;
      if (widget.current) widget.current.api.remove(widget.current.id);
      widget.current = null;
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={box} className={className} />;
}
