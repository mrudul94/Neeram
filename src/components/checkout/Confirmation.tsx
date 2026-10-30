"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getProduct } from "@/data/products";
import { useCart, useCartHydrated } from "@/store/cart";
import { ButtonLink, Eyebrow } from "../ui";

export function Confirmation() {
  const hydrated = useCartHydrated();
  const lastOrder = useCart((s) => s.lastOrder);
  const orderParam = useSearchParams().get("order");
  const order = hydrated && lastOrder?.number === orderParam ? lastOrder : null;
  const items = (order?.slugs ?? ["coconut-oil"]).map((s) => getProduct(s)).filter((p) => !!p);

  return (
    <section className="wrap grid gap-12 py-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:py-20">
      <div>
        <Eyebrow>Order #{orderParam ?? "—"}</Eyebrow>
        <h1 className="display mt-5 text-[clamp(4rem,9vw,8rem)]">
          Nandi.
          <br />
          Thank you.
        </h1>
        <p lang="ml" className="mt-4 font-ml text-2xl text-muted">
          നന്ദി
        </p>
        <p className="mt-6 max-w-[26rem] font-serif text-xl leading-relaxed text-muted">
          {order?.firstName ? `${order.firstName}, your` : "Your"} order is placed. We&apos;ve sent the details to your email and will message you when it ships.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href="/shop" variant="ink">
            Continue shopping
          </ButtonLink>
          <ButtonLink href="/help#track" variant="text">
            Track your order
          </ButtonLink>
        </div>
      </div>
      <figure className="flex flex-col justify-end bg-sand px-8 pt-16 pb-6">
        <div className="flex items-end justify-center gap-6 border-b border-ink">
          {items.map((p) => (
            <Image key={p.slug} src={p.images[0].src} alt={p.images[0].alt} width={p.images[0].width} height={p.images[0].height} className="h-64 w-auto md:h-80" />
          ))}
        </div>
        <figcaption className="mt-3 font-serif text-sm text-muted italic">
          On its way to your kitchen: {items.map((p) => p.name).join(" and ")}.
        </figcaption>
      </figure>
    </section>
  );
}
