"use client";

import { useCallback, useEffect, useState } from "react";
import { Candidate } from "../types";

const STORAGE_KEY = "personai_candidates";

function loadCandidates(): Candidate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Candidate[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(candidates: Candidate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  } catch {
    // storage unavailable — silently ignore
  }
}

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCandidates(loadCandidates());
  }, []);

  const addCandidate = useCallback(
    (data: Omit<Candidate, "id" | "createdAt">) => {
      const next: Candidate = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...data,
      };
      setCandidates((prev) => {
        const updated = [next, ...prev];
        saveToStorage(updated);
        return updated;
      });
      return next;
    },
    []
  );

  const removeCandidate = useCallback((id: string) => {
    setCandidates((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  return { candidates, addCandidate, removeCandidate };
}
