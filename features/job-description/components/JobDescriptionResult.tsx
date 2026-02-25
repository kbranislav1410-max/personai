import styles from "./JobDescriptionResult.module.css";

interface Props {
  result: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function JobDescriptionResult({
  result,
  isLoading,
  error,
}: Props) {
  if (isLoading) {
    return (
      <div className={styles.status} aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        Generating job description…
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        {error}
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <section className={styles.result}>
      <h2 className={styles.heading}>Generated Job Description</h2>
      <pre className={styles.content}>{result}</pre>
    </section>
  );
}
