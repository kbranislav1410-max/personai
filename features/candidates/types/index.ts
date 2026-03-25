export type CandidateStatus = "zamestnani" | "zaujimavy" | "nevhodny";

export type ActivityEventType = "saved" | "status_changed" | "interview_prepared";

export interface ActivityEvent {
  type: ActivityEventType;
  timestamp: string;
  /** Optional human-readable note describing what happened */
  note?: string;
}

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
  /** Chronological log of notable events for this candidate */
  activityLog?: ActivityEvent[];
  /**
   * Base64 data URL of the original CV file (e.g. "data:application/pdf;base64,…").
   * Set at save-time from the File object so it can be opened/downloaded later.
   * Optional – candidates saved before this field existed will not have it.
   */
  cvDataUrl?: string;
  /** Contact details extracted from the CV by the AI */
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}
