"use client";

import Link from "next/link";
import { useCandidates } from "@/features/candidates/hooks/useCandidates";
import { usePositions } from "@/features/positions/hooks/usePositions";
import styles from "./page.module.css";

const features = [
  {
    href: "/analyza-zivotopisov",
    title: "Analýza životopisov",
    description: "Nahrajte životopisy a AI ich porovná s požiadavkami pozície.",
    icon: "📄",
  },
  {
    href: "/pozicie/zoznam-pozicii",
    title: "Pozície",
    description: "Prehľad uložených pracovných pozícií.",
    icon: "💼",
  },
  {
    href: "/uchadzaci",
    title: "Uchádzači",
    description: "Prehľad uložených uchádzačov a ich analýz.",
    icon: "👥",
  },
  {
    href: "/priprava-na-pohovor",
    title: "Príprava na pohovor",
    description: "AI vytvorí otázky a prípravu na pohovor pre konkrétneho uchádzača.",
    icon: "🎤",
  },
  {
    href: "/pozicie/nova-pozicia",
    title: "Nová pozícia",
    description: "Vygenerujte profesionálny inzerát pomocou AI.",
    icon: "✍️",
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const { candidates } = useCandidates();
  const { positions } = usePositions();

  const recentCandidates = candidates.slice(0, 3);
  const recentPositions = positions.slice(0, 3);

  return (
    <>
      <h1 className={styles.title}>Prehľad</h1>
      <p className={styles.subtitle}>Vitajte v Personalistika AI – prehľad vašej práce.</p>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{positions.length}</span>
          <span className={styles.statLabel}>Uložených pozícií</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{candidates.length}</span>
          <span className={styles.statLabel}>Uložených uchádzačov</span>
        </div>
      </div>

      {/* Quick actions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Funkcie</h2>
        <div className={styles.grid}>
          {features.map((f) => (
            <Link key={f.href + f.title} href={f.href} className={styles.featureCard}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <span className={styles.featureTitle}>{f.title}</span>
              <span className={styles.featureDesc}>{f.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent items */}
      <div className={styles.recentRow}>
        {/* Recent positions */}
        <section className={styles.recentSection}>
          <div className={styles.recentHeader}>
            <h2 className={styles.sectionTitle}>Posledné pozície</h2>
            <Link href="/pozicie/zoznam-pozicii" className={styles.viewAll}>Zobraziť všetky →</Link>
          </div>
          {recentPositions.length === 0 ? (
            <p className={styles.empty}>Zatiaľ žiadne uložené pozície.</p>
          ) : (
            <ul className={styles.recentList}>
              {recentPositions.map((pos) => (
                <li key={pos.id} className={styles.recentItem}>
                  <span className={styles.recentName}>{pos.title}</span>
                  <div className={styles.recentMeta}>
                    {pos.seniority && <span className={styles.tag}>{pos.seniority}</span>}
                    {pos.location && <span className={styles.tag}>{pos.location}</span>}
                    <span className={styles.recentDate}>{formatDate(pos.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent candidates */}
        <section className={styles.recentSection}>
          <div className={styles.recentHeader}>
            <h2 className={styles.sectionTitle}>Poslední uchádzači</h2>
            <Link href="/uchadzaci" className={styles.viewAll}>Zobraziť všetkých →</Link>
          </div>
          {recentCandidates.length === 0 ? (
            <p className={styles.empty}>Zatiaľ žiadni uložení uchádzači.</p>
          ) : (
            <ul className={styles.recentList}>
              {recentCandidates.map((c) => (
                <li key={c.id} className={styles.recentItem}>
                  <span className={styles.recentName}>{c.filename}</span>
                  <div className={styles.recentMeta}>
                    {c.positionTitle && <span className={styles.tag}>{c.positionTitle}</span>}
                    <Link
                      href={`/priprava-na-pohovor?candidateId=${c.id}`}
                      className={styles.prepLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Pripraviť pohovor
                    </Link>
                    <span className={styles.recentDate}>{formatDate(c.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
