const fs = require('fs');
const path = require('path');

// 1. CREA LO STORE ZUSTAND
const storePath = path.join(process.cwd(), 'store', 'configurator-store.ts');
const storeCode = `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ConfiguratorDraftStore {
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
  bomboniereDraft: any;
  setBomboniereDraft: (draft: any) => void;
  tazzeDraft: any;
  setTazzeDraft: (draft: any) => void;
  maglietteDraft: any;
  setMaglietteDraft: (draft: any) => void;
  canvasDraft: any;
  setCanvasDraft: (draft: any) => void;
  clearDrafts: () => void;
}

export const useConfiguratorStore = create<ConfiguratorDraftStore>()(
  persist(
    (set) => ({
      activeCategory: null,
      setActiveCategory: (cat) => set({ activeCategory: cat }),
      bomboniereDraft: null,
      setBomboniereDraft: (draft) => set({ bomboniereDraft: draft }),
      tazzeDraft: null,
      setTazzeDraft: (draft) => set({ tazzeDraft: draft }),
      maglietteDraft: null,
      setMaglietteDraft: (draft) => set({ maglietteDraft: draft }),
      canvasDraft: null,
      setCanvasDraft: (draft) => set({ canvasDraft: draft }),
      clearDrafts: () => set({
        bomboniereDraft: null,
        tazzeDraft: null,
        maglietteDraft: null,
        canvasDraft: null,
      }),
    }),
    { name: 'passionart-config-draft' }
  )
);
`;

if (!fs.existsSync(path.join(process.cwd(), 'store'))) {
  fs.mkdirSync(path.join(process.cwd(), 'store'));
}
fs.writeFileSync(storePath, storeCode);
console.log('✅ store/configurator-store.ts creato');

// 2. AGGIORNA configurator-client-page.tsx
const configPath = path.join(process.cwd(), 'components', 'configurator', 'configurator-client-page.tsx');
if (fs.existsSync(configPath)) {
  let code = fs.readFileSync(configPath, 'utf8');

  // Aggiungi import se assente
  if (!code.includes('useConfiguratorStore')) {
    code = code.replace(
      'import { useCartStore } from "@/store/cart-store";',
      'import { useCartStore } from "@/store/cart-store";\nimport { useConfiguratorStore } from "@/store/configurator-store";'
    );
  }

  // Intercetta useState della Categoria e linkalo a Zustand
  if (!code.includes('const storeCategory')) {
    code = code.replace(
      /export default function ConfiguratorPage\(\) \{[\s\S]*?const \[category, setCategory\] = useState<Category \| null>\(null\);/,
      `export default function ConfiguratorPage() {
  const storeCategory = useConfiguratorStore((s) => s.activeCategory);
  const setStoreCategory = useConfiguratorStore((s) => s.setActiveCategory);
  
  const [category, setCategoryState] = useState<Category | null>((storeCategory as Category) || null);
  
  const setCategory = (cat: Category | null) => {
    setCategoryState(cat);
    setStoreCategory(cat);
  };`
    );
  }

  // Svuota le bozze una volta aggiunto al carrello
  if (!code.includes('useConfiguratorStore.getState().clearDrafts()')) {
     code = code.replace(/addItem\(\{[\s\S]*?\}\);/g, (match) => {
         return match + '\n    useConfiguratorStore.getState().clearDrafts();';
     });
  }

  fs.writeFileSync(configPath, code);
  console.log('✅ components/configurator/configurator-client-page.tsx aggiornato');
}

// 3. AGGIORNA canvas-configurator.tsx
const canvasPath = path.join(process.cwd(), 'components', 'catalog', 'canvas-configurator.tsx');
if (fs.existsSync(canvasPath)) {
  let code = fs.readFileSync(canvasPath, 'utf8');

  if (!code.includes('useConfiguratorStore')) {
    code = code.replace(
      'import { useCartStore } from "@/store/cart-store";',
      'import { useCartStore } from "@/store/cart-store";\nimport { useConfiguratorStore } from "@/store/configurator-store";'
    );
  }
  
  // Svuota bozze al checkout anche per i Canvas
  if (!code.includes('useConfiguratorStore.getState().clearDrafts()')) {
     code = code.replace(/addItem\(\{[\s\S]*?\}\);/g, (match) => {
         return match + '\n    useConfiguratorStore.getState().clearDrafts();';
     });
  }

  fs.writeFileSync(canvasPath, code);
  console.log('✅ components/catalog/canvas-configurator.tsx aggiornato');
}

console.log('\n🚀 Patch completata! Le categorie non spariranno più uscendo dalla pagina.');