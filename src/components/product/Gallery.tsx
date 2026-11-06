"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/data/products";
import { usePackChoice } from "@/store/pack";
import { cx } from "../ui";

/**
 * Product gallery: sand panel with the Malayalam name as a watermark, thumbnails below. Picking a
 * size (PackPicker) brings up the photo of that pack; it opens on the size already chosen.
 */
export function Gallery({ slug, images, watermark }: { slug: string; images: ProductImage[]; watermark: string }) {
  const chosen = usePackChoice((s) => s.chosen[slug]);
  const photoOf = (pack: string | undefined) => Math.max(0, images.findIndex((im) => pack && im.pack === pack));
  const [active, setActive] = useState(() => photoOf(chosen));
  // A new size picked: show its photo (state adjusted during render, not in an effect).
  const [shownFor, setShownFor] = useState(chosen);
  if (chosen !== shownFor) {
    setShownFor(chosen);
    if (images.some((im) => im.pack === chosen)) setActive(photoOf(chosen));
  }
  const img = images[active];
  return (
    <div>
      <div data-gallery-photo className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-sand md:aspect-auto md:h-[min(52rem,calc(100svh-5.5rem))]">
        {/* No lang="ml" here — see MalayalamDisplay in ui.tsx. */}
        <p aria-hidden className="absolute inset-x-0 top-[6%] text-center font-ml-display text-[clamp(3.5rem,8vw,7.5rem)] leading-none font-extrabold whitespace-nowrap text-ink/[0.07]">
          {watermark}
        </p>
        {img.cutout ? (
          <div className="absolute inset-x-0 top-[17%] bottom-[7%] flex justify-center">
            <picture key={img.src} className="contents">
              {img.mobileSrc && <source media="(max-width: 767px)" srcSet={img.mobileSrc} />}
              {/* No preload: it would fetch the desktop photo on phones as well. */}
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading={active === 0 ? "eager" : "lazy"}
                fetchPriority={active === 0 ? "high" : "auto"}
                sizes="(max-width: 767px) 50vw, 22rem"
                // max-w: the packets are wider than tall, and would be cropped at the sides.
                className="h-full w-auto max-w-[88%] object-contain drop-shadow-[0_18px_14px_rgb(22_19_15/0.22)]"
              />
            </picture>
          </div>
        ) : (
          <Image key={img.src} src={img.src} alt={img.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
        )}
      </div>
      {/* Thumbnails: as many as fit at 3.5rem or more each (4.5rem from md), sharing the row; phones get a second row. */}
      {images.length > 1 && (
        <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-3 px-5 md:grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] md:px-10" aria-label="Product images">
          {images.map((im, i) => (
            <li key={im.src} className="min-w-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}: ${im.alt}`}
                aria-pressed={i === active}
                className={cx("relative grid aspect-square w-full place-items-center overflow-hidden bg-sand", i === active ? "outline outline-1 outline-ink outline-offset-2" : "opacity-80 hover:opacity-100")}
              >
                {im.cutout ? (
                  // Positioned against the square button, so 85% is of a known size and the whole pack shows.
                  <Image src={im.thumbSrc ?? im.src} alt="" width={im.width} height={im.height} sizes="3rem" className="absolute inset-0 m-auto h-[85%] w-[85%] object-contain" />
                ) : (
                  <Image src={im.thumbSrc ?? im.src} alt="" fill sizes="6rem" className="object-cover" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
