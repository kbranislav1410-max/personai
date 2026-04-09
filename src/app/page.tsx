"use client";

import { useState } from "react";
import { JobFormData, Platform, GeneratedAds } from "@/types/job";
import JobForm from "@/components/JobForm";
import PlatformSelector from "@/components/PlatformSelector";
import GeneratedAdViewer from "@/components/GeneratedAdViewer";

const defaultFormData: JobFormData = {
  jobTitle: "",
  company: "",
  location: "",
  jobType: "",
  salaryRange: "",
  department: "",
  description: "",
  responsibilities: "",
  requirements: "",
  niceToHave: "",
  benefits: "",
  contactPerson: "",
  contactEmail: "",
  applicationDeadline: "",
  companyDescription: "",
};

export default function Home() {
  const [formData, setFormData] = useState<JobFormData>(defaultFormData);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "profesia",
    "linkedin",
  ]);
  const [generatedAds, setGeneratedAds] = useState<GeneratedAds>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.jobTitle.trim() !== "" &&
      formData.company.trim() !== "" &&
      formData.location.trim() !== "" &&
      formData.jobType.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.responsibilities.trim() !== "" &&
      formData.requirements.trim() !== "" &&
      formData.benefits.trim() !== "" &&
      selectedPlatforms.length > 0
    );
  };

  const handleGenerate = async () => {
    if (!isFormValid()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedAds({});

    try {
      const response = await fetch("/api/generate-job-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, platforms: selectedPlatforms }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nepodarilo sa vygenerovať inzerát");
      }

      setGeneratedAds(data.results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nepodarilo sa vygenerovať inzerát"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setGeneratedAds({});
    setError(null);
    setSelectedPlatforms(["profesia", "linkedin"]);
  };

  const hasResults = Object.keys(generatedAds).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PersonAI</h1>
              <p className="text-xs text-gray-500">
                Generátor pracovných inzerátov
              </p>
            </div>
          </div>
          {hasResults && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Nový inzerát
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`grid gap-8 ${
            hasResults
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 max-w-3xl mx-auto"
          }`}
        >
          {/* Left column – form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <PlatformSelector
                selected={selectedPlatforms}
                onChange={setSelectedPlatforms}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <JobForm formData={formData} onChange={handleFormChange} />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                <strong>Chyba:</strong> {error}
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!isFormValid() || isLoading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all ${
                isFormValid() && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generujem inzeráty…
                </span>
              ) : (
                `✨ Vygenerovať inzeráty (${selectedPlatforms.length} platforma${selectedPlatforms.length > 1 ? "y" : ""})`
              )}
            </button>

            {!isFormValid() && !isLoading && (
              <p className="text-center text-xs text-gray-400">
                Vyplňte všetky povinné polia (*) a vyberte aspoň jednu platformu
              </p>
            )}
          </div>

          {/* Right column – results */}
          {hasResults && (
            <div className="sticky top-24 h-fit">
              <GeneratedAdViewer
                ads={generatedAds}
                platforms={selectedPlatforms}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
