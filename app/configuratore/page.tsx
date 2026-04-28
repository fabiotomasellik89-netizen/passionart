import type { Metadata } from "next";
import { Suspense } from "react";
import ConfiguratoreClientPage from "@/components/configurator/configurator-client-page";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Configuratore",
  description:
    "Personalizza la tua bomboniera online: scegli forma, dimensioni, incisione e accessori. Anteprima live con prezzo in tempo reale.",
  alternates: {
    canonical: `${siteConfig.url}/configuratore`,
  },
  openGraph: {
    title: `Configuratore | ${siteConfig.name}`,
    description:
      "Personalizza la tua bomboniera online: scegli forma, dimensioni, incisione e accessori. Anteprima live con prezzo in tempo reale.",
    images: ["/images/logo.jpeg"],
  },
};

export default function ConfiguratorePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          Caricamento configuratore...
        </div>
      }
    >
      <ConfiguratoreClientPage />
    </Suspense>
  );
}
