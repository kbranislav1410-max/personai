"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import { prepareInterviewClient } from "@/features/interview-prep/services/interviewPrepClient";
import { Candidate } from "@/features/candidates/types";
import styles from "./page.module.css";

export default function InterviewPrepContent() {
  const searchParams = useSearchParams();
  const { candidates } = useCandidates();

  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preparation, setPreparation] = useState<string | null>(null);

  // Pre-select candidate from URL param
  useEffect(() => {
    const id = searchParams.get("candidateId");
    if (id) {
      setSelectedId(id);
    }
  }, [searchParams]);

  // Keep selectedCandidate in sync with selectedId and candidates list
  useEffect(() => {
    if (selectedId && candidates.length > 0) {
      const found = candidates.find((c) => c.id === selectedId) ?? null;
      setSelectedCandidate(found);
      // Reset results when candidate changes
      setPreparation(null);
      setError(null);
    } else {
      setSelectedCandidate(null);
    }
  }, [selectedId, candidates]);

  async function handleGenerate() {
    if (!selectedCandidate) return;

    setIsLoading(true);
    setError(null);
    setPreparation(null);

    try {
      const response = await prepareInterviewClient({
        positionTitle: selectedCandidate.positionTitle,
        candidateFilename: selectedCandidate.filename,
        candidateAnalysis: selectedCandidate.analysis,
      });
      setPreparation(response.preparation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Niečo sa pokazilo. Skúste to znova."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function renderPreparation(text: string) {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className={styles.prepHeading}>
            {line.replace(/^###\s*/, "")}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className={styles.prepHeading2}>
            {line.replace(/^##\s*/, "")}
          </h2>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className={styles.prepBold}>
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <p key={i} className={styles.prepBullet}>
            {line.replace(/^[-*]\s/, "• ")}
          </p>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <p key={i} className={styles.prepNumbered}>
            {line}
          </p>
        );
      }
      if (line.trim() === "") {
        return <div key={i} className={styles.prepSpacer} />;
      }
      return (
        <p key={i} className={styles.prepLine}>
          {line}
        </p>
      );
    });
  }

  return (
    <>
      <h1 className={styles.title}>Príprava na pohovor</h1>
      <p className={styles.description}>
        Vyberte uchádzača a AI vytvorí kompletnú prípravu na pohovor – štruktúru,
        otázky a odporúčania šité na mieru danému kandidátovi a pozícii.
      </p>

      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="candidate-select" className={styles.label}>
            Vyberte uchádzača
          </label>
          {candidates.length === 0 ? (
            <p className={styles.noData}>
              Zatiaľ nie sú uložení žiadni uchádzači. Analyzujte životopisy v
              sekcii <em>Analýza životopisov</em> a uložte ich.
            </p>
          ) : (
            <select
              id="candidate-select"
              className={styles.select}
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={isLoading}
            >
              <option value="">— Vyberte uchádzača —</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.filename}
                  {c.positionTitle ? ` – ${c.positionTitle}` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedCandidate && (
          <div className={styles.candidateInfo}>
            <span className={styles.candidateLabel}>Uchádzač:</span>{" "}
            <strong>{selectedCandidate.filename}</strong>
            {selectedCandidate.positionTitle && (
              <>
                {" "}
                na pozíciu <strong>{selectedCandidate.positionTitle}</strong>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          className={styles.generateButton}
          disabled={!selectedCandidate || isLoading}
          onClick={handleGenerate}
        >
          {isLoading ? "Generujem prípravu…" : "Generovať prípravu na pohovor"}
        </button>
      </div>

      {isLoading && (
        <div className={styles.loading} role="status" aria-live="polite">
          <div className={styles.spinner} aria-hidden="true" />
          <p>AI pripravuje pohovor, prosím čakajte…</p>
        </div>
      )}

      {error && (
        <div className={styles.error} role="alert">
          <strong>Chyba:</strong> {error}
        </div>
      )}

      {preparation && (
        <section className={styles.result}>
          <h2 className={styles.resultTitle}>Príprava na pohovor</h2>
          <div className={styles.resultContent}>
            {renderPreparation(preparation)}
          </div>
        </section>
      )}
    </>
  );
}
