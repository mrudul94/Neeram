"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { getProduct, isAvailable } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";
import { QtyStepper } from "./QtyStepper";
import { ArrowRight, buttonClass, cx } from "./ui";

type Variant = "orange" | "ink" | "text" | "cream";

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
  /** Pack id for products sold in several sizes; defaults to the first pack. */
  pack?: string;
  qty?: number;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const product = getProduct(slug);
  if (!product || !isAvailable(product)) return null;
  return (
    <button
      type="button"
      className={variant === "text" ? cx("eyebrow text-[0.75rem] text-orange-text hover:opacity-80", className) : buttonClass(variant, className)}
      onClick={() => {
        add(slug, qty, pack);
        openDrawer();
      }}
    >
      {children ?? "Add to cart"}
      {arrow && <ArrowRight />}
    </button>
  );
}

/** Quantity stepper + ADD TO CART + BUY NOW, as on the product page. */
export function PurchasePanel({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const router = useRouter();
  const product = getProduct(slug);
  if (!product) return null;
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <QtyStepper label={product.name} value={qty} onChange={setQty} />
        <AddToCartButton slug={slug} qty={qty} className="flex-1">
          Add to cart
        </AddToCartButton>
      </div>
      <button
        type="button"
        className={buttonClass("orange", "w-full")}
        onClick={() => {
          add(slug, qty);
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
  const product = getProduct(slug);
  if (!product || !isAvailable(product)) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex gap-3 border-t border-ink bg-cream px-5 py-3 md:hidden">
      <QtyStepper label={product.name} value={qty} onChange={setQty} />
      <AddToCartButton slug={slug} qty={qty} className="flex-1">
        Add to cart · {formatPrice(product.price === null ? null : product.price * qty)}
      </AddToCartButton>
    </div>
  );
}
