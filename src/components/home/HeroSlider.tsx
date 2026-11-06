"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  const headlineWraps = useHeadlineFontMissing(slide.headline.join(" "));

  return (
    <section
      aria-roledescription={many ? "carousel" : undefined}
      aria-label="Featured"
      className="relative isolate z-10 bg-ink text-cream md:min-h-[max(100svh,46rem)]"
    >
      <div aria-hidden className="absolute inset-y-0 right-0 -z-10 w-full md:w-[62%]">
        <Image src={slide.image.src} alt="" fill loading="eager" sizes="(max-width: 767px) 100vw, 62vw" className="object-cover object-[30%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/70 to-ink md:bg-gradient-to-r md:from-ink md:via-ink/55 md:to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="wrap flex flex-col pt-[6.5rem] md:min-h-[max(100svh,46rem)] md:pt-[5.5rem]">
        <div
          key={slide.id}
          role={many ? "group" : undefined}
          aria-roledescription={many ? "slide" : undefined}
          aria-label={many ? `${index + 1} of ${slides.length}` : undefined}
          // Phones: the bottle fills whatever the first screen has left below the text, so the
          // whole bottle is visible on load (svh: measured with the address bar showing). The column
          // is held to the screen width (minmax(0,1fr)): a wider stand-in font for the headline would
          // otherwise widen it until the real font arrives, re-wrapping the text and resizing the bottle.
          className="grid flex-1 items-center gap-6 max-md:min-h-[calc(100svh-7.5rem)] max-md:grid-cols-[minmax(0,1fr)] max-md:grid-rows-[auto_minmax(12rem,1fr)] md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-10"
        >
          <div className="md:py-12">
            {/* The page's H1 says what and where; the big headline below keeps its look. Below 29rem it
                wraps onto two or three rows depending on the font (the stand-in is wider), so it keeps
                room for its tallest layout: dash, text and Malayalam on three rows, 47 px. Wider, it
                fits on one row in either font. */}
            <Eyebrow as="h1" ml={slide.eyebrowMalayalam} className="flex-wrap gap-y-1 max-[29rem]:min-h-[calc(1px+1.125rem+1.25rem+0.5rem)] max-[29rem]:content-start">
              {slide.eyebrow}
            </Eyebrow>
            {/* Clipped, not widened, while the wider stand-in font overflows. If Anton never arrives,
                the lines wrap instead, so the headline stays readable. */}
            <p className={cx("display mt-5 text-[clamp(3.25rem,6.6vw,5.9rem)]", !headlineWraps && "overflow-x-clip")}>
              {slide.headline.map((line) => (
                // One line each, so the wider fallback font can't wrap them and push the bottle down.
                <span key={line} className={cx("block", !headlineWraps && "min-[340px]:whitespace-nowrap")}>
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-6 max-w-[27rem] font-serif text-lg leading-snug text-cream/90 md:text-xl">{slide.body}</p>
            {/* Stacked below 27rem and in one row above it, so the screen width decides, not the
                font: the stand-in font is wider and would otherwise wrap them until the real one loads. */}
            <div data-keep-clear className="mt-8 flex flex-col items-start gap-x-8 gap-y-4 min-[27rem]:flex-row min-[27rem]:items-center">
              <ButtonLink href={slide.cta.href} arrow>
                {slide.cta.label}
              </ButtonLink>
              <ButtonLink href={slide.secondary.href} variant="text">
                {slide.secondary.label}
              </ButtonLink>
            </div>
          </div>

          {slide.productSlug === "coconut-oil" && (
            <div className="flex justify-center max-md:h-full max-md:self-stretch md:justify-end md:self-end">
              <div
                id="bottle-slot-hero"
                className="relative aspect-[2/3] h-full md:h-[min(75svh,47rem)] md:-mb-6"
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

/** How long after the page starts loading the headline waits for Anton before it may wrap. */
const HEADLINE_FONT_WAIT_MS = 3000;

/**
 * True once Anton has failed to load, or still hasn't 3 s after the page started loading. The
 * headline then wraps instead of staying clipped. That moves the bottle once, but only on a page
 * where the font is blocked or very slow; it normally arrives in about 2 s even on slow 4G.
 */
function useHeadlineFontMissing(text: string) {
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let live = true;
    const give = () => live && setMissing(true);
    const timer = window.setTimeout(give, Math.max(0, HEADLINE_FONT_WAIT_MS - performance.now()));
    // "Anton" is the family next/font/google declares (src/app/fonts.ts).
    document.fonts.load("1em Anton", text).then(
      (faces) => {
        if (!faces.some((f) => f.status === "loaded")) return give();
        window.clearTimeout(timer);
      },
      give,
    );
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [text]);
  return missing;
}
