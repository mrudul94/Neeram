import { getPack, getProduct, isAvailable } from "@/data/products";

export type CheckoutLine = { slug: string; qty: number; pack?: string };

export type CheckoutDetails = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  pin: string;
  state: string;
  landmark?: string;
  delivery: "standard";
};

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

/** Field-level validation shared by the checkout form and the API. Returns field → message. */
export function validateDetails(d: Partial<CheckoutDetails>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) errors.email = "Enter a valid email address.";
  if (!d.phone || !/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(d.phone.replace(/\s/g, ""))) errors.phone = "Enter a 10-digit Indian mobile number.";
  if (!d.firstName?.trim()) errors.firstName = "Enter your first name.";
  if (!d.lastName?.trim()) errors.lastName = "Enter your last name.";
  if (!d.street?.trim()) errors.street = "Enter your house name and street.";
  if (!d.city?.trim()) errors.city = "Enter your town or city.";
  if (!d.pin || !/^[1-9]\d{5}$/.test(d.pin)) errors.pin = "Enter a 6-digit PIN code.";
  if (!d.state || !INDIAN_STATES.includes(d.state)) errors.state = "Choose a state.";
  return errors;
}

/** Re-prices the cart from product data on the server. Total is null while any price is unknown. */
export function priceLines(lines: CheckoutLine[]) {
  const items = lines.flatMap((l) => {
    const p = getProduct(l.slug);
    const qty = Math.floor(Number(l.qty));
    if (!p || !isAvailable(p) || !(qty >= 1 && qty <= 20)) return [];
    const pack = getPack(p, l.pack);
    if (l.pack && pack?.id !== l.pack) return [];
    return [{ slug: p.slug, pack: pack?.id, name: pack ? `${p.name} (${pack.label})` : p.name, qty, unitPrice: pack?.price ?? p.price }];
  });
  const total = items.some((i) => i.unitPrice === null) ? null : items.reduce((s, i) => s + i.unitPrice! * i.qty, 0);
  return { items, total };
}

export function newOrderNumber() {
  return `NRM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
