"use client";

import { useRef, useState } from "react";
import { useCompany } from "@/features/company/hooks/useCompany";
import { CompanyProfile } from "@/features/company/types";
import styles from "./page.module.css";

export default function MojaFirmaPage() {
  const { profile, saveProfile } = useCompany();
  const [form, setForm] = useState<CompanyProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialise the local form once the profile loads from localStorage
  const current = form ?? profile;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setSaved(false);
    setForm((prev) => ({ ...(prev ?? profile), [e.target.name]: e.target.value }));
  }

  const [logoError, setLogoError] = useState<string | null>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError(null);
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Logo je príliš veľké. Maximálna povolená veľkosť je 2 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSaved(false);
      setForm((prev) => ({
        ...(prev ?? profile),
        logoDataUrl: reader.result as string,
      }));
    };
    reader.onerror = () => {
      setLogoError("Súbor sa nepodarilo načítať. Skúste iný súbor.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveLogo() {
    setSaved(false);
    setForm((prev) => ({ ...(prev ?? profile), logoDataUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveProfile(current);
    setSaved(true);
  }

  return (
    <>
      <h1 className={styles.title}>Moja firma</h1>
      <p className={styles.subtitle}>
        Nastavte informácie o svojej spoločnosti. Tieto údaje sa automaticky
        predvyplnia pri generovaní pracovných ponúk.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Logo */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Logo</h2>
          <div className={styles.logoRow}>
            {current.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.logoDataUrl}
                alt="Logo firmy"
                className={styles.logoPreview}
              />
            ) : (
              <div className={styles.logoPlaceholder}>Logo</div>
            )}
            <div className={styles.logoActions}>
              <label className={styles.uploadButton}>
                {current.logoDataUrl ? "Zmeniť logo" : "Nahrať logo"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className={styles.hiddenInput}
                />
              </label>
              {current.logoDataUrl && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={handleRemoveLogo}
                >
                  Odstrániť
                </button>
              )}
              <p className={styles.logoHint}>Odporúčaný formát: PNG alebo SVG, max. 2 MB</p>
              {logoError && <p className={styles.logoError}>{logoError}</p>}
            </div>
          </div>
        </section>

        {/* Basic info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Základné údaje</h2>

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Názov spoločnosti *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              value={current.name}
              onChange={handleChange}
              placeholder="napr. Acme Slovakia s.r.o."
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="industry" className={styles.label}>
                Odvetvie / sektor
              </label>
              <input
                id="industry"
                name="industry"
                type="text"
                className={styles.input}
                value={current.industry}
                onChange={handleChange}
                placeholder="napr. IT, Financie, Výroba, Zdravotníctvo"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="employeeCount" className={styles.label}>
                Počet zamestnancov
              </label>
              <select
                id="employeeCount"
                name="employeeCount"
                className={styles.select}
                value={current.employeeCount}
                onChange={handleChange}
              >
                <option value="">— vyberte —</option>
                <option value="1–10">1–10</option>
                <option value="11–50">11–50</option>
                <option value="51–200">51–200</option>
                <option value="201–500">201–500</option>
                <option value="501–1 000">501–1 000</option>
                <option value="1 001–5 000">1 001–5 000</option>
                <option value="5 000+">5 000+</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="website" className={styles.label}>
                Webová stránka
              </label>
              <input
                id="website"
                name="website"
                type="url"
                className={styles.input}
                value={current.website}
                onChange={handleChange}
                placeholder="https://www.mojastranka.sk"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="city" className={styles.label}>
                Mesto / Sídlo
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className={styles.input}
                value={current.city}
                onChange={handleChange}
                placeholder="napr. Bratislava"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="address" className={styles.label}>
              Adresa
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className={styles.input}
              value={current.address}
              onChange={handleChange}
              placeholder="napr. Obchodná 10, 811 06 Bratislava"
            />
          </div>
        </section>

        {/* Description & benefits */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Popis a benefity</h2>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Popis spoločnosti
            </label>
            <p className={styles.hint}>
              Tento text sa automaticky vloží do poľa „Informácie o firme" pri
              generovaní pracovnej ponuky.
            </p>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              value={current.description}
              onChange={handleChange}
              placeholder="napr. Sme dynamická IT firma s viac ako 10-ročnou históriou, pôsobíme v oblasti fintechu a pomáhame klientom po celej Európe..."
              rows={5}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="benefits" className={styles.label}>
              Štandardné benefity
            </label>
            <p className={styles.hint}>
              Tieto benefity sa automaticky vložia do poľa „Benefity" pri
              generovaní pracovnej ponuky.
            </p>
            <textarea
              id="benefits"
              name="benefits"
              className={styles.textarea}
              value={current.benefits}
              onChange={handleChange}
              placeholder="napr. 5 dní dovolenky navyše, home office, Multisport karta, stravovacie poukazy, teambuildingy..."
              rows={4}
            />
          </div>
        </section>

        <div className={styles.submitRow}>
          <button type="submit" className={styles.button}>
            Uložiť zmeny
          </button>
          {saved && (
            <span className={styles.savedBadge}>✓ Uložené</span>
          )}
        </div>
      </form>
    </>
  );
}
