"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "./Products.module.css";
import UpperBar from "./UpperBar";

function initials(name = "") {
  const t = name.trim().split(/\s+/).slice(0, 2).map(s => s[0]?.toUpperCase() || "");
  return t.join("") || "M";
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const q = query(collection(db, "products"), where("active", "==", true));
      const snap = await getDocs(q);
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => String(p.name || "").toLowerCase().includes(s));
  }, [products, search]);

  const totalCount = products.length;
  const showing = filtered.length;

  return (
    <>
      <UpperBar />

      <div className={styles.wrapper}>
        <div className={styles.shell}>
          <section className={styles.hero}>
            <div className={styles.heroGrid}>
              <div>
                <h1 className={styles.hTitle}>
                  Wear the <span>modern</span> vibe.
                </h1>
                <p className={styles.hText}>
                  Clean design. Fast browsing. Simple checkout.
                </p>



                <div className={styles.controls}>
                  <input
                    className={styles.search}
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.statsCard}>
                <div className={styles.statsTitle}>Store stats</div>
                <div className={styles.statsGrid}>
                  <div className={styles.stat}>
                    <b>{totalCount}</b>
                    <span>Products</span>
                  </div>
                  <div className={styles.stat}>
                    <b>24/7</b>
                    <span>Orders</span>
                  </div>
                  <div className={styles.stat}>
                    <b>Fast</b>
                    <span>Browse</span>
                  </div>
                  <div className={styles.stat}>
                    <b>Secure</b>
                    <span>Rules</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {loading ? (
            <div className={styles.loading}>Loading products…</div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>No products found.</div>
          ) : (
            <section className={styles.section} id="products">
              <div className={styles.sectionTitle}>Products</div>

              <div className={styles.grid}>
                {filtered.map((p) => (
                  <article key={p.id} className={styles.card}>
                    <div className={styles.glow} />

                    <div className={styles.media}>
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className={styles.img} src={p.imageUrl} alt={p.name || "Product"} />
                      ) : (
                        <div className={styles.placeholder}>{initials(p.name)}</div>
                      )}
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.nameRow}>
                        <div className={styles.name}>{p.name}</div>
                        <div className={styles.price}>{p.price} DZD</div>
                      </div>

                      <div className={styles.meta}>
                        <span>Stock: {typeof p.stock === "number" ? p.stock : "—"}</span>
                      </div>

                      <div className={styles.actions}>
                        <button
                          className={styles.buy}
                          onClick={() => router.push(`/product/${p.id}`)}
                        >
                          View
                        </button>


                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
