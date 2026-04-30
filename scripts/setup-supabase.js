const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili ambiente mancanti! Assicurati di avere .env.local con:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function setupDatabase() {
  console.log('🔧 Setup database Supabase...\n');

  // 1. Crea tabella products
  const { error: productsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        short_description TEXT,
        description TEXT,
        category TEXT NOT NULL,
        event_type TEXT[] NOT NULL DEFAULT '{}',
        base_price DECIMAL(10, 2) NOT NULL,
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        is_customizable BOOLEAN DEFAULT false,
        inspiration_type TEXT DEFAULT 'realizzato',
        default_shape TEXT,
        materials TEXT[] DEFAULT '{}',
        production_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  if (productsError) console.log('  products:', productsError.message);
  else console.log('  ✅ products');

  // 2. Crea tabella product_images
  const { error: imagesError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS product_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        alt TEXT,
        sort_order INTEGER DEFAULT 0,
        is_cover BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  if (imagesError) console.log('  product_images:', imagesError.message);
  else console.log('  ✅ product_images');

  // 3. Crea tabella orders
  const { error: ordersError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        shipping_address TEXT NOT NULL,
        shipping_city TEXT NOT NULL,
        shipping_zip TEXT NOT NULL,
        shipping_province TEXT NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        shipping_cost DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        payment_status TEXT DEFAULT 'pending',
        production_status TEXT DEFAULT 'nuovo',
        paypal_order_id TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  if (ordersError) console.log('  orders:', ordersError.message);
  else console.log('  ✅ orders');

  // 4. Crea tabella order_items
  const { error: itemsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_snapshot JSONB NOT NULL,
        customization JSONB,
        quantity INTEGER NOT NULL DEFAULT 1,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  if (itemsError) console.log('  order_items:', itemsError.message);
  else console.log('  ✅ order_items');

  // 5. Crea tabella configurator_settings
  const { error: settingsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS configurator_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key TEXT UNIQUE NOT NULL,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  if (settingsError) console.log('  configurator_settings:', settingsError.message);
  else console.log('  ✅ configurator_settings');

  // 6. Crea storage bucket per immagini
  const { error: bucketError } = await supabase.storage.createBucket('products', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
  });
  if (bucketError && !bucketError.message.includes('already exists')) {
    console.log('  storage bucket:', bucketError.message);
  } else {
    console.log('  ✅ storage bucket "products"');
  }

  console.log('\n✅ Setup completato!');
  console.log('\nProssimo passo: esegui npm run seed per popolare i dati demo.');
}

setupDatabase().catch(console.error);
