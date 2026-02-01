"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import styles from "./AdminGuard.module.css";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [state, setState] = useState({ loading: true, user: null });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login");
        setState({ loading: false, user: null });
      } else {
        setState({ loading: false, user });
      }
    });
    return () => unsub();
  }, [router]);

  if (state.loading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.spinner} />
          <div className={styles.text}>Checking admin session…</div>
        </div>
      </div>
    );
  }

  if (!state.user) return null;

  return children;
}
