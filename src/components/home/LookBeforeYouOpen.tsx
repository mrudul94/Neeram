import Image from "next/image";
import { Eyebrow } from "../ui";

// Callout positions are percentages of the bottle image box.
const callouts = [
  { title: "Double filtered", body: "Pressed, then filtered twice before it is bottled.", top: "60%" },
  { title: "Clear bottle", body: "See the oil before you buy.", top: "30%" },
  { title: "Neeram label", body: "Batch, dates and nutrition on the front of every bottle.", top: "76%" },
].sort((a, b) => parseFloat(a.top) - parseFloat(b.top));

export function LookBeforeYouOpen() {
  return (
    <section aria-labelledby="look-title" className="py-20 md:py-28">
      <div className="wrap grid gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-10">
        <div>
          <Eyebrow>The Neeram bottle</Eyebrow>
          <h2 id="look-title" className="display mt-4 text-[clamp(3.5rem,7vw,6rem)]">
            Look before
            <br />
            you open.
          </h2>
          <p className="mt-6 max-w-[22rem] font-serif text-lg leading-relaxed text-muted">
            Neeram coconut oil comes in a clear bottle. Nothing is hidden behind the label.
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:grid-cols-[17.5rem_1fr]">
          <div className="relative grid place-items-center bg-sand px-6 py-10 md:py-14">
            <Image
              src="/images/jars/coconut-oil.webp"
              alt="Neeram Coconut Oil in its clear 500 ml bottle"
              width={460}
              height={1200}
              sizes="(max-width: 767px) 40vw, 12rem"
              className="h-[20rem] w-auto drop-shadow-[0_14px_12px_rgb(22_19_15/0.2)] md:h-[26rem]"
            />
          </div>
          <ol className="relative">
            {callouts.map((c) => (
              <li key={c.title} className="absolute inset-x-0 flex -translate-y-1/2 items-start" style={{ top: c.top }}>
                <span aria-hidden className="relative mt-[0.6rem] -ml-[5.5rem] flex w-[6.5rem] shrink-0 items-center md:-ml-[7.5rem] md:w-[10rem]">
                  <span className="size-2.5 shrink-0 rounded-full border-2 border-cream bg-orange" />
                  <span className="h-px flex-1 bg-ink" />
                </span>
                <span className="pl-3">
                  <span className="block text-[0.9375rem] font-semibold">{c.title}</span>
                  <span className="mt-0.5 block max-w-[12rem] font-serif text-sm leading-snug text-muted">{c.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
