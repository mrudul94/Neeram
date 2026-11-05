// Editorial content that is not product data. Placeholders are listed in TODO_CONTENT.md.
import { resolveSiteUrl } from "@/lib/site-url";

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
    eyebrow: "Coconut oil · Kasaragod, Kerala",
    eyebrowMalayalam: "വെളിച്ചെണ്ണ",
    headline: ["The oil every", "Kerala kitchen", "starts with."],
    body: "Mustard seeds, curry leaves, a dried chilli, and before all of them, a spoon of coconut oil in the pan.",
    cta: { label: "Shop coconut oil", href: "/products/coconut-oil" },
    secondary: { label: "The recipe", href: "/products/coconut-oil#tempering" },
    image: {
      src: "/images/photos/mustard-seeds-curry-leaves-tempering-in-coconut-oil.webp",
      alt: "Mustard seeds and curry leaves crackling in coconut oil in an iron pan",
    },
  },
];

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

export const helpLinks = [
  { label: "Shipping & delivery", href: "/help#shipping" },
  { label: "Returns & refunds", href: "/help#returns" },
  { label: "Track an order", href: "/help#track" },
  { label: "Contact us", href: "/help#contact" },
];

export const legalLinks = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

export const site = {
  name: "Neeram",
  /** As on the GST certificate. */
  legalName: "Kolathingal Sasikumar Sharath, trading as Govindan Oil Mill",
  tradeName: "Govindan Oil Mill",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.NODE_ENV),
  // Blank details below show as "[to be confirmed]" (see TODO_CONTENT.md).
  address: "4/213A, Anakkallu, Sankarampady PO, Chengala Via, Kasaragod, Kerala 671541" as string | null,
  /** For search engines (src/lib/schema.ts). Blank parts are left out of the markup. */
  location: {
    streetAddress: "4/213A, Anakkallu, Sankarampady PO" as string | null,
    locality: "Kasaragod" as string | null,
    region: "Kerala" as string | null,
    postalCode: "671541" as string | null,
    country: "IN" as string | null,
  },
  /** Map coordinates of the mill or office. */
  geo: { latitude: null as number | null, longitude: null as number | null },
  /** True only if customers can visit a shop or outlet: it makes the markup say LocalBusiness. */
  hasPublicLocation: false as boolean,
  foundingDate: "2020-08-21",
  gstin: "32GUPPS3042K1Z7" as string | null,
  /** Named on the Privacy Policy, Terms and Help pages, as the E-Commerce Rules 2020 require. */
  grievanceOfficer: {
    name: "Sharath K Sasikumar" as string | null,
    designation: "Owner" as string | null,
    phone: "+91 97478 44455" as string | null,
    email: "govindanoilmill@gmail.com" as string | null,
  },
  support: {
    phone: "+91 97478 44455" as string | null,
    email: "govindanoilmill@gmail.com" as string | null,
    hours: "8 am to 8 pm" as string | null,
  },
  /** Shown on the Help page, product pages and the coconut oil FAQ. */
  policies: {
    delivery: "We deliver all over India by DTDC and India Post, in six to ten working days.",
    returns: "You can return an order within 7 days of delivery, as long as the cap and its seal, or the packet, are unopened. Before sending it back, send us a photo on WhatsApp showing it is unopened and undamaged. We refund you by UPI once it is back at our mill. If your order arrives damaged or leaking, take a photo of the product and its packaging and send it to us on WhatsApp with your order details, and we will send a replacement or refund you.",
  },
  /** How long order records are kept, for the Privacy Policy. */
  dataRetention: "10 years" as string | null,
  /** Details every product listing shows (src/lib/legal.ts). */
  packaged: {
    manufacturer: "Govindan Oil Mill, Anakallu, Shankarampady Post, Kasaragod 671541" as string | null,
    bestBefore: "6 months. See the date on the pack." as string | null,
  },
  aboutText:
    "Neeram started up on 21 August 2020 and is owned by Sharath K Sasikumar, with 29 coconut producer companies in Kerala behind it. The oil is pressed at our own mill in Anakkallu, Kerala, from coconuts bought straight from member farms. It is sealed at the mill, in clear bottles and pouches, with nothing added.",
  /** FSSAI licence number shown in the footer and on product pages; null hides it. */
  fssaiLicence: "11321014000289" as string | null,
  /**
   * Neeram's own certificates and licences, shown on the About page; the section stays
   * hidden while this is empty. Images go in public/images/certificates/.
   * e.g. { name: "FSSAI licence", number: "113…", issuer: "FSSAI", image: "/images/certificates/fssai.webp", width: 1240, height: 1754 }
   */
  certificates: [] as Certificate[],
  /**
   * Where checkout sends orders (there is no online payment). Numbers in international
   * form without "+" or spaces, e.g. "919876543210". Until `whatsapp` is set, the
   * WhatsApp button lets the customer pick a chat. The "No WhatsApp? Send it by SMS / Email"
   * buttons show only when `phone` (or `whatsapp`, for SMS) and `email` are set.
   */
  orders: {
    whatsapp: "919747844455" as string | null,
    phone: null as string | null,
    email: null as string | null,
  },
  // Set a URL to show the link; null renders the name without a link.
  socials: {
    Instagram: "https://www.instagram.com/neeram_coconut_oil" as string | null,
    Facebook: null as string | null,
    YouTube: null as string | null,
    WhatsApp: "https://wa.me/919747844455" as string | null,
  },
};
