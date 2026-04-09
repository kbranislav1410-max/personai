export type Platform =
  | "profesia"
  | "kariera"
  | "linkedin"
  | "social_media"
  | "career_page";

export interface JobFormData {
  jobTitle: string;
  company: string;
  location: string;
  jobType: string; // full-time, part-time, remote, hybrid
  salaryRange: string;
  department: string;
  description: string;
  responsibilities: string;
  requirements: string;
  niceToHave: string;
  benefits: string;
  contactPerson: string;
  contactEmail: string;
  applicationDeadline: string;
  companyDescription: string;
}

export interface GeneratedAds {
  profesia?: string;
  kariera?: string;
  linkedin?: string;
  social_media?: string;
  career_page?: string;
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  profesia: "Profesia.sk",
  kariera: "Kariera.sk",
  linkedin: "LinkedIn",
  social_media: "Sociálne siete (Instagram/Facebook)",
  career_page: "Kariérna stránka firmy",
};
