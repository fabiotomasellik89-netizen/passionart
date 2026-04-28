import type { AddonGroup, ConfiguratorSelection, PriceBreakdown, Product } from "@/types";
import { getShapeConfig } from "@/lib/configurator/shapes";

export function resolveAddonCost(
  groups: AddonGroup[],
  addons: Array<{ groupId: string; optionId: string }>,
) {
  return addons.reduce((sum, selected) => {
    const group = groups.find((item) => item.id === selected.groupId);
    const option = group?.options.find((item) => item.id === selected.optionId);
    return sum + (option?.price || 0);
  }, 0);
}

export function calculatePriceBreakdown(
  product: Product,
  selection: ConfiguratorSelection,
  groups: AddonGroup[],
): PriceBreakdown {
  const shape = getShapeConfig(selection.shape);
  const areaRatio = (selection.width * selection.height) / 90;
  const sizeAdjustment = Math.max(
    0,
    Number(((areaRatio - 1) * product.basePrice * 0.55).toFixed(2)),
  );
  const thicknessAdjustment = Number(
    Math.max(0, (selection.thickness - 1) * product.basePrice * 0.28).toFixed(2),
  );
  const engravingCost = selection.engraving
    ? Math.min(4.8, 1.2 + selection.engraving.length * 0.08)
    : 0;
  const addonsCost = resolveAddonCost(groups, selection.addons);
  const unitPrice = Number(
    (
      product.basePrice * shape.baseFactor +
      sizeAdjustment +
      thicknessAdjustment +
      engravingCost +
      addonsCost
    ).toFixed(2),
  );

  return {
    basePrice: product.basePrice,
    sizeAdjustment,
    thicknessAdjustment,
    engravingCost: Number(engravingCost.toFixed(2)),
    addonsCost: Number(addonsCost.toFixed(2)),
    quantityMultiplier: selection.quantity,
    total: Number((unitPrice * selection.quantity).toFixed(2)),
  };
}

export function calculateUnitPrice(breakdown: PriceBreakdown) {
  return Number(
    (
      breakdown.basePrice +
      breakdown.sizeAdjustment +
      breakdown.thicknessAdjustment +
      breakdown.engravingCost +
      breakdown.addonsCost
    ).toFixed(2),
  );
}