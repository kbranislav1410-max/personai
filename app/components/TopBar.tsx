"use client";

import Link from "next/link";
import styles from "./TopBar.module.css";

export default function TopBar() {
  return (
    <header className={styles.topbar} aria-label="Top navigation">
      {/* Contact / Hotline */}
      <button
        className={styles.iconBtn}
        title="Kontakt a hotline"
        type="button"
        aria-label="Kontakt a hotline"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.08 11.9 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 9 9l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 24 18v3z" />
        </svg>
      </button>

      {/* Education / Guides */}
      <button
        className={styles.iconBtn}
        title="Vzdelávanie a návody"
        type="button"
        aria-label="Vzdelávanie a návody"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </button>

      <div className={styles.divider} aria-hidden="true" />

      {/* Start selection */}
      <Link href="/analyza-zivotopisov" className={styles.startButton}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        Začať výber
      </Link>
    </header>
  );
}
