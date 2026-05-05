import { create } from 'zustand';
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
