import { NextResponse } from "next/server";
import { getAdminDb, formatPrivateKey } from "@/lib/serverAuth";
import crypto from "crypto";

export async function GET() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";

  let cryptoParseError = "";
  let isCryptoValid = false;
  let formattedKey = "";

  try {
    formattedKey = formatPrivateKey(rawKey);
    crypto.createPrivateKey(formattedKey);
    isCryptoValid = true;
  } catch (err: any) {
    cryptoParseError = err.message;
  }

  let firestoreError = "";
  let firestoreProductCount = 0;
  let sampleProduct = "";

  try {
    const db = getAdminDb();
    const snap = await db.collection("products").limit(1).get();
    firestoreProductCount = snap.size;
    if (!snap.empty) {
      sampleProduct = snap.docs[0].data().name || snap.docs[0].id;
    }
  } catch (err: any) {
    firestoreError = err.message;
  }

  return NextResponse.json({
    status: firestoreProductCount > 0 ? "SUCCESS" : "ERROR",
    config: {
      hasProjectId: !!projectId,
      projectId: projectId || "MISSING",
      hasClientEmail: !!clientEmail,
      clientEmail: clientEmail || "MISSING",
      hasRawKey: !!rawKey,
      rawKeyLength: rawKey.length,
      rawKeySnippet: rawKey.length > 40 ? `${rawKey.slice(0, 25)}...${rawKey.slice(-25)}` : rawKey,
      isCryptoValid,
      cryptoParseError: cryptoParseError || null,
    },
    firestore: {
      connected: !firestoreError,
      productCount: firestoreProductCount,
      sampleProduct: sampleProduct || null,
      error: firestoreError || null,
    }
  });
}
