/**
 * RP Sports — Firestore Service Layer
 *
 * Collections:
 *  - users/{uid}           → user profile, addresses, reward points
 *  - orders/{orderId}      → order data
 *  - products/{productId}  → product catalogue + stock
 *  - wishlists/{uid}       → user wishlist product IDs
 *  - contacts/{docId}      → contact form submissions
 *  - subscribers/{email}   → newsletter subscribers
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Order, User } from "./store";
import type { Product } from "./mockData";

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

/** Save / update a user profile in Firestore */
export async function saveUser(userId: string, data: Partial<User>): Promise<void> {
  try {
    const ref = doc(db, "users", userId);
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err: any) {
    console.warn("Firestore saveUser permission or network warning:", err.message);
  }
}

/** Fetch a user profile by ID */
export async function getUser(userId: string): Promise<User | null> {
  try {
    const ref = doc(db, "users", userId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as User) : null;
  } catch (err: any) {
    console.warn("Firestore getUser permission warning:", err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

/** Save a new order to Firestore and return the Firestore document ID */
export async function saveOrder(order: Order, userEmail?: string): Promise<string> {
  try {
    const ref = await addDoc(collection(db, "orders"), {
      ...order,
      userEmail: userEmail || "guest",
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (err: any) {
    console.warn("Firestore saveOrder permission warning:", err.message);
    return `local-order-${Date.now()}`;
  }
}

/** Fetch all orders for a user (by email) */
export async function getOrdersByUser(userEmail: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", userEmail),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id }) as unknown as Order);
  } catch (err: any) {
    console.warn("Firestore getOrdersByUser permission warning:", err.message);
    return [];
  }
}

/** Fetch all orders (admin use) */
export async function getAllOrders(): Promise<(Order & { firestoreId: string })[]> {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id } as unknown as Order & { firestoreId: string }));
  } catch (err: any) {
    console.warn("Firestore getAllOrders permission warning:", err.message);
    return [];
  }
}

/** Update order status in Firestore */
export async function updateOrderStatusInDB(
  firestoreId: string,
  status: Order["status"]
): Promise<void> {
  try {
    await updateDoc(doc(db, "orders", firestoreId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (err: any) {
    console.warn("Firestore updateOrderStatusInDB warning:", err.message);
  }
}

/** Real-time orders listener for admin panel */
export function listenToOrders(
  callback: (orders: (Order & { firestoreId: string })[]) => void
): Unsubscribe {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(100));
    return onSnapshot(
      q,
      (snap) => {
        const orders = snap.docs.map(
          (d) => ({ ...d.data(), firestoreId: d.id } as Order & { firestoreId: string })
        );
        callback(orders);
      },
      (error) => {
        console.warn("Firestore listenToOrders permission warning:", error.message);
      }
    );
  } catch (err: any) {
    console.warn("Firestore listenToOrders failed setup:", err.message);
    return () => {};
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

/** Upload all products to Firestore (one-time seed) */
export async function seedProducts(products: Product[]): Promise<void> {
  try {
    for (const product of products) {
      await setDoc(doc(db, "products", product.id), {
        ...product,
        updatedAt: serverTimestamp(),
      });
    }
    console.log(`✅ Seeded ${products.length} products to Firestore`);
  } catch (err: any) {
    console.warn("Firestore seedProducts warning:", err.message);
  }
}

/** Fetch all products from Firestore */
export async function getProductsFromDB(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, "products"));
    return snap.docs.map((d) => d.data() as Product);
  } catch (err: any) {
    console.warn("Firestore getProductsFromDB permission warning:", err.message);
    return [];
  }
}

/** Add a single product to Firestore */
export async function addProductToDB(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, "products", product.id), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err: any) {
    console.warn("Firestore addProductToDB warning:", err.message);
  }
}

/** Update product in Firestore */
export async function updateProductInDB(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, "products", product.id), {
      ...product,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err: any) {
    console.warn("Firestore updateProductInDB warning:", err.message);
  }
}

/** Delete product from Firestore */
export async function deleteProductFromDB(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (err: any) {
    console.warn("Firestore deleteProductFromDB warning:", err.message);
  }
}

/** Update stock for a single product */
export async function updateStockInDB(productId: string, stock: number): Promise<void> {
  try {
    await updateDoc(doc(db, "products", productId), {
      stock,
      updatedAt: serverTimestamp(),
    });
  } catch (err: any) {
    console.warn("Firestore updateStockInDB warning:", err.message);
  }
}

/** Real-time products listener */
export function listenToProducts(
  callback: (products: Product[]) => void
): Unsubscribe {
  try {
    return onSnapshot(
      collection(db, "products"),
      (snap) => {
        callback(snap.docs.map((d) => d.data() as Product));
      },
      (error) => {
        console.warn("Firestore listenToProducts permission warning:", error.message);
      }
    );
  } catch (err: any) {
    console.warn("Firestore listenToProducts failed setup:", err.message);
    return () => {};
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// WISHLIST
// ─────────────────────────────────────────────────────────────────────────────

/** Save wishlist for a user */
export async function saveWishlist(userId: string, productIds: string[]): Promise<void> {
  try {
    await setDoc(
      doc(db, "wishlists", userId),
      { productIds, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err: any) {
    console.warn("Firestore saveWishlist warning:", err.message);
  }
}

/** Get wishlist for a user */
export async function getWishlist(userId: string): Promise<string[]> {
  try {
    const snap = await getDoc(doc(db, "wishlists", userId));
    return snap.exists() ? (snap.data().productIds as string[]) : [];
  } catch (err: any) {
    console.warn("Firestore getWishlist warning:", err.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT FORM SUBMISSIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

export async function saveContactSubmission(data: ContactSubmission): Promise<string> {
  try {
    const ref = await addDoc(collection(db, "contacts"), {
      ...data,
      submittedAt: serverTimestamp(),
      status: "new",
    });
    return ref.id;
  } catch (err: any) {
    console.warn("Firestore saveContactSubmission warning:", err.message);
    return `contact-local-${Date.now()}`;
  }
}

/** Get all contact submissions (admin) */
export async function getContactSubmissions(): Promise<(ContactSubmission & { id: string })[]> {
  try {
    const q = query(collection(db, "contacts"), orderBy("submittedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id } as ContactSubmission & { id: string }));
  } catch (err: any) {
    console.warn("Firestore getContactSubmissions warning:", err.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER SUBSCRIBERS
// ─────────────────────────────────────────────────────────────────────────────

export async function addSubscriber(email: string): Promise<void> {
  try {
    const id = email.toLowerCase().replace(/[.#$[\]]/g, "_");
    await setDoc(
      doc(db, "subscribers", id),
      { email, subscribedAt: serverTimestamp(), active: true },
      { merge: true }
    );
  } catch (err: any) {
    console.warn("Firestore addSubscriber warning:", err.message);
  }
}

/** Get total subscriber count */
export async function getSubscriberCount(): Promise<number> {
  try {
    const snap = await getDocs(collection(db, "subscribers"));
    return snap.size;
  } catch (err: any) {
    console.warn("Firestore getSubscriberCount warning:", err.message);
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Log a page view or custom event to Firestore analytics collection */
export async function logEvent(event: string, data?: Record<string, unknown>): Promise<void> {
  try {
    await addDoc(collection(db, "analytics_events"), {
      event,
      data: data || {},
      timestamp: serverTimestamp(),
    });
  } catch {
    // Non-critical — silently fail
  }
}
