"use client";

import styles from "./UpperBar.module.css";

export default function UpperBar() {
  return (
    <header className={styles.bar}>
      <div className={styles.shell}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.name}>modern</span>
        </div>

        <div className={styles.right}>
          <span className={styles.tag}>by issam_m00</span>
        </div>
      </div>
    </header>
  );
}
