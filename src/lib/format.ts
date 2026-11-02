const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** "₹ 240", or "₹ —" while the price is unknown. */
export function formatPrice(price: number | null): string {
  return price === null ? "₹ —" : `₹ ${inr.format(price)}`;
}

/** A detail the client still has to supply shows as a visible gap, never as a blank. */
export function toBeConfirmed(value: string | null | undefined): string {
  return value?.trim() ? value : "[to be confirmed]";
}
