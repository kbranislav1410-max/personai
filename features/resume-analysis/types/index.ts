export interface ResumeFile {
  /** Original file name provided by the user */
  filename: string;
  /** Plain-text content of the CV */
  text: string;
}

export type SuitabilityScore = 1 | 2 | 3 | 4 | 5;

export interface ResumeAnalysisResult {
  filename: string;
  analysis: string;
  /** Suitability score: 5 = very suitable … 1 = very unsuitable */
  score: SuitabilityScore;
  /** Human-readable label derived from score */
  ratingLabel: string;
  /** Contact details extracted from the CV by the AI */
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export interface AnalyzeResumesRequest {
  positionId: string;
  positionTitle: string;
  positionContent: string;
  files: File[];
}

export interface AnalyzeResumesResponse {
  results: ResumeAnalysisResult[];
}
