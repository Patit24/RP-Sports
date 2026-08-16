import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import crypto from "crypto";

let isInitialized = false;

function initAdminSDK() {
  if (isInitialized || getApps().length > 0) {
    isInitialized = true;
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey || rawKey.includes("PLACEHOLDER")) {
    console.warn("⚠️ Firebase Admin credentials are not fully configured (using placeholders). Falling back to mock database mode.");
    isInitialized = true;
    return;
  }

  let cleanKey = rawKey.trim();
  if (cleanKey.startsWith('"') && cleanKey.endsWith('"')) {
    cleanKey = cleanKey.substring(1, cleanKey.length - 1);
  }
  if (cleanKey.startsWith("'") && cleanKey.endsWith("'")) {
    cleanKey = cleanKey.substring(1, cleanKey.length - 1);
  }
  const privateKey = cleanKey.includes("\\n") ? cleanKey.replace(/\\n/g, "\n") : cleanKey;

  try {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (err: any) {
    console.error("❌ Failed to initialize Firebase Admin SDK with private key:", err.message);
  }
  isInitialized = true;
}

export function getAdminDb() {
  initAdminSDK();
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!rawKey || rawKey.includes("PLACEHOLDER")) {
    throw new Error("Firebase Admin SDK is not initialized. Please add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in Vercel settings and trigger a new deployment.");
  }
  return getFirestore();
}

interface DecodedToken {
  uid: string;
  email?: string;
  name?: string;
  exp: number;
  iss: string;
  aud: string;
}

// In-memory cache for Google's public certificates
let googleCertsCache: { [key: string]: string } | null = null;
let googleCertsExpiry = 0;

async function fetchGooglePublicCerts(): Promise<{ [key: string]: string }> {
  if (googleCertsCache && Date.now() < googleCertsExpiry) {
    return googleCertsCache;
  }

  const res = await fetch(
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken-system@system.gserviceaccount.com"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch Google public certs");
  }

  const cacheControl = res.headers.get("cache-control") || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 3600;

  const certs = await res.json();
  googleCertsCache = certs;
  googleCertsExpiry = Date.now() + maxAge * 1000;
  return certs;
}

export async function verifyFirebaseIdToken(token: string): Promise<DecodedToken | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    
    // Decode header & payload
    const header = JSON.parse(Buffer.from(headerB64, "base64").toString("utf-8"));
    const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString("utf-8"));

    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
      // In local dev/demo mode without Firebase Admin configured, mock authentication succeeds
      return {
        uid: payload.sub || "mock_uid",
        email: payload.email || "admin@rpsports.com",
        exp: payload.exp || Math.floor(Date.now() / 1000) + 3600,
        iss: "",
        aud: ""
      };
    }

    // Verify basic JWT claims
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn("verifyFirebaseIdToken: Token has expired.");
      return null;
    }
    if (payload.aud !== projectId) {
      console.warn("verifyFirebaseIdToken: Audience mismatch.");
      return null;
    }
    if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
      console.warn("verifyFirebaseIdToken: Issuer mismatch.");
      return null;
    }

    // Fetch Google public certificates
    const certs = await fetchGooglePublicCerts();
    const cert = certs[header.kid];
    if (!cert) {
      console.warn("verifyFirebaseIdToken: Public key not found for kid:", header.kid);
      return null;
    }

    // Verify signature using crypto
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(`${headerB64}.${payloadB64}`);
    
    // Base64url decode helper for signatures
    const base64Signature = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    const isValid = verifier.verify(cert, base64Signature, "base64");
    
    if (!isValid) {
      console.warn("verifyFirebaseIdToken: Signature verification failed.");
      return null;
    }

    return {
      uid: payload.sub,
      email: payload.email,
      name: payload.name || payload.displayName,
      exp: payload.exp,
      iss: payload.iss,
      aud: payload.aud,
    };
  } catch (err: any) {
    console.error("verifyFirebaseIdToken error:", err.message || err);
    return null;
  }
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

    // Check if it's a mock admin bypass token for dev/demo mode only
    if (token === "mock_admin_bypass_token" && process.env.NODE_ENV !== "production") {
      return { uid: "admin_rpsports_com", email: "admin@rpsports.com" };
    }

    const decoded = await verifyFirebaseIdToken(token);
    if (!decoded || !decoded.uid) return null;

    // Admin email list for auto-promotion and bypass
    const ADMIN_EMAILS = [
      "admin@rpsports.com",
      "superadmin@colortrade.app",
      "admin@colortrade.app",
      "patitroy29@gmail.com"
    ];

    const isBackupAdmin = decoded.email && ADMIN_EMAILS.includes(decoded.email.toLowerCase().trim());

    // Skip Firestore role checks if Firebase Admin credentials are not set up
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!projectId || !rawKey || rawKey.includes("PLACEHOLDER")) {
      return { uid: decoded.uid, email: decoded.email };
    }

    const db = getAdminDb();

    // Auto-promote backup admin email if profile role is missing in Firestore
    if (isBackupAdmin) {
      try {
        const userRef = db.collection("users").doc(decoded.uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists || !["admin", "super_admin"].includes(userDoc.data()?.role)) {
          const role = decoded.email!.toLowerCase().includes("superadmin") ? "super_admin" : "admin";
          await userRef.set({
            uid: decoded.uid,
            email: decoded.email!.toLowerCase().trim(),
            name: decoded.name || decoded.email!.split("@")[0],
            role: role,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          console.log(`[Auto-Promote] Successfully promoted backup admin ${decoded.email} to ${role} in Firestore.`);
        }
      } catch (err: any) {
        console.error("[Auto-Promote] Error promoting user:", err.message);
      }
      return { uid: decoded.uid, email: decoded.email };
    }

    // Check role in users collection in Firestore
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

    return null;
  } catch (err: any) {
    console.error("verifyAdmin authentication error:", err.message || err);
    return null;
  }
}
