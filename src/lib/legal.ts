import { site } from "@/data/content";
import { packMrp, packSize } from "@/data/products";
import type { Product, Spec } from "@/data/products";
import { formatPrice, toBeConfirmed } from "./format";

/** Packaged-goods details for a product listing. Blank ones show as visible gaps. */
export function packagedDetails(product: Product): Spec[] {
  const sizes = product.packs?.map((p) => packSize(p)).join(", ") ?? product.sizeLabel;
  const mrp = product.packs?.map((p) => `${p.label} ${formatPrice(packMrp(product, p))}`).join(", ") ?? (product.price === null ? null : formatPrice(product.price));
  return [
    { label: "Manufacturer", value: toBeConfirmed(site.packaged.manufacturer) },
    { label: "Country of origin", value: "India" },
    { label: "Net quantity", value: sizes },
    { label: "MRP", value: toBeConfirmed(mrp) },
    { label: "Best before", value: toBeConfirmed(site.packaged.bestBefore) },
    { label: "FSSAI licence", value: toBeConfirmed(site.fssaiLicence) },
  ];
}
