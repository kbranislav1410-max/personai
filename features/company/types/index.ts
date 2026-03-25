export type SocialNetwork =
  | "LinkedIn"
  | "Facebook"
  | "Instagram"
  | "Twitter / X"
  | "YouTube"
  | "TikTok"
  | "GitHub"
  | "Pinterest";

export const SOCIAL_NETWORKS: SocialNetwork[] = [
  "LinkedIn",
  "Facebook",
  "Instagram",
  "Twitter / X",
  "YouTube",
  "TikTok",
  "GitHub",
  "Pinterest",
];

export const INDUSTRIES = [
  "IT / Technológie",
  "Financie a bankovníctvo",
  "Zdravotníctvo a farmácia",
  "Výroba a priemysel",
  "Obchod a retail",
  "Logistika a doprava",
  "Stavebníctvo a nehnuteľnosti",
  "Vzdelávanie a veda",
  "Médiá a marketing",
  "Energetika a životné prostredie",
  "Potravinárstvo a gastronómia",
  "Telekomunikácie",
  "Poisťovníctvo",
  "Verejný sektor a štátna správa",
  "Iné",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const TONE_OF_VOICE_OPTIONS = [
  "Profesionálny a formálny",
  "Priateľský a neformálny",
  "Inšpiratívny a motivačný",
  "Moderný a dynamický",
  "Konzervatívny a tradičný",
  "Technický a odborný",
] as const;

export type ToneOfVoice = (typeof TONE_OF_VOICE_OPTIONS)[number];

export interface SocialLink {
  network: SocialNetwork;
  url: string;
}

export interface CompanyProfile {
  // Required
  name: string;
  description: string;
  industry: Industry | "";
  benefits: string;
  toneOfVoice: ToneOfVoice | "";
  toneOfVoiceCustom: string;

  // Optional
  logoDataUrl: string;
  website: string;
  socialLinks: SocialLink[];
  careerPage: string;
  brandManualDataUrl: string;
  brandManualName: string;
  otherGuides: string;
  otherInfo: string;

  // AI-generated
  communicationDna: string;
}

export const EMPTY_COMPANY_PROFILE: CompanyProfile = {
  name: "",
  description: "",
  industry: "",
  benefits: "",
  toneOfVoice: "",
  toneOfVoiceCustom: "",
  logoDataUrl: "",
  website: "",
  socialLinks: [],
  careerPage: "",
  brandManualDataUrl: "",
  brandManualName: "",
  otherGuides: "",
  otherInfo: "",
  communicationDna: "",
};

