"use client";

import { useEffect, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getPack, getProduct, isAvailable, type Pack, type Product } from "@/data/products";

/** `pack` is set for products sold in several sizes (lines saved before packs existed have none). */
export type CartLine = { slug: string; qty: number; pack?: string };

/** Identifies a cart line: one line per product and pack. */
export const lineKey = (l: { slug: string; pack?: string }) => (l.pack ? `${l.slug}:${l.pack}` : l.slug);

type CartState = {
  lines: CartLine[];
  drawerOpen: boolean;
  add: (slug: string, qty?: number, pack?: string) => void;
  /** `key` is the line's lineKey. */
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const MAX_QTY = 20;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      drawerOpen: false,
      add: (slug, qty = 1, packId) =>
        set((s) => {
          const product = getProduct(slug);
          if (!product || !isAvailable(product)) return s;
          const line = { slug, pack: getPack(product, packId)?.id };
          const key = lineKey(line);
          const existing = s.lines.find((l) => key === lineKey(normalise(l)));
          const lines = existing
            ? s.lines.map((l) => (l === existing ? { ...normalise(l), qty: Math.min(MAX_QTY, l.qty + qty) } : l))
            : [...s.lines, { ...line, qty: Math.min(MAX_QTY, qty) }];
          return { lines };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => lineKey(normalise(l)) !== key)
              : s.lines.map((l) => (lineKey(normalise(l)) === key ? { ...normalise(l), qty: Math.min(MAX_QTY, qty) } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => lineKey(normalise(l)) !== key) })),
      clear: () => set({ lines: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "neeram-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
      skipHydration: true,
    },
  ),
);

/** Rehydrates the persisted cart once on the client; returns true when ready. */
export function useCartHydrated() {
  useEffect(() => {
    if (!useCart.persist.hasHydrated()) void useCart.persist.rehydrate();
  }, []);
  // The server snapshot is false, so server and first client render match.
  return useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

/** Gives a line saved before its product had packs the product's default pack. */
function normalise(line: CartLine): CartLine {
  if (line.pack) return line;
  const product = getProduct(line.slug);
  const pack = product && getPack(product)?.id;
  return pack ? { ...line, pack } : line;
}

export type ResolvedLine = CartLine & {
  key: string;
  product: Product;
  packInfo?: Pack;
  /** Pack size and form, or the product's size label. */
  sizeLabel: string;
  image: Product["images"][number];
  lineTotal: number | null;
};

/** Joins cart lines with product data. Lines for unknown or unavailable products are dropped. */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((raw) => {
    const line = normalise(raw);
    const product = getProduct(line.slug);
    if (!product || !isAvailable(product)) return [];
    const pack = getPack(product, line.pack);
    const price = pack?.price ?? product.price;
    return [
      {
        ...line,
        key: lineKey(line),
        product,
        packInfo: pack,
        sizeLabel: pack?.label ?? product.sizeLabel,
        image: pack?.image ?? product.images[0],
        lineTotal: price === null ? null : price * line.qty,
      },
    ];
  });
}

/** Sum of line totals, or null when any price is still unknown. */
export function subtotal(lines: ResolvedLine[]): number | null {
  let total = 0;
  for (const l of lines) {
    if (l.lineTotal === null) return null;
    total += l.lineTotal;
  }
  return total;
}
