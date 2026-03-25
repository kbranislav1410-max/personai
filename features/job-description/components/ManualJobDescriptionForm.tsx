"use client";

import { useState } from "react";
import { usePositions } from "@/features/positions/hooks/usePositions";
import styles from "./ManualJobDescriptionForm.module.css";

export default function ManualJobDescriptionForm() {
  const { addPosition } = usePositions();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Zadajte názov pozície.");
      return;
    }
    if (!content.trim()) {
      setError("Vložte text pracovnej ponuky.");
      return;
    }
    setError("");
    addPosition(title.trim(), content.trim());
    setSaved(true);
    setTitle("");
    setContent("");
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="manualTitle" className={styles.label}>
          Názov pozície
        </label>
        <input
          id="manualTitle"
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          placeholder="napr. Senior Frontend Developer"
          autoComplete="off"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="manualContent" className={styles.label}>
          Text pracovnej ponuky
        </label>
        <textarea
          id="manualContent"
          className={styles.textarea}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError("");
          }}
          placeholder="Vložte alebo napíšte celý text job description…"
          rows={16}
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveButton}>
          Uložiť pozíciu
        </button>
        {saved && (
          <span className={styles.savedBadge} role="status">
            ✓ Uložené do Pozícií
          </span>
        )}
      </div>
    </form>
  );
}
