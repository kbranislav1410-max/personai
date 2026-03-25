"use client";

import { useMemo, useState } from "react";
import { ResumeAnalysisResult as AnalysisResult, SuitabilityScore } from "../types";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import styles from "./ResumeAnalysisResult.module.css";

interface Props {
  results: AnalysisResult[];
  isLoading: boolean;
  error: string | null;
  positionId?: string;
  positionTitle?: string;
  /** Original File objects from the upload, used to persist CV content */
  files?: File[];
}

const SCORE_STYLE: Record<SuitabilityScore, string> = {
  5: styles.score5,
  4: styles.score4,
  3: styles.score3,
  2: styles.score2,
  1: styles.score1,
};

interface SaveForm {
  firstName: string;
  lastName: string;
}

export default function ResumeAnalysisResult({
  results,
  isLoading,
  error,
  positionId,
  positionTitle,
  files,
}: Props) {
  const { addCandidate } = useCandidates();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  /** Map from originalIndex → saved candidate id */
  const [savedMap, setSavedMap] = useState<Record<number, string>>({});
  /** Which card is showing the save form (keyed by originalIndex) */
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  /** Save form state */
  const [saveForm, setSaveForm] = useState<SaveForm>({ firstName: "", lastName: "" });

  /** Sort a copy of results by score descending (best first) */
  const sorted = useMemo(
    () =>
      results
        .map((r, originalIndex) => ({ ...r, originalIndex }))
        .sort((a, b) => b.score - a.score),
    [results]
  );

  /** Auto-expand single result */
  const resolvedExpanded =
    expandedIndex === null && sorted.length === 1 ? 0 : expandedIndex;

  function openSaveForm(originalIndex: number) {
    setSavingIndex(originalIndex);
    setSaveForm({ firstName: "", lastName: "" });
  }

  /** Convert a File to a base64 data URL so it can be stored in localStorage */
  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function handleSaveSubmit(originalIndex: number, result: AnalysisResult) {
    const fullName = `${saveForm.firstName.trim()} ${saveForm.lastName.trim()}`.trim();
    if (fullName.length === 0) return;

    // Find the original File object by filename and convert to a data URL so
    // the recruiter can open/download the CV from the candidate detail page.
    const matchingFile = files?.find((f) => f.name === result.filename);
    let cvDataUrl: string | undefined;
    if (matchingFile) {
      try {
        cvDataUrl = await readFileAsDataUrl(matchingFile);
      } catch (err) {
        // CV content could not be read — candidate will still be saved without it
        console.warn("Could not read CV file as data URL:", err);
      }
    }

    const candidate = addCandidate({
      name: fullName,
      filename: result.filename,
      analysis: result.analysis,
      score: result.score,
      ratingLabel: result.ratingLabel,
      positionId: positionId ?? "",
      positionTitle: positionTitle ?? "",
      cvDataUrl,
    });
    setSavedMap((prev) => ({ ...prev, [originalIndex]: candidate.id }));
    setSavingIndex(null);
  }

  if (isLoading) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        <div className={styles.spinner} aria-hidden="true" />
        <p>Analyzujem životopisy, prosím čakajte…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        <strong>Chyba:</strong> {error}
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        Výsledky analýzy ({results.length}{" "}
        {results.length === 1
          ? "životopis"
          : results.length < 5
          ? "životopisy"
          : "životopisov"}
        ) — zoradené od najvhodnejšieho
      </h2>

      <ul className={styles.list}>
        {sorted.map((result, sortedIdx) => {
          const score = result.score as SuitabilityScore;
          const isSaved = result.originalIndex in savedMap;
          const isSaving = savingIndex === result.originalIndex;
          const isExpanded = resolvedExpanded === sortedIdx;
          const canSave =
            saveForm.firstName.trim().length > 0 &&
            saveForm.lastName.trim().length > 0;

          return (
            <li key={`${result.filename}-${sortedIdx}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardMeta}>
                  <span className={styles.filename}>{result.filename}</span>
                  <span className={`${styles.scoreBadge} ${SCORE_STYLE[score]}`}>
                    {score}/5 — {result.ratingLabel}
                  </span>
                </div>
                <div className={styles.cardActions}>
                  {isSaved ? (
                    <span className={styles.savedBadge}>✓ Uložený</span>
                  ) : isSaving ? (
                    <span className={styles.savingPlaceholder} />
                  ) : (
                    <button
                      type="button"
                      className={styles.saveButton}
                      onClick={() => openSaveForm(result.originalIndex)}
                    >
                      Uložiť ako uchádzača
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() =>
                      setExpandedIndex(isExpanded ? null : sortedIdx)
                    }
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "Skryť" : "Zobraziť analýzu"}
                  </button>
                </div>
              </div>

              {/* Inline save form */}
              {isSaving && (
                <div className={styles.saveForm}>
                  <p className={styles.saveFormLabel}>
                    Zadajte meno uchádzača — systém mu pridelí jedinečné ID automaticky.
                  </p>
                  <div className={styles.saveFormRow}>
                    <input
                      className={styles.saveInput}
                      type="text"
                      placeholder="Meno"
                      value={saveForm.firstName}
                      onChange={(e) =>
                        setSaveForm((f) => ({ ...f, firstName: e.target.value }))
                      }
                      autoFocus
                    />
                    <input
                      className={styles.saveInput}
                      type="text"
                      placeholder="Priezvisko"
                      value={saveForm.lastName}
                      onChange={(e) =>
                        setSaveForm((f) => ({ ...f, lastName: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && canSave)
                          handleSaveSubmit(result.originalIndex, result);
                      }}
                    />
                    <button
                      type="button"
                      className={styles.saveConfirmButton}
                      disabled={!canSave}
                      onClick={() => handleSaveSubmit(result.originalIndex, result)}
                    >
                      Uložiť
                    </button>
                    <button
                      type="button"
                      className={styles.saveCancelButton}
                      onClick={() => setSavingIndex(null)}
                    >
                      Zrušiť
                    </button>
                  </div>
                </div>
              )}

              {isExpanded && (
                <div className={styles.analysis}>
                  {result.analysis.split("\n").map((line, i) => {
                    if (line.startsWith("### ")) {
                      return (
                        <h3 key={i} className={styles.analysisHeading}>
                          {line.replace(/^###\s*/, "")}
                        </h3>
                      );
                    }
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <p key={i} className={styles.analysisBold}>
                          {line.replace(/\*\*/g, "")}
                        </p>
                      );
                    }
                    if (line.startsWith("- ") || line.startsWith("* ")) {
                      return (
                        <p key={i} className={styles.analysisBullet}>
                          {line.replace(/^[-*]\s/, "• ")}
                        </p>
                      );
                    }
                    if (line.trim() === "") {
                      return <div key={i} className={styles.analysisSpacer} />;
                    }
                    return (
                      <p key={i} className={styles.analysisLine}>
                        {line}
                      </p>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

