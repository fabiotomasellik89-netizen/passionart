import { Suspense } from "react";
import type { Metadata } from "next";
import CheckoutClientPage from "@/components/checkout/checkout-client-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutClientPage />
    </Suspense>
  );
}
