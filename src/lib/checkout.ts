import { site } from "@/data/content";
import { getPack, getProduct, isAvailable } from "@/data/products";
import { formatPrice } from "./format";

export type CheckoutLine = { slug: string; qty: number; pack?: string };

/** No payment is taken on the site, and there is no cash on delivery: orders are paid before they ship. */
export const PAYMENT = {
  title: "Pay before delivery",
  note: "Once we confirm your order and delivery charge on WhatsApp, we send our payment details. Your order ships after payment.",
};

export type CheckoutDetails = {
  email?: string;
  phone: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  pin: string;
  state: string;
  landmark?: string;
  note?: string;
};

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const compactPhone = (phone: string) => phone.replace(/[\s-]/g, "");

/** A valid mobile number as "+91 98765 43210", however the customer typed it. */
export function formatPhone(phone: string): string {
  const digits = compactPhone(phone).slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** Field-level validation shared by the checkout form and the API. Returns field → message. */
export function validateDetails(d: Partial<CheckoutDetails>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (d.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) errors.email = "Enter a valid email address, or leave it empty.";
  if (!d.phone || !/^(\+?91|0)?[6-9]\d{9}$/.test(compactPhone(d.phone))) errors.phone = "Enter a 10-digit Indian mobile number.";
  if (!d.firstName?.trim()) errors.firstName = "Enter your first name.";
  if (!d.lastName?.trim()) errors.lastName = "Enter your last name.";
  if (!d.street?.trim()) errors.street = "Enter your house name and street.";
  if (!d.city?.trim()) errors.city = "Enter your town or city.";
  if (!d.pin || !/^[1-9]\d{5}$/.test(d.pin)) errors.pin = "Enter a 6-digit PIN code.";
  if (!d.state || !INDIAN_STATES.includes(d.state)) errors.state = "Choose a state.";
  if ((d.note?.length ?? 0) > 500) errors.note = "Keep the note under 500 characters.";
  return errors;
}

export type PricedItem = { slug: string; pack?: string; name: string; qty: number; unitPrice: number | null };

/** Re-prices the cart from product data on the server. Total is null while any price is unknown. */
export function priceLines(lines: CheckoutLine[]) {
  const items: PricedItem[] = lines.flatMap((l) => {
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

/** The order as plain text, for WhatsApp, SMS, email or copying. */
export function orderMessage(o: { orderNumber: string; items: PricedItem[]; total: number | null; details: CheckoutDetails }) {
  const d = o.details;
  const address = [d.street, d.landmark?.trim() && `Near ${d.landmark.trim()}`, d.city, `${d.state} ${d.pin}`].filter(Boolean).join(", ");
  return [
    `Hello Neeram, I'd like to place an order.`,
    ``,
    `Order: ${o.orderNumber}`,
    ...o.items.map((i) => `• ${i.qty} × ${i.name}: ${formatPrice(i.unitPrice === null ? null : i.unitPrice * i.qty)}`),
    `Subtotal: ${formatPrice(o.total)} (delivery charge to be confirmed)`,
    `Payment: before delivery, after you confirm`,
    ``,
    `Name: ${d.firstName.trim()} ${d.lastName.trim()}`,
    `Phone: ${formatPhone(d.phone)}`,
    ...(d.email?.trim() ? [`Email: ${d.email.trim()}`] : []),
    `Address: ${address}`,
    ...(d.note?.trim() ? [``, `Note: ${d.note.trim()}`] : []),
  ].join("\n");
}

/** Links that send the order message to Neeram; null where the contact isn't set. */
export function orderLinks(message: string, orderNumber: string) {
  const { whatsapp, phone, email } = site.orders;
  const text = encodeURIComponent(message);
  const smsNumber = phone ?? whatsapp;
  return {
    whatsapp: whatsapp ? `https://wa.me/${whatsapp}?text=${text}` : `https://wa.me/?text=${text}`,
    sms: smsNumber ? `sms:+${smsNumber}?body=${text}` : null,
    email: email ? `mailto:${email}?subject=${encodeURIComponent(`Order ${orderNumber}`)}&body=${text}` : null,
  };
}
