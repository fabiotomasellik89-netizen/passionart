import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/constants";
import { CanvasConfigurator } from "@/components/catalog/canvas-configurator";

export function generateStaticParams() {
  return getAllProducts()
    .filter((p) => p.category === "tele-stampate")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `Configura ${product.name}`,
    description: `Personalizza la tua tela stampata UV: scegli misure, tipo di canvas, cornice, carica la tua foto e aggiungi un testo.`,
    alternates: {
      canonical: `${siteConfig.url}/catalogo/${product.slug}/configura-tela`,
    },
  };
}

export default async function ConfiguraTelaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || product.category !== "tele-stampate") {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <CanvasConfigurator product={product} />
    </div>
  );
}
