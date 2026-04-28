import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/catalog/product-detail";
import { ProductJsonLd } from "@/components/seo/product-jsonld";
import { getProductBySlug, getRelatedProducts, getAllProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/constants";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return {};

  const cover = product.images.find((img) => img.isCover) ?? product.images[0];
  const ogImage = cover ? cover.url : "/images/logo.jpeg";

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `${siteConfig.url}/catalogo/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
      images: [ogImage],
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <ProductDetail product={product} related={related} />
      </div>
    </>
  );
}
