import { JobFormData, Platform } from "@/types/job";

export const PLATFORM_PROMPTS: Record<Platform, string> = {
  profesia: `Vytvor pracovný inzerát vo formáte pre Profesia.sk. 
Profesia.sk používa nasledovnú štruktúru:
- Nadpis: Názov pozície a spoločnosť
- Miesto práce
- Druh pracovného pomeru
- Plat (ak je uvedený)
- Popis pracovnej pozície (2-3 odseky)
- Náplň práce (odrážkový zoznam, 5-8 bodov)
- Požiadavky (rozdelené na "Nevyhnutné" a "Výhodou")
- Čo ponúkame / Benefity (odrážkový zoznam)
- Kontaktná osoba a spôsob podania žiadosti
Jazyk: Slovenčina. Tón: Profesionálny, priamy.`,

  kariera: `Vytvor pracovný inzerát vo formáte pre Kariera.sk.
Kariera.sk používa nasledovnú štruktúru:
- Názov pozície (veľkými písmenami)
- O spoločnosti (krátky odsek)
- Popis pozície
- Čo budete robiť (zoznam zodpovedností)
- Čo od vás očakávame (požiadavky - povinné)
- Výhodou je (nepovinné požiadavky)
- Čo vám ponúkame (benefity)
- Informácie o pracovnom mieste (lokalita, typ, plat)
- Ako sa prihlásiť
Jazyk: Slovenčina. Tón: Moderný, inkluzívny.`,

  linkedin: `Vytvor pracovný inzerát pre LinkedIn.
LinkedIn inzeráty majú nasledovnú štruktúru:
- Krátky, chytľavý úvod (1-2 vety, ktoré zaujmú kandidáta)
- Popis spoločnosti a firemnej kultúry (2-3 vety)
- O tejto príležitosti (1 odsek)
- Čo budete robiť (zoznam 4-6 bodov)
- Čo hľadáme (zoznam požiadaviek 4-6 bodov)
- Čo ponúkame (benefity, 4-6 bodov)
- CTA (Call to Action) - ako sa prihlásiť
- Relevantné hashtagy (5-8 tagov)
Jazyk: Slovenčina (prípadne angličtina pre medzinárodné pozície). Tón: Neformálny ale profesionálny, engaging.`,

  social_media: `Vytvor krátky a pútavý príspevok pre sociálne siete (Instagram/Facebook).
Formát pre sociálne siete:
- Chytľavý začiatok/headline (1 veta, emoji)
- Krátky popis pozície (2-3 vety max)
- Kľúčové výhody/benefity (3-4 body s emoji)
- Základné požiadavky (2-3 body)
- CTA s kontaktom/odkazom
- Emojis na zvýšenie vizuálnej príťažlivosti
- Hashtagy (10-15 relevantných tagov)
Dĺžka: max 300 slov. Jazyk: Slovenčina. Tón: Dynamický, neformálny, motivujúci.`,

  career_page: `Vytvor komplexný popis pracovnej pozície pre kariérnu stránku spoločnosti.
Formát pre kariérnu stránku:
- Headline: Názov pozície
- Podnadpis: Oddelenie | Lokalita | Typ práce
- O tejto pozícii (úvodný odsek - "predajný" text, ktorý nadchne kandidáta)
- Vaša rola (popis zodpovedností vo forme príbehu + zoznam)
- Čo hľadáme (požiadavky rozdelené na must-have a nice-to-have)
- Čo vám ponúkame (detailné benefity)
- O nás (spoločnosť, kultúra, hodnoty)
- Proces náboru (kroky)
- Ako sa prihlásiť
Jazyk: Slovenčina. Tón: Inšpiratívny, firemný, detailný.`,
};

export function buildSystemPrompt(platform: Platform): string {
  return `Si skúsený HR špecialista a copywriter so špecializáciou na písanie pracovných inzerátov pre slovenský trh práce. 
Tvojou úlohou je vytvoriť profesionálny pracovný inzerát presne podľa formátu a štýlu špecifického pre danú platformu.
Inzerát musí byť v slovenčine (pokiaľ nie je požadovaná angličtina).
Použi iba informácie, ktoré sú ti poskytnuté. Ak nejaká informácia chýba, vynechaj danú sekciu alebo nahraď generickým textom.
${PLATFORM_PROMPTS[platform]}`;
}

export function buildUserPrompt(
  platform: Platform,
  formData: JobFormData
): string {
  return `Vytvor pracovný inzerát pre platformu ${platform} na základe nasledujúcich informácií:

Pozícia: ${formData.jobTitle}
Spoločnosť: ${formData.company}
Lokalita: ${formData.location}
Typ pracovného pomeru: ${formData.jobType}
Plat/Odmena: ${formData.salaryRange || "Neuvedené"}
Oddelenie: ${formData.department || "Neuvedené"}

Popis pozície:
${formData.description}

Zodpovednosti a náplň práce:
${formData.responsibilities}

Požiadavky na kandidáta:
${formData.requirements}

Výhodou je (nice to have):
${formData.niceToHave || "Neuvedené"}

Benefity a čo ponúkame:
${formData.benefits}

Popis spoločnosti:
${formData.companyDescription || "Neuvedené"}

Kontaktná osoba: ${formData.contactPerson || "Neuvedené"}
Kontaktný email: ${formData.contactEmail || "Neuvedené"}
Uzávierka prihlášok: ${formData.applicationDeadline || "Neuvedené"}`;
}
