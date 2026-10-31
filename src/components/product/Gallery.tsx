"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/data/products";
import { cx } from "../ui";

/** Product gallery: sand panel with the Malayalam name as a watermark, thumbnails below. */
export function Gallery({ images, watermark }: { images: ProductImage[]; watermark: string }) {
  const [active, setActive] = useState(0);
  const img = images[active];
  return (
    <div>
      <div className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-sand md:aspect-auto md:h-[min(52rem,calc(100svh-5.5rem))]">
        {/* No lang="ml" here — see MalayalamDisplay in ui.tsx. */}
        <p aria-hidden className="absolute inset-x-0 top-[6%] text-center font-ml-display text-[clamp(3.5rem,8vw,7.5rem)] leading-none font-extrabold whitespace-nowrap text-ink/[0.07]">
          {watermark}
        </p>
        {img.cutout ? (
          <div className="absolute inset-x-0 top-[17%] bottom-[7%] flex justify-center">
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              preload={active === 0}
              sizes="(max-width: 767px) 50vw, 22rem"
              className="h-full w-auto object-contain drop-shadow-[0_18px_14px_rgb(22_19_15/0.22)]"
            />
          </div>
        ) : (
          <Image key={img.src} src={img.src} alt={img.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
        )}
      </div>
      {images.length > 1 && (
        <ul className="mt-4 flex gap-3 px-5 md:px-10" aria-label="Product images">
          {images.map((im, i) => (
            <li key={im.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}: ${im.alt}`}
                aria-pressed={i === active}
                className={cx("relative grid size-[4.5rem] place-items-center overflow-hidden bg-sand md:size-[5.5rem]", i === active ? "outline outline-1 outline-ink outline-offset-2" : "opacity-80 hover:opacity-100")}
              >
                {im.cutout ? (
                  <Image src={im.src} alt="" width={im.width} height={im.height} sizes="3rem" className="h-[85%] w-auto" />
                ) : (
                  <Image src={im.src} alt="" fill sizes="6rem" className="object-cover" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
