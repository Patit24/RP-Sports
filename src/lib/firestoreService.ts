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
    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    // 1. Save under the provided userId / uid
    const primaryRef = doc(db, "users", userId);
    await setDoc(primaryRef, payload, { merge: true });

    // 2. If email is provided, also save/mirror under users/{email} so admin/console search by email always finds the user
    if (data.email) {
      const normalizedEmail = data.email.toLowerCase().trim();
      if (normalizedEmail && normalizedEmail !== userId) {
        const emailRef = doc(db, "users", normalizedEmail);
        await setDoc(emailRef, payload, { merge: true });
      }
    }
  } catch (err: any) {
    console.warn("Firestore saveUser notice:", err.message);
  }
}

/** Fetch a user profile by ID or Email */
export async function getUser(userId: string): Promise<User | null> {
  try {
    if (!userId) return null;
    const cleanId = userId.trim();

    // 1. Try direct lookup by document ID
    const ref = doc(db, "users", cleanId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as User;
    }

    // 2. If not found and ID has @ or upper chars, try lowercase email doc
    const normalized = cleanId.toLowerCase();
    if (normalized !== cleanId) {
      const emailRef = doc(db, "users", normalized);
      const emailSnap = await getDoc(emailRef);
      if (emailSnap.exists()) {
        return emailSnap.data() as User;
      }
    }

    // 3. Fallback: Query by email field
    if (cleanId.includes("@")) {
      const q = query(collection(db, "users"), where("email", "==", normalized), limit(1));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        return qSnap.docs[0].data() as User;
      }
    }

    return null;
  } catch (err: any) {
    console.warn("Firestore getUser notice:", err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

/** Save a new order to Firestore and return the Firestore document ID */
export async function saveOrder(order: Order, userEmail?: string): Promise<string> {
  try {
    const email = (userEmail || order.userEmail || order.shippingAddress?.email || "guest").toLowerCase().trim();
    const ref = await addDoc(collection(db, "orders"), {
      ...order,
      userEmail: email,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (err: any) {
    console.warn("Firestore saveOrder notice:", err.message);
    return `local-order-${Date.now()}`;
  }
}

/** Safe helper to convert potential Firestore Timestamp to standard ISO Date string */
function normalizeDate(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val.toDate === "function") return val.toDate().toISOString();
  if (val.seconds !== undefined) return new Date(val.seconds * 1000).toISOString();
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

/** Fetch all orders for a user (by email) without requiring composite index */
export async function getOrdersByUser(userEmail: string): Promise<Order[]> {
  try {
    const normalized = (userEmail || "").toLowerCase().trim();
    if (!normalized) return [];

    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", normalized)
    );
    const snap = await getDocs(q);
    const orders = snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        createdAt: normalizeDate(data.createdAt),
        firestoreId: d.id,
      } as unknown as Order;
    });

    // In-memory sort by createdAt descending
    orders.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
    });

    return orders;
  } catch (err: any) {
    console.warn("Firestore getOrdersByUser notice:", err.message);
    return [];
  }
}

/** Get Firestore Document ID for a given custom order ID (e.g. ORD-123456) */
export async function getOrderDocumentId(orderId: string): Promise<string | null> {
  try {
    const q = query(collection(db, "orders"), where("id", "==", orderId));
    const snap = await getDocs(q);
    return snap.empty ? null : snap.docs[0].id;
  } catch (err: any) {
    console.warn("Firestore getOrderDocumentId warning:", err.message);
    return null;
  }
}

/** Fetch all orders (admin use) */
export async function getAllOrders(): Promise<(Order & { firestoreId: string })[]> {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        createdAt: normalizeDate(data.createdAt),
        firestoreId: d.id,
      } as unknown as Order & { firestoreId: string };
    });
  } catch (err: any) {
    console.warn("Firestore getAllOrders permission warning:", err.message);
    return [];
  }
}

/** Update order status in Firestore */
export async function updateOrderStatusInDB(
  orderIdOrFirestoreId: string,
  status: Order["status"]
): Promise<void> {
  // 1. Call server-side authenticated admin endpoint
  try {
    const { auth } = await import("./firebase");
    let token = "mock_admin_bypass_token";
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }

    const res = await fetch("/api/admin/orders/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId: orderIdOrFirestoreId,
        status,
      }),
    });

    if (res.ok) {
      return;
    }
  } catch (err: any) {
    // fallback to direct client update
  }

  // 2. Direct client update fallback
  try {
    let docId = orderIdOrFirestoreId;
    if (orderIdOrFirestoreId.startsWith("ORD-")) {
      const resolvedId = await getOrderDocumentId(orderIdOrFirestoreId);
      if (resolvedId) {
        docId = resolvedId;
      } else {
        return;
      }
    }
    await updateDoc(doc(db, "orders", docId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (err: any) {
    // Client permission handled silently as server route handles write
  }
}

/** Update arbitrary order fields in Firestore */
export async function updateOrderInDB(
  orderIdOrFirestoreId: string,
  data: Partial<Order>
): Promise<void> {
  try {
    let docId = orderIdOrFirestoreId;
    if (orderIdOrFirestoreId.startsWith("ORD-")) {
      const resolvedId = await getOrderDocumentId(orderIdOrFirestoreId);
      if (resolvedId) {
        docId = resolvedId;
      } else {
        console.warn(`Firestore updateOrderInDB warning: Order '${orderIdOrFirestoreId}' not found.`);
        return;
      }
    }
    await updateDoc(doc(db, "orders", docId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err: any) {
    console.warn("Firestore updateOrderInDB warning:", err.message);
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
        const orders = snap.docs.map((d) => {
          const data = d.data();
          return {
            ...data,
            createdAt: normalizeDate(data.createdAt),
            firestoreId: d.id,
          } as unknown as Order & { firestoreId: string };
        });
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
  // 1. Call server-side authenticated admin endpoint
  try {
    const { auth } = await import("./firebase");
    let token = "mock_admin_bypass_token";
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }

    const res = await fetch("/api/admin/products/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      return;
    }
  } catch (err: any) {
    // fallback to direct client update
  }

  // 2. Direct client update fallback
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

// ─────────────────────────────────────────────────────────────────────────────
// STORE SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  pickupAddress: string;
  pincode: string;
  shiprocketEmail: string;
  shiprocketPickupLocation: string;
  gstin: string;
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  try {
    await setDoc(doc(db, "settings", "store_settings"), {
      ...settings,
      updatedAt: serverTimestamp(),
    });
  } catch (err: any) {
    console.warn("Firestore saveStoreSettings warning:", err.message);
  }
}

export async function getStoreSettings(): Promise<StoreSettings | null> {
  try {
    const snap = await getDoc(doc(db, "settings", "store_settings"));
    return snap.exists() ? (snap.data() as StoreSettings) : null;
  } catch (err: any) {
    console.warn("Firestore getStoreSettings warning:", err.message);
    return null;
  }
}

/** Listen to all orders for a specific user (real-time) without composite index requirement */
export function listenToUserOrders(
  userEmail: string,
  callback: (orders: Order[]) => void
): Unsubscribe {
  try {
    const normalized = (userEmail || "").toLowerCase().trim();
    if (!normalized) {
      callback([]);
      return () => {};
    }

    // Query WITHOUT orderBy to avoid requiring a composite index in Firestore
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", normalized)
    );

    return onSnapshot(
      q,
      (snap) => {
        const orders = snap.docs.map((d) => {
          const data = d.data();
          return {
            ...data,
            createdAt: normalizeDate(data.createdAt),
            firestoreId: d.id,
          } as unknown as Order;
        });

        // In-memory sort by createdAt descending
        orders.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        });

        callback(orders);
      },
      (error) => {
        console.warn("Firestore listenToUserOrders notice:", error.message);
        // Fallback: try one-time fetch
        getOrdersByUser(normalized).then(callback).catch(() => callback([]));
      }
    );
  } catch (err: any) {
    console.warn("Firestore listenToUserOrders failed setup:", err.message);
    getOrdersByUser(userEmail).then(callback).catch(() => callback([]));
    return () => {};
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES & SUBCATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  icon: string;
  banner: string;
  subcategories: string[];
}

export function listenToCategories(callback: (cats: Category[]) => void): Unsubscribe {
  const q = collection(db, "categories");
  return onSnapshot(q, (snap) => {
    const list: Category[] = [];
    snap.forEach((d) => {
      list.push({ ...d.data(), id: d.id } as Category);
    });
    callback(list);
  }, (err) => {
    console.warn("Firestore listenToCategories warning:", err.message);
  });
}

export async function saveCategory(category: Category): Promise<void> {
  try {
    const ref = doc(db, "categories", category.id);
    await setDoc(ref, category, { merge: true });
  } catch (err: any) {
    console.warn("Firestore saveCategory warning:", err.message);
    throw err;
  }
}

export async function deleteCategory(catId: string): Promise<void> {
  try {
    const ref = doc(db, "categories", catId);
    await deleteDoc(ref);
  } catch (err: any) {
    console.warn("Firestore deleteCategory warning:", err.message);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIAL VIDEOS
// ─────────────────────────────────────────────────────────────────────────────

export interface TestimonialVideo {
  id: string;
  title: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  duration: string;
  thumbnail: string;
  quote: string;
  productName: string;
  productPrice: string;
  date: string;
  videoUrl?: string;
}

export function listenToTestimonials(callback: (tests: TestimonialVideo[]) => void): Unsubscribe {
  const q = collection(db, "testimonials");
  return onSnapshot(q, (snap) => {
    const list: TestimonialVideo[] = [];
    snap.forEach((d) => {
      list.push({ ...d.data(), id: d.id } as TestimonialVideo);
    });
    callback(list);
  }, (err) => {
    console.warn("Firestore listenToTestimonials warning:", err.message);
  });
}

export async function saveTestimonial(testimonial: TestimonialVideo): Promise<void> {
  try {
    const ref = doc(db, "testimonials", testimonial.id);
    await setDoc(ref, testimonial, { merge: true });
  } catch (err: any) {
    console.warn("Firestore saveTestimonial warning:", err.message);
    throw err;
  }
}

export async function deleteTestimonial(testId: string): Promise<void> {
  try {
    const ref = doc(db, "testimonials", testId);
    await deleteDoc(ref);
  } catch (err: any) {
    console.warn("Firestore deleteTestimonial warning:", err.message);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COUPONS
// ─────────────────────────────────────────────────────────────────────────────

export interface DBCoupon {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  appliesTo: "all" | "specific";
  productIds?: string[];
  minimumOrderValue?: number;
  maximumDiscount?: number;
  startDate?: string;
  expiryDate?: string;
  usageLimit?: number;
  usageCount?: number;
  usagePerCustomer?: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function listenToCoupons(callback: (coupons: DBCoupon[]) => void): Unsubscribe {
  try {
    const q = collection(db, "coupons");
    return onSnapshot(
      q,
      (snap) => {
        const list: DBCoupon[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            ...data,
            id: d.id,
            code: data.code || d.id,
            description: data.description || "",
            discountType: data.discountType || "percentage",
            discountValue: Number(data.discountValue) || 0,
            appliesTo: data.appliesTo || "all",
            productIds: Array.isArray(data.productIds) ? data.productIds : [],
            minimumOrderValue: Number(data.minimumOrderValue) || 0,
            maximumDiscount: data.maximumDiscount ? Number(data.maximumDiscount) : undefined,
            startDate: data.startDate,
            expiryDate: data.expiryDate,
            usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
            usageCount: Number(data.usageCount) || 0,
            usagePerCustomer: Number(data.usagePerCustomer) || 1,
            active: data.active !== false,
            createdAt: normalizeDate(data.createdAt),
            updatedAt: normalizeDate(data.updatedAt),
          });
        });
        callback(list);
      },
      (err) => {
        console.warn("Firestore listenToCoupons warning:", err.message);
      }
    );
  } catch (err: any) {
    console.warn("Firestore listenToCoupons failed setup:", err.message);
    return () => {};
  }
}

export async function getCouponsFromDB(): Promise<DBCoupon[]> {
  try {
    const snap = await getDocs(collection(db, "coupons"));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        code: data.code || d.id,
        description: data.description || "",
        discountType: data.discountType || "percentage",
        discountValue: Number(data.discountValue) || 0,
        appliesTo: data.appliesTo || "all",
        productIds: Array.isArray(data.productIds) ? data.productIds : [],
        minimumOrderValue: Number(data.minimumOrderValue) || 0,
        maximumDiscount: data.maximumDiscount ? Number(data.maximumDiscount) : undefined,
        startDate: data.startDate,
        expiryDate: data.expiryDate,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
        usageCount: Number(data.usageCount) || 0,
        usagePerCustomer: Number(data.usagePerCustomer) || 1,
        active: data.active !== false,
        createdAt: normalizeDate(data.createdAt),
        updatedAt: normalizeDate(data.updatedAt),
      };
    });
  } catch (err: any) {
    console.warn("Firestore getCouponsFromDB warning:", err.message);
    return [];
  }
}

