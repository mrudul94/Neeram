import Link from "next/link";
import { site } from "@/data/content";
import { Logo } from "../Logo";
import { ArrowRight, ButtonLink } from "../ui";

const help = [
  { label: "Shipping & delivery", href: "/help#shipping" },
  { label: "Returns & refunds", href: "/help#returns" },
  { label: "Track an order", href: "/help#track" },
  { label: "Contact us", href: "/help#contact" },
];

export function AboutHelp() {
  return (
    <section id="about" className="scroll-mt-4 bg-sand py-16 md:py-24">
      <div className="wrap grid gap-12 border-t border-ink pt-8 md:grid-cols-[minmax(0,1fr)_22rem] md:gap-24">
        <div>
          <h2 className="eyebrow text-[0.6875rem] text-orange-text">About Neeram</h2>
          <div className="mt-6 pl-1 text-[1.1rem]">
            <Logo href={null} />
          </div>
          <p className="mt-6 max-w-[32rem] font-serif text-[1.625rem] leading-snug">{site.aboutText}</p>
          <ButtonLink href="/about" variant="ink" arrow className="mt-8">
            Read our story
          </ButtonLink>
        </div>
        <div>
          <h2 className="eyebrow text-[0.6875rem] text-orange-text">Help with an order</h2>
          <ul className="mt-4">
            {help.map((h) => (
              <li key={h.href} className="border-b border-ink">
                <Link href={h.href} className="flex items-center justify-between py-4 text-[1.0625rem] hover:text-orange">
                  {h.label}
                  <ArrowRight />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
