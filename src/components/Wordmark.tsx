"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useId, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const W = 1200;
const H = 330;
const WORD = "NEERAM";

/**
 * Full-width NEERAM set in the display face, stretched to the content width. As it
 * scrolls into view the letters rise one after another out of the bottom edge,
 * scrubbed to the scroll (so scrolling back up lowers them again). On hover a wave
 * ripples through the letters from the cursor, tinting each crest turmeric.
 *
 * The stretched text is laid out once by the browser; each letter is then a copy of the
 * whole word clipped to that letter's slot, so the animated version matches the static
 * one exactly. Server render and reduced motion keep the plain text.
 */
export function Wordmark({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  /** Left edge of each letter's slot, plus the right edge of the last one. */
  const [edges, setEdges] = useState<number[] | null>(null);
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");

  // Measure the letters once the display font has loaded.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let live = true;
    document.fonts.ready.then(() => {
      const text = textRef.current;
      if (!live || !text) return;
      const boxes = [...WORD].map((_, i) => text.getExtentOfChar(i));
      // Split halfway across each gap, so no letter's slot shows a sliver of its neighbour.
      const cuts = boxes.slice(1).map((b, i) => (boxes[i].x + boxes[i].width + b.x) / 2);
      setEdges([-20, ...cuts, W + 20]);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!edges) return;
    const svg = svgRef.current!;
    const letters = svg.querySelectorAll(".wordmark-letter");
    const tween = gsap.fromTo(
      letters,
      { y: H * 1.05 },
      {
        y: 0,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: svg, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
      },
    );
    // Hover (pointer devices): a wave rolls through the letters, rippling outward from
    // the cursor for as long as it stays over the word; each crest dips its letter into
    // the bottom edge and tints it turmeric. On leaving, the wave dies down and the
    // letters settle. On an inner layer, so it adds to the scroll reveal instead of
    // fighting it.
    const hovers = [...svg.querySelectorAll<SVGGElement>(".wordmark-hover")];
    const centres = hovers.map((_, i) => (edges[i] + edges[i + 1]) / 2);
    const setY = hovers.map((el) => gsap.quickSetter(el, "y"));
    const wave = { amp: 0, x: W / 2, t: 0 };
    const DEPTH = H * 0.14; // deepest dip, in viewBox units
    const SPEED = 5; // radians per second
    const WAVELENGTH = W / 2.2;
    const tick = (_time: number, deltaMs: number) => {
      wave.t += (deltaMs / 1000) * SPEED;
      hovers.forEach((el, i) => {
        const phase = wave.t - (Math.abs(centres[i] - wave.x) / WAVELENGTH) * Math.PI * 2;
        const crest = (1 - Math.cos(phase)) / 2; // 0-1
        setY[i](DEPTH * wave.amp * crest);
        el.classList.toggle("text-turmeric", wave.amp > 0.5 && crest > 0.8);
      });
      if (wave.amp === 0) gsap.ticker.remove(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      wave.x = ((e.clientX - r.left) / r.width) * W;
    };
    const onEnter = (e: PointerEvent) => {
      onMove(e);
      wave.t = 0; // start the first ripple at the cursor
      gsap.ticker.add(tick);
      gsap.to(wave, { amp: 1, duration: 0.5, ease: "power2.out", overwrite: true });
    };
    const onLeave = () => gsap.to(wave, { amp: 0, duration: 0.8, ease: "power2.out", overwrite: true });
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) {
      svg.addEventListener("pointerenter", onEnter);
      svg.addEventListener("pointermove", onMove);
      svg.addEventListener("pointerleave", onLeave);
    }

    return () => {
      svg.removeEventListener("pointerenter", onEnter);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
      gsap.killTweensOf([wave, ...hovers]);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [edges]);

  const word = (props: { ref?: typeof textRef; hidden?: boolean }) => (
    <text
      ref={props.ref}
      x="0"
      y={H}
      textLength={W}
      lengthAdjust="spacingAndGlyphs"
      fill="currentColor"
      visibility={props.hidden ? "hidden" : undefined}
      style={{ fontFamily: "var(--font-display)", fontSize: 390 }}
    >
      {WORD}
    </text>
  );

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label="Neeram">
      {/* Kept for layout and measuring; hidden once the letters take over. */}
      {word({ ref: textRef, hidden: !!edges })}
      {edges && (
        <g aria-hidden>
          <defs>
            {edges.slice(1).map((right, i) => (
              <clipPath key={i} id={`${id}-l${i}`}>
                <rect x={edges[i]} y={-H} width={right - edges[i]} height={H * 3} />
              </clipPath>
            ))}
          </defs>
          {edges.slice(1).map((_, i) => (
            <g key={i} className="wordmark-letter" clipPath={`url(#${id}-l${i})`}>
              <g className="wordmark-hover transition-colors duration-300">{word({})}</g>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
