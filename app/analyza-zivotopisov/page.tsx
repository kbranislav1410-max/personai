"use client";

import { useState } from "react";
import { usePositions } from "@/features/positions/hooks/usePositions";
import { analyzeResumesClient } from "@/features/resume-analysis/services/analyzeResumesClient";
import { ResumeAnalysisResult as AnalysisResult } from "@/features/resume-analysis/types";
import ResumeAnalysisForm from "@/features/resume-analysis/components/ResumeAnalysisForm";
import ResumeAnalysisResult from "@/features/resume-analysis/components/ResumeAnalysisResult";
import styles from "./page.module.css";

export default function AnalyzaZivotopisovPage() {
  const { positions } = usePositions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [currentPosition, setCurrentPosition] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  async function handleSubmit(positionId: string, files: File[]) {
    const position = positions.find((p) => p.id === positionId);
    if (!position) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setCurrentPosition({ id: position.id, title: position.title });
    setUploadedFiles(files);

    try {
      const response = await analyzeResumesClient({
        positionId: position.id,
        positionTitle: position.title,
        positionContent: position.content,
        files,
      });

      setResults(response.results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Niečo sa pokazilo. Skúste to znova."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className={styles.title}>Analýza životopisov</h1>
      <p className={styles.description}>
        Vyberte pozíciu a nahrajte životopisy uchádzačov. AI vyhodnotí každý
        životopis voči požiadavkám vybranej pozície.
      </p>

      <ResumeAnalysisForm
        positions={positions}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />

      <ResumeAnalysisResult
        results={results}
        isLoading={isLoading}
        error={error}
        positionId={currentPosition?.id}
        positionTitle={currentPosition?.title}
        files={uploadedFiles}
      />
    </>
  );
}
