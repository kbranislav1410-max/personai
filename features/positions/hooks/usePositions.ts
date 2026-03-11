"use client";

import { useCallback, useEffect, useState } from "react";
import { Position } from "../types";

const STORAGE_KEY = "personai_positions";

function loadPositions(): Position[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Position[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(positions: Position[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // storage unavailable — silently ignore
  }
}

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    // Must use useEffect here: the lazy-initializer of useState runs on the
    // server (window === undefined → returns []), and React does not re-call
    // it during client hydration. useEffect fires only in the browser, so
    // this is the correct pattern for loading client-only storage in Next.js.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPositions(loadPositions());
  }, []);

  const addPosition = useCallback(
    (
      title: string,
      content: string,
      meta?: Pick<Position, "seniority" | "location" | "employmentType">
    ) => {
      const next: Position = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
        ...meta,
      };
      setPositions((prev) => {
        const updated = [next, ...prev];
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  const removePosition = useCallback((id: string) => {
    setPositions((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  return { positions, addPosition, removePosition };
}
