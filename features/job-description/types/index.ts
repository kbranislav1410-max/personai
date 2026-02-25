export interface JobDescriptionFormData {
  roleDescription: string;
  seniority: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Freelance";
  language: "SK" | "EN";
}

export interface JobDescriptionResult {
  content: string;
}
