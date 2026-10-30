"use client";

import { useCart } from "@/store/cart";
import { Logo } from "../Logo";
import { ChevronLeft, cx } from "../ui";

const steps = ["Cart", "Details", "Send"];

export function CheckoutHeader() {
  const openDrawer = useCart((s) => s.openDrawer);
  const current = 1;
  return (
    <header className="wrap grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center border-b border-ink md:h-[5.5rem]">
      <button type="button" onClick={openDrawer} className="flex items-center gap-2 justify-self-start text-[0.9375rem] hover:text-orange">
        <ChevronLeft /> Back to cart
      </button>
      <Logo className="text-[0.95rem] md:text-[1.05rem]" />
      <ol className="hidden items-center justify-end gap-2 text-[0.8125rem] md:flex" aria-label="Checkout steps">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="h-px w-3 bg-muted" />}
            <span aria-current={i === current ? "step" : undefined} className={cx(i === current ? "font-medium" : "text-muted")}>
              {s}
            </span>
          </li>
        ))}
      </ol>
    </header>
  );
}
