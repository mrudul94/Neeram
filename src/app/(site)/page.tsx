import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutHelp } from "@/components/home/AboutHelp";
import { BottleStage } from "@/components/home/BottleStage";
import { HeroSlider } from "@/components/home/HeroSlider";
import { LookBeforeYouOpen } from "@/components/home/LookBeforeYouOpen";
import { OilFeature } from "@/components/home/OilFeature";
import { JsonLd } from "@/components/JsonLd";
import { Shelf } from "@/components/Shelf";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { heroSlides } from "@/data/content";
import { products } from "@/data/products";
import { organizationSchema, websiteSchema } from "@/lib/schema";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <BottleStage>
        <HeroSlider slides={heroSlides} />
        <OilFeature />
      </BottleStage>

      <section aria-labelledby="shelf-title" className="defer-render py-20 md:py-28">
        <div className="wrap">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_21rem] md:items-end">
            <div>
              <Eyebrow>Nos. 01 – 06</Eyebrow>
              <h2 id="shelf-title" className="display mt-4 text-[clamp(3.5rem,7.6vw,6.25rem)]">
                A short shelf,
                <br />
                on purpose.
              </h2>
            </div>
            <div>
              <p className="font-serif text-lg leading-relaxed text-muted">
                Six staples of the Kerala kitchen, and nothing else. Coconut oil is on the shelf now; the five spices follow
                soon, each in a clear jar.
              </p>
              <ButtonLink href="/shop" variant="text" className="mt-5">
                See the shelf
              </ButtonLink>
            </div>
          </div>
          <Shelf items={products} className="mt-14 md:mt-16" />
        </div>
      </section>

      <Suspense>
        <LookBeforeYouOpen />
      </Suspense>
      <Suspense>
        <AboutHelp />
      </Suspense>
    </>
  );
}
