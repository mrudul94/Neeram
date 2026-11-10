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

export type TurnstileHandle = {
  /**
   * The current token, or the next one once the check finishes: the form never has to wait
   * for the check before its button can be pressed. "" if none arrives within `timeoutMs`.
   */
  token(timeoutMs: number): Promise<string>;
  /** Asks for a fresh token: each one can be checked only once. */
  reset(): void;
};

/**
 * Cloudflare Turnstile bot check, for checkout only (the script loads when this mounts). In the
 * dashboard the widget is "Managed"; here it stays invisible unless Cloudflare wants a click.
 */
export function Turnstile({ ref, className }: { ref?: Ref<TurnstileHandle>; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<{ api: TurnstileApi; id: string } | null>(null);
  const current = useRef("");
  const waiting = useRef(new Set<(token: string) => void>());

  const report = (token: string) => {
    current.current = token;
    if (token) waiting.current.forEach((give) => give(token));
  };

  useImperativeHandle(ref, () => ({
    token(timeoutMs) {
      if (current.current) return Promise.resolve(current.current);
      return new Promise((resolve) => {
        const give = (token: string) => {
          clearTimeout(timer);
          waiting.current.delete(give);
          resolve(token);
        };
        const timer = setTimeout(() => give(""), timeoutMs);
        waiting.current.add(give);
      });
    },
    reset() {
      current.current = "";
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
          callback: (token: string) => report(token),
          "expired-callback": () => report(""),
          "error-callback": () => report(""),
        });
        widget.current = { api, id };
      })
      .catch(() => report(""));
    return () => {
      cancelled = true;
      if (widget.current) widget.current.api.remove(widget.current.id);
      widget.current = null;
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={box} className={className} />;
}
