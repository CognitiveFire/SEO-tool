"use client";

import { useEffect } from "react";

import { useSeoStore } from "@/hooks/use-seo-store";
import type { SeoSnapshot } from "@/types/seo";

export function SnapshotBootstrap({ snapshot }: { snapshot: SeoSnapshot }) {
  const setSnapshot = useSeoStore((state) => state.setSnapshot);
  const currentSnapshot = useSeoStore((state) => state.snapshot);

  useEffect(() => {
    const currentTime = new Date(currentSnapshot.processedAt).getTime();
    const incomingTime = new Date(snapshot.processedAt).getTime();

    if (Number.isNaN(currentTime) || Number.isNaN(incomingTime) || incomingTime > currentTime) {
      setSnapshot(snapshot);
    }
  }, [currentSnapshot.processedAt, setSnapshot, snapshot]);

  return null;
}
