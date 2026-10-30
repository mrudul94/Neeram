import Image from "next/image";
import type { ReactNode } from "react";
import { Eyebrow } from "./ui";

/** Dark full-bleed band over the tempering-pan photo ("EVERY DISH STARTS IN OIL."). */
export function OilBand({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="relative isolate scroll-mt-4 overflow-hidden bg-ink py-16 text-cream md:py-24">
      <div aria-hidden className="absolute inset-y-0 right-0 -z-10 w-full md:w-[70%]">
        <Image src="/images/photos/tempering-pan.webp" alt="" fill sizes="(max-width: 767px) 100vw, 70vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/60 md:bg-gradient-to-r md:from-ink md:via-ink/50 md:to-ink/10" />
      </div>
      <div className="wrap">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="display mt-4 text-[clamp(3rem,6.4vw,5.5rem)]">{title}</h2>
        {children}
      </div>
    </section>
  );
}
