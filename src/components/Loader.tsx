"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { markLoaderDone } from "@/lib/loader";

declare global {
  interface Window {
    /** Set by the loader script while the loader shows (see engine). */
    __neeramLoader?: {
      /** The app is up: `onClosed` runs once the loader has gone (at once if it already has). */
      hydrated: (onClosed: () => void) => void;
    };
  }
}

const TIMING = {
  /** From when the loader shows, so the pour reads. */
  min: 1800,
  /** From navigation start: fill by then whatever is still loading (the ending also waits for the app's JS). */
  max: 4500,
};

/**
 * The word's viewBox (design/neeram-oil-wordmark.html), with the oil's floor, the level
 * that counts as full (just over the cap tops at 10.2, so the wave clears them) and where
 * the stream lands (16% into the third letter).
 */
const GEO = { width: 1000, height: 300, floor: 272, full: 4, stemX: 339.8 };

/**
 * NEERAM in Anton (the display face) as outlines, set as the reference sets its text:
 * 300 units, baseline 268, squeezed to 900 units wide and centred. Paths rather than
 * <text>, so it needs no font load (it shows from the first frame and never swaps fonts)
 * and, unlike text, isn't taken as the page's Largest Contentful Paint, which stays the
 * hero underneath.
 */
const WORD = "M111.2 268.0L61.3 268.0L61.3 10.2L113.8 10.2L137.3 133.7L137.3 10.2L186.7 10.2L186.7 268.0L136.8 268.0L111.2 139.1L111.2 268.0M314.7 268.0L209.3 268.0L209.3 10.2L311.4 10.2L311.4 60.0L261.2 60.0L261.2 110.2L309.4 110.2L309.4 158.7L261.2 158.7L261.2 217.8L314.7 217.8L314.7 268.0M437.0 268.0L331.6 268.0L331.6 10.2L433.7 10.2L433.7 60.0L383.5 60.0L383.5 110.2L431.7 110.2L431.7 158.7L383.5 158.7L383.5 217.8L437.0 217.8L437.0 268.0M505.5 268.0L453.9 268.0L453.9 10.2L532.2 10.2Q551.8 10.2 561.8 19.2Q571.8 28.2 575.2 44.4Q578.6 60.6 578.6 82.4L578.6 82.4Q578.6 103.5 573.3 116.1Q568.0 128.7 553.4 133.5L553.4 133.5Q565.4 136.0 570.3 145.6Q575.1 155.2 575.1 170.4L575.1 170.4L575.1 268.0L524.8 268.0L524.8 167.1Q524.8 155.8 520.2 153.1Q515.7 150.4 505.5 150.4L505.5 150.4L505.5 268.0M505.8 57.9L505.8 105.7L518.1 105.7Q528.7 105.7 528.7 82.4L528.7 82.4Q528.7 67.3 526.4 62.6Q524.1 57.9 517.7 57.9L517.7 57.9L505.8 57.9M638.1 268.0L588.5 268.0L613.2 10.2L699.8 10.2L724.0 268.0L675.7 268.0L672.1 226.4L641.3 226.4L638.1 268.0M654.6 54.1L644.9 185.2L668.1 185.2L657.0 54.1L654.6 54.1M785.8 268.0L739.7 268.0L739.7 10.2L817.4 10.2L838.9 167.4L860.2 10.2L938.7 10.2L938.7 268.0L892.0 268.0L892.0 82.3L862.7 268.0L816.8 268.0L785.8 82.3L785.8 268.0";

/**
 * The loader, inlined as a script right after its markup so it runs while the HTML is
 * parsed, before first paint and long before the app's JS arrives. Self-contained: it is
 * serialised with toString(), so it may only use its arguments and browser globals.
 *
 * Shows only on the session's first page load. Golden oil pours into the hollow NEERAM
 * and its level, the counter and the line follow real loading (the HTML, images marked
 * data-loader-asset, the fonts and the app starting), eased and never going back, held
 * short of full until everything is in and `min` has passed (or `max`). Once full it
 * plays the ending (~1.15 s): the stream falls away and the oil calms while a shine
 * crosses the letters, the word and bottom row lift out, and the overlay wipes upward
 * behind a gold edge, overlapping the lift. The ending runs here, not on the app's GSAP,
 * so it never waits for the app's JS (on Slow 4G that arrives seconds after the cap).
 * Reduced motion: the word shows full and still, the counter still counts, then a
 * 300 ms fade.
 */
function engine(key: string, o: typeof TIMING, g: typeof GEO) {
  const root = document.getElementById("neeram-loader");
  if (!root) return;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {}
  root.setAttribute("data-show", "");
  const t0 = performance.now();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) root.setAttribute("data-reduced", "");
  const $ = <T extends Element>(s: string) => root.querySelector(s) as T;
  const svg = $<SVGSVGElement>(".loader-word");
  const oil = $<SVGPathElement>(".loader-oil");
  const surface = $<SVGPathElement>(".loader-surface");
  const splash = $<SVGEllipseElement>(".loader-splash");
  const bubbleEls = root.querySelectorAll<SVGCircleElement>(".loader-bubbles circle");
  const stream = $<HTMLElement>(".loader-stream");
  const grain = $<HTMLCanvasElement>(".loader-grain");
  const meter = $<HTMLElement>("[role=progressbar]");
  const digits = root.querySelectorAll<HTMLElement>(".loader-count span");
  const line = $<HTMLElement>(".loader-line span");

  let total = 0;
  let completed = 0;
  const task = () => {
    let done = false;
    total++;
    return () => {
      if (!done) completed++;
      done = true;
    };
  };

  // Film grain: one noise tile, drawn once and stretched over a layer a fifth larger than
  // the screen (as coarse as the reference's), which the loop shifts about.
  const gc = grain.getContext("2d");
  if (gc) {
    const img = gc.createImageData(grain.width, grain.height);
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.random() * 255;
      img.data[i + 3] = 255;
    }
    gc.putImageData(img, 0, 0);
  }

  // The word fades in just after the first paint; the stream aims at the third letter.
  let wordAt = -1;
  const sx = g.stemX;
  let ctm: DOMMatrix | null = null;
  const measure = () => {
    ctm = svg.getScreenCTM();
  };
  requestAnimationFrame(() =>
    requestAnimationFrame((now) => {
      wordAt = now;
      measure();
      root.setAttribute("data-word", "");
    }),
  );
  addEventListener("resize", measure);

  let closed = false;
  let onClosed: (() => void) | null = null;
  const app = task();

  // Keyboard focus stays on the loader while it covers the page (it is aria-modal for
  // screen readers). A trap, not inert on the page: that would change elements React
  // has yet to hydrate.
  const skip = $<HTMLElement>(".loader-skip");
  const trap = (e: FocusEvent) => {
    if (!root.contains(e.target as Node)) skip.focus();
  };
  document.addEventListener("focusin", trap);

  const dom = task();
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll<HTMLImageElement>("img[data-loader-asset]").forEach((img) => {
      if (img.complete) return;
      const done = task();
      img.addEventListener("load", done);
      img.addEventListener("error", done);
    });
    const fonts = task();
    if (document.fonts) document.fonts.ready.then(fonts, fonts);
    else fonts();
    dom();
  });

  const bubbles = Array.from(bubbleEls, (el) => {
    el.setAttribute("r", (1 + Math.random() * 2.4).toFixed(1));
    return { el, x: 70 + Math.random() * 860, v: 18 + Math.random() * 30, d: Math.random() * 6 };
  });
  let raf = 0;
  let stopped = false;
  let shown = 0;
  let k = 0; // animation clock, seconds; stands still while the tab is hidden
  let last = t0;
  let endAt = -1; // when the ending started
  const params = { wobble: 1, pour: 1 };

  // Ease curves for the ending (GSAP's power2/power3 shapes).
  const out2 = (t: number) => 1 - (1 - t) * (1 - t);
  const inOut2 = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));
  const IN2 = "cubic-bezier(0.55, 0.085, 0.68, 0.53)";
  const INOUT3 = "cubic-bezier(0.645, 0.045, 0.355, 1)";
  const shine = $<SVGRectElement>(".loader-shine");
  const edge = $<HTMLElement>(".loader-edge");
  const inner = $<HTMLElement>(".loader-inner");

  const close = () => {
    closed = true;
    release();
    if (onClosed) onClosed();
  };
  const fade = (ms: number) => {
    root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: "ease-out", fill: "forwards" }).onfinish = close;
  };
  const end = (now: number) => {
    endAt = now;
    if (reduced) return fade(300);
    // Pour, wave and shine follow endAt in the frame loop; the rest is plain animation.
    const lift = (el: Element, y: string) =>
      el.animate([{}, { transform: "translateY(" + y + ")", opacity: 0 }], { duration: 250, delay: 350, easing: IN2, fill: "forwards" });
    lift(svg, "-6%");
    lift(meter, "-6px");
    lift(skip, "-6px");
    // The wipe: the overlay slides up while its contents slide down as far, so they stay
    // put and only the overlay's bottom edge (carrying the gold line) moves. Transforms
    // only, so it runs on the compositor and nothing counts as a layout shift.
    const wipe = { duration: 600, delay: 550, easing: INOUT3, fill: "forwards" as const };
    edge.animate([{ opacity: 1 }, { opacity: 1 }], wipe);
    inner.animate([{ transform: "none" }, { transform: "translateY(100%)" }], wipe);
    root.animate([{ transform: "none" }, { transform: "translateY(-100%)" }], wipe).onfinish = close;
  };

  const frame = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    k += dt;
    // performance.now() counts from navigation start, so `max` caps the whole wait; when
    // it does, the oil rises the rest of the way quickly.
    const capped = now >= o.max;
    const finishing = (completed >= total && now - t0 >= o.min) || capped;
    const gap = (finishing ? 1 : (completed / total) * 0.96) - shown;
    if (gap > 0) {
      shown += capped
        ? Math.min(gap, gap * (1 - Math.exp(-dt / 0.15)) + 1.5 * dt, 3.5 * dt)
        : Math.min(gap, gap * (1 - Math.exp(-dt / 0.4)) + 0.04 * dt, (finishing ? 1.4 : 0.7) * dt);
    }
    if (finishing && shown >= 0.999) shown = 1;
    if (endAt >= 0) {
      const e = (now - endAt) / 1000;
      params.pour = 1 - out2(Math.min(1, e / 0.25));
      params.wobble = 1 - 0.65 * out2(Math.min(1, e / 0.25));
      shine.setAttribute("x", (-260 + 1360 * inOut2(Math.min(1, e / 0.45))).toFixed(1));
    }

    const n = String(Math.round(shown * 100));
    if (meter.getAttribute("aria-valuenow") !== n) {
      meter.setAttribute("aria-valuenow", n);
      n.padStart(3, "0")
        .split("")
        .forEach((c, i) => (digits[i].textContent = c));
    }
    line.style.transform = "scaleX(" + shown + ")";

    if (wordAt >= 0) {
      // The stream starts a beat after the word appears, and the ending stops it.
      const t = Math.min(1, Math.max(0, (now - wordAt - 250) / 350));
      const pour = reduced ? 0 : Math.min(t * t, params.pour);
      const y = g.floor - (g.floor - g.full) * (reduced ? 1 : shown);
      const amp = reduced ? 0 : 3.2 * params.wobble;
      // Two travelling waves, and a slight mound where the stream lands.
      const yAt = (x: number) => y + Math.sin(x / 70 + k * 2.2) * amp + Math.sin(x / 23 - k * 3.1) * amp * 0.35 - Math.exp(-(((x - sx) / 60) ** 2)) * 3 * pour;
      let d = "";
      for (let x = 0; x <= 1000; x += 20) d += (x ? "L" : "M") + x + " " + yAt(x).toFixed(2);
      surface.setAttribute("d", d);
      oil.setAttribute("d", d + "L1000 320L0 320Z");

      if (!reduced) {
        const r = (k * 1.6) % 1;
        splash.setAttribute("cy", y.toFixed(1));
        splash.setAttribute("rx", ((6 + r * 34) * pour).toFixed(1));
        splash.setAttribute("ry", ((1.5 + r * 5) * pour).toFixed(1));
        splash.setAttribute("stroke-opacity", (0.6 * (1 - r) * pour).toFixed(2));
        // Bubbles rise from the floor and vanish just under the surface.
        for (const b of bubbles) {
          const by = 300 - ((k * b.v + b.d * 40) % (300 - y + 10));
          b.el.setAttribute("cx", (b.x + Math.sin(k * 1.3 + b.d) * 4).toFixed(1));
          b.el.setAttribute("cy", by.toFixed(1));
          b.el.setAttribute("fill-opacity", by > y + 6 ? "0.35" : "0");
        }
        // The stream falls from the top of the screen onto the surface; it is 2.4 word
        // units wide with a slight shimmer, never under a pixel.
        if (ctm) {
          const bottom = ctm.d * yAt(sx) + ctm.f;
          const w = Math.max(1, ctm.a * (2.4 + Math.sin(k * 11) * 0.35));
          stream.style.width = w.toFixed(2) + "px";
          stream.style.height = Math.max(0, bottom * pour) + "px";
          stream.style.transform = "translate(" + (ctm.a * sx + ctm.e - w / 2).toFixed(1) + "px," + (bottom * (1 - pour)).toFixed(1) + "px)";
        }
        // Grain: a new offset every other frame.
        if (Math.round(k * 60) % 2) {
          grain.style.transform = "translate(" + (Math.random() - 0.5) * 0.2 * innerWidth + "px," + (Math.random() - 0.5) * 0.2 * innerHeight + "px)";
        }
      }
      if (shown === 1 && endAt < 0) end(now);
    }
    raf = requestAnimationFrame(frame);
  };

  // No frames while the tab is hidden; the clock skips the gap on return.
  const onVisibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden && !stopped) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener("visibilitychange", onVisibility);
  raf = requestAnimationFrame(frame);

  const release = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", onVisibility);
    removeEventListener("resize", measure);
    document.removeEventListener("focusin", trap);
    root.removeAttribute("data-show");
  };

  window.__neeramLoader = {
    hydrated(cb) {
      app();
      onClosed = cb;
      if (closed) cb();
    },
  };

  skip.addEventListener("click", () => {
    if (endAt >= 0) return;
    endAt = performance.now();
    fade(200);
  });
}

const SCRIPT = `(${engine.toString()})(${JSON.stringify("neeram-loader-seen")},${JSON.stringify(TIMING)},${JSON.stringify(GEO)})`;

/**
 * First-visit loading screen: golden oil pouring into and filling the NEERAM wordmark,
 * run by the inline script above; the page renders normally underneath. Once it has gone
 * (or straight away when it was skipped this load) this removes it and calls
 * markLoaderDone(), so the page's scroll animations start (src/lib/loader.ts).
 */
export function Loader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const finish = () => {
      setGone(true);
      markLoaderDone();
      ScrollTrigger.refresh();
    };
    if (window.__neeramLoader) window.__neeramLoader.hydrated(finish);
    else finish();
  }, []);

  if (gone) return null;

  // The script changes attributes and text in here before React hydrates.
  return (
    <>
      <div id="neeram-loader" role="dialog" aria-modal="true" aria-label="Neeram" className="neeram-loader" suppressHydrationWarning>
        <div className="loader-inner">
        <canvas aria-hidden width={308} height={308} className="loader-grain" suppressHydrationWarning />
        <div aria-hidden className="loader-glow" />
        <svg aria-hidden className="loader-word" viewBox={`0 0 ${GEO.width} ${GEO.height}`}>
          <defs>
            <clipPath id="loader-clip">
              <path d={WORD} />
            </clipPath>
            <linearGradient id="loader-oil-fill" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="290">
              <stop offset="0" stopColor="#f6db8c" />
              <stop offset="0.45" stopColor="#e4b04a" />
              <stop offset="1" stopColor="#a8701c" />
            </linearGradient>
            <linearGradient id="loader-shine-fill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff4d0" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={WORD} className="loader-outline" fill="rgb(238 232 220 / 0.035)" stroke="rgb(238 232 220 / 0.28)" strokeWidth="1.6" />
          <g clipPath="url(#loader-clip)">
            <path className="loader-oil" fill="url(#loader-oil-fill)" suppressHydrationWarning />
            <path className="loader-surface" fill="none" stroke="#fff1c2" strokeOpacity="0.85" strokeWidth="2.2" suppressHydrationWarning />
            <rect className="loader-shine" x="-260" y="0" width="180" height={GEO.height} fill="url(#loader-shine-fill)" transform="skewX(-18)" />
            <g className="loader-bubbles" fill="#fff3cf">
              {Array.from({ length: 18 }, (_, i) => (
                <circle key={i} r="0" cx="-20" cy="0" fillOpacity="0" suppressHydrationWarning />
              ))}
            </g>
          </g>
          <ellipse className="loader-splash" cx={GEO.stemX} cy="0" rx="0" ry="0" fill="none" stroke="#f3d27a" strokeOpacity="0" strokeWidth="1.2" suppressHydrationWarning />
        </svg>
        <span aria-hidden className="loader-stream" suppressHydrationWarning />
        <button type="button" className="loader-skip">
          Skip
        </button>
        <div role="progressbar" aria-label="Loading Neeram" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} className="loader-foot" suppressHydrationWarning>
          <div className="loader-row">
            <p className="loader-label">
              Kerala coconut oil{" "}
              <span lang="ml" className="loader-ml">
                · വെളിച്ചെണ്ണ
              </span>
            </p>
            {/* One fixed cell per digit: Anton's 1 is narrower than its other figures. */}
            <span aria-hidden className="loader-count">
              {[0, 1, 2].map((i) => (
                <span key={i} suppressHydrationWarning>
                  0
                </span>
              ))}
            </span>
          </div>
          <div className="loader-line">
            <span suppressHydrationWarning />
          </div>
        </div>
        </div>
        <span aria-hidden className="loader-edge" />
      </div>
      <InlineScript html={SCRIPT} />
    </>
  );
}

/** Runs on the server-rendered HTML only (React warns about scripts rendered on the client). */
function InlineScript({ html }: { html: string }) {
  return <script type={typeof window === "undefined" ? "text/javascript" : "text/plain"} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
