"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categories, hasSizes, isAvailable, lowestPrice, products, type Category, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "../AddToCart";
import { QtyStepper } from "../QtyStepper";
import { buttonClass, ChevronDown, cx } from "../ui";

type Sort = "shelf" | "available";

export function ShopList() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [sort, setSort] = useState<Sort>("shelf");

  let items = filter === "All" ? products : products.filter((p) => p.category === filter);
  if (sort === "available") items = [...items].sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a)));

  const tabs: { label: Category | "All"; count: number }[] = [
    { label: "All", count: products.length },
    ...categories.map((c) => ({ label: c, count: products.filter((p) => p.category === c).length })),
  ];

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 md:mt-10">
        <div role="group" aria-label="Filter by type" className="-mx-5 flex gap-6 overflow-x-auto px-5 md:mx-0 md:px-0">
          {tabs.map((t) => (
            <button
              key={t.label}
              type="button"
              aria-pressed={filter === t.label}
              onClick={() => setFilter(t.label)}
              className={cx(
                "shrink-0 border-b-2 pb-1.5 text-[0.9375rem]",
                filter === t.label ? "border-orange font-medium" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
        <label className="relative flex items-center gap-2 text-sm">
          <span className="text-muted">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="appearance-none bg-transparent pr-5 font-medium outline-offset-2"
          >
            <option value="shelf">Shelf order</option>
            <option value="available">In stock first</option>
          </select>
          <span aria-hidden className="pointer-events-none absolute right-0">
            <ChevronDown />
          </span>
        </label>
      </div>

      <ol className="mt-6 border-t border-ink">
        {items.map((p) => (
          <ShopRow key={p.slug} product={p} />
        ))}
      </ol>
    </>
  );
}

function ShopRow({ product: p }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const available = isAvailable(p);
  const img = p.images[0];
  return (
    <li className="group grid grid-cols-[6.5rem_1fr] gap-x-5 gap-y-4 border-b border-ink py-5 hover:bg-sand md:grid-cols-[6.5rem_8rem_minmax(0,1fr)_6rem_auto] md:items-center md:gap-x-8 md:px-4">
      <p aria-hidden className="display hidden self-start text-[3.5rem] leading-none text-stone group-hover:text-orange md:block">
        {p.number}
      </p>
      <Link href={`/products/${p.slug}`} className="row-span-2 grid h-[8.5rem] place-items-center bg-sand group-hover:bg-cream md:row-span-1 md:h-[9.25rem]" tabIndex={-1}>
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes="5rem"
          className={cx("h-[7rem] w-auto md:h-[8rem]", !available && "opacity-85 grayscale-[0.55]")}
        />
      </Link>
      <div>
        <p className="eyebrow text-[0.625rem] text-orange-text">
          <span className="md:hidden">No. {p.number} · </span>
          {p.category}
        </p>
        <h2 className="display mt-1 text-[clamp(1.75rem,3vw,2.5rem)] leading-none">
          <Link href={`/products/${p.slug}`} className="hover:text-orange">
            {p.name}
          </Link>
        </h2>
        <p lang="ml" className="mt-1 font-ml text-[0.8125rem] text-muted">
          {p.nameMalayalam}
        </p>
        <p className="mt-2 max-w-[22rem] font-serif text-[0.9375rem] leading-snug text-muted">{p.shortDescription}</p>
      </div>
      <p className={cx("col-start-2 text-lg font-medium tabular-nums md:col-start-auto", !available && "text-muted")}>
        {!available ? (
          <span className="eyebrow text-[0.6875rem] whitespace-nowrap">Coming soon</span>
        ) : hasSizes(p) ? (
          <>
            <span className="block text-[0.6875rem] font-normal text-muted">From</span>
            {formatPrice(lowestPrice(p))}
          </>
        ) : (
          formatPrice(p.price)
        )}
      </p>
      <div className="col-span-2 flex gap-3 md:col-span-1">
        {available && hasSizes(p) ? (
          <Link href={`/products/${p.slug}`} className={buttonClass("ink", "h-10 flex-1 px-4 md:flex-none")}>
            Choose size
          </Link>
        ) : available ? (
          <>
            <QtyStepper size="sm" label={p.name} value={qty} onChange={setQty} className="h-10" />
            <AddToCartButton slug={p.slug} qty={qty} className="h-10 flex-1 px-4 md:flex-none">
              Add to cart
            </AddToCartButton>
          </>
        ) : (
          <Link
            href={`/products/${p.slug}#notify`}
            className="eyebrow inline-flex h-10 flex-1 items-center justify-center border border-ink px-4 text-[0.75rem] hover:bg-ink hover:text-cream md:flex-none"
          >
            Notify me
          </Link>
        )}
      </div>
    </li>
  );
}
