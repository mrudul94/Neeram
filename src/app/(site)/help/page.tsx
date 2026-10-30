import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Help",
  description: "Shipping, returns, order tracking and contact details for Neeram.",
};

// Every body here is a placeholder for the client to replace (see TODO_CONTENT.md).
const sections = [
  { id: "shipping", title: "Shipping & delivery", body: "[Where you deliver, how long it takes, and what it costs.]" },
  { id: "returns", title: "Returns & refunds", body: "[What can be returned, within how many days, and how refunds are paid.]" },
  { id: "track", title: "Track an order", body: "[How customers track an order — courier link, WhatsApp number, or email.]" },
  { id: "contact", title: "Contact us", body: "[Phone, WhatsApp, email and business hours.]" },
  { id: "privacy", title: "Privacy policy", body: "[Privacy policy text.]" },
  { id: "terms", title: "Terms of service", body: "[Terms of service text, including FSSAI licence number and registered business address.]" },
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
