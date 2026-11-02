import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import { site } from "@/data/content";
import { toBeConfirmed } from "@/lib/format";

export const metadata: Metadata = {
  title: "Help",
  description: "Shipping, returns, order tracking and contact details for Neeram.",
};

const link = "underline decoration-orange underline-offset-4 hover:text-orange";
const officer = site.grievanceOfficer;

// Bracketed text is for the client to supply (see TODO_CONTENT.md).
const sections = [
  {
    id: "shipping",
    title: "Shipping & delivery",
    body: "We confirm the delivery charge on WhatsApp after you order, and your order ships once it is paid. [Delivery areas and times: to be confirmed.]",
  },
  { id: "returns", title: "Returns & refunds", body: "[What can be returned, within how many days, and how refunds are paid.]" },
  { id: "track", title: "Track an order", body: "[How customers track an order — courier link, WhatsApp number, or email.]" },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        Phone: {toBeConfirmed(site.support.phone)}. Email: {toBeConfirmed(site.support.email)}. Hours: {toBeConfirmed(site.support.hours)}.
        <br />
        <br />
        Grievance Officer: {toBeConfirmed(officer.name)}, {toBeConfirmed(officer.designation)}. Phone: {toBeConfirmed(officer.phone)}. Email: {toBeConfirmed(officer.email)}.
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy policy",
    body: (
      <Link href="/privacy" className={link}>
        Read our privacy policy
      </Link>
    ),
  },
  {
    id: "terms",
    title: "Terms of service",
    body: (
      <Link href="/terms" className={link}>
        Read our terms of service
      </Link>
    ),
  },
];

export default function HelpPage() {
  return (
    <div className="wrap py-14 md:py-20">
      <Eyebrow>Help with an order</Eyebrow>
      <h1 className="display mt-4 text-[clamp(4rem,10vw,8rem)]">Help</h1>
      <div className="mt-10 border-t border-ink">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="grid scroll-mt-6 gap-3 border-b border-ink py-8 md:grid-cols-[20rem_1fr]">
            <h2 className="display text-3xl">{s.title}</h2>
            <p className="max-w-[36rem] font-serif text-lg text-muted">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
