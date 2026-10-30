"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { products, isAvailable } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { resolveLines, subtotal, useCart, useCartHydrated } from "@/store/cart";
import { QtyStepper } from "./QtyStepper";
import { CloseIcon, buttonClass } from "./ui";

export function CartDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  const hydrated = useCartHydrated();
  const open = useCart((s) => s.drawerOpen);
  const closeDrawer = useCart((s) => s.closeDrawer);
  const rawLines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const add = useCart((s) => s.add);
  const pathname = usePathname();

  const lines = hydrated ? resolveLines(rawLines) : [];
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = subtotal(lines);
  const suggestions = products.filter((p) => isAvailable(p) && !lines.some((l) => l.slug === p.slug));

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Close when navigating (e.g. to checkout or a product page).
  useEffect(() => closeDrawer(), [pathname, closeDrawer]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="cart-title"
      onClose={closeDrawer}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDrawer();
      }}
      className="cart-drawer fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-[26.5rem] bg-cream p-0 text-ink backdrop:bg-ink/55"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-baseline justify-between px-5 pt-6 pb-4 md:px-6">
          <h2 id="cart-title" className="display text-[2rem]">
            Your cart <span className="ml-2 align-middle font-sans text-sm normal-case text-muted">{count} {count === 1 ? "item" : "items"}</span>
          </h2>
          <button type="button" onClick={closeDrawer} className="-mr-2 p-2" aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 md:px-6" data-lenis-prevent>
          {lines.length === 0 ? (
            <div className="border-t border-ink py-10">
              <p className="font-serif text-lg text-muted">Your cart is empty.</p>
              <Link href="/products/coconut-oil" className={buttonClass("orange", "mt-6")} onClick={closeDrawer}>
                Shop coconut oil →
              </Link>
            </div>
          ) : (
            <ul className="border-t border-ink">
              {lines.map(({ key, slug, qty, product, sizeLabel, image, lineTotal }) => (
                <li key={key} className="grid grid-cols-[5.25rem_1fr_auto] gap-x-4 border-b border-ink py-4">
                  <div className="row-span-2 grid h-[6.5rem] place-items-center bg-sand">
                    <Image src={image.src} alt="" width={image.width} height={image.height} className="max-h-[5.5rem] w-auto max-w-[4.75rem] object-contain" />
                  </div>
                  <div>
                    <p className="eyebrow text-[0.625rem] text-orange-text">No. {product.number}</p>
                    <Link href={`/products/${slug}`} className="mt-0.5 block text-[1.0625rem] font-medium hover:text-orange">
                      {product.name}
                    </Link>
                    <p lang="ml" className="font-ml text-xs text-muted">
                      {product.nameMalayalam} · {sizeLabel}
                    </p>
                  </div>
                  <p className="font-medium tabular-nums">{formatPrice(lineTotal)}</p>
                  <QtyStepper size="sm" label={product.name} value={qty} min={1} onChange={(q) => setQty(key, q)} className="mt-3 self-end justify-self-start" />
                  <button type="button" onClick={() => remove(key)} className="self-end text-xs text-muted underline-offset-2 hover:text-orange hover:underline">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {suggestions.length > 0 && lines.length > 0 && (
            <section className="mt-6" aria-labelledby="cart-suggest">
              <h3 id="cart-suggest" className="display text-xl">
                Goes well with these
              </h3>
              <ul className="mt-3 space-y-2">
                {suggestions.map((p) => (
                  <li key={p.slug} className="flex items-center gap-3 bg-sand p-3">
                    <Image src={p.images[0].src} alt="" width={p.images[0].width} height={p.images[0].height} className="h-14 w-auto" />
                    <div className="flex-1">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted">{formatPrice(p.price)}</p>
                    </div>
                    <button type="button" onClick={() => add(p.slug)} className="eyebrow text-xs text-orange-text hover:opacity-80">
                      Add +
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {lines.length > 0 && (
          <div className="bg-sand px-5 pt-5 pb-6 md:px-6">
            <div className="flex items-baseline justify-between">
              <p className="font-medium">Subtotal</p>
              <p className="font-medium tabular-nums">{formatPrice(total)}</p>
            </div>
            <p className="mt-1 font-serif text-sm text-muted">Shipping and taxes are calculated at checkout.</p>
            <Link href="/checkout" className={buttonClass("orange", "mt-5 w-full")}>
              Checkout
            </Link>
            <button type="button" onClick={closeDrawer} className="eyebrow mt-4 w-full py-2 text-xs hover:text-orange">
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
