"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { HONEYPOT_FIELD } from "@/lib/bot-check";
import { Honeypot } from "./Honeypot";
import { Turnstile, turnstileEnabled, waitForToken, type TurnstileHandle } from "./Turnstile";
import { cx } from "./ui";

type Props = {
  /** "newsletter" for the footer, otherwise the product slug being waited for. */
  topic: string;
  submitLabel?: string;
  tone?: "dark" | "light";
  className?: string;
};

type Status = "idle" | "sending" | "done" | "error";

export function SubscribeForm({ topic, submitLabel = "Subscribe", tone = "dark", className }: Props) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  // The bot check loads once someone starts on the form, not on every page view.
  const [checking, setChecking] = useState(false);
  const token = useRef("");
  const turnstile = useRef<TurnstileHandle>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = new FormData(form);
    setStatus("sending");
    setChecking(true);
    try {
      const turnstileToken = turnstileEnabled ? await waitForToken(() => token.current) : "";
      if (turnstileEnabled && !turnstileToken) throw new Error("The security check is taking a while. Please try again in a moment.");
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fields.get("email"), topic, page: window.location.pathname, [HONEYPOT_FIELD]: fields.get(HONEYPOT_FIELD), turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("done");
      setMessage(topic === "newsletter" ? "Thanks — we'll write when new stock lands." : "Thanks — we'll email you when it's on the shelf.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      // Each token works once.
      turnstile.current?.reset();
    }
  }

  return (
    <form onSubmit={onSubmit} onFocusCapture={() => setChecking(true)} className={cx("relative w-full", className)} noValidate={false}>
      <Honeypot />
      <div className={cx("flex items-end gap-4 border-b", tone === "dark" ? "border-cream/80" : "border-ink")}>
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          className={cx(
            "min-w-0 flex-1 bg-transparent py-3 font-serif text-lg outline-none",
            tone === "dark" ? "placeholder:text-cream/80" : "placeholder:text-muted",
          )}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={cx("tap eyebrow shrink-0 py-3 text-[0.75rem] hover:opacity-80 disabled:opacity-50", tone === "dark" ? "text-orange" : "text-orange-text")}
        >
          {status === "sending" ? "Sending…" : `${submitLabel} →`}
        </button>
      </div>
      {checking && <Turnstile ref={turnstile} onToken={(t) => (token.current = t)} className="mt-3" />}
      <p role="status" aria-live="polite" className={cx("mt-3 min-h-5 text-sm", status === "error" && (tone === "dark" ? "text-orange" : "text-orange-text"))}>
        {status === "done" || status === "error" ? message : ""}
      </p>
    </form>
  );
}
