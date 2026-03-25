"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import { CandidateStatus, ActivityEvent } from "@/features/candidates/types";
import { useState } from "react";
import styles from "./page.module.css";

const STATUS_LABELS: Record<CandidateStatus, string> = {
  zamestnani: "Zamestnaný",
  zaujimavy: "Zaujímavý",
  nevhodny: "Nevhodný",
};

const STATUS_CLASS: Record<CandidateStatus, string> = {
  zamestnani: styles.statusZamestnani,
  zaujimavy: styles.statusZaujimavy,
  nevhodny: styles.statusNevhodny,
};

const SCORE_CLASS: Record<number, string> = {
  5: styles.score5,
  4: styles.score4,
  3: styles.score3,
  2: styles.score2,
  1: styles.score1,
};

const EVENT_ICONS: Record<string, string> = {
  saved: "💾",
  status_changed: "🔄",
  interview_prepared: "🎤",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderAnalysis(text: string, stylesObj: CSSModuleClasses) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("### ")) {
      return (
        <h3 key={i} className={stylesObj.analysisHeading}>
          {line.replace(/^###\s*/, "")}
        </h3>
      );
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={i} className={stylesObj.analysisBold}>
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <p key={i} className={stylesObj.analysisBullet}>
          {line.replace(/^[-*]\s/, "• ")}
        </p>
      );
    }
    if (line.trim() === "") {
      return <div key={i} className={stylesObj.analysisSpacer} />;
    }
    return (
      <p key={i} className={stylesObj.analysisLine}>
        {line}
      </p>
    );
  });
}

// Minimal CSS-modules type used for the renderAnalysis helper signature
type CSSModuleClasses = Record<string, string>;

export default function CandidateDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { candidates, removeCandidate, updateCandidateStatus, addActivityEvent } =
    useCandidates();

  const candidate = candidates.find((c) => c.id === id);
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (candidates.length === 0) {
    // Still loading from localStorage
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        <div className={styles.spinner} aria-hidden="true" />
        <span>Načítavam…</span>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className={styles.notFound}>
        <p>Uchádzač nebol nájdený.</p>
        <Link href="/uchadzaci" className={styles.backLink}>
          ← Späť na zoznam uchádzačov
        </Link>
      </div>
    );
  }

  const score = candidate.score;
  // Legacy candidates saved before activityLog was introduced get a synthetic event
  const activityLog: ActivityEvent[] = candidate.activityLog ?? [
    { type: "saved", timestamp: candidate.createdAt, note: "Uchádzač uložený" },
  ];

  function handleStatusChange(newStatus: CandidateStatus | "") {
    updateCandidateStatus(candidate!.id, newStatus || undefined);
  }

  function handlePrepareInterview() {
    addActivityEvent(candidate!.id, {
      type: "interview_prepared",
      timestamp: new Date().toISOString(),
      note: "Príprava na pohovor spustená",
    });
  }

  function handleDelete() {
    if (
      window.confirm(
        `Skutočne chcete odstrániť uchádzača „${candidate!.name || candidate!.filename}"?`
      )
    ) {
      removeCandidate(candidate!.id);
      router.push("/uchadzaci");
    }
  }

  return (
    <div className={styles.page}>
      {/* Back navigation */}
      <Link href="/uchadzaci" className={styles.backLink}>
        ← Späť na uchádzačov
      </Link>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroName}>
            {candidate.name || candidate.filename}
          </h1>
          <div className={styles.heroMeta}>
            <span className={styles.idBadge}>ID: {candidate.id.slice(0, 8)}</span>
            {score !== undefined && (
              <span className={`${styles.scoreBadge} ${SCORE_CLASS[score] ?? ""}`}>
                {score}/5 — {candidate.ratingLabel}
              </span>
            )}
            {candidate.status && (
              <span
                className={`${styles.statusBadge} ${STATUS_CLASS[candidate.status]}`}
              >
                {STATUS_LABELS[candidate.status]}
              </span>
            )}
          </div>
        </div>

        <div className={styles.heroActions}>
          <Link
            href={`/priprava-na-pohovor?candidateId=${candidate.id}`}
            className={styles.prepButton}
            onClick={handlePrepareInterview}
          >
            🎤 Pripraviť pohovor
          </Link>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
          >
            Odstrániť
          </button>
        </div>
      </div>

      {/* Info grid */}
      <div className={styles.infoGrid}>
        {/* Position info */}
        <div className={styles.infoCard}>
          <h2 className={styles.infoCardTitle}>📋 Pozícia</h2>
          <p className={styles.infoCardValue}>
            {candidate.positionTitle || "—"}
          </p>
        </div>

        {/* CV file */}
        <div className={styles.infoCard}>
          <h2 className={styles.infoCardTitle}>📄 Životopis</h2>
          <p className={styles.infoCardValue}>{candidate.filename}</p>
          {candidate.cvDataUrl ? (
            <div className={styles.cvActions}>
              <button
                type="button"
                className={styles.cvOpenButton}
                title="Otvoriť životopis v novom okne"
                onClick={() => {
                  // Convert the base64 data URL to a Blob URL so the browser
                  // opens the file correctly. Chrome blocks data: URLs in new tabs.
                  const [meta, base64] = candidate.cvDataUrl!.split(",");
                  const mime =
                    meta.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
                  const bytes = Uint8Array.from(atob(base64), (c) =>
                    c.charCodeAt(0)
                  );
                  const blob = new Blob([bytes], { type: mime });
                  const blobUrl = URL.createObjectURL(blob);
                  const win = window.open(blobUrl, "_blank", "noopener,noreferrer");
                  // Revoke the object URL after the browser has loaded it
                  if (win) {
                    win.addEventListener("load", () =>
                      URL.revokeObjectURL(blobUrl)
                    );
                  }
                }}
              >
                Otvoriť
              </button>
              <a
                href={candidate.cvDataUrl}
                download={candidate.filename}
                className={styles.cvDownloadButton}
                title="Stiahnuť životopis"
              >
                Stiahnuť
              </a>
            </div>
          ) : (
            <p className={styles.cvMissing}>Súbor nie je k dispozícii</p>
          )}
        </div>

        {/* Saved date */}
        <div className={styles.infoCard}>
          <h2 className={styles.infoCardTitle}>📅 Uložený</h2>
          <p className={styles.infoCardValue}>
            {formatDateTime(candidate.createdAt)}
          </p>
        </div>

        {/* Status picker */}
        <div className={styles.infoCard}>
          <h2 className={styles.infoCardTitle}>🏷️ Kategória</h2>
          <select
            className={styles.statusSelect}
            value={candidate.status ?? ""}
            onChange={(e) =>
              handleStatusChange(e.target.value as CandidateStatus | "")
            }
            aria-label="Nastaviť kategóriu uchádzača"
          >
            <option value="">— bez kategórie —</option>
            <option value="zamestnani">Zamestnaný</option>
            <option value="zaujimavy">Zaujímavý</option>
            <option value="nevhodny">Nevhodný</option>
          </select>
        </div>
      </div>

      {/* Analysis toggle */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🤖 Analýza AI</h2>
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowAnalysis((v) => !v)}
            aria-expanded={showAnalysis}
          >
            {showAnalysis ? "Skryť analýzu" : "Zobraziť analýzu"}
          </button>
        </div>
        {showAnalysis && (
          <div className={styles.analysisBox}>
            {renderAnalysis(candidate.analysis, styles as CSSModuleClasses)}
          </div>
        )}
      </div>

      {/* Activity timeline */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🕐 História aktivity</h2>
        <ol className={styles.timeline}>
          {[...activityLog].reverse().map((event, i) => (
            <li key={i} className={styles.timelineItem}>
              <span className={styles.timelineIcon} aria-hidden="true">
                {EVENT_ICONS[event.type] ?? "•"}
              </span>
              <div className={styles.timelineBody}>
                <p className={styles.timelineNote}>{event.note ?? event.type}</p>
                <time className={styles.timelineTime} dateTime={event.timestamp}>
                  {formatDateTime(event.timestamp)}
                </time>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
