import type { CategorySettings, ConfiguratorSettings } from "@/types";

export const defaultConfiguratorSettings: ConfiguratorSettings = {
  themes: [
    {
      key: "topolino",
      label: "Topolino / Mickey",
      desc: "Il classico Disney amato da tutti",
      img: "/images/products/mickey-nascita.jpeg",
      active: true,
    },
    {
      key: "stitch-angel",
      label: "Stitch e Angel",
      desc: "La dolce coppia di Lilo & Stitch",
      img: "/images/products/stitch-giovanna.jpeg",
      active: true,
    },
    {
      key: "pinocchio",
      label: "Pinocchio",
      desc: "Il classico italiano per antonomasia",
      img: "/images/products/pinocchio-cesta.jpeg",
      active: true,
    },
    {
      key: "coniglietto-bambi",
      label: "Coniglietto / Bambi",
      desc: "Tenero e delicato per le prime feste",
      img: "/images/products/coniglietto-gaia.jpeg",
      active: true,
    },
    {
      key: "spiderman",
      label: "Spiderman",
      desc: "Il supereroe preferito dai bimbi",
      img: "/images/products/collezione-mista.jpeg",
      active: true,
    },
    {
      key: "famiglia",
      label: "Famiglia",
      desc: "Stick figures personalizzate con la tua famiglia",
      img: "/images/products/collezione-mista.jpeg",
      active: true,
    },
    {
      key: "personalizzato",
      label: "Personalizzato",
      desc: "Descrivi tu il personaggio o il tema",
      img: "/images/logo.jpeg",
      active: true,
    },
  ],
  events: [
    { key: "nascita", label: "Nascita", icon: "🌟", active: true },
    { key: "battesimo", label: "Battesimo", icon: "🕊️", active: true },
    { key: "primo-compleanno", label: "1° Compleanno", icon: "🎂", active: true },
    { key: "comunione", label: "Comunione", icon: "✝️", active: true },
    { key: "cresima", label: "Cresima", icon: "🙏", active: true },
    { key: "matrimonio", label: "Matrimonio", icon: "💍", active: true },
    { key: "pasqua", label: "Pasqua", icon: "🐣", active: true },
    { key: "altro", label: "Altro", icon: "✨", active: true },
  ],
  basePrices: {
    "bomboniera-singola": { piccola: 5.0, media: 7.0, grande: 10.0 },
    "set-cesta": { piccola: 22.0, media: 32.0, grande: 46.0 },
    "decorazione-quadretto": { piccola: 13.0, media: 19.0, grande: 28.0 },
    "palette": { "25x25": 20.0, "30x30": 28.0, "25x35": 30.0, "30x40": 45.0, "personalizzata": 35.0 },
  },
  confettiFlavors: [
    "Mandorla classica",
    "Cioccolato fondente",
    "Cioccolato bianco",
    "Fruttato",
    "Al latte morbido",
  ],
  confettiColors: [
    "Bianco",
    "Rosa",
    "Azzurro",
    "Lilla",
    "Pesca",
    "Verde acqua",
    "Giallo",
    "Fucsia",
  ],
  confettiPrice: 0.8,
  veilColors: ["Bianco", "Crema", "Rosa cipria", "Celeste", "Lilla", "Verde salvia"],
  veilPrice: 1.2,
  basketPrice: 2.0,
  cardPrice: 0.6,
  paletteColors: [
    { label: "Bianco", hex: "#ffffff" },
    { label: "Rosa cipria", hex: "#f2c2d2" },
    { label: "Celeste", hex: "#a8d8ea" },
    { label: "Giallo pastello", hex: "#ffe083" },
    { label: "Verde salvia", hex: "#a8d5b5" },
    { label: "Lilla", hex: "#c3a8d8" },
    { label: "Pesca", hex: "#ffb07b" },
    { label: "Fucsia", hex: "#e91e8c" },
    { label: "Rosso", hex: "#e74c3c" },
    { label: "Blu navy", hex: "#2c3e6b" },
  ],
  minimumOrderPrice: 0,
  productionTimeNote:
    "I tempi di lavorazione sono indicativi (7–14 giorni lavorativi). Riceverai conferma entro 24 ore.",
  summaryMessage:
    "Riceverai un messaggio di conferma entro 24 ore con il preventivo definitivo.",
  tazzePrices: {
    classica: 12.0,
    magica: 16.0,
    "con-cucchiaio": 18.0,
  },
  magliettePrices: {
    "tshirt-manica-corta": 15.0,
    "tshirt-manica-lunga": 18.0,
    polo: 22.0,
    printBothSidesSurcharge: 5.0,
  },
  categories: [
    {
      key: "bomboniere",
      label: "Bomboniere",
      icon: "🎁",
      description:
        "Bomboniere in legno dipinte a mano, set completi, decorazioni, quadretti e palette artistiche",
      active: true,
    },
    {
      key: "tazze",
      label: "Tazze",
      icon: "☕",
      description:
        "Tazze personalizzate con testo, logo o foto — classiche, magiche o con cucchiaino",
      active: true,
    },
    {
      key: "magliette",
      label: "Magliette",
      icon: "👕",
      description:
        "T-shirt e polo personalizzate con il tuo logo o design — tutte le taglie e colori",
      active: true,
    },
  ],
  customCategoryPrices: {} as Record<string, Record<string, number>>,
  categorySettings: {
    tazze: {
      variants: [
        { key: "classica", label: "Tazza Classica", desc: "Ceramica bianca, stampa permanente", img: "/images/products/tazza-personalizzata.svg", price: 12.0, active: true },
        { key: "magica", label: "Tazza Magica", desc: "Il disegno appare con il calore!", img: "/images/products/tazza-magica.svg", price: 16.0, active: true },
        { key: "con-cucchiaio", label: "Con Cucchiaino", desc: "Tazza + cucchiaino coordinato incluso", img: "", price: 18.0, active: true },
      ],
      colors: [],
      addons: [
        {
          key: "confezione-regalo",
          name: "Confezione Regalo",
          options: [{ key: "standard", label: "Confezione regalo standard", price: 2.5, active: true }],
        },
        {
          key: "cucchiaino-extra",
          name: "Cucchiaino Extra",
          options: [{ key: "cucchiaino", label: "Cucchiaino aggiuntivo coordinato", price: 1.5, active: true }],
        },
      ],
    } satisfies CategorySettings,
    magliette: {
      variants: [
        { key: "tshirt-manica-corta", label: "T-Shirt Manica Corta", desc: "100% cotone, taglio classico", img: "/images/products/tshirt-personalizzata.svg", price: 15.0, active: true },
        { key: "tshirt-manica-lunga", label: "T-Shirt Manica Lunga", desc: "100% cotone, manica lunga", img: "", price: 18.0, active: true },
        { key: "polo", label: "Polo", desc: "Con colletto e bottoni, look elegante", img: "/images/products/polo-personalizzata.svg", price: 22.0, active: true },
      ],
      colors: [
        { key: "bianco", label: "Bianco", hex: "#f5f5f5", active: true },
        { key: "nero", label: "Nero", hex: "#1a1a1a", active: true },
        { key: "grigio", label: "Grigio", hex: "#9e9e9e", active: true },
        { key: "blu-navy", label: "Blu Navy", hex: "#1a2d5a", active: true },
        { key: "rosso", label: "Rosso", hex: "#c62828", active: true },
      ],
      addons: [
        {
          key: "confezione-regalo",
          name: "Confezione Regalo",
          options: [{ key: "standard", label: "Confezione regalo", price: 2.5, active: true }],
        },
        {
          key: "stampa-fronte-retro",
          name: "Stampa Fronte+Retro",
          options: [{ key: "fronte-retro", label: "Stampa su entrambi i lati (+€5/pz)", price: 5.0, active: true }],
        },
      ],
    } satisfies CategorySettings,
  } as Record<string, CategorySettings>,
};
