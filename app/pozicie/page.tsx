"use client";

import { useState } from "react";
import { usePositions } from "@/features/positions/hooks/usePositions";
import styles from "./page.module.css";

export default function PoziciePage() {
  const { positions, removePosition } = usePositions();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <>
      <h1 className={styles.title}>Pozície</h1>

      {positions.length === 0 ? (
        <p className={styles.empty}>
          Zatiaľ nie sú uložené žiadne pozície. Vygenerujte pracovnú ponuku a
          uložte ju pomocou tlačidla{" "}
          <em>Uložiť ako pozíciu</em>.
        </p>
      ) : (
        <ul className={styles.list}>
          {positions.map((pos) => (
            <li key={pos.id} className={styles.card}>
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
                    className={styles.deleteButton}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Skutočne chcete odstrániť pozíciu „${pos.title}"?`
                        )
                      ) {
                        removePosition(pos.id);
                        if (expandedId === pos.id) setExpandedId(null);
                      }
                    }}
                    aria-label={`Odstrániť pozíciu ${pos.title}`}
                  >
                    Odstrániť
                  </button>
                </div>
              </div>

              {expandedId === pos.id && (
                <pre className={styles.content}>{pos.content}</pre>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

