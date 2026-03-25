"use client";

import { useState } from "react";
import Link from "next/link";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import { CandidateStatus } from "@/features/candidates/types";
import styles from "./page.module.css";

type FilterTab = "vsetci" | CandidateStatus;

const TABS: { id: FilterTab; label: string }[] = [
  { id: "vsetci", label: "Všetci" },
  { id: "zamestnani", label: "Zamestnaní" },
  { id: "zaujimavy", label: "Zaujímaví" },
  { id: "nevhodny", label: "Nevhodný" },
];

const STATUS_LABELS: Record<CandidateStatus, string> = {
  zamestnani: "Zamestnaný",
  zaujimavy: "Zaujímavý",
  nevhodny: "Nevhodný",
};

export default function UchadzaciPage() {
  const { candidates, removeCandidate, updateCandidateStatus } = useCandidates();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("vsetci");

  const filtered =
    activeTab === "vsetci"
      ? candidates
      : candidates.filter((c) => c.status === activeTab);

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

      {/* Filter tab bar */}
      <div className={styles.tabBar} role="tablist" aria-label="Filter uchádzačov">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id !== "vsetci" && (
              <span className={styles.tabCount}>
                {candidates.filter((c) => c.status === tab.id).length}
              </span>
            )}
            {tab.id === "vsetci" && (
              <span className={styles.tabCount}>{candidates.length}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && candidates.length === 0 ? (
        <p className={styles.empty}>
          Zatiaľ nie sú uložení žiadni uchádzači. Analyzujte životopisy v sekcii{" "}
          <em>Analýza životopisov</em> a uložte ich pomocou tlačidla{" "}
          <em>Uložiť ako uchádzača</em>.
        </p>
      ) : filtered.length === 0 ? (
        <p className={styles.empty}>
          V tejto kategórii sa nenachádzajú žiadni uchádzači.
        </p>
      ) : (
        <ul className={styles.list}>
          {filtered.map((candidate) => (
            <li key={candidate.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardTitle}>{candidate.filename}</span>
                  <div className={styles.cardTagsRow}>
                    {candidate.positionTitle && (
                      <span className={styles.tag}>{candidate.positionTitle}</span>
                    )}
                    {candidate.status && (
                      <span className={`${styles.tag} ${styles[`status_${candidate.status}`]}`}>
                        {STATUS_LABELS[candidate.status]}
                      </span>
                    )}
                  </div>
                  <span className={styles.cardDate}>
                    {formatDate(candidate.createdAt)}
                  </span>
                </div>
                <div className={styles.cardActions}>
                  <select
                    className={styles.statusSelect}
                    value={candidate.status ?? ""}
                    onChange={(e) =>
                      updateCandidateStatus(
                        candidate.id,
                        (e.target.value as CandidateStatus) || undefined
                      )
                    }
                    aria-label="Nastaviť kategóriu uchádzača"
                  >
                    <option value="">— kategória —</option>
                    <option value="zamestnani">Zamestnaný</option>
                    <option value="zaujimavy">Zaujímavý</option>
                    <option value="nevhodny">Nevhodný</option>
                  </select>
                  <Link
                    href={`/priprava-na-pohovor?candidateId=${candidate.id}`}
                    className={styles.prepButton}
                  >
                    Pripraviť pohovor
                  </Link>
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

