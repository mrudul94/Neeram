import { site } from "@/data/content";
import type { Product, Spec } from "@/data/products";
import { toBeConfirmed } from "./format";

/** Packaged-goods details for a product listing. Blank ones show as visible gaps. */
export function packagedDetails(product: Product): Spec[] {
  const sizes = product.packs?.map((p) => (p.form === "Packet" ? `${p.size} packet` : p.size)).join(", ") ?? product.sizeLabel;
  return [
    { label: "Manufacturer", value: toBeConfirmed(site.packaged.manufacturer) },
    { label: "Country of origin", value: "India" },
    { label: "Net quantity", value: sizes },
    { label: "MRP", value: toBeConfirmed(site.packaged.mrp) },
    { label: "Best before", value: toBeConfirmed(site.packaged.bestBefore) },
    { label: "FSSAI licence", value: toBeConfirmed(site.fssaiLicence) },
  ];
}
