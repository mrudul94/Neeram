"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { getPack, getProduct, hasSizes, isAvailable, type Pack } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";
import { usePackChoice } from "@/store/pack";
import { QtyStepper } from "./QtyStepper";
import { ArrowRight, buttonClass, cx } from "./ui";

type Variant = "orange" | "ink" | "text" | "cream";

/** The size picked for this product (shared with the home page's size buttons); undefined if it has no packs. */
export function useChosenPack(slug: string): Pack | undefined {
  const chosen = usePackChoice((s) => s.chosen[slug]);
  const product = getProduct(slug);
  return product && getPack(product, chosen);
}

/** Adds a product and opens the cart drawer. Renders nothing for unavailable products. */
export function AddToCartButton({
  slug,
  pack,
  qty = 1,
  variant = "ink",
  arrow,
  className,
  children,
}: {
  slug: string;
  /** Pack id for products sold in several sizes; defaults to the size picked in PackPicker. */
  pack?: string;
  qty?: number;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const chosen = useChosenPack(slug);
  const product = getProduct(slug);
  if (!product || !isAvailable(product)) return null;
  return (
    <button
      type="button"
      className={variant === "text" ? cx("eyebrow text-[0.75rem] text-orange-text hover:opacity-80", className) : buttonClass(variant, className)}
      onClick={() => {
        add(slug, qty, pack ?? chosen?.id);
        openDrawer();
      }}
    >
      {children ?? "Add to cart"}
      {arrow && <ArrowRight />}
    </button>
  );
}

/** Size buttons for products sold in several packs (light background version of the home feature's). */
export function PackPicker({ slug, className }: { slug: string; className?: string }) {
  const choose = usePackChoice((s) => s.choose);
  const chosen = useChosenPack(slug);
  const product = getProduct(slug);
  if (!product || !hasSizes(product) || !chosen) return null;
  // min-w-0: a fieldset won't shrink below its content by default (min-inline-size: min-content).
  return (
    <fieldset className={cx("min-w-0", className)}>
      <legend className="eyebrow text-[0.6875rem] text-muted">
        Choose a size · <span className="text-ink">{chosen.label}</span>
      </legend>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {product.packs!.map((p) => {
          const on = p.id === chosen.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              aria-label={`${p.label}, ${formatPrice(p.price ?? product.price)}`}
              onClick={() => choose(slug, p.id)}
              className={cx(
                "flex flex-col items-center gap-1.5 border px-1 pt-2 pb-2.5 transition-colors duration-200",
                on ? "border-orange bg-sand ring-1 ring-orange" : "border-ink/25 hover:border-ink",
              )}
            >
              <span className="grid h-14 w-full place-items-center">
                <Image src={p.image.src} alt="" width={p.image.width} height={p.image.height} sizes="4rem" className="max-h-14 w-auto max-w-full object-contain" />
              </span>
              <span className="text-sm leading-none font-medium">{p.size}</span>
              <span className="eyebrow text-[0.5625rem] leading-none text-muted">{p.form === "Packet" ? "Packet" : "Bottle"}</span>
              <span className="text-[0.8125rem] leading-none tabular-nums">{formatPrice(p.price ?? product.price)}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Price of the picked size (or the product), with its size label. */
export function PackPrice({ slug }: { slug: string }) {
  const pack = useChosenPack(slug);
  const product = getProduct(slug);
  if (!product) return null;
  return (
    <p className="mt-6 flex items-baseline gap-3">
      <span className="text-2xl font-medium tabular-nums">{formatPrice(pack?.price ?? product.price)}</span>
      <span className="text-xs text-muted">Inclusive of taxes · {pack?.label ?? product.sizeLabel}</span>
    </p>
  );
}

/** "Add coconut oil · 1 L · ₹ 260", following the picked size. */
export function ChosenPackLabel({ slug }: { slug: string }) {
  const pack = useChosenPack(slug);
  const product = getProduct(slug);
  if (!product) return null;
  return (
    // One span, so a flex button wraps it as one line of text; the price never splits from "₹".
    <span>
      Add {product.name.toLowerCase()}
      {pack && ` · ${pack.size}${pack.form === "Packet" ? " packet" : ""}`}{" "}
      <span className="whitespace-nowrap">· {formatPrice(pack?.price ?? product.price)}</span>
    </span>
  );
}

/** Quantity stepper + ADD TO CART + BUY NOW, as on the product page. Uses the size picked in PackPicker. */
export function PurchasePanel({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const router = useRouter();
  const pack = useChosenPack(slug);
  const product = getProduct(slug);
  if (!product) return null;
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <QtyStepper label={product.name} value={qty} onChange={setQty} />
        <AddToCartButton slug={slug} pack={pack?.id} qty={qty} className="flex-1">
          Add to cart
        </AddToCartButton>
      </div>
      <button
        type="button"
        className={buttonClass("orange", "w-full")}
        onClick={() => {
          add(slug, qty, pack?.id);
          router.push("/checkout");
        }}
      >
        Buy now
      </button>
    </div>
  );
}

/** Fixed bottom bar on mobile product pages. */
export function MobileBuyBar({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1);
  const pack = useChosenPack(slug);
  const product = getProduct(slug);
  if (!product || !isAvailable(product)) return null;
  const price = pack?.price ?? product.price;
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex gap-3 border-t border-ink bg-cream px-5 py-3 md:hidden">
      <QtyStepper label={product.name} value={qty} onChange={setQty} />
      <AddToCartButton slug={slug} pack={pack?.id} qty={qty} className="flex-1">
        Add {pack ? pack.size : "to cart"} · {formatPrice(price === null ? null : price * qty)}
      </AddToCartButton>
    </div>
  );
}
