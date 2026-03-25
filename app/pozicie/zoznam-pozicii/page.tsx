"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePositions } from "@/features/positions/hooks/usePositions";
import styles from "../page.module.css";

export default function ZoznamPoziciiPage() {
  const { positions, removePosition, attachResumeToPosition, removeAttachedResume } =
    usePositions();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedResumesId, setExpandedResumesId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function handleAttachClick(positionId: string) {
    fileInputRefs.current[positionId]?.click();
  }

  function handleFileChange(
    positionId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => attachResumeToPosition(positionId, file));
    // Reset so the same file can be re-selected after removal
    if (fileInputRefs.current[positionId]) {
      fileInputRefs.current[positionId]!.value = "";
    }
  }

  return (
    <>
      <h1 className={styles.title}>Zoznam pozícií</h1>

      {positions.length === 0 ? (
        <p className={styles.empty}>
          Zatiaľ nie sú uložené žiadne pozície. Vygenerujte pracovnú ponuku a
          uložte ju pomocou tlačidla{" "}
          <em>Uložiť ako pozíciu</em>.
        </p>
      ) : (
        <ul className={styles.list}>
          {positions.map((pos) => {
            const resumes = pos.attachedResumes ?? [];
            const resumesExpanded = expandedResumesId === pos.id;

            return (
              <li key={pos.id} className={styles.card}>
                {/* Hidden file input per position */}
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  multiple
                  className={styles.hiddenFileInput}
                  ref={(el) => {
                    fileInputRefs.current[pos.id] = el;
                  }}
                  onChange={(e) => handleFileChange(pos.id, e)}
                  aria-label={`Nahrať životopis pre pozíciu ${pos.title}`}
                />

                <div className={styles.cardHeader}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardTitle}>{pos.title}</span>
                    <span className={styles.cardTags}>
                      {pos.seniority && (
                        <span className={styles.tag}>{pos.seniority}</span>
                      )}
                      {pos.location && (
                        <span className={styles.tag}>{pos.location}</span>
                      )}
                      {pos.employmentType && (
                        <span className={styles.tag}>{pos.employmentType}</span>
                      )}
                    </span>
                    <span className={styles.cardDate}>{formatDate(pos.createdAt)}</span>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.toggleButton}
                      onClick={() =>
                        setExpandedId(expandedId === pos.id ? null : pos.id)
                      }
                      aria-expanded={expandedId === pos.id}
                    >
                      {expandedId === pos.id ? "Skryť" : "Zobraziť"}
                    </button>
                    <button
                      type="button"
                      className={styles.attachButton}
                      onClick={() => handleAttachClick(pos.id)}
                      title="Pridať životopis k tejto pozícii"
                    >
                      📎 Pridať CV
                    </button>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Skutočne chcete odstrániť pozíciu „${pos.title}"?`
                          )
                        ) {
                          removePosition(pos.id);
                          if (expandedId === pos.id) setExpandedId(null);
                          if (expandedResumesId === pos.id) setExpandedResumesId(null);
                        }
                      }}
                      aria-label={`Odstrániť pozíciu ${pos.title}`}
                    >
                      Odstrániť
                    </button>
                  </div>
                </div>

                {/* Attached resumes section */}
                {resumes.length > 0 && (
                  <div className={styles.resumesSection}>
                    <button
                      type="button"
                      className={styles.resumesToggle}
                      onClick={() =>
                        setExpandedResumesId(resumesExpanded ? null : pos.id)
                      }
                      aria-expanded={resumesExpanded}
                    >
                      📄 Životopisy ({resumes.length})
                      <span className={styles.resumesChevron}>
                        {resumesExpanded ? "▲" : "▼"}
                      </span>
                    </button>

                    {resumesExpanded && (
                      <ul className={styles.resumeList}>
                        {resumes.map((r) => (
                          <li key={r.id} className={styles.resumeItem}>
                            <span className={styles.resumeFilename}>
                              {r.filename}
                            </span>
                            <span className={styles.resumeId}>
                              ID: {r.id.slice(0, 8)}
                            </span>
                            <button
                              type="button"
                              className={styles.resumeRemove}
                              onClick={() => removeAttachedResume(pos.id, r.id)}
                              aria-label={`Odstrániť životopis ${r.filename}`}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                        <li className={styles.resumeAnalyseRow}>
                          <Link
                            href="/analyza-zivotopisov"
                            className={styles.analyseLink}
                          >
                            ✨ Analyzovať životopisy
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                )}

                {expandedId === pos.id && (
                  <pre className={styles.content}>{pos.content}</pre>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

