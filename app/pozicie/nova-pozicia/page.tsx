"use client";

import { useState } from "react";
import JobDescriptionGenerator from "@/features/job-description/components/JobDescriptionGenerator";
import ManualJobDescriptionForm from "@/features/job-description/components/ManualJobDescriptionForm";
import styles from "./page.module.css";

type Mode = "ai" | "manual";

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: "ai", label: "Vygenerovať pomocou AI", icon: "✨" },
  { id: "manual", label: "Pridať vlastný", icon: "✏️" },
];

export default function NovaPoziciaPage() {
  const [mode, setMode] = useState<Mode>("ai");

  return (
    <>
      <h1 className={styles.title}>Nová pozícia</h1>

      <div className={styles.modeBar} role="tablist" aria-label="Spôsob vytvorenia pozície">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            className={`${styles.modeTab} ${mode === m.id ? styles.modeTabActive : ""}`}
            onClick={() => setMode(m.id)}
          >
            <span aria-hidden="true">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {mode === "ai" ? <JobDescriptionGenerator /> : <ManualJobDescriptionForm />}
    </>
  );
}
