import type { Metadata } from "next";
import { pageLinks } from "@/lib/seo";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { site } from "@/data/content";
import { toBeConfirmed } from "@/lib/format";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms for ordering from Neeram: orders, payment, delivery, returns and complaints.",
  ...pageLinks("/terms"),
};

const link = "underline decoration-orange underline-offset-4 hover:text-orange";
const officer = site.grievanceOfficer;

// Draft written from how ordering actually works; a lawyer reviews it before launch.
const sections: LegalSection[] = [
  {
    id: "seller",
    title: "Who you are buying from",
    body: (
      <p>
        {site.legalName}, {toBeConfirmed(site.address)}. FSSAI licence: {toBeConfirmed(site.fssaiLicence)}. GSTIN: {toBeConfirmed(site.gstin)}.
      </p>
    ),
  },
  {
    id: "orders",
    title: "Placing an order",
    body: (
      <p>
        You place an order by filling in the checkout form and sending us the order message on WhatsApp, or by SMS or email where offered. An order is accepted only when we confirm it. We may decline an
        order, for example if an item is out of stock or we do not deliver to your address.
      </p>
    ),
  },
  {
    id: "prices",
    title: "Prices and payment",
    body: (
      <p>
        Prices are in Indian rupees and include taxes. The delivery charge is confirmed with you after you order. You pay before delivery using the payment details we send you; there is no cash on
        delivery, and nothing is charged on this website. Your order ships after payment.
      </p>
    ),
  },
  {
    id: "delivery",
    title: "Delivery",
    body: (
      <p>
        Delivery areas and times are on our{" "}
        <Link href="/help#shipping" className={link}>
          Help page
        </Link>
        . Please check that your address and number are correct, as we use them as given.
      </p>
    ),
  },
  {
    id: "returns",
    title: "Returns and refunds",
    body: (
      <p>
        See{" "}
        <Link href="/help#returns" className={link}>
          Returns &amp; refunds
        </Link>
        . These terms do not affect your rights under the Consumer Protection Act, 2019.
      </p>
    ),
  },
  {
    id: "products",
    title: "Products",
    body: <p>Please read the label and follow its storage directions. Photos show the product as closely as we can, but packaging may vary. The label on the pack you receive is what applies.</p>,
  },
  {
    id: "liability",
    title: "Our responsibility",
    body: <p>We are responsible for the products we sell as the law requires. We are not responsible for delays or losses caused by events beyond our reasonable control.</p>,
  },
  {
    id: "grievance",
    title: "Complaints",
    body: (
      <p>
        Grievance Officer: {toBeConfirmed(officer.name)}, {toBeConfirmed(officer.designation)}. Phone: {toBeConfirmed(officer.phone)}. Email: {toBeConfirmed(officer.email)}. We acknowledge complaints
        within 48 hours and resolve them within one month.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These terms are governed by the laws of India.</p>,
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms of service" updated="2 November 2026" draft sections={sections} />;
}
