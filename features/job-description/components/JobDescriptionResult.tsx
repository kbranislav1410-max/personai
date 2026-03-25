"use client";

import { useState } from "react";
import styles from "./JobDescriptionResult.module.css";

interface SaveMeta {
  seniority?: string;
  location?: string;
  employmentType?: string;
  suggestedTitle?: string;
}

interface Props {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  saveMeta?: SaveMeta;
  onSave?: (title: string) => void;
}

export default function JobDescriptionResult({
  result,
  isLoading,
  error,
  saveMeta,
  onSave,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [saved, setSaved] = useState(false);

  function handleOpenSave() {
    setTitleInput(saveMeta?.suggestedTitle ?? "");
    setSaving(true);
    setSaved(false);
  }

  function handleConfirmSave(e: React.FormEvent) {
    e.preventDefault();
    if (!titleInput.trim()) return;
    onSave?.(titleInput.trim());
    setSaving(false);
    setSaved(true);
  }

  if (isLoading) {
    return (
      <div className={styles.status} aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        Generuje sa pracovná ponuka…
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        {error}
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <section className={styles.result}>
      <div className={styles.resultHeader}>
        <h2 className={styles.heading}>Vygenerovaná pracovná ponuka</h2>
        {onSave && !saved && !saving && (
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleOpenSave}
          >
            Uložiť ako pozíciu
          </button>
        )}
        {saved && (
          <span className={styles.savedBadge}>✓ Uložené do Pozícií</span>
        )}
      </div>

      {saving && (
        <form onSubmit={handleConfirmSave} className={styles.saveForm}>
          <label htmlFor="positionTitle" className={styles.saveLabel}>
            Názov pozície
          </label>
          <div className={styles.saveRow}>
            <input
              id="positionTitle"
              type="text"
              className={styles.saveInput}
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="napr. Senior Frontend Developer"
              autoFocus
              required
            />
            <button type="submit" className={styles.saveConfirmButton}>
              Uložiť
            </button>
            <button
              type="button"
              className={styles.saveCancelButton}
              onClick={() => setSaving(false)}
            >
              Zrušiť
            </button>
          </div>
        </form>
      )}

      <pre className={styles.content}>{result}</pre>
    </section>
  );
}
