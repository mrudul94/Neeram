import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton, ChosenPackLabel, MobileBuyBar, PackPicker, PackPrice, PurchasePanel } from "@/components/AddToCart";
import { OilBand } from "@/components/OilBand";
import { Gallery } from "@/components/product/Gallery";
import { Shelf } from "@/components/Shelf";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Eyebrow, MalayalamDisplay, SpecTable, cx } from "@/components/ui";
import { site } from "@/data/content";
import { getProduct, isAvailable, products, type Product } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = isAvailable(product) ? `${product.name} (${product.sizeLabel})` : `${product.name} — coming soon`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${title} · Neeram`,
      description: product.description,
      images:
        product.slug === "coconut-oil"
          ? [{ url: "/og-coconut-oil.jpg", width: 1200, height: 630, alt: product.images[0].alt }]
          : [{ url: product.images[0].src, alt: product.images[0].alt }],
    },
  };
}

// params are read inside Suspense so the shared App Shell stays URL-independent.
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-[44rem] max-w-[90rem] bg-sand md:w-[52%] md:ml-0" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return isAvailable(product) ? <AvailableProduct product={product} /> : <ComingSoonProduct product={product} />;
}

function Breadcrumb({ product }: { product: Product }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.8125rem]">
      <Link href="/" className="hover:text-orange">
        Home
      </Link>
      <span className="mx-1.5 text-muted">/</span>
      <Link href="/shop" className="hover:text-orange">
        Shop
      </Link>
      <span className="mx-1.5 text-muted">/</span>
      <span aria-current="page">{product.category}</span>
    </nav>
  );
}

function TitleBlock({ product }: { product: Product }) {
  return (
    <>
      <Eyebrow className="mt-5">
        No. {product.number} · {product.category}
      </Eyebrow>
      <h1 className="display mt-4 text-[clamp(3.5rem,7vw,6rem)]">{product.name}</h1>
      <p className="mt-3 text-lg">
        <span lang="ml" className="font-ml">
          {product.nameMalayalam}
        </span>
        <span className="mx-2 text-muted">·</span>
        {product.transliteration}
      </p>
      <p className="mt-5 max-w-[30rem] font-serif text-lg leading-relaxed text-muted">{product.description}</p>
    </>
  );
}

const accordions = (product: Product) => [
  {
    title: "Ingredients",
    body: product.category === "Oil" ? "100% coconut oil. [Confirm the exact wording for the label and listing.]" : `100% ${product.name.toLowerCase()}.`,
  },
  {
    title: "Storage",
    body:
      product.category === "Oil"
        ? "Keep the cap closed, away from sunlight and the stove. Coconut oil turns solid below about 24 °C — stand the bottle in warm water and it will clear again."
        : "Close the cap tightly and keep the jar in a cool, dry place away from sunlight.",
  },
  {
    title: "Shipping & returns",
    body: "[Delivery areas, delivery times, charges and the returns policy.]",
  },
];

function AvailableProduct({ product }: { product: Product }) {
  const others = products.filter((p) => p.slug !== product.slug);
  const tempering = ["coconut-oil", "turmeric", "black-pepper"].map((s) => getProduct(s)!);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Neeram ${product.name} ${product.sizeLabel}`,
    description: product.description,
    sku: `NRM-${product.number}`,
    brand: { "@type": "Brand", name: site.name },
    image: product.images.map((i) => new URL(i.src, site.url).toString()),
    ...(product.price !== null && {
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: new URL(`/products/${product.slug}`, site.url).toString(),
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="mx-auto grid max-w-[90rem] gap-8 pb-24 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-12 md:pb-20 lg:gap-16">
        <Gallery images={product.images} watermark={product.nameMalayalam} />

        <div className="px-5 md:py-8 md:pr-10 lg:pr-[max(2.5rem,calc((100vw-75rem)/2))]">
          <Breadcrumb product={product} />
          <TitleBlock product={product} />
          <PackPrice slug={product.slug} />
          <PackPicker slug={product.slug} className="mt-5" />
          <div className="mt-5 hidden md:block">
            <PurchasePanel slug={product.slug} />
          </div>
          <SpecTable specs={product.specs} className="mt-6" />
          {site.fssaiLicence && <p className="mt-3 text-xs text-muted">FSSAI Lic. No. {site.fssaiLicence}</p>}
          <div>
            {accordions(product).map((a) => (
              <details key={a.title} className="group border-b border-ink">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium [&::-webkit-details-marker]:hidden">
                  {a.title}
                  <span aria-hidden className="text-xl leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 font-serif leading-relaxed text-muted">{a.body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <OilBand id="tempering" eyebrow="Cook with it" title={<>The tempering<br />that starts it.</>}>
        <p className="mt-5 max-w-[32rem] font-serif text-lg text-cream/90">
          Heat a spoon of coconut oil until it shimmers. Mustard seeds in; when they pop, curry leaves and a dried chilli. Pour it over
          the dish.
        </p>
        <ul className="mt-8 flex gap-6">
          {tempering.map((p) => (
            <li key={p.slug} className="flex w-20 flex-col items-center text-center">
              <Image
                src={p.images[0].src}
                alt=""
                width={p.images[0].width}
                height={p.images[0].height}
                className={cx("h-24 w-auto", !isAvailable(p) && "opacity-80 grayscale-[0.55]")}
              />
              <span className="mt-2 text-[0.8125rem]">{p.name}</span>
              {!isAvailable(p) && <span className="eyebrow mt-0.5 text-[0.5625rem] text-cream/80">Soon</span>}
            </li>
          ))}
        </ul>
        <AddToCartButton slug={product.slug} variant="orange" arrow className="mt-8">
          <ChosenPackLabel slug={product.slug} />
        </AddToCartButton>
      </OilBand>

      <section aria-labelledby="same-shelf" className="wrap py-20 md:py-28">
        <h2 id="same-shelf" className="display text-[clamp(2.5rem,5vw,4rem)]">
          On the same shelf
        </h2>
        <Shelf items={others} className="mt-10" />
      </section>

      <MobileBuyBar slug={product.slug} />
    </>
  );
}

function ComingSoonProduct({ product }: { product: Product }) {
  const img = product.images[0];
  const others = products.filter((p) => p.slug !== product.slug);
  return (
    <>
      <div className="mx-auto grid max-w-[90rem] gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
        <div className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-sand md:aspect-auto md:min-h-[44rem]">
          <MalayalamDisplay aria-hidden className="absolute inset-x-0 top-[6%] text-center text-[clamp(3.5rem,8vw,7.5rem)] whitespace-nowrap text-ink/[0.07]">
            {product.nameMalayalam}
          </MalayalamDisplay>
          <div className="absolute inset-x-0 top-[24%] bottom-[12%] flex justify-center">
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              preload
              sizes="(max-width: 767px) 45vw, 18rem"
              className="h-full w-auto object-contain drop-shadow-[0_18px_14px_rgb(22_19_15/0.22)]"
            />
          </div>
          <span className="eyebrow absolute top-5 right-5 bg-ink px-3 py-1.5 text-[0.6875rem] text-cream">Coming soon</span>
        </div>

        <div className="px-5 md:py-10 md:pr-10 lg:pr-[max(2.5rem,calc((100vw-75rem)/2))]">
          <Breadcrumb product={product} />
          <TitleBlock product={product} />
          <div id="notify" className="mt-8 scroll-mt-8 border-t border-ink pt-6">
            <h2 className="display text-[2rem]">Coming soon</h2>
            <p className="mt-2 max-w-[28rem] font-serif text-muted">
              {product.name} is not on the shelf yet. Leave your email and we&apos;ll write once, when it is.
            </p>
            <SubscribeForm topic={product.slug} submitLabel="Notify me" tone="light" className="mt-5 max-w-[28rem]" />
          </div>
          <SpecTable specs={product.specs} className="mt-6" />
          <Link href="/products/coconut-oil" className="mt-8 inline-block font-serif text-muted underline underline-offset-4 hover:text-orange">
            In the meantime: Neeram Coconut Oil is available now →
          </Link>
        </div>
      </div>

      <section aria-labelledby="same-shelf" className="wrap py-20 md:py-28">
        <h2 id="same-shelf" className="display text-[clamp(2.5rem,5vw,4rem)]">
          On the same shelf
        </h2>
        <Shelf items={others} className="mt-10" />
      </section>
    </>
  );
}
