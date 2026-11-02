import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      {/* Suspense lets React hydrate it separately, in a shorter task. */}
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
