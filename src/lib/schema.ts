import { site } from "@/data/content";
import { isAvailable, packPrice, type Product } from "@/data/products";
import type { Faq } from "./faq";

/**
 * Schema.org JSON-LD. Only details actually filled in src/data/content.ts go in: a blank one
 * is left out, never sent as a placeholder.
 */
const CONTEXT = "https://schema.org";
const absolute = (path: string) => new URL(path, site.url).toString();
const ORG_ID = () => `${absolute("/")}#organization`;
const productUrl = (p: Product) => absolute(`/products/${p.slug}`);

/** Drops null, undefined and empty values, so blanks never reach the markup. */
function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && !v.length))) as T;
}

export function organizationSchema(overrides: Partial<typeof site> = {}) {
  const s = { ...site, ...overrides };
  const { streetAddress, locality, region, postalCode, country } = s.location;
  const { latitude, longitude } = s.geo;
  return compact({
    "@context": CONTEXT,
    // LocalBusiness only for a place customers can actually visit.
    "@type": s.hasPublicLocation ? "LocalBusiness" : "Organization",
    "@id": ORG_ID(),
    name: s.tradeName,
    alternateName: s.name,
    url: absolute("/"),
    logo: absolute("/images/logo/neeram-coconut-oil-logo.webp"),
    foundingDate: s.foundingDate,
    telephone: s.support.phone,
    email: s.support.email,
    address: compact({
      "@type": "PostalAddress",
      streetAddress,
      addressLocality: locality,
      addressRegion: region,
      postalCode,
      addressCountry: country,
    }),
    geo: latitude !== null && longitude !== null ? { "@type": "GeoCoordinates", latitude, longitude } : null,
    // Profile pages only: a WhatsApp chat link is not one.
    sameAs: Object.entries(s.socials).flatMap(([name, url]) => (url && name !== "WhatsApp" ? [url] : [])),
  });
}

export function websiteSchema() {
  return { "@context": CONTEXT, "@type": "WebSite", name: "Neeram Coconut Oil", url: absolute("/"), publisher: { "@id": ORG_ID() } };
}

export function productSchema(product: Product) {
  const sizes =
    product.packs?.map((p) => ({ name: p.label, id: `-${p.id}`, price: packPrice(product, p), mrp: p.mrp })) ??
    [{ name: product.sizeLabel, id: "", price: product.price, mrp: undefined }];
  const offers = !isAvailable(product)
    ? []
    : sizes
        .filter((s): s is typeof s & { price: number } => s.price !== null)
        .map((s) => ({
          "@type": "Offer",
          name: s.name,
          sku: `NRM-${product.number}${s.id}`,
          price: s.price,
          priceCurrency: "INR",
          // The printed MRP, so search results can show the sale price against it.
          ...(s.mrp && s.mrp > s.price
            ? { priceSpecification: { "@type": "UnitPriceSpecification", priceType: "https://schema.org/StrikethroughPrice", price: s.mrp, priceCurrency: "INR" } }
            : {}),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          url: productUrl(product),
          seller: { "@id": ORG_ID() },
        }));
  return compact({
    "@context": CONTEXT,
    "@type": "Product",
    name: `Neeram ${product.name}`,
    description: product.description,
    sku: `NRM-${product.number}`,
    category: product.category,
    brand: { "@type": "Brand", name: site.name },
    image: [...new Set([...(product.packs?.map((p) => p.image.src) ?? []), ...product.images.filter((i) => i.cutout).map((i) => i.src)])].map(absolute),
    offers,
  });
}

export function breadcrumbSchema(product: Product) {
  const crumbs = [
    { name: "Home", item: absolute("/") },
    { name: "Shop", item: absolute("/shop") },
    { name: product.name, item: productUrl(product) },
  ];
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
  };
}

/** Only answers with no gap in them; null when none are confirmed yet. */
export function faqSchema(faqs: Faq[]) {
  const known = faqs.filter((f) => !f.answer.includes("["));
  if (!known.length) return null;
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: known.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}
