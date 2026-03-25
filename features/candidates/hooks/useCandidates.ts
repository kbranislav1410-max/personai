"use client";

import { useCallback, useEffect, useState } from "react";
import { ActivityEvent, Candidate, CandidateStatus } from "../types";

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

const STATUS_NOTES: Record<CandidateStatus, string> = {
  zamestnani: "Kategória zmenená na: Zamestnaný",
  zaujimavy: "Kategória zmenená na: Zaujímavý",
  nevhodny: "Kategória zmenená na: Nevhodný",
};

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCandidates(loadCandidates());
  }, []);

  const addCandidate = useCallback(
    (data: Omit<Candidate, "id" | "createdAt" | "activityLog">) => {
      const now = new Date().toISOString();
      const initialEvent: ActivityEvent = {
        type: "saved",
        timestamp: now,
        note: "Uchádzač uložený z analýzy životopisu",
      };
      const next: Candidate = {
        id: crypto.randomUUID(),
        createdAt: now,
        activityLog: [initialEvent],
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

  const updateCandidateStatus = useCallback(
    (id: string, status: CandidateStatus | undefined) => {
      setCandidates((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== id) return c;
          const event: ActivityEvent | null = status
            ? {
                type: "status_changed",
                timestamp: new Date().toISOString(),
                note: STATUS_NOTES[status],
              }
            : null;
          return {
            ...c,
            status,
            activityLog: event
              ? [...(c.activityLog ?? []), event]
              : c.activityLog,
          };
        });
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  const addActivityEvent = useCallback(
    (id: string, event: ActivityEvent) => {
      setCandidates((prev) => {
        const updated = prev.map((c) =>
          c.id === id
            ? { ...c, activityLog: [...(c.activityLog ?? []), event] }
            : c
        );
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  return {
    candidates,
    addCandidate,
    removeCandidate,
    updateCandidateStatus,
    addActivityEvent,
  };
}

