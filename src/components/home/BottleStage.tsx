"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getPack, getProduct } from "@/data/products";
import { FRAME_COUNT, STILL_SRC, USE_FRAMES, frameSrc } from "@/lib/bottle";
import { usePackChoice } from "@/store/pack";
import { BASELINE, ENTER, EXIT, FADE, PACK_SLUG, play, reducedMotion, shadowWidth } from "./swap";

gsap.registerPlugin(ScrollTrigger);

/** Progress below/above which the bottle counts as at rest (photo shown). Set a little
 * inside the travel so the bottle is already moving and turning when it swaps. */
const REST_START = 0.04;
const REST_END = 0.96;
/** Hysteresis, so stopping right on a threshold can't flick between photo and render. */
const REST_MARGIN = 0.01;

/**
 * Wraps the hero + coconut-oil feature. The bottle (see BottleMover) sits in
 * #bottle-slot-hero; while the user scrolls, its wrapper is translated/scaled onto
 * #bottle-slot-feature, scrubbed both ways. It is the only bottle on the page: it shows
 * the size chosen on the feature, in the hero, in flight and landed. On the way the
 * photo tilts a little in 3D, a light sweep crosses it and its shadow stretches,
 * settling as it lands. With USE_FRAMES the photo instead swaps to a 360° frame
 * sequence on a canvas while moving (the frames show the 500 ml bottle only).
 * The wrapper stays in document flow, so after landing it scrolls with the page.
 */
export function BottleStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);

  // Starts on page load. Until it runs (or if it never does), a still bottle shows in the
  // feature slot as well, so the landing panel is never empty; [data-live] hides it.
  useEffect(() => {
    const stage = stageRef.current!;
    const mover = stage.querySelector<HTMLElement>(".bottle-mover");
    const heroSlot = stage.querySelector<HTMLElement>("#bottle-slot-hero");
    const featureSlot = stage.querySelector<HTMLElement>("#bottle-slot-feature");
    if (!mover || !heroSlot || !featureSlot) return;
    // Reduced motion: the bottle still travels to the feature, but without tilt,
    // sweep or turn.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Mobile browsers resize the viewport as their address bar shows and hides; the
    // landing point doesn't depend on viewport height, so there's no need to re-measure.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Layout positions (offsetTop/Left), not getBoundingClientRect: an animation on a
    // slot's ancestors (e.g. the size switch) can't skew the measurement.
    const pagePos = (el: HTMLElement) => {
      let x = 0;
      let y = 0;
      for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) {
        x += e.offsetLeft;
        y += e.offsetTop;
      }
      return { x, y };
    };
    const delta = () => {
      const h = pagePos(heroSlot);
      const f = pagePos(featureSlot);
      return { x: f.x - h.x, y: f.y - h.y, scale: featureSlot.offsetHeight / heroSlot.offsetHeight };
    };

    const canvas = mover.querySelector("canvas");
    const turn = USE_FRAMES && !reduced && canvas ? frameTurn(mover, canvas) : null;

    const tl = gsap.timeline({
      onUpdate: turn ? () => turn.update(tl.progress()) : undefined,
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        endTrigger: featureSlot,
        end: "center center",
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    tl.to(mover, { x: () => delta().x, y: () => delta().y, scale: () => delta().scale, ease: "power1.inOut", duration: 1 }, 0);
    if (!USE_FRAMES && !reduced) addPhotoMotion(tl, mover);
    stage.setAttribute("data-live", "");

    // Fonts, images and late layout can move the slots after first paint.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });
    const ro = new ResizeObserver(refresh);
    ro.observe(stage);

    return () => {
      ro.disconnect();
      window.removeEventListener("load", refresh);
      stage.removeAttribute("data-live");
      turn?.dispose();
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(mover, { clearProps: "transform" });
      // Only what the timeline set: React owns the shadow's size and the sheen's mask.
      gsap.set(mover.querySelectorAll(".bottle-tilt, .bottle-sheen, .bottle-shadow"), { clearProps: "transform,opacity,filter,backgroundPosition" });
    };
  }, []);

  return (
    <div ref={stageRef} className="bottle-stage relative">
      {children}
    </div>
  );
}

/**
 * Photo mode, on the travel timeline (0-1): a light 3D turn (rotateY 0 → −12° → +8° → 0
 * with a ±3° lean), one light sweep across the bottle, and a shadow that stretches and
 * softens in flight and settles on landing.
 */
function addPhotoMotion(tl: gsap.core.Timeline, mover: HTMLElement) {
  const tilt = mover.querySelector(".bottle-tilt");
  const sheen = mover.querySelector(".bottle-sheen");
  const shadow = mover.querySelector(".bottle-shadow");
  const ease = "sine.inOut";

  if (tilt) {
    gsap.set(tilt, { transformPerspective: 1200, transformOrigin: "50% 85%" });
    tl.to(tilt, { rotationY: -12, rotationZ: -3, ease, duration: 0.35 }, 0)
      .to(tilt, { rotationY: 8, rotationZ: 3, ease, duration: 0.35 }, 0.35)
      .to(tilt, { rotationY: 0, rotationZ: 0, ease, duration: 0.3 }, 0.7);
  }
  if (sheen) {
    tl.fromTo(sheen, { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", ease: "power1.inOut", duration: 0.6 }, 0.2);
  }
  if (shadow) {
    tl.to(shadow, { scaleX: 1.4, scaleY: 0.8, opacity: 0.45, filter: "blur(9px)", ease, duration: 0.5 }, 0)
      .to(shadow, { scaleX: 1, scaleY: 1, opacity: 1, filter: "blur(3px)", ease: "power2.out", duration: 0.5 }, 0.5);
  }
}

/**
 * Frame mode (USE_FRAMES): the canvas plays a 360° frame sequence between the two
 * swaps, eased in and out, holding frame 1 (aligned with the photo) before and after.
 * The photo shows at rest; the canvas takes over only once the frame for the current
 * position has loaded and been drawn, so on a slow connection the photo keeps
 * travelling instead of the bottle disappearing.
 */
function frameTurn(mover: HTMLElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const set = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
  const frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
  let drawn = -1;
  let wanted = 0;
  let progress = 0; // scroll timeline progress, 0-1
  let moving = false;
  let disposed = false;

  // Always draw the nearest frame that has finished loading.
  const nearestLoaded = (i: number) => {
    for (let d = 0; d <= FRAME_COUNT / 2; d++) {
      const a = (i + d) % FRAME_COUNT;
      if (frames[a]) return a;
      const b = (i - d + FRAME_COUNT) % FRAME_COUNT;
      if (frames[b]) return b;
    }
    return -1;
  };

  const draw = (i: number) => {
    wanted = i;
    const j = nearestLoaded(i);
    if (j < 0 || j === drawn) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[j]!, 0, 0, canvas.width, canvas.height);
    drawn = j;
  };

  const turnEase = gsap.parseEase("power1.inOut");
  const frameAt = (p: number) => {
    const t = gsap.utils.clamp(0, 1, (p - REST_START) / (REST_END - REST_START));
    return Math.round(turnEase(t) * FRAME_COUNT) % FRAME_COUNT;
  };

  // Photo at rest, render while moving (CSS crossfade on .is-moving).
  const setMoving = (p: number) => {
    // Enter motion past the thresholds; return to rest only a margin back from them.
    const inMotion = moving
      ? p > REST_START - REST_MARGIN && p < REST_END + REST_MARGIN
      : p > REST_START && p < REST_END;
    const next = inMotion && (moving ? drawn >= 0 : frames[frameAt(p)] !== null && drawn === frameAt(p));
    if (next !== moving) mover.classList.toggle("is-moving", (moving = next));
  };

  // Frames load after the page (and the photo, the LCP image) have, in bisection order
  // (0, 60, 30, 90, 15, 45, …): a rough version of the whole turn is there early and
  // fills in as more arrive.
  const order = [0];
  const spans: [number, number][] = [[0, FRAME_COUNT]];
  for (let s = 0; s < spans.length; s++) {
    const [lo, hi] = spans[s];
    if (hi - lo < 2) continue;
    const mid = Math.round((lo + hi) / 2);
    order.push(mid);
    spans.push([lo, mid], [mid, hi]);
  }
  const load = (i: number) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(set, i);
      img
        .decode()
        .then(() => {
          if (disposed) return;
          frames[i] = img;
          // Redraw if this frame is closer to the one we want than what is on screen,
          // and swap to the canvas now if the photo was held back waiting for frames.
          draw(wanted);
          setMoving(progress);
        })
        .catch(() => {})
        .finally(resolve);
    });
  const loadAll = async () => {
    await load(order[0]);
    // A few parallel lanes keep the network busy without flooding it.
    let next = 1;
    const lane = async () => {
      while (!disposed && next < order.length) await load(order[next++]);
    };
    await Promise.all([lane(), lane(), lane(), lane()]);
  };
  if (document.readyState === "complete") void loadAll();
  else window.addEventListener("load", () => void loadAll(), { once: true });

  // Canvas backing store follows the wrapper's CSS size and the device pixel ratio.
  const sizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(mover.offsetWidth * dpr);
    canvas.height = Math.round(mover.offsetHeight * dpr);
    drawn = -2;
    draw(wanted);
  };
  sizeCanvas();
  ScrollTrigger.addEventListener("refreshInit", sizeCanvas);

  return {
    update(p: number) {
      progress = p;
      // Draw first, so the canvas never fades in empty.
      draw(frameAt(p));
      setMoving(p);
    },
    dispose() {
      disposed = true;
      ScrollTrigger.removeEventListener("refreshInit", sizeCanvas);
      mover.classList.remove("is-moving");
    },
  };
}

/** The product photo, aligned pixel-for-pixel with frame 1 of the render. */
export function BottleStill({ priority, className }: { priority?: boolean; className?: string }) {
  return (
    <picture className={className}>
      <source media="(max-width: 767px)" srcSet={STILL_SRC.mobile} />
      <img
        src={STILL_SRC.desktop}
        alt="Neeram Coconut Oil, 500 ml clear bottle"
        width={1000}
        height={1500}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain"
      />
    </picture>
  );
}

/**
 * The one bottle on the page: shadow, then the tilt layer (the chosen size's image +
 * light sweep masked to it), and in frame mode a canvas, stacked in one wrapper that
 * fills #bottle-slot-hero. The wrapper carries the travel, .bottle-swap the size switch
 * and the tilt layer only the 3D turn. None of them is ever unmounted or hidden by
 * scroll position; a new size swaps only the image inside.
 *
 * Switch: the image on screen exits (drops, shrinks, blurs, fades), then the new one is
 * mounted and enters once decoded. A newer pick mid-exit continues the exit from where
 * it is, toward the latest choice; picking back the size still on screen brings it
 * straight back in.
 */
export function BottleMover() {
  const product = getProduct(PACK_SLUG)!;
  const packs = product.packs!;
  const chosen = getPack(product, usePackChoice((s) => s.chosen[PACK_SLUG]))!;
  const [shown, setShown] = useState(chosen);
  const swapRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);
  /** The image on screen has started (or finished) its exit. */
  const out = useRef(false);

  // Preload every size so a switch never waits on the network or flashes.
  useEffect(() => {
    for (const p of packs.slice(1)) {
      const img = new window.Image();
      img.src = p.image.src;
      void img.decode().catch(() => {});
    }
  }, [packs]);

  useEffect(() => {
    const body = swapRef.current!;
    const shadow = shadowRef.current!;
    const reduced = reducedMotion();

    if (chosen.id !== shown.id) {
      out.current = true;
      play(shadow, [{}, { opacity: 0, scale: "0.7 0.7" }], reduced ? FADE : EXIT);
      const anim = reduced
        ? play(body, [{}, { opacity: 0 }], FADE)
        : play(body, [{}, { opacity: 0, transform: "translateY(24px) scale(0.94)", filter: "blur(4px)" }], EXIT);
      anim.onfinish = () => setShown(chosen);
      return () => {
        anim.onfinish = null;
      };
    }
    if (!out.current) return;

    let live = true;
    const enter = () => {
      out.current = false;
      const glow = document.querySelector<HTMLElement>(".feature-glow");
      if (glow && !reduced) play(glow, [{ opacity: 0.6 }, { opacity: 1 }], { duration: 700, easing: "ease-out" });
      play(shadow, [{ opacity: 0, scale: "0.7 0.7" }, { opacity: 1, scale: "1 1" }], reduced ? FADE : ENTER);
      const anim = reduced
        ? play(body, [{ opacity: 0 }, { opacity: 1 }], FADE)
        : play(
            body,
            [
              { opacity: 0, transform: "translateY(30px) scale(0.92)", filter: "blur(6px)" },
              { opacity: 1, transform: "translateY(-2px) scale(1.02)", filter: "blur(0px)", offset: 0.7 },
              { opacity: 1, transform: "none", filter: "blur(0px)" },
            ],
            ENTER,
          );
      // It ends in its natural state: drop the animations and what play() committed
      // inline from interrupted ones, so the travel timeline owns the shadow again.
      anim.onfinish = () => {
        for (const el of [body, shadow]) {
          el.getAnimations().forEach((a) => a.cancel());
          for (const prop of ["opacity", "transform", "filter", "scale"]) if (el !== shadow || prop !== "transform") el.style.removeProperty(prop);
        }
      };
    };
    const img = body.querySelector("img");
    void (img ? img.decode().catch(() => {}) : Promise.resolve()).then(() => live && enter());
    return () => {
      live = false;
    };
  }, [chosen, shown]);

  const isDefault = shown.id === packs[0].id;
  const shadow = shadowWidth(shown, isDefault);
  // Every size stands on the 500 ml bottle's floor line, at its own height.
  const box = isDefault ? undefined : { top: "auto", bottom: `${BASELINE}%`, height: `${shown.stageHeight * 100}%` };

  return (
    <div data-frames={(USE_FRAMES && isDefault) || undefined} className="bottle-mover pointer-events-none absolute inset-0 z-10 origin-top-left">
      <span ref={shadowRef} aria-hidden className="bottle-shadow" style={{ width: `${shadow}%`, left: `${(100 - shadow) / 2}%` }} />
      <div ref={swapRef} className="bottle-swap absolute inset-0">
        <div className="bottle-tilt absolute inset-0">
          {isDefault ? (
            <BottleStill priority />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- preloaded by exact URL above
            <img
              key={shown.id}
              src={shown.image.src}
              alt={shown.image.alt}
              width={shown.image.width}
              height={shown.image.height}
              decoding="async"
              className="absolute inset-x-0 w-full object-contain object-bottom"
              style={box}
            />
          )}
          {!USE_FRAMES && (
            <span
              aria-hidden
              className="bottle-sheen"
              style={box && { ...box, maskImage: `url(${shown.image.src})`, maskPosition: "bottom center" }}
            />
          )}
        </div>
        {USE_FRAMES && <canvas aria-hidden className="absolute inset-0 h-full w-full" />}
      </div>
    </div>
  );
}
