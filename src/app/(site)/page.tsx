import { preload } from "react-dom";
import { AboutHelp } from "@/components/home/AboutHelp";
import { BottleStage } from "@/components/home/BottleStage";
import { STILL_SRC } from "@/lib/bottle";
import { DishList } from "@/components/home/DishList";
import { HeroSlider } from "@/components/home/HeroSlider";
import { LookBeforeYouOpen } from "@/components/home/LookBeforeYouOpen";
import { OilFeature } from "@/components/home/OilFeature";
import { Shelf } from "@/components/Shelf";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { heroSlides } from "@/data/content";
import { products } from "@/data/products";

export default function HomePage() {
  // The bottle photo is the LCP image; fetch it before anything discovered later.
  preload(STILL_SRC.desktop, { as: "image", fetchPriority: "high", media: "(min-width: 768px)" });
  preload(STILL_SRC.mobile, { as: "image", fetchPriority: "high", media: "(max-width: 767px)" });

  return (
    <>
      <BottleStage>
        <HeroSlider slides={heroSlides} />
        <OilFeature />
      </BottleStage>

      <section aria-labelledby="shelf-title" className="py-20 md:py-28">
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

      <DishList />
      <LookBeforeYouOpen />
      <AboutHelp />
    </>
  );
}
