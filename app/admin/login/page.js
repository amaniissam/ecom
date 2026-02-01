"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin/orders");
    } catch (error) {
      setErr(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>

        <form onSubmit={onSubmit} className={styles.form}>
          <input
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <input
            className={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button className={styles.button} disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>

          {err ? <p className={styles.error}>{err}</p> : null}
        </form>
      </div>
    </main>
  );
}
