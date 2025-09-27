'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id: string) => {
        const currentIds = get().ids;
        const isSelected = currentIds.includes(id);
        
        if (isSelected) {
          set({ ids: currentIds.filter(existingId => existingId !== id) });
        } else {
          set({ ids: [...currentIds, id] });
        }
      },
      remove: (id: string) => {
        set({ ids: get().ids.filter(existingId => existingId !== id) });
      },
      clear: () => {
        set({ ids: [] });
      },
    }),
    {
      name: 'ih-compare-ids',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          localStorage.removeItem(name);
        },
      },
    }
  )
);
