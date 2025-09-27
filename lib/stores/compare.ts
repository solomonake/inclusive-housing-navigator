'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CompareStore {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((item) => item !== id)
            : [...state.ids, id],
        }));
      },
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'ih-compare-ids',
      storage: createJSONStorage(() => localStorage),
    }
  )
);