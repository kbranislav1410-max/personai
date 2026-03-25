export interface BuildCompanyDnaPromptInput {
  name: string;
  description?: string;
  industry?: string;
  benefits?: string;
  toneOfVoice?: string;
  toneOfVoiceCustom?: string;
  otherInfo?: string;
  otherGuides?: string;
}

export function buildCompanyDnaPrompt(
  input: BuildCompanyDnaPromptInput
): string {
  const {
    name,
    description,
    industry,
    benefits,
    toneOfVoice,
    toneOfVoiceCustom,
    otherInfo,
    otherGuides,
  } = input;

  const lines: string[] = [];
  lines.push(`Názov firmy: ${name}`);
  if (industry) lines.push(`Odvetvie: ${industry}`);
  if (description) lines.push(`Popis firmy: ${description}`);
  if (benefits) lines.push(`Benefity: ${benefits}`);
  if (toneOfVoice) lines.push(`Tone of voice: ${toneOfVoice}`);
  if (toneOfVoiceCustom)
    lines.push(`Doplnkový popis tone of voice: ${toneOfVoiceCustom}`);
  if (otherGuides) lines.push(`Interné materiály: ${otherGuides}`);
  if (otherInfo) lines.push(`Iné informácie: ${otherInfo}`);

  return `Si expert na employer branding a komunikačnú stratégiu firiem.

Na základe nasledujúcich informácií o firme vytvor dokument "Communication DNA firmy" v slovenskom jazyku.

Communication DNA má slúžiť ako praktický sprievodca pre recruitera pri písaní akejkoľvek komunikácie v mene firmy – pracovných ponúk, oslovovacích správ, emailov kandidátom a podobne.

## INFORMÁCIE O FIRME

${lines.join("\n")}

---

## POKYNY PRE VÝSTUP

Vytvor štruktúrovaný dokument Communication DNA, ktorý obsahuje nasledujúce časti:

1. **Hlas a osobnosť firmy** – Ako firma znie? Aká je jej "osobnosť" v komunikácii? (2–4 vety)

2. **Tón komunikácie** – Konkrétny popis tónu: formálnosť, energia, emocionálnosť, priamočiarosť. (2–4 vety alebo odrážky)

3. **Kľúčové hodnoty v komunikácii** – Aké hodnoty majú byť viditeľné v každom texte? (3–6 odrážok)

4. **Jazyk a slovník** – Aké slová, frázy a výrazy sú typické pre túto firmu? Čomu sa naopak treba vyhnúť? (odrážky)

5. **Pravidlá pre oslovovanie kandidátov** – Na „ty" alebo „vy"? Aký je odporúčaný prístup? (2–3 vety)

6. **Príklady viet** – 3–4 konkrétne príklady viet alebo nadpisov, ktoré zodpovedajú Communication DNA tejto firmy.

Píš v slovenčine. Buď konkrétny a praktický – vyhnúť sa generickým radám, ktoré by platili pre akúkoľvek firmu. Každá časť má odrážať špecifiká práve tejto spoločnosti.`;
}
