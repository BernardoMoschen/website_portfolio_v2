import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <div className={styles.inner}>
        <h1 className={`${styles.errorCode} gradient-text`}>404</h1>

        <div className={`${styles.terminal} glass`}>
          <div className={styles.terminalHeader}>
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
            <span className={`${styles.terminalTitle} mono`}>bash — 80x24</span>
          </div>
          <div className={`${styles.terminalBody} mono`}>
            <p className={styles.line}>$ find / -name "this-page"</p>
            <p className={`${styles.line} ${styles.output}`}>&gt; searching...</p>
            <p className={`${styles.line} ${styles.output} ${styles.error}`}>&gt; ERROR: page not found</p>
            <p className={`${styles.line} ${styles.output}`}>&gt;</p>
            <p className={`${styles.line} ${styles.output}`}>&gt; suggested commands:</p>
            <p className={`${styles.line} ${styles.output}`}>
              &gt;&nbsp;&nbsp;
              <Link href="/#hero" className={styles.link}>cd /home</Link>
              <span className={styles.comment}>— go back to start</span>
            </p>
            <p className={`${styles.line} ${styles.output}`}>
              &gt;&nbsp;&nbsp;
              <Link href="/#projects" className={styles.link}>ls /projects</Link>
              <span className={styles.comment}>— browse my work</span>
            </p>
            <p className={`${styles.line} ${styles.output}`}>
              &gt;&nbsp;&nbsp;
              <Link href="/#contact" className={styles.link}>cat /contact</Link>
              <span className={styles.comment}>— get in touch</span>
            </p>
            <p className={styles.line}>$ <span className={styles.cursor}>_</span></p>
          </div>
        </div>

        <Link href="/" className={`btn btn-primary ${styles.goHome}`}>Go Home</Link>
      </div>
    </main>
  );
}
