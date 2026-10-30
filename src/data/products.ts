// Product catalogue. To launch a spice, set `status: "available"`, fill in `price`,
// and (optionally) add a hero slide in src/data/heroSlides.ts. Nothing else hard-codes
// "coming soon" — every component reads `status`.

export type ProductStatus = "available" | "coming_soon";
export type Category = "Oil" | "Souring" | "Spice" | "Flower";

export type Spec = { label: string; value: string };

export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Transparent cutout that stands on a shelf line. */
  cutout?: boolean;
};

/** A size / pack a product is sold in. The first pack is the default. */
export type Pack = {
  id: string;
  /** "1 L bottle", for buttons and cart lines. */
  label: string;
  /** "1 L", for the caption. */
  size: string;
  /** "Clear bottle" / "Packet", for the caption. */
  form: string;
  /** Price in rupees; `null` until confirmed (falls back to the product price). */
  price: number | null;
  /** Transparent cutout, for thumbnails, the cart and the feature stage. */
  image: ProductImage;
  /** Height on the feature stage as a share of the bottle slot (the 500 ml photo is ~0.79). */
  stageHeight: number;
};

export type Product = {
  slug: string;
  number: string;
  name: string;
  nameMalayalam: string;
  transliteration: string;
  category: Category;
  sizeLabel: string;
  /** Price in rupees. `null` until the client confirms it — shown as "₹ —". */
  price: number | null;
  status: ProductStatus;
  /** Main cutout first; further entries are gallery shots. */
  images: ProductImage[];
  specs: Spec[];
  /** Long description for the product page. */
  description: string;
  /** One line for shop lists and shelves. */
  shortDescription: string;
  /** Relative jar height on shelves (1 = tallest). */
  shelfScale: number;
  /** Sizes on sale; omitted for single-size products. */
  packs?: Pack[];
};

const jar = (slug: string, name: string, width: number, height: number): ProductImage => ({
  src: `/images/jars/${slug}.webp`,
  alt: `Neeram ${name} in a clear jar with a black screw cap`,
  width,
  height,
  cutout: true,
});

export const products: Product[] = [
  {
    slug: "coconut-oil",
    number: "01",
    name: "Coconut Oil",
    nameMalayalam: "വെളിച്ചെണ്ണ",
    transliteration: "Velichenna",
    category: "Oil",
    sizeLabel: "500 ml",
    price: 130,
    status: "available",
    images: [
      {
        src: "/images/jars/coconut-oil.webp",
        alt: "Neeram Coconut Oil, 500 ml clear bottle with the Neeram label",
        width: 460,
        height: 1200,
        cutout: true,
      },
      {
        src: "/images/photos/tempering-pan.webp",
        alt: "Mustard seeds, curry leaves and dried chilli tempering in coconut oil in an iron pan",
        width: 720,
        height: 680,
      },
      {
        src: "/images/gallery/coconut-oil-label.webp",
        alt: "Close-up of the Neeram Coconut Oil label: double filtered",
        width: 900,
        height: 900,
      },
      {
        src: "/images/gallery/coconut-oil-cap.webp",
        alt: "Close-up of the sealed Neeram bottle cap and neck",
        width: 900,
        height: 900,
      },
    ],
    specs: [
      { label: "Also called", value: "Velichenna" },
      { label: "Made for", value: "Everyday cooking. Every kind of kitchen." },
      { label: "How to use", value: "Heat gently; add mustard seeds once it shimmers" },
      { label: "Container", value: "Clear bottle" },
    ],
    description:
      "Coconut oil for everyday Kerala cooking: frying, tempering, and a spoonful over thoran or avial at the end.",
    shortDescription: "Frying, tempering and finishing thoran and avial.",
    shelfScale: 1,
    packs: [
      {
        id: "bottle-500",
        label: "500 ml bottle",
        size: "500 ml",
        form: "Clear bottle",
        price: 130,
        image: { src: "/images/jars/coconut-oil.webp", alt: "Neeram Coconut Oil, 500 ml clear bottle", width: 460, height: 1200, cutout: true },
        stageHeight: 0.79,
      },
      {
        id: "bottle-1l",
        label: "1 L bottle",
        size: "1 L",
        form: "Clear bottle",
        price: 260,
        image: { src: "/images/packs/bottle-1l.webp", alt: "Neeram Coconut Oil, 1 litre clear bottle", width: 386, height: 1200, cutout: true },
        stageHeight: 0.89,
      },
      {
        id: "bottle-200",
        label: "200 ml bottle",
        size: "200 ml",
        form: "Clear bottle",
        price: 70,
        image: { src: "/images/packs/bottle-200.webp", alt: "Neeram Coconut Oil, 200 ml clear bottle", width: 289, height: 960, cutout: true },
        stageHeight: 0.6,
      },
      {
        id: "pouch-500",
        label: "500 ml packet",
        size: "500 ml",
        form: "Packet",
        price: 125,
        image: { src: "/images/packs/pouch-500.webp", alt: "Neeram Coconut Oil, 500 ml packet", width: 960, height: 876, cutout: true },
        stageHeight: 0.62,
      },
    ],
  },
  {
    slug: "malabar-tamarind",
    number: "02",
    name: "Malabar Tamarind",
    nameMalayalam: "കുടംപുളി",
    transliteration: "Kudampuli",
    category: "Souring",
    sizeLabel: "200 ml",
    price: null,
    status: "coming_soon",
    images: [jar("malabar-tamarind", "Malabar Tamarind", 263, 571)],
    specs: [
      { label: "Also called", value: "Kudampuli, Gambooge" },
      { label: "Goes into", value: "Meen curry, prawn curry" },
      { label: "How to use", value: "Rinse, soak 10 min, add with the water" },
      { label: "Container", value: "Clear jar, black screw cap" },
    ],
    description: "Dried Malabar tamarind, dark and smoky. The souring in Kerala fish curry.",
    shortDescription: "Soaked and added to fish curry for a smoky sourness.",
    shelfScale: 0.86,
  },
  {
    slug: "turmeric",
    number: "03",
    name: "Turmeric",
    nameMalayalam: "മഞ്ഞൾ",
    transliteration: "Manjal",
    category: "Spice",
    sizeLabel: "200 ml",
    price: null,
    status: "coming_soon",
    images: [jar("turmeric", "Turmeric", 282, 598)],
    specs: [
      { label: "Form", value: "Ground powder" },
      { label: "Goes into", value: "Curries, thoran, sambar, egg roast" },
      { label: "Pairs with", value: "Black Pepper, Coconut Oil" },
    ],
    description:
      "Ground turmeric for curries, thoran, sambar and marinades. Most dishes need only a pinch, added early with the oil.",
    shortDescription: "A pinch in curries, thoran, sambar and marinades.",
    shelfScale: 0.96,
  },
  {
    slug: "black-pepper",
    number: "04",
    name: "Black Pepper",
    nameMalayalam: "കുരുമുളക്",
    transliteration: "Kurumulaku",
    category: "Spice",
    sizeLabel: "200 ml",
    price: null,
    status: "coming_soon",
    images: [jar("black-pepper", "Black Pepper", 269, 590)],
    specs: [
      { label: "Form", value: "Whole peppercorns" },
      { label: "Goes into", value: "Rasam, pepper chicken, egg roast, soups" },
      { label: "How to use", value: "Crush or grind right before it goes in" },
      { label: "Container", value: "Clear jar, black screw cap" },
    ],
    description: "Whole black peppercorns. Crush them just before cooking for pepper chicken and rasam.",
    shortDescription: "Rasam, pepper chicken, egg roast and soups.",
    shelfScale: 0.88,
  },
  {
    slug: "tamarind",
    number: "05",
    name: "Tamarind",
    nameMalayalam: "വാളൻപുളി",
    transliteration: "Valanpuli",
    category: "Souring",
    sizeLabel: "200 ml",
    price: null,
    status: "coming_soon",
    images: [jar("tamarind", "Tamarind", 277, 599)],
    specs: [
      { label: "Also called", value: "Valanpuli" },
      { label: "Goes into", value: "Sambar, rasam, puli inji, chutneys" },
      { label: "How to use", value: "Soak in warm water, squeeze, strain" },
      { label: "Container", value: "Clear jar, black screw cap" },
    ],
    description: "Pressed tamarind for sambar, rasam and puli inji. Soak, squeeze and use the pulp.",
    shortDescription: "Sambar, rasam, puli inji and chutneys.",
    shelfScale: 0.9,
  },
  {
    slug: "shankupushpam",
    number: "06",
    name: "Shankupushpam",
    nameMalayalam: "ശംഖുപുഷ്പം",
    transliteration: "Shankhupushpam",
    category: "Flower",
    sizeLabel: "200 ml",
    price: null,
    status: "coming_soon",
    images: [jar("shankupushpam", "Shankupushpam", 270, 587)],
    specs: [
      { label: "Also called", value: "Butterfly pea flower" },
      { label: "Goes into", value: "Blue tea, lemonade, rice" },
      { label: "How to use", value: "Steep a few flowers in hot water" },
      { label: "Container", value: "Clear jar, black screw cap" },
    ],
    description: "Dried butterfly pea flowers. Steep in hot water for a deep blue tea; add lemon and watch it turn.",
    shortDescription: "Steep in hot water for a deep blue tea.",
    shelfScale: 0.88,
  },
];

export const categories: Category[] = ["Oil", "Souring", "Spice", "Flower"];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** The pack with this id, or the product's default (first) pack; undefined if it has none. */
export function getPack(product: Product, id?: string): Pack | undefined {
  return product.packs?.find((p) => p.id === id) ?? product.packs?.[0];
}

export function isAvailable(product: Product): boolean {
  return product.status === "available";
}
