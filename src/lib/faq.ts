import { site } from "@/data/content";
import type { Product } from "@/data/products";
import { formatPrice } from "./format";

export type Faq = { question: string; answer: string };

export const OIL_STORAGE = "Keep the cap closed, away from sunlight and the stove. Coconut oil turns solid below about 24 °C — stand the bottle in warm water and it will clear again.";

/**
 * Questions as people ask them. "[client to confirm]" marks a fact we don't have yet: it shows
 * on the page during review, and that answer stays out of the FAQPage schema until it's filled.
 */
export function productFaqs(product: Product): Faq[] {
  if (product.slug !== "coconut-oil" || !product.packs) return [];
  const sizes = product.packs.map((p) => `${p.label} (${formatPrice(p.price ?? product.price)})`).join(", ");
  return [
    {
      question: "Where is Neeram coconut oil made?",
      answer: "Neeram coconut oil is made at our own mill in Anakkallu, Kasaragod, Kerala.",
    },
    {
      question: "What sizes does Neeram coconut oil come in?",
      answer: `It comes in ${sizes}. Prices include taxes.`,
    },
    {
      question: "How should I store coconut oil?",
      answer: OIL_STORAGE,
    },
    {
      question: "How long does Neeram coconut oil last?",
      answer: "Neeram coconut oil has a shelf life of 6 months. Check the best-before date on the pack.",
    },
    {
      question: "Do you deliver to my area?",
      answer: `Yes. ${site.policies.delivery} We confirm the delivery charge on WhatsApp after you order.`,
    },
    {
      question: "How do I order Neeram coconut oil?",
      answer:
        "Choose a size, add it to your cart, fill in the checkout form and send us the order on WhatsApp. We confirm your order and delivery charge there and send our payment details. Your order ships after payment; there is no cash on delivery.",
    },
  ];
}
