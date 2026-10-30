const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** "₹ 240", or "₹ —" while the price is unknown. */
export function formatPrice(price: number | null): string {
  return price === null ? "₹ —" : `₹ ${inr.format(price)}`;
}
