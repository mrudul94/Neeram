"use client";

import { create } from "zustand";

/** The pack chosen on the home page's coconut-oil feature, per product slug. */
export const usePackChoice = create<{ chosen: Record<string, string>; choose: (slug: string, pack: string) => void }>()((set) => ({
  chosen: {},
  choose: (slug, pack) => set((s) => ({ chosen: { ...s.chosen, [slug]: pack } })),
}));
