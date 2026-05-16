"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getMockSnapshot } from "@/lib/mock-data/seo-snapshot";
import type { SeoSnapshot } from "@/types/seo";

interface SeoStoreState {
  snapshot: SeoSnapshot;
  isProcessing: boolean;
  lastUploadAt: string | null;
  setSnapshot: (snapshot: SeoSnapshot) => void;
  setProcessing: (isProcessing: boolean) => void;
  resetSnapshot: () => void;
}

const fallbackSnapshot = getMockSnapshot();

export const useSeoStore = create<SeoStoreState>()(
  persist(
    (set) => ({
      snapshot: fallbackSnapshot,
      isProcessing: false,
      lastUploadAt: null,
      setSnapshot: (snapshot) =>
        set({
          snapshot,
          lastUploadAt: new Date().toISOString(),
          isProcessing: false,
        }),
      setProcessing: (isProcessing) => set({ isProcessing }),
      resetSnapshot: () => set({ snapshot: fallbackSnapshot, lastUploadAt: null, isProcessing: false }),
    }),
    {
      name: "seo-ops-snapshot",
      partialize: (state) => ({
        snapshot: state.snapshot,
        lastUploadAt: state.lastUploadAt,
      }),
    },
  ),
);
