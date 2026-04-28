import { siteConfig } from "@/lib/constants";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.jpeg`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    sameAs: [
      `https://www.instagram.com/${siteConfig.instagram.replace("@", "")}`,
    ],
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "PayPal",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
