"use client";

import { useState } from "react";
import { ResumeAnalysisResult as AnalysisResult } from "../types";
import styles from "./ResumeAnalysisResult.module.css";

interface Props {
  results: AnalysisResult[];
  isLoading: boolean;
  error: string | null;
}

export default function ResumeAnalysisResult({
  results,
  isLoading,
  error,
}: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    results.length === 1 ? 0 : null
  );

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
        )
      </h2>

      <ul className={styles.list}>
        {results.map((result, index) => (
          <li key={`${result.filename}-${index}`} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.filename}>{result.filename}</span>
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                aria-expanded={expandedIndex === index}
              >
                {expandedIndex === index ? "Skryť" : "Zobraziť analýzu"}
              </button>
            </div>

            {expandedIndex === index && (
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
        ))}
      </ul>
    </section>
  );
}
