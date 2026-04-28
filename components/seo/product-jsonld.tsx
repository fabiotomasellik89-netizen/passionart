import type { Product } from "@/types";
import { siteConfig } from "@/lib/constants";

export function ProductJsonLd({ product }: { product: Product }) {
  const cover = product.images.find((img) => img.isCover) ?? product.images[0];
  const imageUrl = cover ? `${siteConfig.url}${cover.url}` : `${siteConfig.url}/images/logo.jpeg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: imageUrl,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      price: product.basePrice.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/catalogo/${product.slug}`,
      priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split("T")[0],
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
