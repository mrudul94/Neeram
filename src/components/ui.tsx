import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { Spec } from "@/data/products";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Eyebrow({ children, className, ml }: { children: ReactNode; className?: string; ml?: string }) {
  return (
    <p className={cx("eyebrow flex items-center gap-3", className)}>
      <span aria-hidden className="h-px w-6 shrink-0 bg-orange" />
      <span>{children}</span>
      {ml && (
        <span lang="ml" className="font-ml text-[0.8125rem] font-medium normal-case tracking-normal">
          {ml}
        </span>
      )}
    </p>
  );
}

type Variant = "orange" | "ink" | "cream" | "text";

const variants: Record<Variant, string> = {
  orange: "bg-orange text-ink hover:bg-orange-deep px-6 h-12",
  ink: "bg-ink text-cream hover:bg-ink/85 px-6 h-12",
  cream: "bg-cream text-ink hover:bg-sand px-6 h-12",
  text: "tap h-auto border-b border-current pb-0.5 hover:text-orange",
};

export function buttonClass(variant: Variant = "orange", className?: string) {
  return cx(
    "eyebrow inline-flex items-center justify-center gap-3 text-[0.8125rem] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className,
  );
}

export function ButtonLink({
  variant = "orange",
  arrow,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean }) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      {children}
      {arrow && <ArrowRight />}
    </Link>
  );
}

export function SpecTable({ specs, className }: { specs: Spec[]; className?: string }) {
  return (
    <dl className={cx("border-t border-ink", className)}>
      {specs.map((s) => (
        <div key={s.label} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-ink py-3 sm:grid-cols-[9rem_1fr]">
          <dt className="eyebrow pt-0.5 text-[0.6875rem] text-muted">{s.label}</dt>
          <dd className="text-[0.9375rem]">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Large Malayalam display word (വെളിച്ചെണ്ണ). Deliberately no lang="ml": with it, Chrome
 * selects Baloo Chettan 2's "MAL" language system, which drops the stacked conjuncts
 * (ച്ച, ണ്ണ). Nearby captions carry the lang attribute.
 */
export function MalayalamDisplay({ children, className, "aria-hidden": hidden }: { children: ReactNode; className?: string; "aria-hidden"?: boolean }) {
  return (
    <p aria-hidden={hidden} className={cx("font-ml-display font-extrabold leading-[1.1]", className)}>
      {children}
    </p>
  );
}

const icon = { width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true } as const;

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg {...icon} width={16} height={16} viewBox="0 0 24 24" className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
export function ChevronLeft() {
  return (
    <svg {...icon} width={14} height={14} viewBox="0 0 24 24">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}
export function ChevronRight() {
  return (
    <svg {...icon} width={14} height={14} viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
export function ChevronDown() {
  return (
    <svg {...icon} width={14} height={14} viewBox="0 0 24 24">
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}
export function BagIcon() {
  return (
    <svg {...icon} viewBox="0 0 24 24">
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </svg>
  );
}
export function MenuIcon() {
  return (
    <svg {...icon} viewBox="0 0 24 24">
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}
export function CloseIcon() {
  return (
    <svg {...icon} viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
export function PlusIcon() {
  return (
    <svg {...icon} width={14} height={14} viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
export function MinusIcon() {
  return (
    <svg {...icon} width={14} height={14} viewBox="0 0 24 24">
      <path d="M5 12h14" />
    </svg>
  );
}
