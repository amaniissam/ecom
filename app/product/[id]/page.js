"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./ProductCheckout.module.css";

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductCheckoutPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // product options
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);

  // checkout form
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setMsg("");
        const snap = await getDoc(doc(db, "products", id));
        if (!snap.exists()) {
          setProduct(null);
          setMsg("Product not found");
        } else {
          setProduct({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        setMsg(e?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function placeOrder(e) {
    e.preventDefault();
    if (!product) return;

    const cleanQty = Math.max(1, Number(qty) || 1);


    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setMsg("Please fill name, phone, and address.");
      return;
    }

    setSubmitting(true);
    setMsg("");

    try {
      const itemPrice = Number(product.price) || 0;

      const items = [
        {
          productId: product.id,
          name: product.name,
          price: itemPrice,
          qty: cleanQty,
          size,
        },
      ];

      const total = itemPrice * cleanQty;

      const ref = await addDoc(collection(db, "orders"), {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        items,
        total,
        status: "new",
        createdAt: serverTimestamp(),
      });

      setMsg(`✅ Order sent!`);


      setCustomerName("");
      setPhone("");
      setAddress("");
      setNotes("");
      setQty(1);
      setSize("M");
    } catch (e) {
      setMsg(e?.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className={styles.wrap}>Loading…</div>;

  if (!product) {
    return (
      <div className={styles.wrap}>
        <p>{msg || "Product not found."}</p>
        <button className={styles.back} onClick={() => router.push("/")}>← Back</button>
      </div>
    );
  }

  const price = Number(product.price) || 0;
  const total = price * Math.max(1, Number(qty) || 1);

  return (
    <div className={styles.wrap}>
      <button className={styles.back} onClick={() => router.push("/")}>← Back</button>

      <div className={styles.layout}>
        {/* LEFT */}
        <div className={styles.left}>
          <div className={styles.media}>
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.img} src={product.imageUrl} alt={product.name || "Product"} />
            ) : (
              <div className={styles.noImg}>No image</div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.price}>{price} DZD</div>

          <p className={styles.desc}>
            {product.description ? product.description : "No description provided."}
          </p>

          <div className={styles.options}>
            <div className={styles.optionBox}>
              <div className={styles.label}>Size</div>
              <div className={styles.sizes}>
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`${styles.sizeBtn} ${size === s ? styles.active : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.optionBox}>
              <div className={styles.label}>Quantity</div>
              <input
                className={styles.input}
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.summary}>
            <span>Total:</span>
            <b>{total} DZD</b>
          </div>

          <form className={styles.form} onSubmit={placeOrder}>
            <div className={styles.label}>Checkout</div>

            <input
              className={styles.input}
              placeholder="Full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              className={styles.input}
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              className={styles.input}
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <textarea
              className={styles.textarea}
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button className={styles.cta} disabled={submitting}>
              {submitting ? "Sending…" : "Order now"}
            </button>

            {msg ? <p className={styles.msg}>{msg}</p> : null}
          </form>
        </div>
      </div>
    </div>
  );
}
