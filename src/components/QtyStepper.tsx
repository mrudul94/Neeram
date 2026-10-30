"use client";

import { MAX_QTY } from "@/store/cart";
import { MinusIcon, PlusIcon, cx } from "./ui";

type Props = {
  value: number;
  onChange: (qty: number) => void;
  label: string;
  min?: number;
  size?: "sm" | "md";
  className?: string;
};

export function QtyStepper({ value, onChange, label, min = 1, size = "md", className }: Props) {
  const h = size === "sm" ? "h-8" : "h-12";
  const w = size === "sm" ? "w-8" : "w-10";
  return (
    <div role="group" aria-label={`Quantity for ${label}`} className={cx("inline-flex items-center border border-ink", h, className)}>
      <button
        type="button"
        className={cx("grid h-full place-items-center hover:bg-ink/5 disabled:opacity-30", w)}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon />
      </button>
      <output aria-live="polite" className={cx("min-w-6 text-center tabular-nums", size === "sm" ? "text-sm" : "text-[0.9375rem]")}>
        {value}
      </output>
      <button
        type="button"
        className={cx("grid h-full place-items-center hover:bg-ink/5 disabled:opacity-30", w)}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label="Increase quantity"
      >
        <PlusIcon />
      </button>
    </div>
  );
}
