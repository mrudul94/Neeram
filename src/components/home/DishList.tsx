import Image from "next/image";
import Link from "next/link";
import { dishes, ingredientColor } from "@/data/content";
import { getProduct, isAvailable } from "@/data/products";
import { Eyebrow } from "../ui";

export function DishList() {
  return (
    <section id="kitchen" aria-labelledby="dishes-title" className="scroll-mt-4 bg-ink py-20 text-cream md:py-28">
      <div className="wrap">
        <Eyebrow>From the Neeram kitchen</Eyebrow>
        <h2 id="dishes-title" className="display mt-4 text-[clamp(3.5rem,7.6vw,6.25rem)]">
          What goes
          <br />
          into what.
        </h2>

        <div className="mt-14 grid gap-12 md:grid-cols-[minmax(0,1fr)_19.75rem] md:gap-16">
          <ul className="border-t border-cream/70">
            {dishes.map((dish) => (
              <li key={dish.name} className="flex flex-col gap-3 border-b border-cream/70 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="display text-[clamp(2.25rem,4vw,3.25rem)] leading-none">{dish.name}</h3>
                  <p lang="ml" className="mt-2 font-ml text-[0.8125rem] text-cream/80">
                    {dish.nameMalayalam}
                  </p>
                </div>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem]" aria-label={`Ingredients for ${dish.name}`}>
                  {dish.ingredients.map((slug) => {
                    const p = getProduct(slug)!;
                    return (
                      <li key={slug} className="flex items-center gap-1.5">
                        <span aria-hidden className="size-1.5 rounded-full" style={{ background: ingredientColor[slug] }} />
                        {isAvailable(p) ? (
                          <Link href={`/products/${slug}`} className="underline decoration-orange underline-offset-4 hover:text-orange">
                            {p.name}
                          </Link>
                        ) : (
                          <span className="text-cream/85">{p.name}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          <figure>
            <Image
              src="/images/photos/sambar.webp"
              alt="Sambar in a steel bowl on a banana leaf, with rice and tamarind"
              width={380}
              height={469}
              sizes="(max-width: 767px) 100vw, 20rem"
              className="w-full"
            />
            <figcaption className="mt-3 font-serif text-[0.9375rem] text-cream/85 italic">
              Sambar · with Neeram Tamarind and Turmeric
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
