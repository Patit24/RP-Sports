import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANQ3H4WNGxsbcNDSLCRUoCH0wl_zgU4CY",
  authDomain: typeof window !== "undefined" ? window.location.host : "rpsports-data.firebaseapp.com",
  projectId: "rpsports-data",
  storageBucket: "rpsports-data.firebasestorage.app",
  messagingSenderId: "212466668507",
  appId: "1:212466668507:web:95eda401514d63524d4dfe",
  measurementId: "G-HP0KNXB2MS",
};

// Prevent duplicate app initialization in Next.js (hot reload / SSR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore database instance
export const db = getFirestore(app);

// Firebase Auth instance & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics — only in browser (not SSR)
export const analyticsPromise =
  typeof window !== "undefined"
    ? isSupported().then((yes) => (yes ? getAnalytics(app) : null))
    : Promise.resolve(null);

export default app;

