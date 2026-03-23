"use client";

import { Suspense } from "react";
import InterviewPrepContent from "./InterviewPrepContent";

export default function PripravaNaPohovorPage() {
  return (
    <Suspense>
      <InterviewPrepContent />
    </Suspense>
  );
}
