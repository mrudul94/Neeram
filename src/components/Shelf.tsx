import Image from "next/image";
import Link from "next/link";
import { isAvailable, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./AddToCart";
import { cx } from "./ui";

/** Products standing on one thin line, info cells below split by vertical hairlines. */
export function Shelf({ items, className }: { items: Product[]; className?: string }) {
  return (
    <div className={cx("-mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-visible md:px-0", className)}>
      <ul
        className="grid min-w-max auto-cols-[42vw] grid-flow-col sm:auto-cols-[28vw] md:min-w-0 md:auto-cols-fr"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((p, i) => (
          <ShelfItem key={p.slug} product={p} first={i === 0} />
        ))}
      </ul>
    </div>
  );
}

function ShelfItem({ product: p, first }: { product: Product; first: boolean }) {
  const available = isAvailable(p);
  const img = p.images[0];
  return (
    <li className="flex flex-col" style={{ scrollSnapAlign: "start" }}>
      <Link
        href={`/products/${p.slug}`}
        className="group relative flex h-[13rem] items-end justify-center border-b border-ink md:h-[15.5rem]"
        aria-label={`${p.name}${available ? "" : " — coming soon"}`}
      >
        <Image
          src={img.src}
          alt=""
          width={img.width}
          height={img.height}
          sizes="10rem"
          className={cx(
            "w-auto drop-shadow-[0_10px_8px_rgb(22_19_15/0.18)] transition-transform duration-300 group-hover:-translate-y-1",
            !available && "opacity-85 grayscale-[0.55]",
          )}
          style={{ height: `${Math.round(p.shelfScale * 92)}%` }}
        />
        {!available && (
          <span className="eyebrow absolute top-2 right-2 bg-ink px-2 py-1 text-[0.5625rem] text-cream">Coming soon</span>
        )}
      </Link>
      <div className={cx("flex flex-1 flex-col px-3 pt-4 pb-2 md:px-4", !first && "border-l border-ink/25")}>
        <p className="eyebrow text-[0.625rem] text-orange-text">No. {p.number}</p>
        <Link href={`/products/${p.slug}`} className="mt-1 text-[1.0625rem] leading-tight font-medium hover:text-orange">
          {p.name}
        </Link>
        <p lang="ml" className="mt-0.5 font-ml text-[0.8125rem] text-muted">
          {p.nameMalayalam}
        </p>
        <div className="mt-auto flex items-center gap-4 pt-4 text-sm">
          {available ? (
            <>
              <span className="font-medium tabular-nums">{formatPrice(p.price)}</span>
              <AddToCartButton slug={p.slug} variant="text">
                Add +
              </AddToCartButton>
            </>
          ) : (
            <Link href={`/products/${p.slug}#notify`} className="eyebrow text-[0.75rem] text-orange-text hover:opacity-80">
              Notify me
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
