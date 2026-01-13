-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CandidateScore" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analysisRunId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "recommendation" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "gaps" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "CandidateScore_analysisRunId_fkey" FOREIGN KEY ("analysisRunId") REFERENCES "AnalysisRun" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CandidateScore_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CandidateScore" ("analysisRunId", "candidateId", "gaps", "id", "recommendation", "score", "strengths", "summary") SELECT "analysisRunId", "candidateId", "gaps", "id", "recommendation", "score", "strengths", "summary" FROM "CandidateScore";
DROP TABLE "CandidateScore";
ALTER TABLE "new_CandidateScore" RENAME TO "CandidateScore";
CREATE INDEX "CandidateScore_analysisRunId_idx" ON "CandidateScore"("analysisRunId");
CREATE INDEX "CandidateScore_candidateId_idx" ON "CandidateScore"("candidateId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
