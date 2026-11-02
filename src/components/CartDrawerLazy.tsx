"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { afterPageLoad } from "@/lib/motion";
import { useCart } from "@/store/cart";

const load = () => import("./CartDrawer").then((m) => m.CartDrawer);
const CartDrawer = dynamic(load, { ssr: false });

/** The drawer is mounted the first time it opens; its code is fetched once the page has loaded. */
export function CartDrawerLazy() {
  const open = useCart((s) => s.drawerOpen);
  const [opened, setOpened] = useState(false);

  useEffect(() => afterPageLoad(() => void load()), []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- stays mounted once it has opened
  useEffect(() => void (open && setOpened(true)), [open]);

  return opened ? <CartDrawer /> : null;
}
