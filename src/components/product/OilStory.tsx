import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import { site } from "@/data/content";
import { discountPercent, packMrp, packPrice, packSize, type Product } from "@/data/products";
import { formatPrice, toBeConfirmed } from "@/lib/format";

/** "500 ml" → 0.5, "1 L" → 1. */
const litres = (size: string) => (/ml/i.test(size) ? parseFloat(size) / 1000 : parseFloat(size));

const steps = [
  { title: "Coconuts from local farmers", body: "Fresh coconuts, sourced directly from local farmers." },
  { title: "Dried into copra", body: toBeConfirmed(site.oilProcess.drying) },
  { title: "Expeller pressed", body: toBeConfirmed(site.oilProcess.pressing) },
  { title: "Double filtered", body: toBeConfirmed(site.oilProcess.filtering) },
  { title: "Sealed at the mill", body: "Bottled and sealed in Anakkallu, in clear bottles and packets, with nothing added." },
];

const purity = [
  { title: "Clear bottle.", body: "You can see the oil before you open it." },
  { title: "Sealed at the mill.", body: "The seal under the cap should be unbroken when it reaches you." },
  { title: "Nothing added.", body: "The only ingredient is coconut oil." },
  { title: "It sets in the cold.", body: "Coconut oil turns solid below about 24 °C and clears again in warm water, so a white bottle in winter is normal." },
];

const h2 = "display mt-4 text-[clamp(2.5rem,5vw,4rem)]";

/** How the coconut oil is made, its price list and how to check it: the product page's buying questions. */
export function OilStory({ product }: { product: Product }) {
  return (
    <>
      <section aria-labelledby="how-its-made" className="wrap pt-20 md:pt-28">
        <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
          <div>
            <Eyebrow>From farm to bottle</Eyebrow>
            <h2 id="how-its-made" className={h2}>
              How our coconut oil is made
            </h2>
            <p className="mt-5 max-w-[30rem] font-serif text-lg leading-relaxed text-muted">
              We buy coconuts directly from local farmers and press them at our own mill in Anakkallu, Kasaragod, so the oil in your bottle
              comes from one place you can name.
            </p>
            <Link href="/about" className="mt-5 inline-block font-serif text-muted underline underline-offset-4 hover:text-orange">
              Read about our mill in Anakkallu →
            </Link>
          </div>
          <ol className="border-t border-ink">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-ink py-4">
                <span className="eyebrow pt-0.5 text-[0.6875rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="mt-1 font-serif leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap py-20 md:py-28">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <Eyebrow>Price list</Eyebrow>
            <h2 className={h2}>Sizes and prices</h2>
            <table className="mt-8 w-full border-t border-ink text-left text-[0.9375rem]">
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="eyebrow py-3 text-[0.6875rem] font-normal text-muted">Size</th>
                  <th scope="col" className="eyebrow py-3 text-right text-[0.6875rem] font-normal text-muted">MRP</th>
                  <th scope="col" className="eyebrow py-3 text-right text-[0.6875rem] font-normal text-muted">Our price</th>
                  <th scope="col" className="eyebrow py-3 text-right text-[0.6875rem] font-normal text-muted">Per litre</th>
                </tr>
              </thead>
              <tbody>
                {product.packs?.map((p) => {
                  const price = packPrice(product, p);
                  const mrp = packMrp(product, p);
                  const off = discountPercent(price, mrp);
                  return (
                    <tr key={p.id} className="border-b border-ink">
                      <th scope="row" className="py-3 font-normal">{p.form === "Packet" ? packSize(p) : `${p.size} bottle`}</th>
                      <td className="py-3 text-right text-muted">{off > 0 ? <s>{formatPrice(mrp)}</s> : formatPrice(mrp)}</td>
                      <td className="py-3 text-right">
                        {formatPrice(price)}
                        {off > 0 && <span className="block text-[0.6875rem] text-orange-text">{off}% off</span>}
                      </td>
                      <td className="py-3 text-right text-muted">{formatPrice(price === null ? null : Math.round(price / litres(p.size)))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-4 font-serif text-muted">
              Prices include taxes. {site.policies.delivery}{" "}
              <Link href="/help#shipping" className="underline underline-offset-4 hover:text-orange">
                Shipping and returns
              </Link>
            </p>
          </div>
          <div>
            <Eyebrow>Look before you open</Eyebrow>
            <h2 className={h2}>How to tell it&apos;s pure</h2>
            <ul className="mt-8 border-t border-ink">
              {purity.map((p) => (
                <li key={p.title} className="border-b border-ink py-4 font-serif leading-relaxed text-muted">
                  <strong className="font-sans font-medium text-ink">{p.title}</strong> {p.body}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
