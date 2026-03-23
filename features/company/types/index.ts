export interface CompanyProfile {
  name: string;
  logoDataUrl: string;
  description: string;
  industry: string;
  employeeCount: string;
  website: string;
  address: string;
  city: string;
  benefits: string;
}

export const EMPTY_COMPANY_PROFILE: CompanyProfile = {
  name: "",
  logoDataUrl: "",
  description: "",
  industry: "",
  employeeCount: "",
  website: "",
  address: "",
  city: "",
  benefits: "",
};
