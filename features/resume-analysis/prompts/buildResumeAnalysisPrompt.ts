import { ResumeFile } from "../types";

/**
 * Builds a prompt that instructs the AI to evaluate a single CV against
 * the provided job position description.
 */
export function buildResumeAnalysisPrompt(
  positionTitle: string,
  positionContent: string,
  resume: ResumeFile
): string {
  return `Si skúsený personalista. Tvoja úloha je posúdiť životopis uchádzača vzhľadom na konkrétnu pracovnú pozíciu.

## Pracovná pozícia: ${positionTitle}

${positionContent}

---

## Životopis uchádzača (súbor: ${resume.filename})

${resume.text}

---

## Pokyny pre analýzu

Vykonaj dôkladnú analýzu životopisu voči požiadavkám pozície. Svoju odpoveď štruktúruj nasledovne:

### 1. Celkové hodnotenie
Krátke zhrnutie (2–3 vety) – vhodnosť kandidáta pre danú pozíciu.

### 2. Zhoda s požiadavkami
Uveď, ktoré kľúčové požiadavky pozície kandidát spĺňa a ktoré nespĺňa.

### 3. Silné stránky
Zoznam hlavných silných stránok kandidáta vo vzťahu k pozícii.

### 4. Slabé stránky / chýbajúce kompetencie
Zoznam oblastí, v ktorých kandidát nespĺňa požiadavky alebo mu chýbajú skúsenosti.

### 5. Odporúčanie
Jednoznačné odporúčanie: **Odporúčam pozvať na pohovor** / **Neodporúčam** / **Zvážiť s výhradami** – s krátkym zdôvodnením.

Odpoveď píš v slovenčine.`;
}
