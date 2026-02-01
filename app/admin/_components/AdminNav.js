"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./AdminNav.module.css";

export default function AdminNav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.shell}>
        <div className={styles.left}>
          <span className={styles.brand}>modern</span>

          <Link href="/admin/orders" className={styles.link}>
            Orders
          </Link>

          <Link href="/admin/products" className={styles.link}>
            Products
          </Link>
        </div>

        <button
          className={styles.logout}
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
