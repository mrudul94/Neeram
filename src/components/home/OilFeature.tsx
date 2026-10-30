import { getProduct } from "@/data/products";
import { ButtonLink, Eyebrow, MalayalamDisplay, SpecTable } from "../ui";
import { FeatureAddButton, FeatureStage } from "./FeatureStage";

// Same layout as the turmeric feature in the design ("THE YELLOW IN ALMOST EVERYTHING."),
// with a dark stage on the left where the scroll-spinning bottle lands.
export function OilFeature() {
  const oil = getProduct("coconut-oil")!;
  return (
    <section aria-labelledby="oil-feature-title" className="grid md:min-h-[max(100svh,52rem)] md:grid-cols-2">
      <div className="relative flex flex-col items-center justify-center overflow-hidden bg-ink py-12 md:py-0">
        <div aria-hidden className="feature-glow absolute inset-0 bg-[radial-gradient(ellipse_at_50%_62%,rgb(242_106_13/0.22),transparent_60%)]" />
        <FeatureStage />
      </div>

      <div className="bg-sand px-5 py-14 md:px-12 md:py-24 lg:px-20">
        <div className="max-w-[32rem]">
          <MalayalamDisplay className="text-[clamp(2.75rem,5vw,4.6rem)] text-turmeric">{oil.nameMalayalam}</MalayalamDisplay>
          <Eyebrow className="mt-8">No. {oil.number} · {oil.name}</Eyebrow>
          <h2 id="oil-feature-title" className="display mt-4 text-[clamp(2.75rem,4.6vw,4.25rem)]">
            The first thing
            <br />
            in the pan.
          </h2>
          <p className="mt-6 font-serif text-lg leading-relaxed text-muted">
            Double-filtered coconut oil for tempering, frying and finishing. Heat it gently; the mustard seeds go in once it
            shimmers.
          </p>
          <SpecTable
            className="mt-8"
            specs={[
              { label: "Form", value: "Double-filtered oil" },
              { label: "Made for", value: "Everyday cooking. Every kind of kitchen." },
              { label: "From first to last", value: "The first sizzle to the finishing touch." },
            ]}
          />
          {/* One fixed layout per breakpoint: the button keeps its width (SwapText), so the
              link never jumps between beside and below it. */}
          <div className="mt-8 flex flex-col items-start gap-4 xl:flex-row xl:flex-nowrap xl:items-center xl:gap-8">
            <FeatureAddButton />
            <ButtonLink href={`/products/${oil.slug}`} variant="text" className="shrink-0 whitespace-nowrap">
              Product details
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
