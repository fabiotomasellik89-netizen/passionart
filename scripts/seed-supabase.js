const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili ambiente mancanti!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const demoProducts = [
  {
    slug: "bomboniera-topolino-nascita",
    name: "Bomboniera Topolino – Nascita",
    short_description: "Bomboniera in legno dipinta a mano con Topolino, personalizzabile con il nome del bambino.",
    description: "Realizzata a mano su sagoma di legno, questa bomboniera raffigura Topolino in un'illustrazione tenera e colorata. Il nome del bambino viene dipinto direttamente sul pezzo, rendendola un ricordo unico per nascita o primo compleanno.",
    category: "bomboniere",
    event_type: ["nascita"],
    base_price: 12,
    is_featured: true,
    is_active: true,
    is_customizable: true,
    inspiration_type: "both",
    default_shape: "cerchio",
    materials: ["Legno di betulla", "Colori acrilici atossici", "Vernice protettiva"],
    production_notes: "Dipinto interamente a mano da Fabio. Ogni pezzo può variare leggermente dal campione fotografato.",
    images: [{ url: "/images/products/mickey-nascita.jpeg", alt: "Bomboniera Topolino dipinta a mano su legno", is_cover: true }]
  },
  {
    slug: "set-cesta-pinocchio-compleanno",
    name: "Set Cesta Pinocchio – Primo Compleanno",
    short_description: "Set completo a tema Pinocchio: cesta con bomboniere dipinte, confetti e veli colorati.",
    description: "Un allestimento completo e festoso pensato per il primo compleanno del bambino. La cesta contiene bomboniere in legno dipinte a mano con Pinocchio, confetti colorati e veli coordinati.",
    category: "set-regalo",
    event_type: ["compleanno"],
    base_price: 35,
    is_featured: true,
    is_active: true,
    is_customizable: true,
    inspiration_type: "both",
    default_shape: "casetta",
    materials: ["Legno dipinto a mano", "Cesta in vimini", "Confetti", "Veli colorati"],
    production_notes: "Set assemblato su misura in base al numero di ospiti.",
    images: [{ url: "/images/products/pinocchio-cesta.jpeg", alt: "Cesta tema Pinocchio con bomboniere dipinte", is_cover: true }]
  },
  {
    slug: "collezione-mista-passionart",
    name: "Collezione Mista PassionArt",
    short_description: "Selezione di quadretti e bomboniere in legno dipinti a mano.",
    description: "Una panoramica della produzione artigianale PassionArt: quadretti in legno dipinti a mano con soggetti diversi.",
    category: "collezione",
    event_type: ["nascita"],
    base_price: 10,
    is_featured: true,
    is_active: true,
    is_customizable: true,
    inspiration_type: "showcase",
    default_shape: "rettangolo",
    materials: ["Legno di betulla", "Colori acrilici atossici", "Fiocchi e nastri"],
    images: [{ url: "/images/products/collezione-mista.jpeg", alt: "Collezione mista PassionArt", is_cover: true }]
  },
  {
    slug: "quadretto-coniglietto-gaia",
    name: "Quadretto Coniglietto – Gaia",
    short_description: "Quadretto in legno dipinto a mano con coniglietto, fiori e uccellino.",
    description: "Quadretto in legno dipinto a mano con un tenero coniglietto, fiori e uccellino. Personalizzabile con il nome del bambino.",
    category: "decorazioni",
    event_type: ["nascita"],
    base_price: 15,
    is_featured: false,
    is_active: true,
    is_customizable: true,
    inspiration_type: "realizzato",
    default_shape: "rettangolo",
    materials: ["Legno di betulla", "Colori acrilici atossici", "Cordino e perline"],
    images: [{ url: "/images/products/coniglietto-gaia.jpeg", alt: "Quadretto coniglietto Gaia", is_cover: true }]
  },
  {
    slug: "bomboniera-stitch-angel-battesimo",
    name: "Bomboniera Stitch & Angel – Battesimo",
    short_description: "Bomboniera in legno dipinta a mano con Stitch e Angel, personalizzabile con il nome.",
    description: "Bomboniera in legno dipinta a mano con Stitch e Angel. Personalizzabile con il nome del bambino per battesimo o nascita.",
    category: "bomboniere",
    event_type: ["battesimo"],
    base_price: 14,
    is_featured: true,
    is_active: true,
    is_customizable: true,
    inspiration_type: "both",
    default_shape: "cuore",
    materials: ["Legno di betulla", "Colori acrilici atossici"],
    images: [{ url: "/images/products/stitch-giovanna.jpeg", alt: "Bomboniera Stitch e Angel", is_cover: true }]
  },
  {
    slug: "portaovetti-coniglio-pasqua",
    name: "Portaovetti Coniglio di Pasqua",
    short_description: "Portaovetti a forma di coniglio in legno dipinto a mano.",
    description: "Portaovetti a forma di coniglio in legno dipinto a mano, con orecchie e dettagli rosa. Personalizzabile con nome.",
    category: "decorazioni",
    event_type: ["pasqua"],
    base_price: 18,
    is_featured: false,
    is_active: true,
    is_customizable: true,
    inspiration_type: "both",
    default_shape: "casetta",
    materials: ["Legno di betulla", "Colori acrilici atossici"],
    images: [{ url: "/images/products/coniglio-pasqua.jpeg", alt: "Portaovetti coniglio Pasqua", is_cover: true }]
  }
];

const defaultSettings = {
  key: "configurator",
  value: {
    categories: [
      { key: "bomboniere", name: "Bomboniere", emoji: "🪵", description: "Bomboniere in legno dipinte a mano", active: true },
      { key: "tazze", name: "Tazze", emoji: "☕", description: "Tazze personalizzate", active: true },
      { key: "magliette", name: "Magliette", emoji: "👕", description: "Magliette e polo personalizzate", active: true }
    ],
    basePrices: {
      singola: { piccola: 8, media: 12, grande: 18 },
      set: { piccola: 25, media: 35, grande: 50 },
      quadretto: { piccola: 15, media: 22, grande: 30 },
      palette: { "25x25": 20, "30x30": 28, "25x35": 32, "30x40": 45 }
    },
    tazzePrices: { classica: 12, magica: 16, cucchiaino: 18 },
    magliettePrices: { corta: 15, lunga: 18, polo: 22 },
    palette: ["#fce8d0", "#f4a261", "#e76f51", "#2ec4b6", "#9b5de5", "#d4a5a5"]
  }
};

async function seed() {
  console.log('🌱 Seed database Supabase...\n');

  // 1. Inserisci prodotti
  for (const product of demoProducts) {
    const images = product.images;
    delete product.images;

    const { data: prod, error } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.log(`  ❌ ${product.slug}:`, error.message);
    } else {
      console.log(`  ✅ Prodotto: ${product.name}`);

      // Inserisci immagini
      for (const img of images) {
        const { error: imgError } = await supabase
          .from('product_images')
          .upsert({
            product_id: prod.id,
            url: img.url,
            alt: img.alt,
            is_cover: img.is_cover
          });
        if (imgError) console.log(`    ❌ Immagine:`, imgError.message);
      }
    }
  }

  // 2. Inserisci settings
  const { error: settingsError } = await supabase
    .from('configurator_settings')
    .upsert(defaultSettings, { onConflict: 'key' });

  if (settingsError) {
    console.log(`  ❌ Settings:`, settingsError.message);
  } else {
    console.log(`  ✅ Configurator settings`);
  }

  console.log('\n✅ Seed completato!');
}

seed().catch(console.error);
