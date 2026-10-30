import Image from "next/image";
import Link from "next/link";
import { cx } from "./ui";

// Neeram coconut-leaf logo (public/images/Main logo/, trimmed copy in public/images/logo/)
// with the product line under it. Sized in em, so callers set the size with font-size.
export function Logo({ className, href = "/" }: { className?: string; href?: string | null }) {
  const mark = (
    <span className={cx("inline-flex flex-col items-center leading-none", className)}>
      <Image
        src="/images/logo/neeram-logo.webp"
        alt="Neeram Coconut Oil"
        width={320}
        height={247}
        loading="eager"
        sizes="8rem"
        className="h-[3.2em] w-auto"
      />
      <span aria-hidden className="mt-[0.3em] flex items-center gap-[0.35em] text-[0.55em] font-medium text-leaf">
        <span className="h-px w-[1.4em] bg-leaf" />
        Coconut Oil
        <span className="h-px w-[1.4em] bg-leaf" />
      </span>
    </span>
  );
  if (href === null) return mark;
  return (
    <Link href={href} title="Home" className="inline-flex">
      {mark}
    </Link>
  );
}
