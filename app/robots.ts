import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/checkout", "/carrello", "/ordine-confermato"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
