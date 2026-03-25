export interface AttachedResume {
  /** Auto-generated unique candidate ID */
  id: string;
  /** Original CV filename */
  filename: string;
  /** ISO timestamp of when the CV was attached */
  attachedAt: string;
}

export interface Position {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  seniority?: string;
  location?: string;
  employmentType?: string;
  /** CVs pre-attached to this position (metadata only; actual files are in-memory) */
  attachedResumes?: AttachedResume[];
}
