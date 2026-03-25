import JobDescriptionGenerator from "@/features/job-description/components/JobDescriptionGenerator";
import styles from "../../page.module.css";

export default function NovaPoziciaPage() {
  return (
    <>
      <h1 className={styles.title}>Nová pozícia</h1>
      <JobDescriptionGenerator />
    </>
  );
}
