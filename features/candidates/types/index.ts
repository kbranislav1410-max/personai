export type CandidateStatus = "zamestnani" | "zaujimavy" | "nevhodny";

export interface Candidate {
  id: string;
  /** Original CV filename */
  filename: string;
  /** Full AI analysis text */
  analysis: string;
  /** ID of the position this candidate was evaluated for */
  positionId: string;
  /** Title of the position this candidate was evaluated for */
  positionTitle: string;
  /** ISO timestamp of when the candidate was saved */
  createdAt: string;
  /** Optional categorisation set by the recruiter */
  status?: CandidateStatus;
}
