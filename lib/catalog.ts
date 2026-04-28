import type { Product } from "@/types";
import { listAddonGroups, listProducts } from "@/lib/mock-db";
import { shapePresets } from "@/lib/data/demo-catalog";

export function getAllProducts() {
  return listProducts().filter((product) => product.isActive);
}

export function getFeaturedProducts() {
  return getAllProducts().filter((product) => product.isFeatured);
}

export function getCustomizableProducts() {
  return getAllProducts().filter((product) => product.isCustomizable);
}

export function getShowcaseProducts() {
  return getAllProducts().filter(
    (product) =>
      product.inspirationType === "showcase" || product.inspirationType === "both",
  );
}

export function getProductBySlug(slug: string) {
  return getAllProducts().find((product) => product.slug === slug) ?? null;
}

export function getRelatedProducts(product: Product) {
  return getAllProducts()
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        (candidate.category === product.category ||
          candidate.eventType === product.eventType),
    )
    .slice(0, 3);
}

export function getFilterCollections() {
  const products = getAllProducts();
  return {
    categories: [...new Set(products.map((product) => product.category))],
    events: [...new Set(products.map((product) => product.eventType))],
  };
}

export const addonGroups = listAddonGroups();
export { shapePresets };