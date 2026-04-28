import type { Metadata } from "next";
import { CategoriesStrip } from "@/components/home/categories-strip";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { ShowcaseGrid } from "@/components/home/showcase-grid";
import { StorySection } from "@/components/home/story-section";
import { getFeaturedProducts, getShowcaseProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const showcaseProducts = getShowcaseProducts();

  return (
    <>
      <Hero />
      <CategoriesStrip />
      <FeaturedProducts products={featuredProducts} />
      <ShowcaseGrid products={showcaseProducts} />
      <InstagramFeed />
      <StorySection />
    </>
  );
}
