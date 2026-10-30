import type { Metadata } from "next";
import { Suspense } from "react";
import { Confirmation } from "@/components/checkout/Confirmation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

export default function OrderConfirmedPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-[70vh]" />}>
        <Confirmation />
      </Suspense>
      <Footer />
    </>
  );
}
