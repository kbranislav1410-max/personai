/**
 * Builds a prompt that instructs the AI to generate a complete interview
 * preparation guide for a specific candidate and position.
 */
export function buildInterviewPrepPrompt(
  positionTitle: string,
  candidateFilename: string,
  candidateAnalysis: string
): string {
  return `Si skúsený personalista. Pripravuješ pohovor s konkrétnym uchádzačom na pozíciu ${positionTitle}.

## Analýza uchádzača (súbor: ${candidateFilename})

${candidateAnalysis}

---

## Tvoja úloha

Na základe analýzy uchádzača vytvor kompletnú prípravu na pohovor. Štruktúruj ju nasledovne:

### 1. Zhrnutie uchádzača
Stručné zhrnutie kto je uchádzač, jeho hlavné silné stránky a oblasti, ktoré treba overiť na pohovore.

### 2. Odporúčaná štruktúra pohovoru
Navrhni postup pohovoru vrátane časového rozloženia (napr. predstavenie firmy, otázky na skúsenosti, technické otázky, priestor pre otázky kandidáta).

### 3. Kľúčové otázky na overenie kompetencií
Minimálne 8–10 konkrétnych otázok zameraných na overenie kompetencií a skúseností dôležitých pre túto pozíciu. Pre každú otázku uveď, čo ňou overuješ.

### 4. Otázky na overenie slabých stránok
3–5 otázok cielene zameraných na oblasti, kde analýza odhalila nedostatky alebo nejasnosti v životopise uchádzača.

### 5. Situačné a behaviorálne otázky
5 otázok vo formáte STAR (Situation, Task, Action, Result) prispôsobených tejto pozícii.

### 6. Praktické úlohy / case study (voliteľné)
Ak je to relevantné pre pozíciu, navrhni 1–2 praktické zadania alebo prípadové štúdie, ktoré môžeš uchádzačovi zadať počas alebo po pohovore.

### 7. Červené vlajky
Upozornenia na potenciálne riziká alebo veci, ktorým treba venovať pozornosť počas pohovoru.

### 8. Odporúčané otázky, ktoré môže položiť kandidát
2–3 príklady dobrých otázok, ktoré by mal kandidát položiť, ak má o pozíciu skutočný záujem.

Odpoveď píš v slovenčine. Buď konkrétny a praktický – cieľom je, aby mal personalista všetko pripravené na vedenie profesionálneho pohovoru.`;
}
