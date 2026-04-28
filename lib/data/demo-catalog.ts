import { AddonGroup, Product, ShapePreset } from "@/types";

const ALL_SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
const ALL_SHIRT_COLORS = ["bianco", "nero", "grigio", "blu-navy", "rosso"] as const;
const ALL_PRINT_POSITIONS = ["fronte", "retro", "entrambi"] as const;

export const shapePresets: ShapePreset[] = [
  {
    key: "cuore",
    label: "Cuore",
    minWidth: 6,
    maxWidth: 18,
    minHeight: 6,
    maxHeight: 18,
    defaultWidth: 9,
    defaultHeight: 9,
    baseFactor: 1.1,
  },
  {
    key: "stella",
    label: "Stella",
    minWidth: 6,
    maxWidth: 20,
    minHeight: 6,
    maxHeight: 20,
    defaultWidth: 10,
    defaultHeight: 10,
    baseFactor: 1.15,
  },
  {
    key: "rettangolo",
    label: "Rettangolo",
    minWidth: 6,
    maxWidth: 24,
    minHeight: 3,
    maxHeight: 16,
    defaultWidth: 11,
    defaultHeight: 6,
    baseFactor: 0.95,
  },
  {
    key: "cerchio",
    label: "Cerchio",
    minWidth: 6,
    maxWidth: 18,
    minHeight: 6,
    maxHeight: 18,
    defaultWidth: 8,
    defaultHeight: 8,
    baseFactor: 1,
  },
  {
    key: "albero",
    label: "Albero",
    minWidth: 7,
    maxWidth: 18,
    minHeight: 7,
    maxHeight: 20,
    defaultWidth: 9,
    defaultHeight: 11,
    baseFactor: 1.25,
  },
  {
    key: "casetta",
    label: "Casetta",
    minWidth: 7,
    maxWidth: 18,
    minHeight: 7,
    maxHeight: 18,
    defaultWidth: 10,
    defaultHeight: 10,
    baseFactor: 1.2,
  },
];

export const addonGroups: AddonGroup[] = [
  {
    id: "confetti",
    name: "Confetti",
    description: "Abbina il gusto perfetto al tuo evento.",
    options: [
      {
        id: "mandorla-rosa",
        label: "Mandorla rosa cipria",
        price: 0.8,
        description: "Confetti classici tono cipria per una finitura romantica.",
        tone: "cipria",
      },
      {
        id: "cioccolato-avorio",
        label: "Cioccolato avorio",
        price: 1,
        description: "Morbidi confetti al cioccolato con palette crema.",
        tone: "avorio",
      },
      {
        id: "fruttato-fucsia",
        label: "Fruttato fucsia",
        price: 1.2,
        description: "Accento vivace per composizioni più creative.",
        tone: "fucsia",
      },
    ],
  },
  {
    id: "veli",
    name: "Veli e nastri",
    description: "Rifiniture tessili per rendere la confezione pronta regalo.",
    options: [
      {
        id: "organza-crema",
        label: "Organza crema",
        price: 1.4,
        description: "Velo leggero con fiocco soft-touch.",
        tone: "crema",
      },
      {
        id: "garza-rosata",
        label: "Garza rosata",
        price: 1.8,
        description: "Texture delicata e romantica.",
        tone: "rosato",
      },
    ],
  },
  {
    id: "cesta",
    name: "Cesta coordinata",
    description: "Per presentare la collezione con un allestimento completo.",
    options: [
      {
        id: "vimini-chiaro",
        label: "Vimini chiaro",
        price: 12,
        description: "Cesta artigianale con fodera naturale.",
        tone: "legno",
      },
      {
        id: "scatola-premium",
        label: "Box premium rigido",
        price: 16,
        description: "Box ricordo con nastro in raso.",
        tone: "tortora",
      },
    ],
  },
];

export const demoProducts: Product[] = [
  {
    id: "prod-mickey-nascita",
    slug: "bomboniera-topolino-nascita",
    name: "Bomboniera Topolino – Nascita",
    shortDescription:
      "Bomboniera in legno dipinta a mano con Topolino, personalizzabile con il nome del bambino.",
    description:
      "Realizzata a mano su sagoma di legno, questa bomboniera raffigura Topolino in un'illustrazione tenera e colorata. Il nome del bambino (come Dilan Gioele) viene dipinto direttamente sul pezzo, rendendola un ricordo unico per nascita o primo compleanno. Ogni pezzo è unico e può essere personalizzato con colori e nome a scelta.",
    category: "bomboniere",
    eventType: "nascita",
    basePrice: 12,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "both",
    defaultShape: "cerchio",
    supportedShapes: ["cerchio", "cuore", "rettangolo"],
    materials: ["Legno di betulla", "Colori acrilici atossici", "Vernice protettiva"],
    productionNotes:
      "Dipinto interamente a mano da Fabio. Ogni pezzo può variare leggermente dal campione fotografato.",
    leadTimeDays: 10,
    badge: "Dipinto a mano",
    palette: ["#fce8d0", "#f4a261", "#e76f51"],
    images: [
      {
        id: "img-mickey-nascita",
        url: "/images/products/mickey-nascita.jpeg",
        alt: "Bomboniera Topolino dipinta a mano su legno, nome Dilan Gioele, per nascita",
        isCover: true,
      },
    ],
  },
  {
    id: "prod-pinocchio-cesta",
    slug: "set-cesta-pinocchio-compleanno",
    name: "Set Cesta Pinocchio – Primo Compleanno",
    shortDescription:
      "Set completo a tema Pinocchio: cesta con bomboniere dipinte, confetti e veli colorati per il primo compleanno.",
    description:
      "Un allestimento completo e festoso pensato per il primo compleanno del bambino. La cesta contiene bomboniere in legno dipinte a mano con Pinocchio, confetti colorati e veli coordinati. Il nome (come Alessandro) può essere personalizzato su ogni bomboniera. Perfetto come centrotavola o set confetti da distribuire agli ospiti.",
    category: "set-regalo",
    eventType: "compleanno",
    basePrice: 35,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "both",
    defaultShape: "casetta",
    supportedShapes: ["casetta", "cerchio", "rettangolo"],
    materials: ["Legno dipinto a mano", "Cesta in vimini", "Confetti", "Veli colorati"],
    productionNotes:
      "Set assemblato su misura in base al numero di ospiti. Prezzo indicato per set base da 10 bomboniere.",
    leadTimeDays: 14,
    badge: "Set completo",
    palette: ["#fff3b0", "#f4a261", "#2ec4b6"],
    images: [
      {
        id: "img-pinocchio-cesta",
        url: "/images/products/pinocchio-cesta.jpeg",
        alt: "Cesta tema Pinocchio con bomboniere dipinte, confetti e veli colorati per primo compleanno Alessandro",
        isCover: true,
      },
    ],
  },
  {
    id: "prod-collezione-mista",
    slug: "collezione-mista-passionart",
    name: "Collezione Mista PassionArt",
    shortDescription:
      "Selezione di quadretti e bomboniere in legno dipinti a mano: Topolino, coniglietti, gattini, Spiderman e molto altro.",
    description:
      "Una panoramica della produzione artigianale PassionArt: quadretti in legno dipinti a mano con soggetti diversi (Topolino, coniglietti, gattini, famiglia, Spiderman), abbelliti con fiocchi e nastri colorati. Ogni pezzo è unico. Qui puoi trovare ispirazione per la tua bomboniera personalizzata: contatta Fabio per ordinare il soggetto che preferisci.",
    category: "collezione",
    eventType: "nascita",
    basePrice: 10,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "showcase",
    defaultShape: "rettangolo",
    supportedShapes: ["rettangolo", "cerchio", "cuore"],
    materials: ["Legno di betulla", "Colori acrilici atossici", "Fiocchi e nastri"],
    productionNotes:
      "Vetrina ispirativa: ogni soggetto è realizzabile su richiesta con personalizzazione nome e colori.",
    leadTimeDays: 12,
    badge: "Ispirati da noi",
    palette: ["#f8f0e3", "#d4a5a5", "#9b5de5"],
    images: [
      {
        id: "img-collezione-mista",
        url: "/images/products/collezione-mista.jpeg",
        alt: "Collezione mista PassionArt: quadretti in legno dipinti con Topolino, coniglietti, gattini, Spiderman",
        isCover: true,
      },
    ],
  },
  {
    id: "prod-coniglietto-gaia",
    slug: "quadretto-coniglietto-gaia",
    name: "Quadretto Coniglietto – Gaia",
    shortDescription:
      "Quadretto in legno dipinto a mano con coniglietto tra fiori e uccellino, personalizzato con il nome, appendibile con cordino e perline.",
    description:
      "Un delicato quadretto in legno dipinto interamente a mano, raffigurante un coniglietto circondato da fiori e un uccellino. Personalizzabile con il nome del bambino (come Gaia). Viene consegnato con cordino e perline decorative pronto per essere appeso in cameretta. Ideale come ricordino per nascita o battesimo.",
    category: "decorazioni",
    eventType: "nascita",
    basePrice: 15,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "both",
    defaultShape: "rettangolo",
    supportedShapes: ["rettangolo", "cerchio", "cuore"],
    materials: ["Legno di betulla", "Colori acrilici atossici", "Cordino", "Perline"],
    productionNotes:
      "Appendibile con cordino decorativo incluso. Misure indicative 15×15 cm, personalizzabili.",
    leadTimeDays: 10,
    badge: "Dipinto a mano",
    palette: ["#fce8f3", "#a8dadc", "#f4a261"],
    images: [
      {
        id: "img-coniglietto-gaia",
        url: "/images/products/coniglietto-gaia.jpeg",
        alt: "Quadretto in legno dipinto coniglietto con fiori e uccellino, nome Gaia, con cordino e perline",
        isCover: true,
      },
    ],
  },
  {
    id: "prod-stitch-giovanna",
    slug: "bomboniera-stitch-giovanna",
    name: "Bomboniera Stitch & Angel – Battesimo",
    shortDescription:
      "Bomboniera in legno dipinta a mano con Stitch e Angel, personalizzata con il nome, perfetta per nascita o battesimo.",
    description:
      "Stitch e Angel dipinti a mano su legno in una composizione tenera e romantica. Il nome del bambino (come Giovanna) è integrato nel disegno. Ideale come bomboniera per nascita o battesimo, è un pezzo che i genitori conserveranno per sempre. Ogni bomboniera è unica e realizzata da Fabio con colori acrilici ad alta qualità.",
    category: "bomboniere",
    eventType: "battesimo",
    basePrice: 14,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "both",
    defaultShape: "cerchio",
    supportedShapes: ["cerchio", "cuore", "rettangolo"],
    materials: ["Legno di betulla", "Colori acrilici atossici", "Vernice protettiva"],
    productionNotes:
      "Soggetto riprodotto fedelmente; colori di sfondo e nome personalizzabili su richiesta.",
    leadTimeDays: 10,
    badge: "Edizione speciale",
    palette: ["#d0f0fd", "#6fbfe8", "#ff85a1"],
    images: [
      {
        id: "img-stitch-giovanna",
        url: "/images/products/stitch-giovanna.jpeg",
        alt: "Bomboniera Stitch e Angel dipinta a mano su legno, nome Giovanna, per nascita o battesimo",
        isCover: true,
      },
    ],
  },
  {
    id: "prod-coniglio-pasqua",
    slug: "portaovetti-coniglio-pasqua",
    name: "Portaovetti Coniglio di Pasqua",
    shortDescription:
      "Coniglio di Pasqua in legno con orecchie, personalizzabile con il nome, dettagli rosa, porta l'ovetto di Pasqua.",
    description:
      "Un portaovetti in legno sagomato a coniglio con grandi orecchie, dipinto con dettagli rosa e fiori primaverili. Personalizzabile con il nome del destinatario, diventa un regalo di Pasqua unico e artigianale. Tiene un piccolo ovetto di cioccolato o un bigliettino augurale. Perfetto per bambini e adulti.",
    category: "decorazioni",
    eventType: "pasqua",
    basePrice: 18,
    isFeatured: false,
    isActive: true,
    isCustomizable: true,
    inspirationType: "both",
    defaultShape: "casetta",
    supportedShapes: ["casetta", "cerchio", "cuore"],
    materials: ["Legno di betulla", "Colori acrilici atossici", "Vernice protettiva"],
    productionNotes:
      "Sagoma personalizzata a forma di coniglio. Dimensioni circa 12×18 cm.",
    leadTimeDays: 8,
    badge: "Pasqua",
    palette: ["#fff0f6", "#ffb3c6", "#a8e6cf"],
    images: [
      {
        id: "img-coniglio-pasqua",
        url: "/images/products/coniglio-pasqua.jpeg",
        alt: "Portaovetti coniglio di Pasqua in legno con orecchie e dettagli rosa, nome personalizzato",
        isCover: true,
      },
    ],
  },

  // ── TAZZE PERSONALIZZATE ─────────────────────────────────────────────────────

  {
    id: "prod-tazza-personalizzata",
    slug: "tazza-ceramica-personalizzata",
    name: "Tazza in Ceramica Personalizzata",
    shortDescription:
      "Tazza in ceramica con stampa personalizzata: carica il tuo logo, scegli il testo o un design. Varianti classica, magica e con cucchiaio.",
    description:
      "Tazza in ceramica di qualità con stampa a sublimazione: perfetta per regali aziendali, bomboniere moderne o ricordi speciali. Puoi caricare il tuo logo, un'immagine o scegliere un testo personalizzato. Disponibile in tre varianti: classica (bianca standard), magica (cambia colore con il caldo) e con cucchiaino coordinato. Resistente in lavastoviglie (variante classica).",
    category: "tazze",
    eventType: "compleanno",
    basePrice: 12,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "product",
    defaultShape: "cerchio",
    supportedShapes: ["cerchio"],
    materials: ["Ceramica premium", "Stampa a sublimazione", "Vernice alimentare"],
    productionNotes:
      "Risoluzione immagine consigliata: almeno 300dpi. La tazza magica mostra il design solo a caldo. Produzione in 5-7 giorni lavorativi.",
    leadTimeDays: 7,
    badge: "Personalizzata",
    palette: ["#fef3e8", "#c87137", "#8b4513"],
    images: [
      {
        id: "img-tazza-personalizzata",
        url: "/images/products/tazza-personalizzata.svg",
        alt: "Tazza in ceramica personalizzata con logo o immagine a scelta, variante classica",
        isCover: true,
      },
    ],
    cupVariants: ["classica", "magica", "con-cucchiaio"],
  },

  {
    id: "prod-tazza-magica",
    slug: "tazza-magica-personalizzata",
    name: "Tazza Magica Personalizzata",
    shortDescription:
      "Tazza che cambia colore con il calore: nera a freddo, rivela il tuo design con il caffè caldo. Effetto sorpresa garantito.",
    description:
      "La tazza magica è nera quando è fredda e rivela il disegno personalizzato non appena viene riempita con una bevanda calda. Un effetto sorpresa perfetto per regali di compleanno, anniversari o aziendali. Puoi personalizzarla con foto, loghi, testi o design su misura. Disponibile anche nelle varianti classica e con cucchiaino.",
    category: "tazze",
    eventType: "anniversario",
    basePrice: 14,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "product",
    defaultShape: "cerchio",
    supportedShapes: ["cerchio"],
    materials: ["Ceramica premium", "Rivestimento termo-sensibile", "Stampa a sublimazione"],
    productionNotes:
      "Non adatta a lavastoviglie o microonde. Lavaggio a mano consigliato. Il design appare completamente sopra i 45°C.",
    leadTimeDays: 7,
    badge: "Effetto sorpresa",
    palette: ["#1a1a2e", "#533483", "#e94560"],
    images: [
      {
        id: "img-tazza-magica",
        url: "/images/products/tazza-magica.svg",
        alt: "Tazza magica personalizzata che cambia colore con il caldo, design a sorpresa",
        isCover: true,
      },
    ],
    cupVariants: ["magica", "classica", "con-cucchiaio"],
  },

  // ── MAGLIETTE E POLO PERSONALIZZATE ─────────────────────────────────────────

  {
    id: "prod-tshirt-personalizzata",
    slug: "tshirt-personalizzata",
    name: "T-Shirt Personalizzata",
    shortDescription:
      "T-shirt manica corta o lunga con stampa personalizzata del tuo logo o design. Taglie S-XXL, disponibile in 5 colori base.",
    description:
      "T-shirt in cotone 100% con stampa digitale di alta qualità. Puoi caricare il tuo logo, immagine o design e scegliere la posizione di stampa (fronte, retro o entrambi). Disponibile in due varianti di manica (corta e lunga), cinque colori base (bianco, nero, grigio, blu navy, rosso) e tutte le taglie dalla S alla XXL. Ideale per gruppi, eventi, team aziendali o regali personalizzati.",
    category: "magliette",
    eventType: "compleanno",
    basePrice: 15,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "product",
    defaultShape: "rettangolo",
    supportedShapes: ["rettangolo"],
    materials: ["Cotone 100% ring-spun", "Stampa digitale DTG", "Girocollo rinforzato"],
    productionNotes:
      "Taglie standard europee. Consigliato lavaggio a 30°C rovescio. Stampa resistente oltre 50 lavaggi.",
    leadTimeDays: 10,
    badge: "Stampa digitale",
    palette: ["#f0f4f8", "#4a5568", "#2d3748"],
    images: [
      {
        id: "img-tshirt-personalizzata",
        url: "/images/products/tshirt-personalizzata.svg",
        alt: "T-shirt personalizzata con logo o design a scelta, disponibile in più colori e taglie",
        isCover: true,
      },
    ],
    shirtTypes: ["tshirt-manica-corta", "tshirt-manica-lunga"],
    sizes: [...ALL_SHIRT_SIZES],
    colors: [...ALL_SHIRT_COLORS],
    printPositions: [...ALL_PRINT_POSITIONS],
  },

  {
    id: "prod-polo-personalizzata",
    slug: "polo-personalizzata",
    name: "Polo Personalizzata",
    shortDescription:
      "Polo in piquet con stampa o ricamo del tuo logo. Taglie S-XXL, 5 colori base. Perfetta per divise aziendali ed eventi.",
    description:
      "Polo in piquet di cotone di alta qualità, con colletto e bottoni coordinati. Ideale per divise aziendali, eventi sportivi, team building o regali personalizzati. Puoi applicare il tuo logo tramite stampa digitale o ricamo (specificate nelle note). Scelta di 5 colori base e tutte le taglie dalla S alla XXL. Posizione stampa configurabile: fronte, retro o entrambi.",
    category: "magliette",
    eventType: "anniversario",
    basePrice: 20,
    isFeatured: false,
    isActive: true,
    isCustomizable: true,
    inspirationType: "product",
    defaultShape: "rettangolo",
    supportedShapes: ["rettangolo"],
    materials: ["Piquet cotone 220g/m²", "Stampa digitale / ricamo", "Colletto a coste"],
    productionNotes:
      "Disponibile anche con ricamo (contattare per preventivo). Spedizione in 10-14 giorni lavorativi per ordini multipli.",
    leadTimeDays: 12,
    badge: "Aziendale",
    palette: ["#1e3a5f", "#c8a96e", "#ffffff"],
    images: [
      {
        id: "img-polo-personalizzata",
        url: "/images/products/polo-personalizzata.svg",
        alt: "Polo personalizzata con logo aziendale, disponibile in più colori e taglie",
        isCover: true,
      },
    ],
    shirtTypes: ["polo"],
    sizes: [...ALL_SHIRT_SIZES],
    colors: [...ALL_SHIRT_COLORS],
    printPositions: [...ALL_PRINT_POSITIONS],
  },

  // ── Tele Stampate UV ────────────────────────────────────────────────────────
  {
    id: "prod-tela-uv-mini",
    slug: "tela-stampata-uv-mini",
    name: "Tela Stampata UV – Formato Mini",
    shortDescription:
      "Quadro su tela stampato con tecnologia UV, formato 20×30 cm. Carica la tua foto o scegli un design predefinito.",
    description:
      "La tela stampata UV è il modo più moderno e duraturo di trasformare le tue foto in quadri. La stampa con tecnologia UV garantisce colori vivaci e resistenti alla luce. Disponibile in canvas classico, premium, lucido o opaco, con o senza cornice in legno. Perfetta come regalo personalizzato o arredo per la casa. Formato compatto 20×30 cm ideale per mensole o scrivanie.",
    category: "tele-stampate",
    eventType: "compleanno",
    basePrice: 25,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "product",
    defaultShape: "rettangolo",
    supportedShapes: ["rettangolo"],
    materials: ["Canvas in cotone", "Inchiostri UV certificati", "Telaio in legno di pino"],
    productionNotes:
      "Stampa UV ad alta risoluzione (1200 dpi). Colori vivaci e resistenti alla luce. Pronti in 3–5 giorni lavorativi.",
    leadTimeDays: 5,
    badge: "Stampa UV",
    palette: ["#ff9a56", "#ffcb77", "#1a1a2e"],
    images: [
      {
        id: "img-tela-uv-mini",
        url: "/images/products/tela-uv-mini.svg",
        alt: "Tela stampata UV formato mini 20x30 cm con tramonto sul mare",
        isCover: true,
      },
    ],
  },
  {
    id: "prod-tela-uv-standard",
    slug: "tela-stampata-uv-standard",
    name: "Tela Stampata UV – Formato Standard",
    shortDescription:
      "Quadro su tela stampato UV, formato 40×60 cm. Personalizza con la tua foto, testo e cornice.",
    description:
      "Il formato 40×60 cm è il più apprezzato per decorare le pareti di casa o come regalo speciale. Stampa UV con inchiostri di alta qualità che garantiscono colori brillanti nel tempo. Puoi caricare la tua foto o scegliere tra i nostri design artistici predefiniti. Aggiungere una scritta personalizzata (nome, data, dedica) con font e colore a tua scelta. Disponibile con cornice in legno naturale, scuro o bianca.",
    category: "tele-stampate",
    eventType: "anniversario",
    basePrice: 50,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "product",
    defaultShape: "rettangolo",
    supportedShapes: ["rettangolo"],
    materials: ["Canvas in cotone premium", "Inchiostri UV certificati", "Telaio in legno di pino"],
    productionNotes:
      "Stampa UV ad alta risoluzione. Canvas tensionato a mano su telaio solido. Pronti in 3–5 giorni lavorativi.",
    leadTimeDays: 5,
    badge: "Bestseller",
    palette: ["#fce4ec", "#f3e5f5", "#4caf50"],
    images: [
      {
        id: "img-tela-uv-standard",
        url: "/images/products/tela-uv-standard.svg",
        alt: "Tela stampata UV formato standard 40x60 cm con fiori di primavera",
        isCover: true,
      },
    ],
  },
  {
    id: "prod-tela-uv-grande",
    slug: "tela-stampata-uv-grande",
    name: "Tela Stampata UV – Formato Grande",
    shortDescription:
      "Quadro su tela stampato UV, formato 70×100 cm. Grande impatto visivo per pareti importanti.",
    description:
      "Il formato grande 70×100 cm trasforma qualsiasi parete in un'opera d'arte. La tecnologia di stampa UV assicura una resa fotografica impeccabile anche in grande formato. Ideale per living, camere da letto, uffici e negozi. Carica la tua immagine in alta risoluzione o scegli uno dei nostri design artistici esclusivi. Possibilità di aggiungere testo personalizzato. La cornice in legno naturale, scuro o bianca completa l'opera.",
    category: "tele-stampate",
    eventType: "matrimonio",
    basePrice: 100,
    isFeatured: true,
    isActive: true,
    isCustomizable: true,
    inspirationType: "product",
    defaultShape: "rettangolo",
    supportedShapes: ["rettangolo"],
    materials: [
      "Canvas in cotone premium",
      "Inchiostri UV certificati",
      "Telaio rinforzato in legno massello",
    ],
    productionNotes:
      "Stampa UV professionale. Telaio rinforzato per formati grandi. Consegna in 5–7 giorni lavorativi.",
    leadTimeDays: 7,
    badge: "Grande Formato",
    palette: ["#1a237e", "#283593", "#4a148c"],
    images: [
      {
        id: "img-tela-uv-grande",
        url: "/images/products/tela-uv-grande.svg",
        alt: "Tela stampata UV formato grande 70x100 cm con paesaggio montano notturno",
        isCover: true,
      },
    ],
  },
];
