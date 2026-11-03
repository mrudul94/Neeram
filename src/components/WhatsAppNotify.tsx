import { whatsappLink } from "@/lib/checkout";
import { cx } from "./ui";

type Props = {
  /** The message the customer sends us; they can edit it in WhatsApp first. */
  message: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
};

/** New-stock requests are handled by hand on WhatsApp, so nothing is saved by the site. */
export function WhatsAppNotify({ message, label, tone = "dark", className }: Props) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cx("tap eyebrow inline-block py-3 text-[0.75rem] hover:opacity-80", tone === "dark" ? "text-orange" : "text-orange-text", className)}
    >
      {label} →
    </a>
  );
}
