"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const navItems = [
  { href: "/", label: "Job Description Generator" },
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
