"use client";

import { useState } from "react";
import JobDescriptionForm from "./JobDescriptionForm";
import JobDescriptionResult from "./JobDescriptionResult";
import { generateJobDescription } from "../services/generateJobDescription";
import { JobDescriptionFormData } from "../types";

export default function JobDescriptionGenerator() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: JobDescriptionFormData) {
    setIsLoading(true);
    setError(null);
    setResult(null);
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

  return (
    <>
      <JobDescriptionForm onSubmit={handleSubmit} isLoading={isLoading} />
      <JobDescriptionResult
        result={result}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
