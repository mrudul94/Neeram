// Editorial content that is not product data. Placeholders are listed in TODO_CONTENT.md.

export type HeroSlide = {
  id: string;
  productSlug: string;
  /** Short label shown in the slider progress bar. */
  tab: string;
  eyebrow: string;
  eyebrowMalayalam: string;
  headline: string[];
  body: string;
  cta: { label: string; href: string };
  secondary: { label: string; href: string };
  image: { src: string; alt: string };
};

// Phase 1 ships one slide. Spice slides are added here when they launch.
export const heroSlides: HeroSlide[] = [
  {
    id: "coconut-oil",
    productSlug: "coconut-oil",
    tab: "Velichenna",
    eyebrow: "No. 01 · Coconut Oil",
    eyebrowMalayalam: "വെളിച്ചെണ്ണ",
    headline: ["The oil every", "Kerala kitchen", "starts with."],
    body: "Mustard seeds, curry leaves, a dried chilli — and before all of them, a spoon of coconut oil in the pan.",
    cta: { label: "Shop coconut oil", href: "/products/coconut-oil" },
    secondary: { label: "The recipe", href: "/products/coconut-oil#tempering" },
    image: {
      src: "/images/photos/tempering-pan.webp",
      alt: "Mustard seeds and curry leaves crackling in coconut oil in an iron pan",
    },
  },
];

export type Dish = {
  name: string;
  nameMalayalam: string;
  ingredients: string[]; // product slugs
};

export const dishes: Dish[] = [
  { name: "Meen curry", nameMalayalam: "മീൻ കറി", ingredients: ["malabar-tamarind", "turmeric", "coconut-oil"] },
  { name: "Sambar", nameMalayalam: "സാമ്പാർ", ingredients: ["tamarind", "turmeric"] },
  { name: "Pepper chicken", nameMalayalam: "കുരുമുളക് ചിക്കൻ", ingredients: ["black-pepper", "turmeric", "coconut-oil"] },
  { name: "Thoran", nameMalayalam: "തോരൻ", ingredients: ["coconut-oil", "turmeric"] },
  { name: "Blue tea", nameMalayalam: "നീല ചായ", ingredients: ["shankupushpam"] },
];

/** Dot colour per ingredient in the dish list. */
export const ingredientColor: Record<string, string> = {
  "coconut-oil": "#f1ebdd",
  "malabar-tamarind": "#5a3a2c",
  turmeric: "#e3a21a",
  "black-pepper": "#8b857a",
  tamarind: "#b8602a",
  shankupushpam: "#5b55d6",
};

export type Certificate = {
  name: string;
  /** Licence or certificate number, shown under the name. */
  number?: string;
  issuer?: string;
  /** Scan of the certificate; opens full size when clicked. */
  image: string;
  width: number;
  height: number;
};

export const site = {
  name: "Neeram",
  legalName: "Neeram Coconut Oil",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  address: "[Business address, Kerala]",
  aboutText:
    "Neeram was started in 2018 by 29 coconut producer companies in Kerala, owned by the farmers who grow the coconuts. The oil is pressed at our own mill in Anakkallu, Kerala, from coconuts bought straight from member farms. It is sealed at the mill, in clear bottles and pouches, with nothing added.",
  /**
   * FSSAI licence number shown in the footer and on product pages; null hides it.
   * The bottle label carries 11321014000289 (Govindan Oil Mill, Kasaragod): confirm
   * which licence the site should show before setting it (TODO_CONTENT.md).
   */
  fssaiLicence: null as string | null,
  /**
   * Neeram's own certificates and licences, shown on the About page; the section stays
   * hidden while this is empty. Images go in public/images/certificates/.
   * e.g. { name: "FSSAI licence", number: "113…", issuer: "FSSAI", image: "/images/certificates/fssai.webp", width: 1240, height: 1754 }
   */
  certificates: [] as Certificate[],
  // Set a URL to show the link; null renders the name without a link.
  socials: {
    Instagram: null as string | null,
    Facebook: null as string | null,
    YouTube: null as string | null,
    WhatsApp: null as string | null,
  },
};
