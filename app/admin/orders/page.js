"use client";

import AdminGuard from "../_components/AdminGuard";
import AdminNav from "../_components/AdminNav";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

function formatDate(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : null;
    return d ? d.toLocaleString() : "";
  } catch {
    return "";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const q = useMemo(
    () => query(collection(db, "orders"), orderBy("createdAt", "desc")),
    []
  );

  useEffect(() => {
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [q]);

  async function setStatus(orderId, status) {
    await updateDoc(doc(db, "orders", orderId), { status });
  }

  return (
    <AdminGuard>
      <AdminNav />

      <main className={styles.page}>
        <h1 className={styles.title}>Orders</h1>

        {orders.length === 0 ? (
          <div className={styles.empty}>No orders yet.</div>
        ) : (
          <div className={styles.list}>
            {orders.map((o) => (
              <article key={o.id} className={styles.card}>
                {/* header */}
                <div className={styles.header}>
                  <div className={styles.orderId}>
                    #{o.id.slice(0, 8)}
                    <span className={styles.status}>{o.status || "new"}</span>
                  </div>
                  <span className={styles.date}>{formatDate(o.createdAt)}</span>
                </div>

                {/* customer */}
                <div className={styles.section}>
                  <div><b>Name:</b> {o.customerName}</div>
                  <div><b>Phone:</b> {o.phone}</div>
                  <div><b>Address:</b> {o.address}</div>
                  {o.notes && <div><b>Notes:</b> {o.notes}</div>}
                </div>

                {/* items */}
                <div className={styles.section}>
                  <b>Items</b>
                  <ul className={styles.items}>
                    {(o.items || []).map((it, idx) => (
                      <li key={idx}>
                        {it.name}
                        {it.size && <span className={styles.size}>Size: {it.size}</span>}
                        <span className={styles.qty}>× {it.qty}</span>
                        <span className={styles.price}>{it.price}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.total}>
                    Total: <b>{o.total}</b>
                  </div>
                </div>

                {/* actions */}
                <div className={styles.actions}>
                  <button onClick={() => setStatus(o.id, "new")}>New</button>
                  <button onClick={() => setStatus(o.id, "processing")}>Processing</button>
                  <button onClick={() => setStatus(o.id, "delivered")}>Delivered</button>
                  <button onClick={() => setStatus(o.id, "canceled")}>Canceled</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}
