import JobDescriptionGenerator from "@/features/job-description/components/JobDescriptionGenerator";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Personalistika AI – Job Description Generator
      </h1>
      <JobDescriptionGenerator />
    </main>
  );
}
