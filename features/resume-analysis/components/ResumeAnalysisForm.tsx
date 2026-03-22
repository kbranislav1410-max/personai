"use client";

import { useRef, useState } from "react";
import { Position } from "@/features/positions/types";
import styles from "./ResumeAnalysisForm.module.css";

interface Props {
  positions: Position[];
  isLoading: boolean;
  onSubmit: (positionId: string, files: File[]) => void;
}

export default function ResumeAnalysisForm({
  positions,
  isLoading,
  onSubmit,
}: Props) {
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setFiles(selected);
  }

  function handleRemoveFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPositionId || files.length === 0) return;
    onSubmit(selectedPositionId, files);
  }

  const isValid = selectedPositionId !== "" && files.length > 0;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="position-select" className={styles.label}>
          Vyberte pozíciu
        </label>
        {positions.length === 0 ? (
          <p className={styles.noPositions}>
            Zatiaľ nemáte uložené žiadne pozície. Najprv vygenerujte a uložte
            pozíciu v sekcii <em>Generátor pracovnej ponuky</em>.
          </p>
        ) : (
          <select
            id="position-select"
            className={styles.select}
            value={selectedPositionId}
            onChange={(e) => setSelectedPositionId(e.target.value)}
            disabled={isLoading}
          >
            <option value="">— Vyberte pozíciu —</option>
            {positions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.title}
                {pos.seniority ? ` (${pos.seniority})` : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="cv-upload" className={styles.label}>
          Nahrajte životopisy
        </label>
        <p className={styles.hint}>
          Podporované formáty: .pdf, .txt. Môžete nahrať viacero súborov naraz
          (max. 10).
        </p>
        <input
          ref={fileInputRef}
          id="cv-upload"
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          multiple
          className={styles.fileInput}
          onChange={handleFileChange}
          disabled={isLoading}
        />

        {files.length > 0 && (
          <ul className={styles.fileList}>
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className={styles.fileItem}>
                <span className={styles.fileName}>{file.name}</span>
                <button
                  type="button"
                  className={styles.removeFile}
                  onClick={() => handleRemoveFile(i)}
                  disabled={isLoading}
                  aria-label={`Odstrániť súbor ${file.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!isValid || isLoading}
      >
        {isLoading ? "Analyzujem..." : "Analyzovať životopisy"}
      </button>
    </form>
  );
}
