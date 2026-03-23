export interface JobDescriptionFormData {
  roleDescription: string;
  seniority: string;
  location: string;
  employmentType: string;
  benefits: string;
  companyInfo: string;
  salary: string;
  languageSkills: string;
  driverLicense: string;
  certificates: string;
  education: string;
  language: "SK" | "EN";
  toneOfVoice?: string;
  toneOfVoiceCustom?: string;
}

export interface JobDescriptionResult {
  content: string;
}
