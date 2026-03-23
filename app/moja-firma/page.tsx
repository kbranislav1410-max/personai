"use client";

import { useRef, useState } from "react";
import { useCompany } from "@/features/company/hooks/useCompany";
import {
  CompanyProfile,
  INDUSTRIES,
  SOCIAL_NETWORKS,
  TONE_OF_VOICE_OPTIONS,
  SocialLink,
  SocialNetwork,
} from "@/features/company/types";
import styles from "./page.module.css";

export default function MojaFirmaPage() {
  const { profile, saveProfile } = useCompany();
  const [form, setForm] = useState<CompanyProfile | null>(null);
  const [saved, setSaved] = useState(false);

  const logoRef = useRef<HTMLInputElement>(null);
  const brandRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [brandError, setBrandError] = useState<string | null>(null);

  const current: CompanyProfile = form ?? profile;

  // ── Generic field change ──────────────────────────────────────────────────
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setSaved(false);
    setForm((prev) => ({ ...(prev ?? profile), [e.target.name]: e.target.value }));
  }

  // ── Logo ──────────────────────────────────────────────────────────────────
  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError(null);
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Logo je príliš veľké. Max. povolená veľkosť je 2 MB.");
      if (logoRef.current) logoRef.current.value = "";
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
      if (logoRef.current) logoRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveLogo() {
    setSaved(false);
    setForm((prev) => ({ ...(prev ?? profile), logoDataUrl: "" }));
    if (logoRef.current) logoRef.current.value = "";
  }

  // ── Brand manual (PDF) ────────────────────────────────────────────────────
  function handleBrandManualChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBrandError(null);
    if (file.size > 10 * 1024 * 1024) {
      setBrandError("Súbor je príliš veľký. Max. povolená veľkosť je 10 MB.");
      if (brandRef.current) brandRef.current.value = "";
      return;
    }
    if (file.type !== "application/pdf") {
      setBrandError("Prosím nahrajte súbor vo formáte PDF.");
      if (brandRef.current) brandRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSaved(false);
      setForm((prev) => ({
        ...(prev ?? profile),
        brandManualDataUrl: reader.result as string,
        brandManualName: file.name,
      }));
    };
    reader.onerror = () => {
      setBrandError("Súbor sa nepodarilo načítať. Skúste iný súbor.");
      if (brandRef.current) brandRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveBrandManual() {
    setSaved(false);
    setForm((prev) => ({
      ...(prev ?? profile),
      brandManualDataUrl: "",
      brandManualName: "",
    }));
    if (brandRef.current) brandRef.current.value = "";
  }

  // ── Social links ──────────────────────────────────────────────────────────
  function addSocialLink() {
    setSaved(false);
    setForm((prev) => ({
      ...(prev ?? profile),
      socialLinks: [
        ...(prev ?? profile).socialLinks,
        { network: "LinkedIn" as SocialNetwork, url: "" },
      ],
    }));
  }

  function updateSocialLink(
    index: number,
    field: keyof SocialLink,
    value: string
  ) {
    setSaved(false);
    setForm((prev) => {
      const base = prev ?? profile;
      const updated = base.socialLinks.map((sl, i) =>
        i === index ? { ...sl, [field]: value } : sl
      );
      return { ...base, socialLinks: updated };
    });
  }

  function removeSocialLink(index: number) {
    setSaved(false);
    setForm((prev) => {
      const base = prev ?? profile;
      return {
        ...base,
        socialLinks: base.socialLinks.filter((_, i) => i !== index),
      };
    });
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
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
        {/* ── POVINNÉ ÚDAJE ─────────────────────────────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Povinné údaje</h2>

          {/* Názov firmy */}
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Názov firmy <span className={styles.required}>*</span>
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

          {/* Popis firmy */}
          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Krátky popis firmy <span className={styles.required}>*</span>
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
              required
            />
          </div>

          {/* Odvetvie */}
          <div className={styles.field}>
            <label htmlFor="industry" className={styles.label}>
              Odvetvie <span className={styles.required}>*</span>
            </label>
            <select
              id="industry"
              name="industry"
              className={styles.select}
              value={current.industry}
              onChange={handleChange}
              required
            >
              <option value="">— vyberte odvetvie —</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Benefity */}
          <div className={styles.field}>
            <label htmlFor="benefits" className={styles.label}>
              Benefity <span className={styles.required}>*</span>
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
              required
            />
          </div>

          {/* Tone of voice */}
          <div className={styles.field}>
            <label htmlFor="toneOfVoice" className={styles.label}>
              Tone of voice <span className={styles.required}>*</span>
            </label>
            <p className={styles.hint}>
              Vyberte štýl komunikácie, ktorý zodpovedá kultúre vašej firmy.
              Tento štýl sa zohľadní pri generovaní pracovných ponúk.
            </p>
            <select
              id="toneOfVoice"
              name="toneOfVoice"
              className={styles.select}
              value={current.toneOfVoice}
              onChange={handleChange}
              required
            >
              <option value="">— vyberte tone of voice —</option>
              {TONE_OF_VOICE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="toneOfVoiceCustom" className={styles.label}>
              Doplnkový popis tone of voice
            </label>
            <p className={styles.hint}>
              Opíšte podrobnejšie, ako chcete komunikovať so záujemcami o prácu
              – môžete uviesť konkrétne slová, frázy alebo hodnoty, ktoré majú
              byť v texte prítomné.
            </p>
            <textarea
              id="toneOfVoiceCustom"
              name="toneOfVoiceCustom"
              className={styles.textarea}
              value={current.toneOfVoiceCustom}
              onChange={handleChange}
              placeholder="napr. Hovoríme otvorene, bez korporátneho slangu. Sme na 'ty' so všetkými. Zdôrazňujeme rast a slobodu rozhodovania."
              rows={3}
            />
          </div>
        </section>

        {/* ── NEPOVINNÉ ÚDAJE ───────────────────────────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nepovinné údaje</h2>

          {/* Logo */}
          <div className={styles.field}>
            <label className={styles.label}>Logo firmy</label>
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
                    ref={logoRef}
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
                <p className={styles.fileHint}>
                  Odporúčaný formát: PNG alebo SVG, max. 2 MB
                </p>
                {logoError && (
                  <p className={styles.fileError}>{logoError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Webstránka */}
          <div className={styles.field}>
            <label htmlFor="website" className={styles.label}>
              Webstránka firmy
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

          {/* Sociálne siete */}
          <div className={styles.field}>
            <label className={styles.label}>Sociálne siete</label>
            <div className={styles.socialList}>
              {current.socialLinks.map((sl, i) => (
                <div key={i} className={styles.socialRow}>
                  <select
                    className={styles.socialSelect}
                    value={sl.network}
                    onChange={(e) =>
                      updateSocialLink(i, "network", e.target.value)
                    }
                  >
                    {SOCIAL_NETWORKS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <input
                    type="url"
                    className={styles.socialInput}
                    value={sl.url}
                    onChange={(e) =>
                      updateSocialLink(i, "url", e.target.value)
                    }
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    className={styles.socialRemove}
                    onClick={() => removeSocialLink(i)}
                    aria-label="Odstrániť"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={addSocialLink}
            >
              + Pridať sociálnu sieť
            </button>
          </div>

          {/* Kariérna stránka */}
          <div className={styles.field}>
            <label htmlFor="careerPage" className={styles.label}>
              Kariérna stránka
            </label>
            <input
              id="careerPage"
              name="careerPage"
              type="url"
              className={styles.input}
              value={current.careerPage}
              onChange={handleChange}
              placeholder="https://careers.mojastranka.sk"
            />
          </div>

          {/* Brand manual */}
          <div className={styles.field}>
            <label className={styles.label}>Brand manual (PDF)</label>
            <p className={styles.hint}>Max. 10 MB, iba PDF</p>
            {current.brandManualDataUrl ? (
              <div className={styles.fileAttached}>
                <span className={styles.fileName}>
                  📄 {current.brandManualName || "brand-manual.pdf"}
                </span>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={handleRemoveBrandManual}
                >
                  Odstrániť
                </button>
              </div>
            ) : (
              <label className={styles.uploadButton}>
                Nahrať Brand manual
                <input
                  ref={brandRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleBrandManualChange}
                  className={styles.hiddenInput}
                />
              </label>
            )}
            {brandError && <p className={styles.fileError}>{brandError}</p>}
          </div>

          {/* Iné interné návody */}
          <div className={styles.field}>
            <label htmlFor="otherGuides" className={styles.label}>
              Iné interné návody a materiály
            </label>
            <textarea
              id="otherGuides"
              name="otherGuides"
              className={styles.textarea}
              value={current.otherGuides}
              onChange={handleChange}
              placeholder="napr. Onboarding manuál, interný štýlový sprievodca, prezentačné šablóny..."
              rows={3}
            />
          </div>

          {/* Iné informácie */}
          <div className={styles.field}>
            <label htmlFor="otherInfo" className={styles.label}>
              Iné informácie o firme
            </label>
            <textarea
              id="otherInfo"
              name="otherInfo"
              className={styles.textarea}
              value={current.otherInfo}
              onChange={handleChange}
              placeholder="napr. História firmy, ocenenia, partnerstvá, misie a hodnoty..."
              rows={4}
            />
          </div>
        </section>

        <div className={styles.submitRow}>
          <button type="submit" className={styles.button}>
            Uložiť zmeny
          </button>
          {saved && <span className={styles.savedBadge}>✓ Uložené</span>}
        </div>
      </form>
    </>
  );
}
