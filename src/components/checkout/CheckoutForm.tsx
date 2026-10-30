"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { INDIAN_STATES, validateDetails, type CheckoutDetails } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { resolveLines, subtotal, useCart, useCartHydrated } from "@/store/cart";
import { buttonClass, cx } from "../ui";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: string, cb: (r: { error: { description: string } }) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

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
  const setLastOrder = useCart((s) => s.setLastOrder);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState("upi");
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

  const finish = (orderNumber: string, firstName: string) => {
    setLastOrder({ number: orderNumber, firstName, slugs: lines.map((l) => l.slug) });
    clear();
    router.push(`/order/confirmed?order=${encodeURIComponent(orderNumber)}`);
  };

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
    setBusy(true);
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
      if (data.mode === "mock") return finish(data.orderNumber, details.firstName);

      if (!(await loadRazorpay()) || !window.Razorpay) throw new Error("Could not load the payment window. Check your connection and try again.");
      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.razorpayOrderId,
        amount: data.amount,
        currency: "INR",
        name: "Neeram",
        description: `Order ${data.orderNumber}`,
        prefill: { name: `${details.firstName} ${details.lastName}`, email: details.email, contact: details.phone, method: payment },
        theme: { color: "#F26A0D" },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (resp: RazorpayResponse) => {
          const v = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...resp, orderNumber: data.orderNumber }),
          });
          if (v.ok) finish(data.orderNumber, details.firstName);
          else {
            setBusy(false);
            setFormError("We couldn't verify the payment. If money was taken, contact us with your order number " + data.orderNumber + ".");
          }
        },
      });
      rzp.on("payment.failed", (r) => {
        setBusy(false);
        setFormError(r.error.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      setBusy(false);
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const err = (name: string) => ({ id: name, name, "aria-invalid": errors[name] ? true : undefined, "aria-describedby": errors[name] ? `${name}-error` : undefined });

  return (
    <div className="mx-auto grid max-w-[90rem] md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]">
      <div className="px-5 pt-8 pb-16 md:pt-10 md:pr-16 md:pl-[max(2.5rem,calc((100vw-75rem)/2))]">
        <h1 className="display text-[clamp(3.5rem,8vw,6rem)]">Checkout</h1>
        <form onSubmit={onSubmit} noValidate className="mt-8">
          <Step n="01" title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" name="email" error={errors.email}>
                <input {...err("email")} type="email" autoComplete="email" placeholder="you@example.com" className={input} />
              </Field>
              <Field label="Mobile number" name="phone" error={errors.phone}>
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
                <input id="landmark" name="landmark" placeholder="Near…" className={input} />
              </Field>
            </div>
          </Step>

          <Step n="03" title="Delivery">
            <div className="space-y-3">
              <Choice name="delivery" value="standard" checked onChange={() => {}} title="Standard delivery" note="[Delivery time and charge]" />
              <Choice name="delivery-alt" value="express" checked={false} onChange={() => {}} title="[Second delivery option, if offered]" disabled />
            </div>
          </Step>

          <Step n="04" title="Payment">
            <div className="space-y-3">
              <Choice name="payment" value="upi" checked={payment === "upi"} onChange={setPayment} title="UPI" note="Pay with any UPI app" />
              <Choice name="payment" value="card" checked={payment === "card"} onChange={setPayment} title="Debit or credit card" />
            </div>
            <p className="mt-3 font-serif text-sm text-muted italic">Payment options shown depend on your payment provider.</p>
          </Step>

          {formError && (
            <p role="alert" className="mb-4 border border-orange px-4 py-3 text-sm">
              {formError}
            </p>
          )}
          <button type="submit" disabled={busy} className={buttonClass("orange", "h-14 w-full")}>
            {busy ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </button>
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
