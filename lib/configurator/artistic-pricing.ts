import type { ArtisticConfigSelection, BasePriceMatrix, PaletteSizeKey, PriceBreakdown } from "@/types";

const DEFAULT_BASE_PRICES: BasePriceMatrix = {
  "bomboniera-singola": { piccola: 5.0, media: 7.0, grande: 10.0 },
  "set-cesta": { piccola: 22.0, media: 32.0, grande: 46.0 },
  "decorazione-quadretto": { piccola: 13.0, media: 19.0, grande: 28.0 },
  "palette": { "25x25": 20.0, "30x30": 28.0, "25x35": 30.0, "30x40": 45.0, "personalizzata": 35.0 },
};

export type PricingOptions = {
  basePrices?: BasePriceMatrix;
  confettiPrice?: number;
  veilPrice?: number;
  basketPrice?: number;
  cardPrice?: number;
};

type PricingInput = Pick<
  ArtisticConfigSelection,
  | "format"
  | "size"
  | "paletteSize"
  | "quantity"
  | "confettiEnabled"
  | "veilEnabled"
  | "decoratedBasket"
  | "personalizedCard"
>;

export function calculateArtisticPricing(
  selection: PricingInput,
  options?: PricingOptions,
): {
  unitPrice: number;
  totalPrice: number;
  breakdown: PriceBreakdown;
} {
  const priceMatrix = options?.basePrices ?? DEFAULT_BASE_PRICES;

  // For palette format use paletteSize key; for others use size key
  const sizeKey: string =
    selection.format === "palette"
      ? (selection.paletteSize as string) ?? "25x25"
      : (selection.size as string) ?? "piccola";

  const base = priceMatrix[selection.format]?.[sizeKey] ?? 0;

  let addonsCost = 0;
  if (selection.confettiEnabled) addonsCost += options?.confettiPrice ?? 0.8;
  if (selection.veilEnabled) addonsCost += options?.veilPrice ?? 1.2;
  if (selection.personalizedCard) addonsCost += options?.cardPrice ?? 0.6;
  if (selection.decoratedBasket) addonsCost += options?.basketPrice ?? 2.0;

  const unitPrice = Number((base + addonsCost).toFixed(2));
  const total = Number((unitPrice * selection.quantity).toFixed(2));

  const breakdown: PriceBreakdown = {
    basePrice: base,
    sizeAdjustment: 0,
    thicknessAdjustment: 0,
    engravingCost: 0,
    addonsCost: Number(addonsCost.toFixed(2)),
    quantityMultiplier: selection.quantity,
    total,
  };

  return { unitPrice, totalPrice: total, breakdown };
}
