"use client";

import { useState } from "react";
import {
  JobDescriptionFormData,
  LanguageSkill,
  POSITION_TEMPLATES,
  SENIORITY_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  LANGUAGE_OPTIONS,
  LANGUAGE_LEVEL_OPTIONS,
  DRIVER_LICENSE_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  EDUCATION_FIELD_OPTIONS,
} from "../types";
import styles from "./JobDescriptionForm.module.css";

interface Props {
  onSubmit: (data: JobDescriptionFormData) => void;
  isLoading: boolean;
  initialData?: Partial<JobDescriptionFormData>;
}

const DEFAULT_FORM: JobDescriptionFormData = {
  positionTemplate: "",
  positionCustom: "",
  jobContent: "",
  seniority: "",
  teamSize: "",
  teamType: "",
  teamAverageAge: "",
  positionGoal: "",
  whyApply: "",
  mustHave: "",
  niceToHave: "",
  location: "",
  employmentType: EMPLOYMENT_TYPE_OPTIONS[0],
  salary: "",
  languageSkills: [],
  driverLicense: DRIVER_LICENSE_OPTIONS[0],
  certificates: [],
  educationRequired: false,
  educationLevel: "",
  educationFields: [],
  language: "SK",
  benefits: "",
  companyInfo: "",
  toneOfVoice: "",
  toneOfVoiceCustom: "",
  roleDescription: "",
};

export default function JobDescriptionForm({ onSubmit, isLoading, initialData }: Props) {
  const [form, setForm] = useState<JobDescriptionFormData>({
    ...DEFAULT_FORM,
    ...initialData,
  });

  // ── Generic field handler ────────────────────────────────────────────────
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ── Language skills ──────────────────────────────────────────────────────
  function addLanguage() {
    setForm((prev) => ({
      ...prev,
      languageSkills: [
        ...prev.languageSkills,
        { language: "Angličtina", level: "B2 – Vyššia stredná" },
      ],
    }));
  }

  function updateLanguage(index: number, field: keyof LanguageSkill, value: string) {
    setForm((prev) => ({
      ...prev,
      languageSkills: prev.languageSkills.map((ls, i) =>
        i === index ? { ...ls, [field]: value } : ls
      ),
    }));
  }

  function removeLanguage(index: number) {
    setForm((prev) => ({
      ...prev,
      languageSkills: prev.languageSkills.filter((_, i) => i !== index),
    }));
  }

  // ── Certificates ─────────────────────────────────────────────────────────
  function addCertificate() {
    setForm((prev) => ({ ...prev, certificates: [...prev.certificates, ""] }));
  }

  function updateCertificate(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      certificates: prev.certificates.map((c, i) => (i === index ? value : c)),
    }));
  }

  function removeCertificate(index: number) {
    setForm((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  }

  // ── Education fields ──────────────────────────────────────────────────────
  function addEducationField() {
    setForm((prev) => ({
      ...prev,
      educationFields: [...prev.educationFields, EDUCATION_FIELD_OPTIONS[0]],
    }));
  }

  function updateEducationField(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      educationFields: prev.educationFields.map((f, i) =>
        i === index ? value : f
      ),
    }));
  }

  function removeEducationField(index: number) {
    setForm((prev) => ({
      ...prev,
      educationFields: prev.educationFields.filter((_, i) => i !== index),
    }));
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Build roleDescription for prompt builder backward compat
    const positionName =
      form.positionTemplate === "Vlastná pozícia..."
        ? form.positionCustom
        : form.positionTemplate;
    const roleDescription = [positionName, form.jobContent].filter(Boolean).join(" – ");
    onSubmit({ ...form, roleDescription });
  }

  const isCustomPosition = form.positionTemplate === "Vlastná pozícia...";

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      {/* ═══════════════════════════════════════════════════════════════════
          SEKCIA 1 – Pozícia
      ═══════════════════════════════════════════════════════════════════ */}
      <div className={styles.sectionHeader}>Pozícia</div>

      {/* Pozícia – dropdown + custom */}
      <div className={styles.field}>
        <label htmlFor="positionTemplate" className={styles.label}>
          Pozícia <span className={styles.required}>*</span>
        </label>
        <select
          id="positionTemplate"
          name="positionTemplate"
          className={styles.select}
          value={form.positionTemplate}
          onChange={handleChange}
          required
        >
          <option value="">— vyberte pozíciu —</option>
          {POSITION_TEMPLATES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {isCustomPosition && (
        <div className={styles.field}>
          <label htmlFor="positionCustom" className={styles.label}>
            Názov pozície <span className={styles.required}>*</span>
          </label>
          <input
            id="positionCustom"
            name="positionCustom"
            type="text"
            className={styles.input}
            value={form.positionCustom}
            onChange={handleChange}
            placeholder="napr. Growth Hacker, Customer Success Manager..."
            required={isCustomPosition}
          />
        </div>
      )}

      {/* Náplň práce */}
      <div className={styles.field}>
        <label htmlFor="jobContent" className={styles.label}>
          Náplň práce <span className={styles.required}>*</span>
        </label>
        <p className={styles.hint}>Opíšte krátko, čo bude zamestnanec robiť a na čom pracovať.</p>
        <textarea
          id="jobContent"
          name="jobContent"
          className={styles.textarea}
          value={form.jobContent}
          onChange={handleChange}
          placeholder="napr. Bude zodpovedný za vývoj a údržbu frontendovej časti nášho SaaS produktu, spoluprácu s UX tímom a code review..."
          rows={4}
          required
        />
      </div>

      {/* Seniorita */}
      <div className={styles.field}>
        <label htmlFor="seniority" className={styles.label}>
          Seniorita <span className={styles.required}>*</span>
        </label>
        <select
          id="seniority"
          name="seniority"
          className={styles.select}
          value={form.seniority}
          onChange={handleChange}
          required
        >
          <option value="">— vyberte —</option>
          {SENIORITY_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Tím */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.fieldsetLegend}>Tím</legend>
        <div className={styles.row3}>
          <div className={styles.field}>
            <label htmlFor="teamSize" className={styles.label}>Veľkosť tímu</label>
            <input
              id="teamSize"
              name="teamSize"
              type="text"
              className={styles.input}
              value={form.teamSize}
              onChange={handleChange}
              placeholder="napr. 6 ľudí"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="teamType" className={styles.label}>Typ tímu</label>
            <input
              id="teamType"
              name="teamType"
              type="text"
              className={styles.input}
              value={form.teamType}
              onChange={handleChange}
              placeholder="napr. cross-functional, produktový..."
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="teamAverageAge" className={styles.label}>Priemerný vek</label>
            <input
              id="teamAverageAge"
              name="teamAverageAge"
              type="text"
              className={styles.input}
              value={form.teamAverageAge}
              onChange={handleChange}
              placeholder="napr. 28 rokov"
            />
          </div>
        </div>
      </fieldset>

      {/* Cieľ pozície */}
      <div className={styles.field}>
        <label htmlFor="positionGoal" className={styles.label}>Cieľ pozície</label>
        <p className={styles.hint}>Aký cieľ má zamestnanec na najbližších 3–6 mesiacov?</p>
        <textarea
          id="positionGoal"
          name="positionGoal"
          className={styles.textarea}
          value={form.positionGoal}
          onChange={handleChange}
          placeholder="napr. Prevziať ownership nad modulom platobnej brány, dotiahnuť migráciu na novú architektúru a zaškoliť dvoch junior vývojárov."
          rows={3}
        />
      </div>

      {/* Prečo by mal chcieť uchádzač túto pozíciu */}
      <div className={styles.field}>
        <label htmlFor="whyApply" className={styles.label}>Prečo by mal chcieť uchádzač túto pozíciu</label>
        <textarea
          id="whyApply"
          name="whyApply"
          className={styles.textarea}
          value={form.whyApply}
          onChange={handleChange}
          placeholder="napr. Práca na produkte s medzinárodným dosahom, veľká miera autonómie, rast a mentoring od skúsených kolegov..."
          rows={3}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SEKCIA 2 – Požiadavky
      ═══════════════════════════════════════════════════════════════════ */}
      <div className={styles.divider} />
      <div className={styles.sectionHeader}>Požiadavky</div>

      <div className={styles.field}>
        <label htmlFor="mustHave" className={styles.label}>
          Must-have požiadavky <span className={styles.required}>*</span>
        </label>
        <p className={styles.hint}>Povinné zručnosti, skúsenosti alebo vlastnosti. Každá na nový riadok.</p>
        <textarea
          id="mustHave"
          name="mustHave"
          className={styles.textarea}
          value={form.mustHave}
          onChange={handleChange}
          placeholder={"napr.\n3+ roky skúseností s React\nZnalosť TypeScript\nSkúsenosti s REST API"}
          rows={5}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="niceToHave" className={styles.label}>Nice-to-have požiadavky</label>
        <p className={styles.hint}>Vítané, ale nie povinné. Každá na nový riadok.</p>
        <textarea
          id="niceToHave"
          name="niceToHave"
          className={styles.textarea}
          value={form.niceToHave}
          onChange={handleChange}
          placeholder={"napr.\nSkúsenosti s Next.js\nZnalosť GraphQL\nOpen-source príspevky"}
          rows={4}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SEKCIA 3 – Podmienky
      ═══════════════════════════════════════════════════════════════════ */}
      <div className={styles.divider} />
      <div className={styles.sectionHeader}>Podmienky</div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="location" className={styles.label}>
            Lokalita <span className={styles.required}>*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className={styles.input}
            value={form.location}
            onChange={handleChange}
            placeholder="napr. Bratislava, Remote, Hybrid"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="employmentType" className={styles.label}>Typ pracovného pomeru</label>
          <select
            id="employmentType"
            name="employmentType"
            className={styles.select}
            value={form.employmentType}
            onChange={handleChange}
          >
            {EMPLOYMENT_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="salary" className={styles.label}>Mzda</label>
        <input
          id="salary"
          name="salary"
          type="text"
          className={styles.input}
          value={form.salary}
          onChange={handleChange}
          placeholder="napr. 2 000 – 3 000 € brutto, fixná mzda + bonusy"
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SEKCIA 4 – Ďalšie požiadavky
      ═══════════════════════════════════════════════════════════════════ */}
      <div className={styles.divider} />
      <div className={styles.sectionHeader}>Ďalšie požiadavky</div>

      {/* Jazyky */}
      <div className={styles.field}>
        <label className={styles.label}>Jazykové zručnosti</label>
        <div className={styles.dynamicList}>
          {form.languageSkills.map((ls, i) => (
            <div key={i} className={styles.dynamicRow}>
              <select
                className={styles.dynamicSelect}
                value={ls.language}
                onChange={(e) => updateLanguage(i, "language", e.target.value)}
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <select
                className={styles.dynamicSelect}
                value={ls.level}
                onChange={(e) => updateLanguage(i, "level", e.target.value)}
              >
                {LANGUAGE_LEVEL_OPTIONS.map((lv) => (
                  <option key={lv} value={lv}>
                    {lv}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeLanguage(i)}
                aria-label="Odstrániť"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" className={styles.addBtn} onClick={addLanguage}>
          + Pridať jazyk
        </button>
      </div>

      {/* Vodičský preukaz */}
      <div className={styles.field}>
        <label htmlFor="driverLicense" className={styles.label}>Vodičský preukaz</label>
        <select
          id="driverLicense"
          name="driverLicense"
          className={styles.select}
          value={form.driverLicense}
          onChange={handleChange}
        >
          {DRIVER_LICENSE_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Certifikáty a školenia */}
      <div className={styles.field}>
        <label className={styles.label}>Certifikáty a školenia</label>
        <div className={styles.dynamicList}>
          {form.certificates.map((cert, i) => (
            <div key={i} className={styles.dynamicRow}>
              <input
                type="text"
                className={styles.dynamicInput}
                value={cert}
                onChange={(e) => updateCertificate(i, e.target.value)}
                placeholder="napr. AWS Certified Solutions Architect, PMP..."
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeCertificate(i)}
                aria-label="Odstrániť"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" className={styles.addBtn} onClick={addCertificate}>
          + Pridať certifikát / školenie
        </button>
      </div>

      {/* Vzdelanie */}
      <div className={styles.field}>
        <label className={styles.label}>Vzdelanie</label>
        <div className={styles.toggleRow}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${!form.educationRequired ? styles.toggleBtnActive : ""}`}
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                educationRequired: false,
                educationLevel: "",
                educationFields: [],
              }))
            }
          >
            Nie je požiadavka
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${form.educationRequired ? styles.toggleBtnActive : ""}`}
            onClick={() =>
              setForm((prev) => ({ ...prev, educationRequired: true }))
            }
          >
            Je požiadavka
          </button>
        </div>

        {form.educationRequired && (
          <div className={styles.educationDetails}>
            <div className={styles.field}>
              <label htmlFor="educationLevel" className={styles.label}>
                Minimálna úroveň vzdelania
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                className={styles.select}
                value={form.educationLevel}
                onChange={handleChange}
              >
                <option value="">— vyberte úroveň —</option>
                {EDUCATION_LEVEL_OPTIONS.map((lv) => (
                  <option key={lv} value={lv}>
                    {lv}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Odbor / zameranie</label>
              <div className={styles.dynamicList}>
                {form.educationFields.map((ef, i) => (
                  <div key={i} className={styles.dynamicRow}>
                    <select
                      className={styles.dynamicSelect}
                      value={ef}
                      onChange={(e) => updateEducationField(i, e.target.value)}
                    >
                      {EDUCATION_FIELD_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeEducationField(i)}
                      aria-label="Odstrániť"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={styles.addBtn}
                onClick={addEducationField}
              >
                + Pridať odbor
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          Jazyk výstupu (always visible)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className={styles.divider} />

      <div className={styles.field}>
        <label htmlFor="language" className={styles.label}>Jazyk výstupu</label>
        <select
          id="language"
          name="language"
          className={styles.select}
          value={form.language}
          onChange={handleChange}
          style={{ maxWidth: 220 }}
        >
          <option value="SK">Slovenčina</option>
          <option value="EN">Angličtina</option>
        </select>
      </div>

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? "Generuje sa..." : "Generovať pracovnú ponuku"}
      </button>
    </form>
  );
}
