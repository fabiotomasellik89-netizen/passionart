# PassionArt

E-commerce demo completo per PassionArt costruito con `Next.js App Router`, `Tailwind CSS`, `Supabase-ready` e checkout `PayPal sandbox-ready`.

## Cosa include

- homepage brandizzata con logo, hero e sezioni editoriali
- catalogo con filtri e pagine dettaglio prodotto
- configuratore interattivo con preview SVG live e pricing dinamico
- carrello persistente con Zustand
- checkout con fallback demo e integrazione PayPal sandbox pronta
- area admin protetta da cookie con CRUD demo per prodotti e gestione ordini
- schema e seed SQL in `supabase/schema.sql` e `supabase/seed.sql`

## Avvio rapido

```bash
npm install
npm run dev
```

Apri `http://localhost:3000`.

## Credenziali admin demo

- email: `admin@passionart.it`
- password: `PassionArt2026!`

## Variabili ambiente opzionali

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENV=sandbox
```

### Note importanti

- se Supabase non è configurato, l’app usa un data layer demo in memoria
- se PayPal non è configurato, il checkout usa una modalità demo completa fino alla conferma ordine
- appena inserisci le credenziali sandbox PayPal, il bottone PayPal reale viene attivato automaticamente

## Struttura principale

- `app/` rotte App Router pubbliche, API e admin
- `components/` componenti UI, layout, home e catalogo
- `lib/mock-db.ts` data layer demo condiviso
- `lib/configurator/*` logica preview, shapes e pricing
- `store/cart-store.ts` carrello persistente client-side
- `supabase/` schema e seed iniziale

## Setup Supabase consigliato

1. crea un progetto Supabase
2. esegui `supabase/schema.sql`
3. esegui `supabase/seed.sql`
4. inserisci le variabili ambiente

## Setup PayPal sandbox

1. crea una sandbox app su PayPal Developer
2. imposta `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
3. imposta `PAYPAL_CLIENT_SECRET`
4. lascia `PAYPAL_ENV=sandbox`

## Stato progetto

Questo repository è configurato per essere navigabile subito in locale anche senza servizi esterni, ma resta predisposto per il collegamento reale a Supabase e PayPal.