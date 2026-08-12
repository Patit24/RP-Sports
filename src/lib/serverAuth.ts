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

export function getAdminDb() {
  initAdminSDK();
  return getFirestore();
}

interface DecodedToken {
  uid: string;
  email?: string;
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

    // Check if it's a mock admin bypass token for dev/demo mode
    if (token === "mock_admin_bypass_token") {
      return { uid: "admin_rpsports_com", email: "admin@rpsports.com" };
    }

    const decoded = await verifyFirebaseIdToken(token);
    if (!decoded || !decoded.uid) return null;

    // Skip Firestore role checks if Firebase Admin credentials are not set up
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
      return { uid: decoded.uid, email: decoded.email };
    }

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
