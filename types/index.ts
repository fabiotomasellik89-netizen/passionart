export type EventType =
  | "matrimonio"
  | "battesimo"
  | "comunione"
  | "nascita"
  | "compleanno"
  | "pasqua"
  | "anniversario";

export type ProductCategory =
  | "bomboniere"
  | "segnaposto"
  | "ricordini"
  | "decorazioni"
  | "set-regalo"
  | "collezione"
  | "tazze"
  | "magliette"
  | "tele-stampate";

export type ShapeKey =
  | "cuore"
  | "stella"
  | "rettangolo"
  | "cerchio"
  | "albero"
  | "casetta";

export type ShapeType = ShapeKey;

export type InspirationType = "product" | "showcase" | "both";

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  isCover?: boolean;
  sortOrder?: number;
};

export type ShapePreset = {
  key: ShapeKey;
  label: string;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  defaultWidth: number;
  defaultHeight: number;
  baseFactor: number;
};

// ── Tele Stampate UV Types ────────────────────────────────────────────────────

export type CanvasSizeKey =
  | "20x30"
  | "30x40"
  | "40x60"
  | "50x70"
  | "60x80"
  | "70x100"
  | "personalizzata";

export type CanvasType = "classico" | "premium" | "lucida" | "opaca";

export type FrameType = "senza" | "legno-naturale" | "legno-scuro" | "bianca";

export type CanvasTextConfig = {
  text: string;
  font: "serif" | "sans" | "script";
  position: "top" | "center" | "bottom";
  color: string;
};

export type CanvasPrintConfig = {
  sizeKey: CanvasSizeKey;
  width: number;
  height: number;
  canvasType: CanvasType;
  frameType: FrameType;
  userImageUrl?: string;
  designSlug?: string;
  textConfig?: CanvasTextConfig;
  quantity: number;
};

// ── Tazze / Magliette Types ───────────────────────────────────────────────────

export type CupVariant = "classica" | "magica" | "con-cucchiaio";

export type ShirtType = "tshirt-manica-corta" | "tshirt-manica-lunga" | "polo";

export type ShirtSize = "S" | "M" | "L" | "XL" | "XXL";

export type ShirtColor = "bianco" | "nero" | "grigio" | "blu-navy" | "rosso";

export type PrintPosition = "fronte" | "retro" | "entrambi";

export type ProductCustomOptions = {
  cupVariant?: string;
  shirtType?: string;
  size?: string;
  color?: string;
  printPosition?: string;
  logoUrl?: string;
  customText?: string;
  quantity: number;
};

// ── Product ───────────────────────────────────────────────────────────────────

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ProductCategory;
  eventType: EventType;
  basePrice: number;
  isFeatured: boolean;
  isActive: boolean;
  isCustomizable: boolean;
  inspirationType: InspirationType;
  defaultShape: ShapeKey;
  supportedShapes: ShapeKey[];
  materials: string[];
  productionNotes: string;
  leadTimeDays: number;
  badge: string;
  palette: string[];
  images: ProductImage[];
  // Category-specific options
  cupVariants?: CupVariant[];
  shirtTypes?: ShirtType[];
  sizes?: ShirtSize[];
  colors?: ShirtColor[];
  printPositions?: PrintPosition[];
};

export type AddonOption = {
  id: string;
  label: string;
  price: number;
  description: string;
  tone: string;
};

export type AddonGroup = {
  id: string;
  name: string;
  description: string;
  options: AddonOption[];
};

export type ConfiguratorSelection = {
  productId: string;
  productSlug: string;
  shape: ShapeKey;
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  engraving: string;
  addons: Array<{ groupId: string; optionId: string }>;
};

export type ProductCustomization = {
  shape: ShapeKey;
  width: number;
  height: number;
  thickness: number;
  engraving: string;
};

export type PriceBreakdown = {
  basePrice: number;
  sizeAdjustment: number;
  thicknessAdjustment: number;
  engravingCost: number;
  addonsCost: number;
  quantityMultiplier: number;
  total: number;
};

// ── Artistic Configurator Types ───────────────────────────────────────────────

export type ThemeKey =
  | "topolino"
  | "stitch-angel"
  | "pinocchio"
  | "coniglietto-bambi"
  | "spiderman"
  | "famiglia"
  | "personalizzato";

export type ArtisticEventKey =
  | "nascita"
  | "battesimo"
  | "primo-compleanno"
  | "comunione"
  | "cresima"
  | "matrimonio"
  | "pasqua"
  | "altro";

export type FormatKey =
  | "bomboniera-singola"
  | "set-cesta"
  | "decorazione-quadretto"
  | "palette";

export type SizeKey = "piccola" | "media" | "grande";

export type PaletteSizeKey = "25x25" | "30x30" | "25x35" | "30x40" | "personalizzata";

export type ArtisticConfigSelection = {
  theme: ThemeKey;
  themeCustomNote?: string;
  event: ArtisticEventKey;
  names: string;
  eventDate?: string;
  preferredColors: string[];
  specialNotes?: string;
  format: FormatKey;
  size?: SizeKey;
  paletteSize?: PaletteSizeKey;
  paletteCustomNote?: string;
  confettiEnabled: boolean;
  confettiFlavor?: string;
  confettiColor?: string;
  veilEnabled: boolean;
  veilColor?: string;
  decoratedBasket: boolean;
  personalizedCard: boolean;
  personalizedCardText?: string;
  quantity: number;
};

// ── Cart Types ────────────────────────────────────────────────────────────────

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  configuration: ArtisticConfigSelection;
  breakdown: PriceBreakdown;
  customOptions?: ProductCustomOptions;
  canvasConfig?: CanvasPrintConfig;
};

// ── Configurator Settings Types ───────────────────────────────────────────────

export type ConfiguratorTheme = {
  key: string;
  label: string;
  desc: string;
  img: string;
  active: boolean;
};

export type ConfiguratorEvent = {
  key: string;
  label: string;
  icon: string;
  active: boolean;
};

export type PaletteColor = {
  label: string;
  hex: string;
};

export type ConfiguratorCategory = {
  key: string;
  label: string;
  icon: string;
  description: string;
  active: boolean;
};

// ── Per-category configurable types ──────────────────────────────────────────

export type CategoryVariant = {
  key: string;
  label: string;
  desc: string;
  img: string;
  price: number;
  active: boolean;
};

export type CategoryColor = {
  key: string;
  label: string;
  hex: string;
  active: boolean;
};

export type CategoryAddonOption = {
  key: string;
  label: string;
  price: number;
  active: boolean;
};

export type CategoryAddonGroup = {
  key: string;
  name: string;
  options: CategoryAddonOption[];
};

export type CategorySettings = {
  variants: CategoryVariant[];
  colors: CategoryColor[];
  addons: CategoryAddonGroup[];
};

export type BasePriceMatrix = Record<string, Record<string, number>>;

export type ConfiguratorSettings = {
  themes: ConfiguratorTheme[];
  events: ConfiguratorEvent[];
  basePrices: BasePriceMatrix;
  confettiFlavors: string[];
  confettiColors: string[];
  confettiPrice: number;
  veilColors: string[];
  veilPrice: number;
  basketPrice: number;
  cardPrice: number;
  paletteColors: PaletteColor[];
  minimumOrderPrice: number;
  productionTimeNote: string;
  summaryMessage: string;
  tazzePrices: {
    classica: number;
    magica: number;
    "con-cucchiaio": number;
  };
  magliettePrices: {
    "tshirt-manica-corta": number;
    "tshirt-manica-lunga": number;
    polo: number;
    printBothSidesSurcharge: number;
  };
  categories: ConfiguratorCategory[];
  customCategoryPrices: Record<string, Record<string, number>>;
  categorySettings: Record<string, CategorySettings>;
};

export type AdminSession = {
  email: string;
  loggedIn: boolean;
};

export type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  notes: string;
};

export type OrderRecord = {
  id: string;
  createdAt: string;
  status: "bozza" | "pagato" | "in-lavorazione" | "spedito";
  paymentStatus: "pending" | "captured";
  paypalOrderId?: string;
  total: number;
  customer: CustomerInfo;
  items: CartItem[];
};
