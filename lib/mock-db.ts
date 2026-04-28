import { addonGroups, demoProducts } from "@/lib/data/demo-catalog";
import { defaultConfiguratorSettings } from "@/lib/data/configurator-settings";
import { uid } from "@/lib/utils";
import type { ConfiguratorSettings, OrderRecord, Product } from "@/types";

type MockState = {
  products: Product[];
  orders: OrderRecord[];
  configuratorSettings: ConfiguratorSettings;
};

declare global {
  var __passionartMockState__: MockState | undefined;
}

function getInitialOrders(): OrderRecord[] {
  return [
    {
      id: uid("order"),
      createdAt: new Date().toISOString(),
      status: "in-lavorazione",
      paymentStatus: "captured",
      paypalOrderId: "PAYPAL-DEMO-001",
      total: 58.4,
      customer: {
        fullName: "Giulia Rossi",
        email: "giulia@example.com",
        phone: "+39 333 1234567",
        address: "Via dei Tigli 12",
        city: "Brescia",
        zip: "25121",
        notes: "Palette cipria e avorio",
      },
      items: [],
    },
  ];
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getState() {
  if (!globalThis.__passionartMockState__) {
    globalThis.__passionartMockState__ = {
      products: clone(demoProducts),
      orders: getInitialOrders(),
      configuratorSettings: clone(defaultConfiguratorSettings),
    };
  }

  // Back-fill fields added in newer schema versions so hot-reload can't leave
  // a stale __passionartMockState__ that is missing tazzePrices / magliettePrices.
  const cs = globalThis.__passionartMockState__.configuratorSettings;
  if (!cs.tazzePrices) {
    cs.tazzePrices = clone(defaultConfiguratorSettings.tazzePrices);
  }
  if (!cs.magliettePrices) {
    cs.magliettePrices = clone(defaultConfiguratorSettings.magliettePrices);
  }
  if (!cs.categories) {
    cs.categories = clone(defaultConfiguratorSettings.categories);
  }
  if (!cs.customCategoryPrices) {
    cs.customCategoryPrices = {};
  }
  if (!cs.categorySettings) {
    cs.categorySettings = clone(defaultConfiguratorSettings.categorySettings);
  }

  return globalThis.__passionartMockState__;
}

export function listProducts() {
  return clone(getState().products);
}

export function getProduct(slug: string) {
  return clone(getState().products.find((item) => item.slug === slug) ?? null);
}

export function getProductById(id: string) {
  return clone(getState().products.find((item) => item.id === id) ?? null);
}

export function upsertProduct(input: Partial<Product> & { name: string; slug: string }) {
  const state = getState();
  const existingIndex = state.products.findIndex((item) => item.id === input.id);
  const fallback = state.products[0];
  const nextProduct: Product = {
    id: input.id || uid("product"),
    slug: input.slug,
    name: input.name,
    shortDescription: input.shortDescription || input.name,
    description: input.description || input.shortDescription || input.name,
    category: input.category || fallback.category,
    eventType: input.eventType || fallback.eventType,
    basePrice: input.basePrice || fallback.basePrice,
    isFeatured: input.isFeatured ?? false,
    isActive: input.isActive ?? true,
    isCustomizable: input.isCustomizable ?? true,
    inspirationType: input.inspirationType || "product",
    defaultShape: input.defaultShape || fallback.defaultShape,
    supportedShapes: input.supportedShapes || fallback.supportedShapes,
    materials: input.materials || fallback.materials,
    productionNotes: input.productionNotes || "Creazione aggiornata tramite area admin.",
    leadTimeDays: input.leadTimeDays || 8,
    badge: input.badge || "Aggiornato in admin",
    palette: input.palette || fallback.palette,
    images: input.images !== undefined ? input.images : fallback.images,
  };

  if (existingIndex >= 0) {
    state.products[existingIndex] = nextProduct;
  } else {
    state.products.unshift(nextProduct);
  }

  return clone(nextProduct);
}

export function deleteProduct(id: string) {
  const state = getState();
  state.products = state.products.filter((item) => item.id !== id);
  return true;
}

export function listAddonGroups() {
  return clone(addonGroups);
}

export function listOrders() {
  return clone(getState().orders).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function createOrder(order: Omit<OrderRecord, "id" | "createdAt">) {
  const state = getState();
  const nextOrder: OrderRecord = {
    ...order,
    id: uid("order"),
    createdAt: new Date().toISOString(),
  };
  state.orders.unshift(nextOrder);
  return clone(nextOrder);
}

export function updateOrderStatus(
  id: string,
  payload: Partial<Pick<OrderRecord, "status" | "paymentStatus">>,
) {
  const state = getState();
  const order = state.orders.find((item) => item.id === id);
  if (!order) {
    return null;
  }
  Object.assign(order, payload);
  return clone(order);
}

export function getConfiguratorSettings(): ConfiguratorSettings {
  return clone(getState().configuratorSettings);
}

export function setConfiguratorSettings(settings: ConfiguratorSettings): ConfiguratorSettings {
  const state = getState();
  state.configuratorSettings = clone(settings);
  return clone(state.configuratorSettings);
}