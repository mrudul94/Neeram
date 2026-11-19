import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow } from "@/components/ui";
import { site } from "@/data/content";
import { toBeConfirmed } from "@/lib/format";
import { contactPageSchema } from "@/lib/schema";
import { pageLinks } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us: Email, Phone and WhatsApp",
  description: `Email Neeram Coconut Oil at ${site.support.email ?? "our support address"}, call or WhatsApp ${site.support.phone ?? "us"}. Questions about orders, delivery or returns, answered by our mill in Kasaragod, Kerala.`,
  ...pageLinks("/contact", { title: "Contact Neeram Coconut Oil" }),
};

const link = "underline decoration-orange underline-offset-4 hover:text-orange";
const { email, phone, hours } = site.support;
const whatsapp = site.socials.WhatsApp;
const officer = site.grievanceOfficer;

export default function ContactPage() {
  return (
    <div className="wrap py-14 md:py-20">
      <JsonLd data={contactPageSchema()} />
      <Eyebrow>Email, call or WhatsApp</Eyebrow>
      <h1 className="display mt-4 text-[clamp(3.5rem,10vw,8rem)]">Contact us</h1>
      <p className="mt-6 max-w-[40rem] font-serif text-xl text-muted">
        Questions about an order, delivery or returns? Email, call or WhatsApp the mill.
      </p>

      <div className="mt-10 border-t border-ink">
        <section id="email" className="grid scroll-mt-6 gap-3 border-b border-ink py-8 md:grid-cols-[20rem_1fr]">
          <h2 className="display text-3xl">Email</h2>
          <div className="max-w-[36rem] font-serif text-lg text-muted">
            {email ? (
              <a href={`mailto:${email}`} className={`${link} text-2xl text-ink [overflow-wrap:anywhere]`}>
                {email}
              </a>
            ) : (
              toBeConfirmed(email)
            )}
            <p className="mt-2">Include your order number if you have one, and a photo if something arrived damaged.</p>
          </div>
        </section>

        <section id="phone" className="grid scroll-mt-6 gap-3 border-b border-ink py-8 md:grid-cols-[20rem_1fr]">
          <h2 className="display text-3xl">Phone & WhatsApp</h2>
          <div className="max-w-[36rem] font-serif text-lg text-muted">
            {phone ? (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className={`${link} text-2xl text-ink [overflow-wrap:anywhere]`}>
                {phone}
              </a>
            ) : (
              toBeConfirmed(phone)
            )}
            <p className="mt-2">
              {toBeConfirmed(hours)}.{" "}
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={link}>
                  Message us on WhatsApp
                </a>
              )}
            </p>
          </div>
        </section>

        <section id="write" className="grid scroll-mt-6 gap-6 border-b border-ink py-8 md:grid-cols-[20rem_1fr]">
          <h2 className="display text-3xl">Send a message</h2>
          <div className="max-w-[36rem]">
            <ContactForm email={email} />
          </div>
        </section>

        <section id="address" className="grid scroll-mt-6 gap-3 border-b border-ink py-8 md:grid-cols-[20rem_1fr]">
          <h2 className="display text-3xl">Our mill</h2>
          <address className="max-w-[36rem] font-serif text-lg not-italic text-muted">
            {site.tradeName}
            <br />
            {toBeConfirmed(site.address)}
          </address>
        </section>

        <section id="grievance" className="grid scroll-mt-6 gap-3 border-b border-ink py-8 md:grid-cols-[20rem_1fr]">
          <h2 className="display text-3xl">Grievance Officer</h2>
          <p className="max-w-[36rem] font-serif text-lg text-muted [overflow-wrap:anywhere]">
            {toBeConfirmed(officer.name)}, {toBeConfirmed(officer.designation)}. Phone: {toBeConfirmed(officer.phone)}. Email:{" "}
            {officer.email ? (
              <a href={`mailto:${officer.email}`} className={link}>
                {officer.email}
              </a>
            ) : (
              toBeConfirmed(officer.email)
            )}
            .
          </p>
        </section>
      </div>

      <p className="mt-8 font-serif text-lg text-muted">
        Looking for delivery times or our returns policy? See{" "}
        <Link href="/help" className={link}>
          Help
        </Link>
        .
      </p>
    </div>
  );
}
