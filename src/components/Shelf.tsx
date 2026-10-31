import Image from "next/image";
import Link from "next/link";
import { hasSizes, isAvailable, lowestPrice, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./AddToCart";
import { cx } from "./ui";

/** Products standing on one thin line, info cells below split by vertical hairlines. */
export function Shelf({ items, className }: { items: Product[]; className?: string }) {
  return (
    <div className={cx("-mx-5 overflow-x-auto px-5 lg:mx-0 lg:overflow-visible lg:px-0", className)}>
      <ul
        className="grid min-w-max auto-cols-[max(42vw,10.5rem)] grid-flow-col sm:auto-cols-[28vw] lg:min-w-0 lg:auto-cols-fr"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((p, i) => (
          <ShelfItem key={p.slug} product={p} first={i === 0} />
        ))}
      </ul>
    </div>
  );
}

/** The whole card is one link to the product (stretched over the card from the name); the action sits above it. */
function ShelfItem({ product: p, first }: { product: Product; first: boolean }) {
  const available = isAvailable(p);
  const img = p.images[0];
  const action = "tap z-10 eyebrow text-[0.75rem] whitespace-nowrap text-orange-text hover:opacity-80";
  return (
    <li className="group relative flex flex-col" style={{ scrollSnapAlign: "start" }}>
      <div className="relative flex h-[13rem] items-end justify-center border-b border-ink md:h-[15.5rem]">
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
      </div>
      <div className={cx("flex flex-1 flex-col px-3 pt-4 pb-2 md:px-4", !first && "border-l border-ink/25")}>
        <p className="eyebrow text-[0.625rem] text-orange-text">No. {p.number}</p>
        <Link
          href={`/products/${p.slug}`}
          aria-label={`${p.name}${available ? "" : " — coming soon"}`}
          className="mt-1 text-[1.0625rem] leading-tight font-medium group-hover:text-orange after:absolute after:inset-0 after:content-['']"
        >
          {p.name}
        </Link>
        <p lang="ml" className="mt-0.5 font-ml text-[0.8125rem] text-muted">
          {p.nameMalayalam}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-sm">
          {available && hasSizes(p) ? (
            <>
              <span className="font-medium whitespace-nowrap tabular-nums">From {formatPrice(lowestPrice(p))}</span>
              <Link href={`/products/${p.slug}`} className={action}>
                Choose size
              </Link>
            </>
          ) : available ? (
            <>
              <span className="font-medium whitespace-nowrap tabular-nums">{formatPrice(p.price)}</span>
              <AddToCartButton slug={p.slug} variant="text" className="tap z-10 whitespace-nowrap">
                Add +
              </AddToCartButton>
            </>
          ) : (
            <Link href={`/products/${p.slug}#notify`} className={action}>
              Notify me
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
