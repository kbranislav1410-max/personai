"use client";

import { useState } from "react";
import JobDescriptionForm from "./JobDescriptionForm";
import JobDescriptionResult from "./JobDescriptionResult";
import { generateJobDescription } from "../services/generateJobDescription";
import { JobDescriptionFormData } from "../types";
import { usePositions } from "@/features/positions/hooks/usePositions";
import { useCompany } from "@/features/company/hooks/useCompany";

export default function JobDescriptionGenerator() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFormData, setLastFormData] = useState<JobDescriptionFormData | null>(null);
  const { addPosition } = usePositions();
  const { profile } = useCompany();

  const companyInitialData: Partial<JobDescriptionFormData> = {
    ...(profile.description ? { companyInfo: profile.description } : {}),
    ...(profile.benefits ? { benefits: profile.benefits } : {}),
  };

  async function handleSubmit(data: JobDescriptionFormData) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastFormData(data);
    try {
      const response = await generateJobDescription(data);
      setResult(response.content);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Niečo sa pokazilo. Skúste to znova."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSave(title: string) {
    if (!result) return;
    addPosition(title, result, {
      seniority: lastFormData?.seniority,
      location: lastFormData?.location,
      employmentType: lastFormData?.employmentType,
    });
  }

  const suggestedTitle = lastFormData
    ? [lastFormData.seniority, lastFormData.roleDescription.slice(0, 50)]
        .filter(Boolean)
        .join(" – ")
    : undefined;

  return (
    <>
      <JobDescriptionForm onSubmit={handleSubmit} isLoading={isLoading} initialData={companyInitialData} />
      <JobDescriptionResult
        result={result}
        isLoading={isLoading}
        error={error}
        saveMeta={
          result
            ? {
                seniority: lastFormData?.seniority,
                location: lastFormData?.location,
                employmentType: lastFormData?.employmentType,
                suggestedTitle,
              }
            : undefined
        }
        onSave={result ? handleSave : undefined}
      />
    </>
  );
}
