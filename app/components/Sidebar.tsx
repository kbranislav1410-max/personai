"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const navItems = [
  { href: "/dashboard", label: "Prehľad" },
  { href: "/moja-firma", label: "Moja firma" },
  { href: "/", label: "Generátor pracovnej ponuky" },
  { href: "/pozicie", label: "Pozície" },
  { href: "/uchadzaci", label: "Uchádzači" },
  { href: "/analyza-zivotopisov", label: "Analýza životopisov" },
  { href: "/priprava-na-pohovor", label: "Príprava na pohovor" },
  { href: "/otazka-a-ukolovanie", label: "Otázka a úkolovanie" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.logo}>Personalistika AI</div>
      <ul className={styles.navList}>
        {navItems.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`${styles.navLink} ${pathname === href ? styles.active : ""}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
