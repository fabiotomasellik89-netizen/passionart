import type { Metadata } from "next";
import { CartClientPage } from "@/components/cart/cart-client-page";

export const metadata: Metadata = {
  title: "Carrello",
  robots: { index: false, follow: false },
};

export default function CarrelloPage() {
  return <CartClientPage />;
}
