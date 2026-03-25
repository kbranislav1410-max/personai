import Link from "next/link";
import styles from "./page.module.css";

const subPages = [
  {
    href: "/pozicie/nova-pozicia",
    title: "Nová pozícia",
    description: "Vygenerujte profesionálny inzerát pomocou AI.",
    icon: "✍️",
  },
  {
    href: "/pozicie/zoznam-pozicii",
    title: "Zoznam pozícií",
    description: "Prehľad uložených pracovných pozícií.",
    icon: "💼",
  },
];

export default function PoziciePage() {
  return (
    <>
      <h1 className={styles.title}>Pozície</h1>
      <div className={styles.subNav}>
        {subPages.map((page) => (
          <Link key={page.href} href={page.href} className={styles.subNavCard}>
            <span className={styles.subNavIcon}>{page.icon}</span>
            <span className={styles.subNavTitle}>{page.title}</span>
            <span className={styles.subNavDesc}>{page.description}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

