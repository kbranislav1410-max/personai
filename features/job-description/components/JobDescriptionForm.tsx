"use client";

import { useState } from "react";
import { JobDescriptionFormData } from "../types";
import styles from "./JobDescriptionForm.module.css";

interface Props {
  onSubmit: (data: JobDescriptionFormData) => void;
  isLoading: boolean;
}

export default function JobDescriptionForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState<JobDescriptionFormData>({
    roleDescription: "",
    seniority: "",
    location: "",
    employmentType: "Plný úväzok",
    benefits: "",
    companyInfo: "",
    salary: "",
    languageSkills: "",
    driverLicense: "",
    certificates: "",
    education: "",
    language: "SK",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="roleDescription" className={styles.label}>
          Krátky popis pozície *
        </label>
        <textarea
          id="roleDescription"
          name="roleDescription"
          className={styles.textarea}
          value={formData.roleDescription}
          onChange={handleChange}
          placeholder="napr. Frontend developer pracujúci na SaaS produkte v oblasti fintechu..."
          rows={4}
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="seniority" className={styles.label}>
            Seniorita uchádzača *
          </label>
          <input
            id="seniority"
            name="seniority"
            type="text"
            className={styles.input}
            value={formData.seniority}
            onChange={handleChange}
            placeholder="napr. Junior, Mid, Senior"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="location" className={styles.label}>
            Lokalita *
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className={styles.input}
            value={formData.location}
            onChange={handleChange}
            placeholder="napr. Bratislava, Remote, Hybrid"
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="employmentType" className={styles.label}>
            Typ pracovného pomeru
          </label>
          <select
            id="employmentType"
            name="employmentType"
            className={styles.select}
            value={formData.employmentType}
            onChange={handleChange}
          >
            <option value="Plný úväzok">Plný úväzok</option>
            <option value="Čiastočný úväzok">Čiastočný úväzok</option>
            <option value="Kontrakt">Kontrakt</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="education" className={styles.label}>
            Potrebné vzdelanie
          </label>
          <input
            id="education"
            name="education"
            type="text"
            className={styles.input}
            value={formData.education}
            onChange={handleChange}
            placeholder="napr. VŠ technického smeru, SŠ s maturitou"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="companyInfo" className={styles.label}>
          Informácie o firme
        </label>
        <textarea
          id="companyInfo"
          name="companyInfo"
          className={styles.textarea}
          value={formData.companyInfo}
          onChange={handleChange}
          placeholder="napr. Sme dynamická IT firma s 50+ zamestnancami, pôsobíme v oblasti fintechu..."
          rows={3}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="salary" className={styles.label}>
          Ponúkaná mzda a spôsob odmeňovania
        </label>
        <input
          id="salary"
          name="salary"
          type="text"
          className={styles.input}
          value={formData.salary}
          onChange={handleChange}
          placeholder="napr. 2 000 – 3 000 € brutto, fixná mzda + bonusy"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="benefits" className={styles.label}>
          Benefity
        </label>
        <textarea
          id="benefits"
          name="benefits"
          className={styles.textarea}
          value={formData.benefits}
          onChange={handleChange}
          placeholder="napr. 5 dní dovolenky navyše, home office, stravovacie poukazy, Multisport karta..."
          rows={3}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="languageSkills" className={styles.label}>
          Jazykové zručnosti
        </label>
        <input
          id="languageSkills"
          name="languageSkills"
          type="text"
          className={styles.input}
          value={formData.languageSkills}
          onChange={handleChange}
          placeholder="napr. anglický jazyk – pokročilý (B2+), slovenčina – materinský"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="driverLicense" className={styles.label}>
            Vodičský preukaz
          </label>
          <input
            id="driverLicense"
            name="driverLicense"
            type="text"
            className={styles.input}
            value={formData.driverLicense}
            onChange={handleChange}
            placeholder="napr. skupina B, nie je podmienkou"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="language" className={styles.label}>
            Jazyk výstupu
          </label>
          <select
            id="language"
            name="language"
            className={styles.select}
            value={formData.language}
            onChange={handleChange}
          >
            <option value="SK">Slovenčina</option>
            <option value="EN">Angličtina</option>
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="certificates" className={styles.label}>
          Iné potrebné certifikáty, školenia a podobné
        </label>
        <textarea
          id="certificates"
          name="certificates"
          className={styles.textarea}
          value={formData.certificates}
          onChange={handleChange}
          placeholder="napr. CISCO certifikácia, projektové riadenie (PMP), bezpečnostná previerka NBÚ..."
          rows={3}
        />
      </div>

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? "Generuje sa..." : "Generovať pracovnú ponuku"}
      </button>
    </form>
  );
}
