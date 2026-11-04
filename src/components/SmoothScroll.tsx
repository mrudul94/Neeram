"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { afterPageLoad, loadMotion } from "@/lib/motion";
import { useCart } from "@/store/cart";

/** Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const drawerOpen = useCart((s) => s.drawerOpen);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let live = true;
    let stop = () => {};
    // Loaded after the page: native scrolling works fine until then.
    const cancel = afterPageLoad(() => {
      void Promise.all([import("lenis"), loadMotion()]).then(([{ default: LenisClass }, { gsap, ScrollTrigger }]) => {
        if (!live) return;
        const lenis = new LenisClass({ anchors: true, lerp: 0.12 });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        if (useCart.getState().drawerOpen) lenis.stop();
        stop = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          lenisRef.current = null;
        };
      });
    });
    return () => {
      live = false;
      cancel();
      stop();
    };
  }, []);

  useEffect(() => {
    if (drawerOpen) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [drawerOpen]);

  // New page: start at the top unless navigating to an anchor.
  useEffect(() => {
    if (!window.location.hash) lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
