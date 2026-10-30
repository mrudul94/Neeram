"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getPack, getProduct, type Pack } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { usePackChoice } from "@/store/pack";
import { AddToCartButton } from "../AddToCart";
import { cx } from "../ui";
import { ENTER, EXIT, FADE, PACK_SLUG, play, reducedMotion } from "./swap";

/**
 * Left half of the coconut-oil feature: the landing slot for the scroll bottle, the size
 * buttons and the caption. The slot itself is empty: the bottle in it is BottleMover,
 * which shows whichever size is picked here (from the shared usePackChoice store).
 */
export function FeatureStage() {
  const product = getProduct(PACK_SLUG)!;
  const packs = product.packs!;
  const choose = usePackChoice((s) => s.choose);
  const chosen = getPack(product, usePackChoice((s) => s.chosen[PACK_SLUG]))!;
  const caption = (p: Pack) => `${p.size} · Double filtered · ${p.form}`;

  return (
    <>
      <div id="bottle-slot-feature" className="relative aspect-[2/3] h-[min(52svh,30rem)] md:h-[min(56svh,32rem)]" />

      <div role="group" aria-label="Choose a size" className="relative z-20 mt-8 flex gap-2 md:absolute md:bottom-20 md:left-10 md:mt-0 md:gap-3">
        {packs.map((p) => {
          const on = p.id === chosen.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              aria-label={p.label}
              onClick={() => choose(PACK_SLUG, p.id)}
              className={cx(
                "flex w-[4.5rem] flex-col items-center gap-1.5 border px-2 pt-2 pb-2.5 transition-colors duration-200 md:w-20",
                on ? "border-orange bg-cream/10 text-cream" : "border-cream/25 text-cream/70 hover:border-cream/60 hover:text-cream",
              )}
            >
              <span className="grid h-14 w-full place-items-center">
                <Image src={p.image.src} alt="" width={p.image.width} height={p.image.height} sizes="4rem" className="max-h-14 w-auto max-w-full object-contain" />
              </span>
              <span className="text-sm leading-none font-medium">{p.size}</span>
              <span className="eyebrow text-[0.5625rem] leading-none">{p.form === "Packet" ? "Packet" : "Bottle"}</span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="eyebrow absolute bottom-6 left-5 text-[0.6875rem] text-cream/80 md:left-10">
        <SwapText value={caption(chosen)} all={packs.map(caption)} />
      </p>
    </>
  );
}

/**
 * Text that changes with the chosen pack: the old text slides down 8px and fades out,
 * the new one rises 8px into place, on the same timings as the bottle. Every option is
 * laid out (hidden) in the same grid cell, on one line, so the size never changes
 * between them.
 */
function SwapText({ value, all }: { value: string; all: string[] }) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const entering = useRef(false);

  useEffect(() => {
    const el = ref.current!;
    if (value === shown) return;
    const reduced = reducedMotion();
    const exit = play(el, [{}, { opacity: 0, transform: reduced ? "none" : "translateY(8px)" }], reduced ? FADE : EXIT);
    exit.onfinish = () => {
      entering.current = true;
      setShown(value);
    };
    return () => {
      exit.onfinish = null;
    };
  }, [value, shown]);

  useLayoutEffect(() => {
    if (!entering.current) return;
    entering.current = false;
    const reduced = reducedMotion();
    play(ref.current!, [{ opacity: 0, transform: reduced ? "none" : "translateY(8px)" }, { opacity: 1, transform: "none" }], reduced ? FADE : ENTER);
  }, [shown]);

  return (
    <span className="inline-grid whitespace-nowrap">
      {[...new Set(all)].map((t) => (
        <span key={t} aria-hidden className="invisible col-start-1 row-start-1">
          {t}
        </span>
      ))}
      <span ref={ref} className="col-start-1 row-start-1">
        {shown}
      </span>
    </span>
  );
}

/** The feature's Add button, for whichever size is picked on the stage. */
export function FeatureAddButton() {
  const product = getProduct(PACK_SLUG)!;
  const pack = getPack(product, usePackChoice((s) => s.chosen[PACK_SLUG]))!;
  // Short enough to stay on one line at phone width: "Add · 500 ml packet · ₹ 240".
  const label = (p: Pack) => {
    const price = p.price ?? product.price;
    return `Add · ${p.size}${p.form === "Packet" ? " packet" : ""}${price === null ? "" : ` · ${formatPrice(price)}`}`;
  };
  return (
    <AddToCartButton slug={PACK_SLUG} pack={pack.id} variant="orange" arrow>
      <SwapText value={label(pack)} all={product.packs!.map(label)} />
    </AddToCartButton>
  );
}
