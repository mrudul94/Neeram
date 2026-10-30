// First-visit loader hand-off (src/components/Loader.tsx). Page animations that depend
// on layout or should start once the page is seen wait for it with whenLoaderDone.

export const LOADER_DONE_EVENT = "neeram:loader-done";

let done = false;

/** True once the loader has gone, or was skipped (not the first load of the session). */
export const isLoaderDone = () => done;

/** Called by the Loader when it has been removed (or skipped). */
export function markLoaderDone() {
  if (done) return;
  done = true;
  window.dispatchEvent(new Event(LOADER_DONE_EVENT));
}

/**
 * Runs `start` once the loader is done (immediately if it already is). `start` may return
 * a cleanup; the returned function cancels the wait or runs that cleanup, so it can be
 * returned straight from a useEffect.
 */
export function whenLoaderDone(start: () => void | (() => void)) {
  let cleanup: void | (() => void);
  let live = true;
  const run = () => {
    if (live) cleanup = start();
  };
  if (done) run();
  else window.addEventListener(LOADER_DONE_EVENT, run, { once: true });
  return () => {
    live = false;
    window.removeEventListener(LOADER_DONE_EVENT, run);
    cleanup?.();
  };
}
