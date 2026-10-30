"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { site } from "@/data/content";
import { INDIAN_STATES, MAX_LENGTHS, orderLinks, PAYMENT, validateDetails, type CheckoutDetails } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { resolveLines, subtotal, useCart, useCartHydrated } from "@/store/cart";
import { Honeypot } from "../Honeypot";
import { buttonClass, cx } from "../ui";

type Channel = "whatsapp" | "sms" | "email";
const smsNumber = site.orders.phone ?? site.orders.whatsapp;

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
          <span className="text-orange">{n}</span> {title}
        </span>
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function Choice({ name, value, checked, onChange, title, note, disabled }: { name: string; value: string; checked: boolean; onChange: (v: string) => void; title: string; note?: string; disabled?: boolean }) {
  return (
    <label className={cx("flex cursor-pointer items-center gap-4 border px-4 py-3.5", checked ? "border-ink border-[1.5px]" : "border-ink/70", disabled && "cursor-not-allowed opacity-60")}>
      <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={() => onChange(value)} className="size-4 accent-orange" />
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
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [discountNote, setDiscountNote] = useState("");

  const lines = resolveLines(rawLines);
  const total = subtotal(lines);

  if (!hydrated) return <div className="min-h-[60vh]" />;
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
    setBusy(true);
    // Opened inside the click so pop-up blockers allow it; pointed at WhatsApp once the order is saved.
    const tab = via === "whatsapp" ? window.open("", "_blank") : null;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: rawLines, details }),
      });
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
      <div className="px-5 pt-8 pb-16 md:pt-10 md:pr-16 md:pl-[max(2.5rem,calc((100vw-75rem)/2))]">
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
                <select {...err("state")} autoComplete="address-level1" defaultValue="Kerala" className={input}>
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
              <Choice name="delivery" value="standard" checked onChange={() => {}} title="Standard delivery" note="[Delivery time] · charge confirmed on WhatsApp" />
              <Choice name="delivery-alt" value="express" checked={false} onChange={() => {}} title="[Second delivery option, if offered]" disabled />
            </div>
          </Step>

          <Step n="04" title="Payment">
            <div className="border-[1.5px] border-ink px-4 py-3.5">
              <p className="text-[0.9375rem] font-medium">{PAYMENT.title}</p>
              <p className="mt-0.5 text-[0.8125rem] text-muted">{PAYMENT.note}</p>
            </div>
            <p className="mt-3 font-serif text-sm text-muted italic">Nothing is charged on this website.</p>
            <Field label="Note for us (optional)" name="note" error={errors.note} className="mt-6">
              <textarea {...err("note")} rows={3} maxLength={500} placeholder="Delivery time, gift message…" className={cx(input, "h-auto py-3")} />
            </Field>
          </Step>

          {formError && (
            <p role="alert" className="mb-4 border border-orange px-4 py-3 text-sm">
              {formError}
            </p>
          )}
          <button type="submit" value="whatsapp" disabled={busy} className={buttonClass("orange", "h-14 w-full")}>
            {busy ? "Sending…" : `Send order on WhatsApp · ${formatPrice(total)}`}
          </button>
          {(smsNumber || site.orders.email) && (
            <p className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.8125rem] text-muted">
              No WhatsApp? Send it by
              {smsNumber && (
                <button type="submit" value="sms" disabled={busy} className={buttonClass("text")}>
                  SMS
                </button>
              )}
              {site.orders.email && (
                <button type="submit" value="email" disabled={busy} className={buttonClass("text")}>
                  Email
                </button>
              )}
            </p>
          )}
        </form>
      </div>

      <aside aria-labelledby="summary-title" className="bg-sand px-5 py-10 md:px-10 md:pr-[max(2.5rem,calc((100vw-75rem)/2))]">
        <div className="md:sticky md:top-8">
          <h2 id="summary-title" className="eyebrow text-[0.6875rem] text-orange-text">
            Your order
          </h2>
          <ul className="mt-4">
            {lines.map(({ key, qty, product, sizeLabel, image, lineTotal }) => (
              <li key={key} className="flex items-center gap-4 border-b border-ink py-4">
                <span className="relative grid h-[4.5rem] w-14 shrink-0 place-items-center bg-cream">
                  <Image src={image.src} alt="" width={image.width} height={image.height} className="max-h-16 w-auto max-w-[3.25rem] object-contain" />
                  <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center bg-ink text-[0.6875rem] text-cream">{qty}</span>
                </span>
                <span className="flex-1">
                  <span className="block font-medium">{product.name}</span>
                  <span className="block text-xs text-muted">{sizeLabel}</span>
                  <span lang="ml" className="font-ml text-xs text-muted">
                    {product.nameMalayalam}
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
          <p className="mt-2 font-serif text-sm text-muted italic">Prices include taxes.</p>
        </div>
      </aside>
    </div>
  );
}
