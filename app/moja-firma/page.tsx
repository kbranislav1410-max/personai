"use client";

import { useCallback, useRef, useState, useEffect } from "react";
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

async function fetchGenerateDna(profile: CompanyProfile): Promise<string> {
  const res = await fetch("/api/generate-company-dna", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: profile.name,
      description: profile.description || undefined,
      industry: profile.industry || undefined,
      benefits: profile.benefits || undefined,
      toneOfVoice: profile.toneOfVoice || undefined,
      toneOfVoiceCustom: profile.toneOfVoiceCustom || undefined,
      otherInfo: profile.otherInfo || undefined,
      otherGuides: profile.otherGuides || undefined,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as Record<string, string>).error ??
        "Generovanie DNA zlyhalo."
    );
  }
  const data = await res.json();
  return (data as { communicationDna: string }).communicationDna;
}

export default function MojaFirmaPage() {
  const { profile, saveProfile, loaded } = useCompany();
  const [form, setForm] = useState<CompanyProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(true); // start in edit; corrected after load

  // Communication DNA state
  const [editingDna, setEditingDna] = useState(false);
  const [dnaForm, setDnaForm] = useState("");
  const [generatingDna, setGeneratingDna] = useState(false);
  const [dnaError, setDnaError] = useState<string | null>(null);

  // Once localStorage data is available, switch to view mode if profile has data
  useEffect(() => {
    if (loaded) {
      setEditing(!profile.name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

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
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveProfile(current);
    setSaved(true);
    setEditing(false);
    setForm(null);

    // Auto-generate DNA on first save (when DNA is empty)
    if (!current.communicationDna) {
      setGeneratingDna(true);
      setDnaError(null);
      try {
        const dna = await fetchGenerateDna(current);
        saveProfile({ ...current, communicationDna: dna });
      } catch (err) {
        setDnaError(
          err instanceof Error ? err.message : "Generovanie DNA zlyhalo."
        );
      } finally {
        setGeneratingDna(false);
      }
    }
  }

  function handleEdit() {
    setForm(profile);
    setSaved(false);
    setEditing(true);
  }

  function handleCancel() {
    setForm(null);
    setSaved(false);
    setEditing(false);
  }

  // ── DNA handlers ───────────────────────────────────────────────────────────
  function handleEditDna() {
    setDnaForm(profile.communicationDna);
    setDnaError(null);
    setEditingDna(true);
  }

  function handleCancelDna() {
    setDnaForm("");
    setDnaError(null);
    setEditingDna(false);
  }

  function handleSaveDna() {
    saveProfile({ ...profile, communicationDna: dnaForm });
    setEditingDna(false);
    setDnaForm("");
  }

  const handleRegenerateDna = useCallback(async () => {
    setGeneratingDna(true);
    setDnaError(null);
    setEditingDna(false);
    try {
      const dna = await fetchGenerateDna(profile);
      saveProfile({ ...profile, communicationDna: dna });
    } catch (err) {
      setDnaError(
        err instanceof Error ? err.message : "Generovanie DNA zlyhalo."
      );
    } finally {
      setGeneratingDna(false);
    }
  }, [profile, saveProfile]);

  // ── View mode (read-only) ──────────────────────────────────────────────────
  if (!editing && profile.name) {
    return (
      <>
        <div className={styles.viewHeader}>
          <div>
            <h1 className={styles.title}>Moja firma</h1>
          </div>
          <button className={styles.editButton} onClick={handleEdit}>
            ✏️ Upraviť
          </button>
        </div>

        <div className={styles.viewCard}>
          {profile.logoDataUrl && (
            <div className={styles.viewLogoRow}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.logoDataUrl}
                alt="Logo firmy"
                className={styles.viewLogo}
              />
            </div>
          )}

          <div className={styles.viewSection}>
            <h2 className={styles.viewSectionTitle}>Základné informácie</h2>
            <dl className={styles.viewDl}>
              <dt className={styles.viewDt}>Názov firmy</dt>
              <dd className={styles.viewDd}>{profile.name}</dd>

              {profile.industry && (
                <>
                  <dt className={styles.viewDt}>Odvetvie</dt>
                  <dd className={styles.viewDd}>{profile.industry}</dd>
                </>
              )}

              {profile.description && (
                <>
                  <dt className={styles.viewDt}>Popis firmy</dt>
                  <dd className={`${styles.viewDd} ${styles.viewMultiline}`}>
                    {profile.description}
                  </dd>
                </>
              )}

              {profile.benefits && (
                <>
                  <dt className={styles.viewDt}>Benefity</dt>
                  <dd className={`${styles.viewDd} ${styles.viewMultiline}`}>
                    {profile.benefits}
                  </dd>
                </>
              )}

              {profile.toneOfVoice && (
                <>
                  <dt className={styles.viewDt}>Tone of voice</dt>
                  <dd className={styles.viewDd}>{profile.toneOfVoice}</dd>
                </>
              )}

              {profile.toneOfVoiceCustom && (
                <>
                  <dt className={styles.viewDt}>Doplnkový popis tone of voice</dt>
                  <dd className={`${styles.viewDd} ${styles.viewMultiline}`}>
                    {profile.toneOfVoiceCustom}
                  </dd>
                </>
              )}
            </dl>
          </div>

          {(profile.website ||
            profile.careerPage ||
            profile.socialLinks.length > 0) && (
            <div className={styles.viewSection}>
              <h2 className={styles.viewSectionTitle}>Online prítomnosť</h2>
              <dl className={styles.viewDl}>
                {profile.website && (
                  <>
                    <dt className={styles.viewDt}>Webstránka</dt>
                    <dd className={styles.viewDd}>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewLink}
                      >
                        {profile.website}
                      </a>
                    </dd>
                  </>
                )}

                {profile.careerPage && (
                  <>
                    <dt className={styles.viewDt}>Kariérna stránka</dt>
                    <dd className={styles.viewDd}>
                      <a
                        href={profile.careerPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewLink}
                      >
                        {profile.careerPage}
                      </a>
                    </dd>
                  </>
                )}

                {profile.socialLinks.length > 0 && (
                  <>
                    <dt className={styles.viewDt}>Sociálne siete</dt>
                    <dd className={styles.viewDd}>
                      <ul className={styles.viewSocialList}>
                        {profile.socialLinks.map((sl, i) => (
                          <li key={i} className={styles.viewSocialItem}>
                            <span className={styles.viewSocialNetwork}>
                              {sl.network}:
                            </span>{" "}
                            <a
                              href={sl.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.viewLink}
                            >
                              {sl.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {(profile.brandManualDataUrl ||
            profile.otherGuides ||
            profile.otherInfo) && (
            <div className={styles.viewSection}>
              <h2 className={styles.viewSectionTitle}>Materiály a iné</h2>
              <dl className={styles.viewDl}>
                {profile.brandManualDataUrl && (
                  <>
                    <dt className={styles.viewDt}>Brand manual</dt>
                    <dd className={styles.viewDd}>
                      📄 {profile.brandManualName || "brand-manual.pdf"}
                    </dd>
                  </>
                )}

                {profile.otherGuides && (
                  <>
                    <dt className={styles.viewDt}>Interné návody a materiály</dt>
                    <dd className={`${styles.viewDd} ${styles.viewMultiline}`}>
                      {profile.otherGuides}
                    </dd>
                  </>
                )}

                {profile.otherInfo && (
                  <>
                    <dt className={styles.viewDt}>Iné informácie</dt>
                    <dd className={`${styles.viewDd} ${styles.viewMultiline}`}>
                      {profile.otherInfo}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* ── Communication DNA section ──────────────────────────────────── */}
        <div className={styles.dnaCard}>
          <div className={styles.dnaSectionHeader}>
            <div>
              <h2 className={styles.dnaSectionTitle}>
                🧬 Communication DNA firmy
              </h2>
              <p className={styles.dnaSubtitle}>
                AI-generovaný komunikačný štýl vašej firmy – používa sa pri
                tvorbe pracovných ponúk a ďalšej komunikácii.
              </p>
            </div>
            {!editingDna && (
              <div className={styles.dnaHeaderButtons}>
                {profile.communicationDna && (
                  <button
                    type="button"
                    className={styles.dnaEditButton}
                    onClick={handleEditDna}
                  >
                    ✏️ Upraviť
                  </button>
                )}
                <button
                  type="button"
                  className={styles.dnaRegenerateButton}
                  onClick={handleRegenerateDna}
                  disabled={generatingDna}
                >
                  🔄 {profile.communicationDna ? "Regenerovať" : "Generovať DNA"}
                </button>
              </div>
            )}
          </div>

          {dnaError && (
            <p className={styles.dnaError}>{dnaError}</p>
          )}

          {generatingDna && (
            <div className={styles.dnaGenerating}>
              <span className={styles.dnaSpinner} />
              AI generuje Communication DNA…
            </div>
          )}

          {!generatingDna && editingDna && (
            <div className={styles.dnaEditArea}>
              <textarea
                className={styles.dnaTextarea}
                value={dnaForm}
                onChange={(e) => setDnaForm(e.target.value)}
                rows={18}
              />
              <div className={styles.dnaActions}>
                <button
                  type="button"
                  className={styles.button}
                  onClick={handleSaveDna}
                >
                  Uložiť
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancelDna}
                >
                  Zrušiť
                </button>
              </div>
            </div>
          )}

          {!generatingDna && !editingDna && profile.communicationDna && (
            <div className={styles.dnaText}>
              {profile.communicationDna}
            </div>
          )}

          {!generatingDna && !editingDna && !profile.communicationDna && (
            <p className={styles.dnaPlaceholder}>
              Communication DNA ešte nebola vygenerovaná. Klikni na tlačidlo
              „Generovať DNA" vyššie.
            </p>
          )}
        </div>
      </>
    );
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
          {profile.name && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Zrušiť
            </button>
          )}
          {saved && <span className={styles.savedBadge}>✓ Uložené</span>}
        </div>
      </form>
    </>
  );
}
