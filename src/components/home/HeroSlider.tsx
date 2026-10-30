"use client";

import Image from "next/image";
import { useState } from "react";
import type { HeroSlide } from "@/data/content";
import { ButtonLink, ChevronLeft, ChevronRight, Eyebrow, cx } from "../ui";
import { BottleMover } from "./BottleStage";

/**
 * Hero slider. Phase 1 has a single coconut-oil slide; spice slides are added in
 * src/data/content.ts. The coconut-oil slide holds #bottle-slot-hero, where the
 * scroll-spinning bottle starts.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const many = slides.length > 1;
  const go = (d: number) => setIndex((i) => (i + d + slides.length) % slides.length);

  return (
    <section
      aria-roledescription={many ? "carousel" : undefined}
      aria-label="Featured"
      className="relative isolate z-10 bg-ink text-cream md:min-h-[max(100svh,46rem)]"
    >
      <div aria-hidden className="absolute inset-y-0 right-0 -z-10 w-full md:w-[62%]">
        <Image src={slide.image.src} alt="" fill preload data-loader-assetsizes="(max-width: 767px) 100vw, 62vw" className="object-cover object-[30%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/70 to-ink md:bg-gradient-to-r md:from-ink md:via-ink/55 md:to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="wrap flex flex-col pt-[6.5rem] md:min-h-[max(100svh,46rem)] md:pt-[5.5rem]">
        <div
          key={slide.id}
          role={many ? "group" : undefined}
          aria-roledescription={many ? "slide" : undefined}
          aria-label={many ? `${index + 1} of ${slides.length}` : undefined}
          className="grid flex-1 items-center gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-10"
        >
          <div className="md:py-12">
            <Eyebrow ml={slide.eyebrowMalayalam}>{slide.eyebrow}</Eyebrow>
            <h1 className="display mt-5 text-[clamp(3.25rem,6.6vw,5.9rem)]">
              {slide.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-[27rem] font-serif text-lg leading-snug text-cream/90 md:text-xl">{slide.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href={slide.cta.href} arrow>
                {slide.cta.label}
              </ButtonLink>
              <ButtonLink href={slide.secondary.href} variant="text">
                {slide.secondary.label}
              </ButtonLink>
            </div>
          </div>

          {slide.productSlug === "coconut-oil" && (
            <div className="flex justify-center md:justify-end md:self-end">
              <div
                id="bottle-slot-hero"
                className="relative aspect-[2/3] h-[min(62svh,34rem)] md:h-[min(75svh,47rem)] md:-mb-6"
              >
                <BottleMover />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 mb-6 flex items-end gap-6 md:mb-8">
          <ol className="flex flex-1 gap-2">
            {slides.map((s, i) => (
              <li key={s.id} className="max-w-[11rem] flex-1">
                <button
                  type="button"
                  disabled={!many}
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? "true" : undefined}
                  className="w-full text-left disabled:cursor-default"
                >
                  <span className={cx("block h-0.5", i === index ? "bg-orange" : "bg-cream/70")} />
                  <span className="mt-3 flex gap-4 text-sm">
                    <span className="tabular-nums text-cream/80">{String(i + 1).padStart(2, "0")}</span>
                    {s.tab}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          {many && (
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="grid size-9 place-items-center border border-cream/80 hover:bg-cream hover:text-ink">
                <ChevronLeft />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next slide" className="grid size-9 place-items-center border border-cream/80 hover:bg-cream hover:text-ink">
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
