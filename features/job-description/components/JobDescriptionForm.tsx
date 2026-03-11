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
    employmentType: "Full-time",
    language: "EN",
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
          Short role description
        </label>
        <textarea
          id="roleDescription"
          name="roleDescription"
          className={styles.textarea}
          value={formData.roleDescription}
          onChange={handleChange}
          placeholder="e.g. Frontend developer working on a SaaS product..."
          rows={4}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="seniority" className={styles.label}>
          Seniority
        </label>
        <input
          id="seniority"
          name="seniority"
          type="text"
          className={styles.input}
          value={formData.seniority}
          onChange={handleChange}
          placeholder="e.g. Junior, Mid, Senior"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="location" className={styles.label}>
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          className={styles.input}
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Bratislava, Remote"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="employmentType" className={styles.label}>
          Employment type
        </label>
        <select
          id="employmentType"
          name="employmentType"
          className={styles.select}
          value={formData.employmentType}
          onChange={handleChange}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="language" className={styles.label}>
          Language
        </label>
        <select
          id="language"
          name="language"
          className={styles.select}
          value={formData.language}
          onChange={handleChange}
        >
          <option value="SK">SK</option>
          <option value="EN">EN</option>
        </select>
      </div>

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Job Description"}
      </button>
    </form>
  );
}
