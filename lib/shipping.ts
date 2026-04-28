export type ShippingOption = {
  id: "standard" | "express";
  label: string;
  description: string;
  price: number;
  estimatedDays: string;
};

/**
 * Calculates shipping options based on total item quantity and order subtotal.
 * Free shipping on orders >= €120.
 * Standard tiers: ≤10 pz = €4.90 | ≤30 pz = €7.90 | ≤60 pz = €12.90 | 61+ = €17.90
 * Express adds €5.00 flat on top of standard.
 */
export function calculateShippingOptions(
  totalItems: number,
  subtotal: number,
): ShippingOption[] {
  if (subtotal >= 120) {
    return [
      {
        id: "standard",
        label: "Spedizione gratuita",
        description: "Ordine qualificato per la spedizione inclusa",
        price: 0,
        estimatedDays: "5-8 giorni lavorativi",
      },
    ];
  }

  let standardPrice: number;
  if (totalItems <= 10) {
    standardPrice = 4.9;
  } else if (totalItems <= 30) {
    standardPrice = 7.9;
  } else if (totalItems <= 60) {
    standardPrice = 12.9;
  } else {
    standardPrice = 17.9;
  }

  return [
    {
      id: "standard",
      label: "Spedizione standard",
      description: `${totalItems} pz · Posta raccomandata tracciata`,
      price: standardPrice,
      estimatedDays: "5-8 giorni lavorativi",
    },
    {
      id: "express",
      label: "Spedizione express",
      description: `${totalItems} pz · Corriere espresso prioritario`,
      price: standardPrice + 5.0,
      estimatedDays: "2-3 giorni lavorativi",
    },
  ];
}
