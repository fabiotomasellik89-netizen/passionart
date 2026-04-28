import type { CanvasSizeKey, CanvasType, FrameType, PriceBreakdown } from "@/types";

export type CanvasSizeOption = {
  key: CanvasSizeKey;
  label: string;
  width: number;
  height: number;
  basePrice: number;
};

export const CANVAS_SIZES: CanvasSizeOption[] = [
  { key: "20x30", label: "20×30 cm", width: 20, height: 30, basePrice: 25 },
  { key: "30x40", label: "30×40 cm", width: 30, height: 40, basePrice: 35 },
  { key: "40x60", label: "40×60 cm", width: 40, height: 60, basePrice: 50 },
  { key: "50x70", label: "50×70 cm", width: 50, height: 70, basePrice: 65 },
  { key: "60x80", label: "60×80 cm", width: 60, height: 80, basePrice: 80 },
  { key: "70x100", label: "70×100 cm", width: 70, height: 100, basePrice: 100 },
  { key: "personalizzata", label: "Personalizzata", width: 40, height: 50, basePrice: 0 },
];

export const CANVAS_TYPES: { key: CanvasType; label: string; description: string }[] = [
  { key: "classico", label: "Canvas Classico", description: "Cotone standard, opaco naturale" },
  { key: "premium", label: "Canvas Premium", description: "Spessore maggiore, cotone pesante (+20%)" },
  { key: "lucida", label: "Finitura Lucida", description: "Superficie lucida, colori brillanti (+5€)" },
  { key: "opaca", label: "Finitura Opaca", description: "Superficie morbida anti-riflesso" },
];

export const FRAME_TYPES: { key: FrameType; label: string; description: string; price: number }[] = [
  { key: "senza", label: "Senza Cornice", description: "Solo la tela tensionata", price: 0 },
  { key: "legno-naturale", label: "Cornice Legno Naturale", description: "Legno chiaro con venatura", price: 10 },
  { key: "legno-scuro", label: "Cornice Legno Scuro", description: "Legno wengé o noce scuro", price: 12 },
  { key: "bianca", label: "Cornice Bianca", description: "Laccata bianco opaco", price: 15 },
];

export const PREDEFINED_DESIGNS = [
  { slug: "tramonto", label: "Tramonto sul Mare", img: "/images/canvas-designs/tramonto.svg" },
  { slug: "fiori", label: "Fiori di Ciliegio", img: "/images/canvas-designs/fiori.svg" },
  { slug: "montagna", label: "Paesaggio Montano", img: "/images/canvas-designs/montagna.svg" },
  { slug: "astratto", label: "Astratto Dorato", img: "/images/canvas-designs/astratto.svg" },
  { slug: "famiglia", label: "Famiglia Felice", img: "/images/canvas-designs/famiglia.svg" },
];

/** Interpolate price for custom size based on area ratio vs reference 40x60 */
function customSizePrice(width: number, height: number): number {
  const area = width * height;
  // Reference area tiers
  const tiers = [
    { maxArea: 600 + 1, price: 25 },   // 20x30 = 600
    { maxArea: 1200 + 1, price: 35 },  // 30x40 = 1200
    { maxArea: 2400 + 1, price: 50 },  // 40x60 = 2400
    { maxArea: 3500 + 1, price: 65 },  // 50x70 = 3500
    { maxArea: 4800 + 1, price: 80 },  // 60x80 = 4800
    { maxArea: 7000 + 1, price: 100 }, // 70x100 = 7000
  ];
  for (const tier of tiers) {
    if (area < tier.maxArea) return tier.price;
  }
  return 120; // Above 70x100
}

export function calculateCanvasPrice(
  sizeKey: CanvasSizeKey,
  width: number,
  height: number,
  canvasType: CanvasType,
  frameType: FrameType,
  quantity: number,
): PriceBreakdown {
  // Base price
  const sizeOption = CANVAS_SIZES.find((s) => s.key === sizeKey);
  let basePrice =
    sizeKey === "personalizzata"
      ? customSizePrice(width, height)
      : (sizeOption?.basePrice ?? 25);

  // Canvas type adjustment
  let sizeAdjustment = 0;
  if (canvasType === "premium") {
    sizeAdjustment = Math.round(basePrice * 0.2 * 100) / 100;
  } else if (canvasType === "lucida") {
    sizeAdjustment = 5;
  }

  // Frame cost (using addonsCost slot)
  const frameOption = FRAME_TYPES.find((f) => f.key === frameType);
  const addonsCost = frameOption?.price ?? 0;

  const unitPrice = basePrice + sizeAdjustment + addonsCost;
  const total = unitPrice * quantity;

  return {
    basePrice,
    sizeAdjustment,
    thicknessAdjustment: 0,
    engravingCost: 0,
    addonsCost,
    quantityMultiplier: quantity,
    total,
  };
}
