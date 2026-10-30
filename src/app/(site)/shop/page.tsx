import type { Metadata } from "next";
import Link from "next/link";
import { OilBand } from "@/components/OilBand";
import { ShopList } from "@/components/shop/ShopList";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "The shelf",
  description: "Six staples of the Kerala kitchen. Neeram Coconut Oil is available now; the spices are coming soon.",
};

export default function ShopPage() {
  return (
    <>
      <section className="wrap pt-6 pb-20 md:pt-8 md:pb-28">
        <nav aria-label="Breadcrumb" className="text-[0.8125rem]">
          <Link href="/" className="hover:text-orange">
            Home
          </Link>
          <span className="mx-1.5 text-muted">/</span>
          <span aria-current="page">Shop</span>
        </nav>
        <div className="mt-3 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <h1 className="display text-[clamp(4.5rem,12vw,10rem)]">The shelf</h1>
          <p className="font-serif text-lg text-muted md:pb-6">Six products. Shown in shelf order.</p>
        </div>
        <ShopList />
      </section>

      <OilBand eyebrow="No. 01 · Coconut Oil" title={<>Every dish<br />starts in oil.</>}>
        <ButtonLink href="/products/coconut-oil" arrow className="mt-8">
          Shop coconut oil
        </ButtonLink>
      </OilBand>
    </>
  );
}
