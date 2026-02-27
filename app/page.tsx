import JobDescriptionGenerator from "@/features/job-description/components/JobDescriptionGenerator";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <h1 className={styles.title}>Job Description Generator</h1>
      <JobDescriptionGenerator />
    </>
  );
}
