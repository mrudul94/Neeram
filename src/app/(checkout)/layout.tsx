import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";

export default function CheckoutLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <CheckoutHeader />
      <main id="main">{children}</main>
    </>
  );
}
