import Link from "next/link";
import { products } from "@/data/products";
import { site } from "@/data/content";
import { SubscribeForm } from "./SubscribeForm";
import { Wordmark } from "./Wordmark";

const columns: { title: string; links: { label: string; href: string | null }[] }[] = [
  { title: "Shop", links: products.map((p) => ({ label: p.name, href: `/products/${p.slug}` })) },
  {
    title: "Help",
    links: [
      { label: "Shipping & delivery", href: "/help#shipping" },
      { label: "Returns & refunds", href: "/help#returns" },
      { label: "Track an order", href: "/help#track" },
      { label: "Contact us", href: "/help#contact" },
    ],
  },
  {
    title: "Neeram",
    links: [
      { label: "About us", href: "/about" },
      { label: "The kitchen", href: "/#kitchen" },
      { label: "Privacy policy", href: "/help#privacy" },
      { label: "Terms of service", href: "/help#terms" },
    ],
  },
  { title: "Follow", links: Object.entries(site.socials).map(([label, href]) => ({ label, href })) },
];

export function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-cream">
      <div className="wrap pt-16 md:pt-24">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <h2 className="display text-[2.5rem] md:text-[3.25rem]">
            A note when
            <br />
            new stock lands.
          </h2>
          <SubscribeForm topic="newsletter" className="md:pb-2" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-cream/80 pt-8 md:mt-12 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow text-[0.6875rem]">{col.title}</h3>
              <ul className="mt-3 space-y-1.5 text-[0.9375rem]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <Link href={l.href} className="hover:text-orange">
                        {l.label}
                      </Link>
                    ) : (
                      <span className="text-cream/70">{l.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-cream/20 pt-4 text-xs text-cream/90">
          © 2026 {site.legalName} · {site.address}
          {site.fssaiLicence && <> · FSSAI Lic. No. {site.fssaiLicence}</>}
        </p>
        <Wordmark className="mt-8 block w-full text-orange md:mt-10" />
      </div>
    </footer>
  );
}
