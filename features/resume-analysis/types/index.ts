export interface ResumeFile {
  /** Original file name provided by the user */
  filename: string;
  /** Plain-text content of the CV */
  text: string;
}

export interface ResumeAnalysisResult {
  filename: string;
  analysis: string;
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
