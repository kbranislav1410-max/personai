export type CandidateStatus = "zamestnani" | "zaujimavy" | "nevhodny";

export interface Candidate {
  id: string;
  /** Full name entered by the recruiter when saving (e.g. "Ján Novák") */
  name: string;
  /** Original CV filename */
  filename: string;
  /** Full AI analysis text */
  analysis: string;
  /** Suitability score returned by AI (1 = very unsuitable … 5 = very suitable) */
  score?: number;
  /** Human-readable rating label */
  ratingLabel?: string;
  /** ID of the position this candidate was evaluated for */
  positionId: string;
  /** Title of the position this candidate was evaluated for */
  positionTitle: string;
  /** ISO timestamp of when the candidate was saved */
  createdAt: string;
  /** Optional categorisation set by the recruiter */
  status?: CandidateStatus;
}
