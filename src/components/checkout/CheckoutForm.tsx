"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { site } from "@/data/content";
import { INDIAN_STATES, MAX_LENGTHS, orderLinks, PAYMENT, validateDetails, type CheckoutDetails } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { resolveLines, subtotal, useCart, useCartHydrated } from "@/store/cart";
import { Honeypot } from "../Honeypot";
import { QtyStepper } from "../QtyStepper";
import { Turnstile, turnstileEnabled, type TurnstileHandle } from "../Turnstile";
import { buttonClass, cx } from "../ui";

type Channel = "whatsapp" | "sms" | "email";
const smsNumber = site.orders.phone ?? site.orders.whatsapp;
/** How long a press waits for a bot check still running (or showing a click-to-verify box). */
const TOKEN_WAIT_MS = 20_000;

const input =
  "h-12 w-full border border-ink bg-transparent px-3.5 text-[0.9375rem] placeholder:text-muted/80 focus:border-orange focus:outline-none aria-[invalid=true]:border-orange";

function Field({ label, name, error, className, children }: { label: string; name: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="eyebrow mb-2 block text-[0.6875rem] text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[0.8125rem] text-orange-text">
          {error}
        </p>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-ink pt-6 pb-8">
      <legend className="contents">
        <span className="display flex items-baseline gap-3 text-[2rem]">
          <span className="text-orange-text">{n}</span> {title}
        </span>
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function Choice({ name, value, checked, onChange, title, note }: { name: string; value: string; checked: boolean; onChange: (v: string) => void; title: string; note?: string }) {
  return (
    <label className={cx("flex cursor-pointer items-center gap-4 border px-4 py-3.5", checked ? "border-ink border-[1.5px]" : "border-ink/70")}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="size-4 accent-orange" />
      <span>
        <span className="block text-[0.9375rem] font-medium">{title}</span>
        {note && <span className="block text-[0.8125rem] text-muted">{note}</span>}
      </span>
    </label>
  );
}

export function CheckoutForm() {
  const hydrated = useCartHydrated();
  const rawLines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState<false | "verifying" | "sending">(false);
  const [discountNote, setDiscountNote] = useState("");
  const turnstile = useRef<TurnstileHandle>(null);

  const lines = resolveLines(rawLines);
  const total = subtotal(lines);

  // The heading is in the first HTML, so the page shows it before the cart has loaded.
  if (!hydrated) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-[90rem] md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]">
        <div className="px-5 pt-8 pb-16 md:pt-10 md:pr-16 md:pl-(--page-edge)">
          <h1 className="display text-[clamp(3.5rem,8vw,6rem)]">Checkout</h1>
        </div>
      </div>
    );
  }
  if (!lines.length) {
    return (
      <div className="wrap py-20">
        <h1 className="display text-[clamp(3.5rem,8vw,6rem)]">Checkout</h1>
        <p className="mt-6 font-serif text-lg text-muted">Your cart is empty.</p>
        <Link href="/products/coconut-oil" className={buttonClass("orange", "mt-6")}>
          Shop coconut oil →
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const form = new FormData(e.currentTarget);
    const details = Object.fromEntries(form.entries()) as unknown as CheckoutDetails;
    const found = validateDetails(details);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(first)?.focus();
      return;
    }
    // Which button sent the form: WhatsApp (the main one), or SMS / email for customers without it.
    const via = ((e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") ?? "whatsapp") as Channel;
    // Opened inside the click so pop-up blockers allow it; pointed at WhatsApp once the message is ready.
    // The bot check may still be running: the tab opens first, then the order waits for its token.
    const tab = via === "whatsapp" ? window.open("", "_blank") : null;
    try {
      let token = "";
      if (turnstileEnabled && turnstile.current) {
        setBusy("verifying");
        token = await turnstile.current.token(TOKEN_WAIT_MS);
        if (!token) throw new Error("The security check didn't finish. Please try again.");
      }
      setBusy("sending");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: rawLines, details, turnstileToken: token }),
      });
      // Each token works once: get a fresh one in case the customer needs to send again.
      turnstile.current?.reset();
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        throw new Error(data.error ?? "Something went wrong.");
      }
      const link = orderLinks(data.message, data.orderNumber)[via] ?? orderLinks(data.message, data.orderNumber).whatsapp;
      clear();
      if (tab) {
        tab.location.href = link;
        router.push("/shop");
      } else {
        // Pop-up blocked, or an sms:/mailto: link that opens an app: use this tab.
        window.location.href = link;
      }
    } catch (err) {
      tab?.close();
      turnstile.current?.reset();
      setBusy(false);
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const err = (name: string) => ({
    id: name,
    name,
    maxLength: (MAX_LENGTHS as Record<string, number>)[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <div className="mx-auto grid max-w-[90rem] md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]">
      <div className="px-5 pt-8 pb-16 md:pt-10 md:pr-16 md:pl-(--page-edge)">
        <h1 className="display text-[clamp(3.5rem,8vw,6rem)]">Checkout</h1>
        <form onSubmit={onSubmit} noValidate className="relative mt-8">
          <Honeypot />
          <Step n="01" title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email (optional)" name="email" error={errors.email}>
                <input {...err("email")} type="email" autoComplete="email" placeholder="you@example.com" className={input} />
              </Field>
              <Field label="Mobile number (WhatsApp)" name="phone" error={errors.phone}>
                <input {...err("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="+91" className={input} />
              </Field>
            </div>
          </Step>

          <Step n="02" title="Delivery address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" name="firstName" error={errors.firstName}>
                <input {...err("firstName")} autoComplete="given-name" placeholder="First name" className={input} />
              </Field>
              <Field label="Last name" name="lastName" error={errors.lastName}>
                <input {...err("lastName")} autoComplete="family-name" placeholder="Last name" className={input} />
              </Field>
              <Field label="House name, street" name="street" error={errors.street} className="sm:col-span-2">
                <input {...err("street")} autoComplete="street-address" placeholder="House name, street" className={input} />
              </Field>
              <Field label="Town / city" name="city" error={errors.city}>
                <input {...err("city")} autoComplete="address-level2" placeholder="Town / city" className={input} />
              </Field>
              <Field label="PIN code" name="pin" error={errors.pin}>
                <input {...err("pin")} autoComplete="postal-code" inputMode="numeric" maxLength={6} placeholder="6-digit PIN" className={input} />
              </Field>
              <Field label="State" name="state" error={errors.state}>
                {/* 4 px less left padding: the browser adds its own inside a select, so its text lines up with the other fields'. */}
                <select {...err("state")} autoComplete="address-level1" defaultValue="Kerala" className={cx(input, "pl-2.5")}>
                  {INDIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Landmark (optional)" name="landmark">
                <input id="landmark" name="landmark" maxLength={MAX_LENGTHS.landmark} placeholder="Near…" className={input} />
              </Field>
            </div>
          </Step>

          <Step n="03" title="Delivery">
            <div className="space-y-3">
              <Choice name="delivery" value="standard" checked onChange={() => {}} title="Standard delivery" note="Six to ten working days · charge confirmed on WhatsApp" />
            </div>
          </Step>

          <Step n="04" title="Payment">
            <div className="border-[1.5px] border-ink px-4 py-3.5">
              <p className="text-[0.9375rem] font-medium">{PAYMENT.title}</p>
              <p className="mt-0.5 text-[0.8125rem] text-muted">{PAYMENT.note}</p>
            </div>
            <p className="mt-3 font-[family-name:var(--font-inter-italic)] text-sm text-muted italic">Nothing is charged on this website.</p>
            <Field label="Note for us (optional)" name="note" error={errors.note} className="mt-6">
              <textarea {...err("note")} rows={3} maxLength={500} placeholder="Delivery time, gift message…" className={cx(input, "h-auto py-3")} />
            </Field>
          </Step>

          <Turnstile ref={turnstile} className="mb-4" />
          {formError && (
            <p role="alert" className="mb-4 border border-orange px-4 py-3 text-sm">
              {formError}
            </p>
          )}
          {/* New tabs, so reading these doesn't lose what's typed in the form. */}
          <p className="mb-3 text-center text-[0.8125rem] text-muted">
            By sending this order you agree to our{" "}
            <Link href="/terms" target="_blank" className="tap underline underline-offset-2 hover:text-orange-text">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" target="_blank" className="tap underline underline-offset-2 hover:text-orange-text">
              Privacy Policy
            </Link>
            .
          </p>
          <button data-keep-clear type="submit" value="whatsapp" disabled={!!busy} className={buttonClass("orange", "h-14 w-full")}>
            {busy === "verifying" ? "Verifying…" : busy ? "Sending…" : `Send order on WhatsApp · ${formatPrice(total)}`}
          </button>
          {(smsNumber || site.orders.email) && (
            <p className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.8125rem] text-muted">
              No WhatsApp? Send it by
              {smsNumber && (
                <button type="submit" value="sms" disabled={!!busy} className={buttonClass("text")}>
                  SMS
                </button>
              )}
              {site.orders.email && (
                <button type="submit" value="email" disabled={!!busy} className={buttonClass("text")}>
                  Email
                </button>
              )}
            </p>
          )}
        </form>
      </div>

      <aside aria-labelledby="summary-title" className="bg-sand px-5 py-10 md:px-10 md:pr-(--page-edge)">
        <div className="md:sticky md:top-8">
          <h2 id="summary-title" className="eyebrow text-[0.6875rem] text-orange-text">
            Your order
          </h2>
          <ul className="mt-4">
            {lines.map(({ key, qty, product, sizeLabel, image, lineTotal }) => (
              <li key={key} className="flex items-start gap-4 border-b border-ink py-4">
                <span className="grid h-[4.5rem] w-14 shrink-0 place-items-center bg-cream">
                  <Image src={image.src} alt="" width={image.width} height={image.height} className="max-h-16 w-auto max-w-[3.25rem] object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{product.name}</span>
                  <span className="block text-xs text-muted">{sizeLabel}</span>
                  <span lang="ml" className="font-ml text-xs text-muted">
                    {product.nameMalayalam}
                  </span>
                  <span className="mt-2.5 flex items-center gap-4">
                    <QtyStepper size="sm" label={`${product.name}, ${sizeLabel}`} value={qty} min={1} onChange={(q) => setQty(key, q)} />
                    <button type="button" onClick={() => remove(key)} className="tap text-xs text-muted underline-offset-2 hover:text-orange hover:underline">
                      Remove
                    </button>
                  </span>
                </span>
                <span className="tabular-nums">{formatPrice(lineTotal)}</span>
              </li>
            ))}
          </ul>
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              setDiscountNote("Discount codes aren't available yet.");
            }}
          >
            <label htmlFor="discount" className="eyebrow mb-2 block text-[0.6875rem] text-muted">
              Discount code
            </label>
            <div className="flex gap-2">
              <input id="discount" placeholder="Code" className={cx(input, "bg-cream")} />
              <button type="submit" className={buttonClass("ink", "px-5")}>
                Apply
              </button>
            </div>
            <p role="status" className="mt-1.5 min-h-5 text-[0.8125rem] text-muted">
              {discountNote}
            </p>
          </form>
          <dl className="mt-4 space-y-2 text-[0.9375rem]">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between border-b border-ink pb-4">
              <dt>Delivery</dt>
              <dd className="text-muted">Calculated after address</dd>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <dt className="display text-[2rem]">Total</dt>
              <dd className="display text-[2rem]">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="mt-2 font-[family-name:var(--font-inter-italic)] text-sm text-muted italic">Prices include taxes.</p>
        </div>
      </aside>
    </div>
  );
}
