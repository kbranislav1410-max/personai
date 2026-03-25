"use client";

import { useCallback, useEffect, useState } from "react";
import { Position, AttachedResume } from "../types";
import {
  addAttachedFile,
  clearAttachedFiles,
  removeAttachedFile,
} from "@/features/resume-analysis/services/attachedFilesStore";

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
    clearAttachedFiles(id);
    setPositions((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Attach a CV file to a position.
   * - Saves metadata (id, filename, timestamp) to localStorage.
   * - Stores the actual File object in the in-memory file store.
   */
  const attachResumeToPosition = useCallback(
    (positionId: string, file: File) => {
      const resume: AttachedResume = {
        id: crypto.randomUUID(),
        filename: file.name,
        attachedAt: new Date().toISOString(),
      };
      addAttachedFile(positionId, file);
      setPositions((prev) => {
        const updated = prev.map((p) =>
          p.id === positionId
            ? {
                ...p,
                attachedResumes: [...(p.attachedResumes ?? []), resume],
              }
            : p
        );
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  /**
   * Remove a previously attached CV from a position.
   * Removes both the localStorage metadata and the in-memory File.
   */
  const removeAttachedResume = useCallback(
    (positionId: string, resumeId: string) => {
      setPositions((prev) => {
        const updated = prev.map((p) => {
          if (p.id !== positionId) return p;
          const removed = p.attachedResumes?.find((r) => r.id === resumeId);
          if (removed) removeAttachedFile(positionId, removed.filename);
          return {
            ...p,
            attachedResumes: (p.attachedResumes ?? []).filter(
              (r) => r.id !== resumeId
            ),
          };
        });
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  return {
    positions,
    addPosition,
    removePosition,
    attachResumeToPosition,
    removeAttachedResume,
  };
}

