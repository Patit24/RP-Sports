import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let isInitialized = false;

function initAdminSDK() {
  if (isInitialized || getApps().length > 0) {
    isInitialized = true;
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    throw new Error("Missing Firebase Admin credentials in environment variables.");
  }

  const privateKey = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
  isInitialized = true;
}

export function getAdminAuth() {
  initAdminSDK();
  return getAuth();
}

export function getAdminDb() {
  initAdminSDK();
  return getFirestore();
}

/**
 * Verify if the request comes from an authenticated administrator
 */
export async function verifyAdmin(request: Request): Promise<{ uid: string; email?: string } | null> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) return null;

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);
    if (!decoded || !decoded.uid) return null;

    // Check role in users collection in Firestore
    const db = getAdminDb();
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    
    // Fallback: If it's a simulated admin user ID (like admin_rpsports_com) or has admin role field
    const isAdminId = decoded.uid === "admin_rpsports_com" || 
                      decoded.uid === "catalog_rpsports_com" || 
                      decoded.uid === "warehouse_rpsports_com";

    if (isAdminId) {
      return { uid: decoded.uid, email: decoded.email };
    }

    if (userDoc.exists) {
      const role = userDoc.data()?.role;
      if (role === "admin" || role === "super_admin") {
        return { uid: decoded.uid, email: decoded.email };
      }
    }

    // Secondary fallback: check email string directly as backup admin
    if (decoded.email === "admin@rpsports.com") {
      return { uid: decoded.uid, email: decoded.email };
    }

    return null;
  } catch (err: any) {
    console.error("verifyAdmin authentication error:", err.message || err);
    return null;
  }
}
