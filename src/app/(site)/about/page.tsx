import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Eyebrow, MalayalamDisplay } from "@/components/ui";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "About us",
  description:
    "How 29 coconut producer companies in Kerala came together in 2018 to make Neeram: traditional, honestly made coconut oil that pays farmers fairly.",
};

// Story text supplied by Neeram. Mill figures are from the Neeram oil mill page
// (neeram.vercel.app/oilmill).
const chapters = [
  {
    title: "The seed of an idea",
    body: [
      "Before we became known for our pure coconut oil, our roots were tied to the sap of the coconut palm — Neera. As a collective of passionate farmer-producer companies in Kerala, we initially came together to process and promote Neera, working closely with local agricultural communities. We learned the intricate rhythms of the palm groves, understood what makes a perfect coconut, and built a deep trust with hundreds of farming families.",
    ],
  },
  {
    title: "The transition to purity",
    body: [
      "When the agricultural landscape shifted, so did we. We realized that our true strength lay in our direct access to the finest, hand-picked coconuts and our unyielding commitment to unadulterated quality.",
      "In May 2018, 29 coconut producer companies united with a single goal: to channel our expertise into creating an authentic, traditional coconut oil that families could trust blindly. Just in time for the festive spirit of Onam, Neeram was born.",
    ],
    image: {
      src: "/images/about/mill-opening.webp",
      alt: "Lighting the traditional lamp at the opening of the Neeram oil mill",
      width: 960,
      height: 640,
      caption: "Lighting the lamp at the opening of the oil mill.",
    },
  },
  {
    title: "Honest methods, traditional taste",
    body: [
      "We chose the name Neeram because it reflects our liquid gold — pure, transparent, and completely natural. By moving away from mass-industrial chemical processing, we focused on traditional methods that preserve the natural aroma, nutrients, and rich taste of the coconut.",
      "Whether it is our meticulously roasted copra oil or our nutrient-rich cold-pressed variants, we ensure that what reaches your home is exactly how nature intended it to be.",
    ],
  },
  {
    title: "Empowering the soil and the soul",
    body: [
      "Today, Neeram is more than just a brand on a shelf. It stands as a symbol of farmer empowerment and sustainable agriculture. When you choose Neeram, you aren’t just choosing health and purity for your family; you are directly supporting the traditional farmers of Kerala, ensuring they receive a fair share for their dedication and hard work.",
    ],
  },
];

const figures = [
  { value: "29", label: "Coconut producer companies" },
  { value: "2018", label: "Neeram born, in time for Onam" },
  { value: "15 t", label: "Copra the mill can crush a day" },
  { value: "45 t", label: "Copra in store at the mill" },
];

// "Why Neeram", from the Neeram site's About page.
const promises = [
  { title: "Pure", body: "Free from adulteration, perfumes, additives, preservatives and chemicals." },
  { title: "Two ways", body: "Roasted, for aroma and a sweet copra taste, or cold-pressed, with the copra left unroasted." },
  { title: "Every kind of cooking", body: "Tempering, deep and shallow frying, salad dressings — or straight from the spoon." },
  { title: "Packed to keep", body: "Pack sizes and materials chosen for easy carrying and a long shelf life." },
];

// From copra to pack, in the order it happens at the mill.
const steps = [
  { title: "Dried", body: "Copra is dried with hot air at up to 80 °C — nine tonnes in twelve hours — from market condition to the right moisture." },
  { title: "Cut", body: "A copra cutter takes it down to pieces under 12 mm, a tonne an hour." },
  { title: "Roasted", body: "For our roasted oil, the pieces go through a four-stage steam cooker that brings out the aroma and sweet taste of the copra. For cold-pressed oil, they are not roasted." },
  { title: "Pressed", body: "Two expellers crush the copra twice, 750 kg an hour." },
  { title: "Packed", body: "Form-fill-seal machines pack 1 litre, 500 ml and 100 ml pouches." },
];

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="about-title" className="wrap pt-14 pb-16 md:pt-20 md:pb-24">
        <Eyebrow>About us · Our story</Eyebrow>
        <h1 id="about-title" className="display mt-4 text-[clamp(3.5rem,9vw,8rem)]">
          Rooted in purity,
          <br />
          driven by farmers.
        </h1>
        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end md:gap-16">
          <p className="max-w-[34rem] font-serif text-[1.375rem] leading-snug md:text-[1.625rem]">
            Every drop of Neeram Coconut Oil carries the essence of Kerala’s lush palm groves and the hard work of the
            farmers who nurture them. Our journey didn’t begin in a corporate boardroom — it started right in the heart of
            the coconut farms, born out of a collective vision to bring the absolute purest coconut oil to your kitchen
            while empowering the hands that harvest it.
          </p>
          <figure>
            <Image
              src="/images/about/oil-mill.webp"
              alt="The Neeram oil mill at Anakkallu, Kerala: a red and white mill building with a covered loading bay"
              width={1249}
              height={902}
              sizes="(max-width: 767px) 100vw, 40rem"
              preload
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="eyebrow mt-3 text-[0.6875rem] text-muted">The oil mill · Anakkallu, Kasaragod</figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="The story" className="wrap border-t border-ink">
        {chapters.map((c, i) => (
          <article key={c.title} className="grid gap-6 border-b border-ink py-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16 md:py-16">
            <header>
              <p className="eyebrow text-[0.6875rem] text-orange-text">Chapter {String(i + 1).padStart(2, "0")}</p>
              <h2 className="display mt-3 text-[clamp(2.5rem,4.5vw,3.75rem)]">{c.title}</h2>
            </header>
            <div>
              {c.body.map((p) => (
                <p key={p.slice(0, 24)} className="mb-5 max-w-[38rem] font-serif text-lg leading-relaxed text-muted last:mb-0">
                  {p}
                </p>
              ))}
              {c.image && (
                <figure className="mt-8">
                  <Image
                    src={c.image.src}
                    alt={c.image.alt}
                    width={c.image.width}
                    height={c.image.height}
                    sizes="(max-width: 767px) 100vw, 38rem"
                    className="aspect-[3/2] w-full max-w-[38rem] object-cover"
                  />
                  <figcaption className="eyebrow mt-3 text-[0.6875rem] text-muted">{c.image.caption}</figcaption>
                </figure>
              )}
            </div>
          </article>
        ))}
      </section>

      <section aria-label="Neeram in numbers" className="mt-16 bg-ink text-cream md:mt-24">
        <dl className="wrap grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4 md:py-20">
          {figures.map((f) => (
            <div key={f.label} className="flex flex-col-reverse justify-end border-t border-cream/30 pt-4">
              <dt className="mt-2 max-w-[12rem] text-[0.9375rem] text-cream/80">{f.label}</dt>
              <dd className="display text-[clamp(3.25rem,6vw,5.5rem)] text-orange">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="who-title" className="wrap py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2 id="who-title" className="display mt-4 text-[clamp(2.75rem,5vw,4.25rem)]">
              Neeram Coconut
              <br />
              Industries.
            </h2>
          </div>
          <p className="max-w-[38rem] font-serif text-lg leading-relaxed text-muted">
            Neeram Coconut Industries Private Limited makes pure coconut oil — roasted, cold-pressed and virgin — at its
            own mill in Anakkallu, Kerala, packed in pouches, bottles and cans for cooking and for hair. The company was
            formed to spread the benefits of coconut to people. It has come a long way, with a long way still to go.
          </p>
        </div>
        <ul className="mt-12 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <li key={p.title} className="border-b border-ink py-6 sm:pr-6 lg:border-b-0">
              <h3 className="display text-2xl">{p.title}</h3>
              <p className="mt-2 max-w-[18rem] font-serif leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
        {site.certificates.length > 0 && (
          <div className="mt-14">
            <h3 id="certificates-title" className="eyebrow text-[0.6875rem] text-orange-text">
              Certified &amp; licensed
            </h3>
            <ul aria-labelledby="certificates-title" className="mt-5 flex flex-wrap gap-6">
              {site.certificates.map((c) => (
                <li key={c.name} className="w-[9.5rem]">
                  <a href={c.image} target="_blank" rel="noopener" className="group block">
                    <Image
                      src={c.image}
                      alt={`${c.name} certificate${c.number ? `, number ${c.number}` : ""}`}
                      width={c.width}
                      height={c.height}
                      sizes="9.5rem"
                      className="aspect-[3/4] w-full border border-ink/20 bg-cream object-contain transition-transform duration-200 group-hover:-translate-y-1"
                    />
                    <span className="mt-3 block text-[0.9375rem] font-semibold group-hover:text-orange-text">{c.name}</span>
                  </a>
                  {(c.number || c.issuer) && (
                    <span className="mt-0.5 block text-xs text-muted">{[c.issuer, c.number].filter(Boolean).join(" · ")}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section aria-labelledby="mill-title" className="wrap border-t border-ink py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
          <div>
            <Eyebrow>Inside the mill</Eyebrow>
            <h2 id="mill-title" className="display mt-4 text-[clamp(2.75rem,5vw,4.25rem)]">
              From copra
              <br />
              to your kitchen.
            </h2>
            <p className="mt-6 max-w-[24rem] font-serif text-lg leading-relaxed text-muted">
              Every drop is made at our own mill in Anakkallu, Kerala.
            </p>
          </div>
          <ol className="border-t border-ink">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-ink py-6 md:grid-cols-[4rem_10rem_1fr]">
                <span className="display text-2xl text-orange-text">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display text-2xl">{s.title}</h3>
                <p className="col-start-2 mt-2 font-serif leading-relaxed text-muted md:col-start-3 md:mt-0">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="closing-title" className="bg-sand">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-16 md:py-24">
          <div>
            <MalayalamDisplay className="text-[clamp(2.5rem,5vw,4rem)] text-turmeric">വെളിച്ചെണ്ണ</MalayalamDisplay>
            <h2 id="closing-title" className="display mt-4 text-[clamp(2.75rem,5vw,4.25rem)]">
              From our groves
              <br />
              to your home.
            </h2>
            <p className="mt-6 max-w-[26rem] font-serif text-lg leading-relaxed text-muted">
              We invite you to taste the purity of a tradition kept alive.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="/products/coconut-oil" arrow>
                Shop coconut oil
              </ButtonLink>
              <ButtonLink href="/shop" variant="text">
                See the shelf
              </ButtonLink>
            </div>
          </div>
          <Image
            src="/images/about/neeram-banner.webp"
            alt="Neeram Coconut Oil in a 500 ml pouch and two clear bottles, on a wooden table in front of coconut palm leaves"
            width={1800}
            height={1110}
            sizes="(max-width: 767px) 100vw, 40rem"
            className="w-full"
          />
        </div>
      </section>
    </>
  );
}
