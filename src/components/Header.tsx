"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart, useCartHydrated } from "@/store/cart";
import { Logo } from "./Logo";
import { BagIcon, CloseIcon, MenuIcon, cx } from "./ui";

// "The kitchen" becomes a full page in Phase 2; until then it points at the matching
// home-page section.
const nav = [
  { label: "Shop", href: "/shop" },
  { label: "The kitchen", href: "/#kitchen" },
  { label: "About us", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const setMenuOpen = (open: boolean | ((o: boolean) => boolean)) =>
    setMenuPath((typeof open === "function" ? open(menuOpen) : open) ? pathname : null);

  return (
    <header className={cx("z-30 w-full", overHero ? "absolute inset-x-0 top-0 text-cream" : "relative bg-cream text-ink")}>
      <div className="wrap grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center border-b border-current md:h-[5.5rem]">
        <nav aria-label="Main" className="flex items-center gap-1 md:gap-8">
          <button
            type="button"
            className="-ml-2 p-2 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden text-[0.9375rem] hover:text-orange md:inline"
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Logo className="text-[0.95rem] md:text-[1.05rem]" />
        <div className="flex items-center justify-end gap-2 md:gap-5">
          <CartButton />
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className={cx("absolute inset-x-0 top-full border-b md:hidden", overHero ? "bg-ink" : "bg-cream")}
        >
          <ul className="wrap py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="display block py-2 text-3xl" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function CartButton() {
  const hydrated = useCartHydrated();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const openDrawer = useCart((s) => s.openDrawer);
  const shown = hydrated ? count : 0;
  return (
    <button
      type="button"
      onClick={openDrawer}
      className="-mr-1 flex items-center gap-2 p-1 text-[0.9375rem] hover:text-orange"
      aria-label={`Cart, ${shown} ${shown === 1 ? "item" : "items"}`}
      aria-haspopup="dialog"
    >
      <BagIcon />
      <span className="hidden md:inline">Cart ({shown})</span>
      <span className="md:hidden">{shown}</span>
    </button>
  );
}
