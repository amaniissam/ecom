"use client";

import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.name}>modern</span>
        </div>

        {/* Links */}
        <nav className={styles.links}>
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </nav>

        {/* Bottom */}
        <div className={styles.bottom}>
          <span>© {year} modern. All rights reserved.</span>

        </div>
      </div>
    </footer>
  );
}
