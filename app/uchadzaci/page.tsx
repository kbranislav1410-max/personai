"use client";

import { useState } from "react";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import styles from "./page.module.css";

export default function UchadzaciPage() {
  const { candidates, removeCandidate } = useCandidates();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function renderAnalysis(text: string) {
    return text.split("\n").map((line, i) => {
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
    });
  }

  return (
    <>
      <h1 className={styles.title}>Uchádzači</h1>

      {candidates.length === 0 ? (
        <p className={styles.empty}>
          Zatiaľ nie sú uložení žiadni uchádzači. Analyzujte životopisy v sekcii{" "}
          <em>Analýza životopisov</em> a uložte ich pomocou tlačidla{" "}
          <em>Uložiť ako uchádzača</em>.
        </p>
      ) : (
        <ul className={styles.list}>
          {candidates.map((candidate) => (
            <li key={candidate.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardTitle}>{candidate.filename}</span>
                  {candidate.positionTitle && (
                    <span className={styles.cardTags}>
                      <span className={styles.tag}>{candidate.positionTitle}</span>
                    </span>
                  )}
                  <span className={styles.cardDate}>
                    {formatDate(candidate.createdAt)}
                  </span>
                </div>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() =>
                      setExpandedId(
                        expandedId === candidate.id ? null : candidate.id
                      )
                    }
                    aria-expanded={expandedId === candidate.id}
                  >
                    {expandedId === candidate.id ? "Skryť" : "Zobraziť analýzu"}
                  </button>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Skutočne chcete odstrániť uchádzača „${candidate.filename}"?`
                        )
                      ) {
                        removeCandidate(candidate.id);
                        if (expandedId === candidate.id) setExpandedId(null);
                      }
                    }}
                    aria-label={`Odstrániť uchádzača ${candidate.filename}`}
                  >
                    Odstrániť
                  </button>
                </div>
              </div>

              {expandedId === candidate.id && (
                <div className={styles.analysis}>
                  {renderAnalysis(candidate.analysis)}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

