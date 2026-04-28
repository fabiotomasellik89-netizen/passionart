import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ArtisticConfigSelection,
  CanvasPrintConfig,
  CartItem,
  PriceBreakdown,
  Product,
  ProductCustomOptions,
} from "@/types";
import { uid } from "@/lib/utils";

type CartStore = {
  items: CartItem[];
  addItem: (payload: {
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    breakdown: PriceBreakdown;
    configuration: ArtisticConfigSelection;
    canvasConfig?: CanvasPrintConfig;
  }) => void;
  addSimpleProduct: (product: Product, quantity?: number) => void;
  addProductWithOptions: (product: Product, options: ProductCustomOptions) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: ({ product, quantity, unitPrice, totalPrice, breakdown, configuration, canvasConfig }) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              id: uid("cart"),
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images[0]?.url || "/images/logo.jpeg",
              unitPrice,
              totalPrice,
              quantity,
              configuration,
              canvasConfig,
              breakdown,
            },
          ],
        })),
      addSimpleProduct: (product, quantity = 1) => {
        const configuration: ArtisticConfigSelection = {
          theme: "personalizzato",
          event: "altro",
          names: product.name,
          preferredColors: [],
          format: "bomboniera-singola",
          size: "media",
          confettiEnabled: false,
          veilEnabled: false,
          decoratedBasket: false,
          personalizedCard: false,
          quantity,
        };

        const unitPrice = product.basePrice;

        get().addItem({
          product,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
          breakdown: {
            basePrice: product.basePrice,
            sizeAdjustment: 0,
            thicknessAdjustment: 0,
            engravingCost: 0,
            addonsCost: 0,
            quantityMultiplier: quantity,
            total: unitPrice * quantity,
          },
          configuration,
        });
      },
      addProductWithOptions: (product, options) => {
        const { quantity } = options;
        const configuration: ArtisticConfigSelection = {
          theme: "personalizzato",
          event: "altro",
          names: options.customText || product.name,
          preferredColors: options.color ? [options.color] : [],
          format: "bomboniera-singola",
          size: "media",
          confettiEnabled: false,
          veilEnabled: false,
          decoratedBasket: false,
          personalizedCard: false,
          quantity,
        };
        const unitPrice = product.basePrice;
        set((state) => ({
          items: [
            ...state.items,
            {
              id: uid("cart"),
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images[0]?.url || "/images/logo.jpeg",
              unitPrice,
              totalPrice: unitPrice * quantity,
              quantity,
              configuration,
              breakdown: {
                basePrice: product.basePrice,
                sizeAdjustment: 0,
                thicknessAdjustment: 0,
                engravingCost: 0,
                addonsCost: 0,
                quantityMultiplier: quantity,
                total: unitPrice * quantity,
              },
              customOptions: options,
            } satisfies CartItem,
          ],
        }));
      },
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== itemId)
              : state.items.map((item) =>
                  item.id === itemId
                    ? {
                        ...item,
                        quantity,
                        configuration: { ...item.configuration, quantity },
                        totalPrice: item.unitPrice * quantity,
                        breakdown: {
                          ...item.breakdown,
                          quantityMultiplier: quantity,
                          total: item.unitPrice * quantity,
                        },
                      }
                    : item,
                ),
        })),
      clearCart: () => set({ items: [] }),
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "passionart-cart",
    },
  ),
);
