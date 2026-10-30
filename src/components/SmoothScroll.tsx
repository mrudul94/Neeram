"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isLoaderDone, whenLoaderDone } from "@/lib/loader";
import { useCart } from "@/store/cart";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

/** Scrolls the page to `y`: smoothly through Lenis when it runs, else natively. */
export function scrollToY(y: number) {
  if (instance) instance.scrollTo(y, { duration: 0.7 });
  else window.scrollTo({ top: y, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

/** Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const drawerOpen = useCart((s) => s.drawerOpen);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ anchors: true, lerp: 0.12 });
    lenisRef.current = instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // No scrolling under the first-visit loader.
    lenis.stop();
    const unlock = whenLoaderDone(() => {
      if (!useCart.getState().drawerOpen) lenis.start();
    });
    return () => {
      unlock();
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = instance = null;
    };
  }, []);

  useEffect(() => {
    if (drawerOpen) lenisRef.current?.stop();
    else if (isLoaderDone()) lenisRef.current?.start();
  }, [drawerOpen]);

  // New page: start at the top unless navigating to an anchor.
  useEffect(() => {
    if (!window.location.hash) lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
