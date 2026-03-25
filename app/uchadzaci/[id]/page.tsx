"use client";

import { Suspense } from "react";
import CandidateDetailContent from "./CandidateDetailContent";

export default function CandidateDetailPage() {
  return (
    <Suspense>
      <CandidateDetailContent />
    </Suspense>
  );
}
