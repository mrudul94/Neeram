"use client";

import { useRef, useState, type FormEvent } from "react";
import { CONTACT_LIMITS, validateContact, type ContactMessage } from "@/lib/contact";
import { Honeypot } from "./Honeypot";
import { Turnstile, turnstileEnabled, type TurnstileHandle } from "./Turnstile";
import { buttonClass, cx } from "./ui";

const field = "mt-2 w-full border border-ink bg-transparent px-4 py-3 text-base outline-none focus-visible:border-orange focus-visible:ring-2 focus-visible:ring-orange/40 aria-invalid:border-red-700";
const label = "eyebrow text-[0.6875rem]";
const TOKEN_WAIT_MS = 15_000;

type Errors = Partial<Record<keyof ContactMessage, string>>;

/** Sends the message to Neeram's inbox through /api/contact (Resend). `email` is shown if sending fails. */
export function ContactForm({ email }: { email: string | null }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState("");
  // The security check loads once someone starts on the form, not for everyone who opens the page.
  const [started, setStarted] = useState(false);
  const turnstile = useRef<TurnstileHandle>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setFormError("");
    const fields = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const found = validateContact(fields as unknown as ContactMessage);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      let token = "";
      if (turnstileEnabled) {
        // Pressing Send can be what started the form: give the check a moment to appear.
        for (let i = 0; !turnstile.current && i < 30; i++) await new Promise((r) => setTimeout(r, 100));
        if (!turnstile.current) throw new Error("The security check didn't load. Please try again.");
        token = await turnstile.current.token(TOKEN_WAIT_MS);
        if (!token) throw new Error("The security check didn't finish. Please try again.");
      }
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, turnstileToken: token }),
      });
      // Each token works once: get a fresh one in case they send another message.
      turnstile.current?.reset();
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.errors ?? {});
        throw new Error(data.error ?? "Your message couldn't be sent just now.");
      }
      form.reset();
      setStatus("sent");
    } catch (err) {
      turnstile.current?.reset();
      setStatus("idle");
      setFormError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Your message couldn't be sent. Please check your connection and try again.");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-ink p-6">
        <p className="display text-3xl">Message sent</p>
        <p className="mt-3 font-serif text-lg text-muted">Thank you. We&rsquo;ll reply to the email address you gave us.</p>
        <button type="button" onClick={() => setStatus("idle")} className={cx(buttonClass("text"), "mt-5")}>
          Send another message
        </button>
      </div>
    );
  }

  const props = (name: keyof ContactMessage) => ({
    id: `contact-${name}`,
    name,
    maxLength: CONTACT_LIMITS[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    className: field,
  });
  const error = (name: keyof ContactMessage) =>
    errors[name] && (
      <span id={`contact-${name}-error`} className="mt-1.5 block text-sm text-red-700">
        {errors[name]}
      </span>
    );

  return (
    <form onSubmit={onSubmit} onFocus={() => setStarted(true)} noValidate className="relative grid gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Your name</span>
          <input {...props("name")} autoComplete="name" />
          {error("name")}
        </label>
        <label className="block">
          <span className={label}>Your email</span>
          <input {...props("email")} type="email" autoComplete="email" inputMode="email" />
          {error("email")}
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Subject (optional)</span>
          <input {...props("subject")} />
          {error("subject")}
        </label>
        <label className="block">
          <span className={label}>Order number (optional)</span>
          <input {...props("order")} autoComplete="off" />
          {error("order")}
        </label>
      </div>
      <label className="block">
        <span className={label}>Message</span>
        <textarea {...props("message")} rows={6} />
        {error("message")}
      </label>
      {started && <Turnstile ref={turnstile} className="max-w-full overflow-hidden" />}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className={buttonClass("orange")}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {formError && (
          <p role="alert" className="text-sm text-red-700 [overflow-wrap:anywhere]">
            {formError}
            {email && !formError.includes(email) && (
              <>
                {" "}
                Or email us at{" "}
                <a href={`mailto:${email}`} className="underline underline-offset-4">
                  {email}
                </a>
                .
              </>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
