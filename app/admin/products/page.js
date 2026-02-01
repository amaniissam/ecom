"use client";

import { useEffect, useState } from "react";
import AdminGuard from "../_components/AdminGuard";
import AdminNav from "../_components/AdminNav";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import styles from "./page.module.css";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    imageUrl: "",
    stock: 0,
    active: true,
  });

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  async function addProduct(e) {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      name: form.name.trim(),
      price: Number(form.price) || 0,
      imageUrl: form.imageUrl.trim(),
      stock: Number(form.stock) || 0,
      active: !!form.active,
    });
    setForm({ name: "", price: 0, imageUrl: "", stock: 0, active: true });
  }

  async function toggleActive(p) {
    await updateDoc(doc(db, "products", p.id), { active: !p.active });
  }

  async function updateField(pId, field, value) {
    await updateDoc(doc(db, "products", pId), { [field]: value });
  }

  async function remove(pId) {
    if (!confirm("Delete product?")) return;
    await deleteDoc(doc(db, "products", pId));
  }

  return (
    <AdminGuard>
      <AdminNav />

      <main className={styles.page}>
        <h1 className={styles.title}>Products</h1>

        {/* Add form */}
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Add product</h2>

          <form onSubmit={addProduct} className={styles.form}>
            <input
              className={styles.input}
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />

            <div className={styles.row}>

              <input
                className={styles.input}
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
              <input
                className={styles.input}
                placeholder="Stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              />
            </div>

            <input
              className={styles.input}
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            />

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              <span>Active</span>
            </label>

            <button className={styles.primaryBtn}>Add product</button>
          </form>
        </section>

        <div className={styles.divider} />

        {/* List */}
        <section className={styles.list}>
          {products.map((p) => (
            <article key={p.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <b className={styles.name}>{p.name}</b>
                <span className={`${styles.status} ${p.active ? styles.active : styles.inactive}`}>
                  {p.active ? "active" : "inactive"}
                </span>
              </div>

              <div className={styles.editRow}>
                <label className={styles.field}>
                  <span>Price</span>
                  <input
                    className={styles.smallInput}
                    type="number"
                    defaultValue={p.price}
                    onBlur={(e) => updateField(p.id, "price", Number(e.target.value) || 0)}
                  />
                </label>

                <label className={styles.field}>
                  <span>Stock</span>
                  <input
                    className={styles.smallInput}
                    type="number"
                    defaultValue={p.stock}
                    onBlur={(e) => updateField(p.id, "stock", Number(e.target.value) || 0)}
                  />
                </label>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => toggleActive(p)}
                >
                  {p.active ? "Disable" : "Enable"}
                </button>

                <button
                  className={styles.dangerBtn}
                  onClick={() => remove(p.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </AdminGuard>
  );
}
