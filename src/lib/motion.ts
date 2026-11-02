/** GSAP and ScrollTrigger, loaded once on demand so they never hold up the first paint. */
export type Motion = { gsap: typeof import("gsap").default; ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger };

let motion: Promise<Motion> | null = null;

export function loadMotion() {
  motion ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return motion;
}

const FIRST_INPUT = ["scroll", "pointerdown", "touchstart", "keydown"] as const;

/**
 * Runs `start` once the page has loaded and the browser is idle, or straight away on the
 * visitor's first scroll, tap or key press. Returns a function that cancels the wait.
 */
export function afterPageLoad(start: () => void) {
  let done = false;
  let idle: number | undefined;
  const run = () => {
    if (done) return;
    done = true;
    cleanup();
    start();
  };
  const onLoad = () => {
    idle = window.requestIdleCallback ? window.requestIdleCallback(run, { timeout: 2000 }) : window.setTimeout(run, 500);
  };
  const cleanup = () => {
    window.removeEventListener("load", onLoad);
    FIRST_INPUT.forEach((e) => window.removeEventListener(e, run));
    if (idle !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idle);
  };
  FIRST_INPUT.forEach((e) => window.addEventListener(e, run, { once: true, passive: true }));
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad, { once: true });
  return () => {
    done = true;
    cleanup();
  };
}
