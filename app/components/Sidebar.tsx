"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const navItems = [
  { href: "/dashboard", label: "Prehľad" },
  { href: "/moja-firma", label: "Moja firma" },
  {
    href: "/pozicie",
    label: "Pozície",
    children: [
      { href: "/pozicie/nova-pozicia", label: "Nová pozícia" },
      { href: "/pozicie/zoznam-pozicii", label: "Zoznam pozícií" },
    ],
  },
  { href: "/analyza-zivotopisov", label: "Analýza životopisov" },
  { href: "/uchadzaci", label: "Uchádzači" },
  { href: "/priprava-na-pohovor", label: "Príprava na pohovor" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.logo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://github.com/user-attachments/assets/51a53a39-d207-4158-924b-69b3f02881a4"
          alt="Personalistika AI"
          className={styles.logoImage}
        />
      </div>
      <ul className={styles.navList}>
        {navItems.map(({ href, label, children }) => (
          <li key={href}>
            <Link
              href={href}
              className={`${styles.navLink} ${pathname === href ? styles.active : ""}`}
            >
              {label}
            </Link>
            {children && (
              <ul className={styles.subNavList}>
                {children.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className={`${styles.subNavLink} ${pathname === child.href ? styles.active : ""}`}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
