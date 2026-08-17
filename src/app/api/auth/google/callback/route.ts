import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Get the base app URL — works dynamically at runtime on Vercel production, preview and local
function getAppUrl(request: Request, parsedOrigin?: string): string {
  if (parsedOrigin && (parsedOrigin.startsWith("https://") || parsedOrigin.startsWith("http://localhost"))) {
    return parsedOrigin.replace(/\/$/, "");
  }
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  const host = request.headers.get("host");
  if (host) {
    const proto = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    return `${proto}://${host}`;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

// Initialize Firebase Admin SDK lazily — never throws, returns null on failure
async function getAdminAuth() {
  try {
    const { initializeApp, getApps, cert } = await import("firebase-admin/app");
    const { getAuth } = await import("firebase-admin/auth");

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.error("[OAuth Callback] Missing Firebase Admin env vars");
      return null;
    }

    // Handle both literal \n (from .env.local) and real newlines (from Vercel UI)
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;

    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
    }

    return getAuth();
  } catch (err) {
    console.error("[OAuth Callback] Firebase Admin init failed:", err);
    return null;
  }
}

export async function GET(request: Request) {
  const appUrl = getAppUrl(request);

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const returnedStateRaw = searchParams.get("state");
    const error = searchParams.get("error");

    // User cancelled Google sign-in
    if (error) {
      console.log("[OAuth Callback] User cancelled:", error);
      return NextResponse.redirect(`${appUrl}/signin?error=google_cancelled`);
    }

    if (!code || !returnedStateRaw) {
      console.error("[OAuth Callback] Missing code or state");
      return NextResponse.redirect(`${appUrl}/signin?error=invalid_callback`);
    }

    // Parse state JSON
    let parsedState: { state: string; redirectTo: string; origin?: string } | null = null;
    try {
      parsedState = JSON.parse(decodeURIComponent(returnedStateRaw));
    } catch {
      try {
        parsedState = JSON.parse(returnedStateRaw);
      } catch {
        console.error("[OAuth Callback] Could not parse state:", returnedStateRaw);
        return NextResponse.redirect(`${appUrl}/signin?error=invalid_state`);
      }
    }

    const resolvedAppUrl = getAppUrl(request, parsedState?.origin);

    if (!parsedState?.state) {
      return NextResponse.redirect(`${resolvedAppUrl}/signin?error=invalid_state`);
    }

    // Validate CSRF state cookie
    let savedState: string | undefined;
    try {
      const cookieStore = await cookies();
      savedState = cookieStore.get("google_oauth_state")?.value;
    } catch (err) {
      console.warn("[OAuth Callback] Could not read state cookie:", err);
    }

    if (!savedState) {
      // [SECURITY H-2] Hard-reject if state cookie is absent — do NOT silently bypass CSRF protection.
      // Cookies can be blocked in some environments but security must take precedence.
      console.warn("[OAuth Callback] State cookie missing — possible CSRF attempt.");
      return NextResponse.redirect(`${resolvedAppUrl}/signin?error=state_mismatch`);
    }

    if (savedState !== parsedState.state) {
      console.warn("[OAuth Callback] State mismatch. saved:", savedState?.slice(0, 8), "returned:", parsedState.state?.slice(0, 8));
      return NextResponse.redirect(`${resolvedAppUrl}/signin?error=state_mismatch`);
    }

    const rawRedirect = parsedState.redirectTo || "/";
    // [SECURITY C-2] Validate redirect to be a relative path only
    const redirectTo = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.includes("://")
      ? rawRedirect
      : "/";

    // Exchange authorization code for Google tokens
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("[OAuth Callback] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
      return NextResponse.redirect(`${resolvedAppUrl}/signin?error=oauth_not_configured`);
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${resolvedAppUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("[OAuth Callback] Token exchange failed:", JSON.stringify(tokenData));
      return NextResponse.redirect(`${resolvedAppUrl}/signin?error=token_exchange_failed`);
    }

    // Fetch Google user profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileRes.json();

    if (!profile.id || !profile.email) {
      console.error("[OAuth Callback] Profile fetch failed:", JSON.stringify(profile));
      return NextResponse.redirect(`${resolvedAppUrl}/signin?error=profile_fetch_failed`);
    }

    console.log("[OAuth Callback] Got Google profile for:", profile.email);

    // Try to create Firebase custom token
    const adminAuth = await getAdminAuth();

    if (!adminAuth) {
      // Firebase Admin not available — redirect to a special page that signs in directly via Google ID token
      console.warn("[OAuth Callback] Firebase Admin unavailable — using fallback token flow");
      // Pass user info as URL params so the client can handle it
      const name = encodeURIComponent(profile.name || profile.email.split("@")[0]);
      const email = encodeURIComponent(profile.email);
      const uid = encodeURIComponent(`google_${profile.id}`);
      return NextResponse.redirect(
        `${resolvedAppUrl}/auth/callback?fallback=1&email=${email}&name=${name}&uid=${uid}&redirect=${encodeURIComponent(redirectTo)}`
      );
    }

    const firebaseUid = `google_${profile.id}`;

    // Ensure user exists in Firebase Auth
    try {
      await adminAuth.getUser(firebaseUid);
    } catch {
      await adminAuth.createUser({
        uid: firebaseUid,
        email: profile.email,
        displayName: profile.name || profile.email.split("@")[0],
        photoURL: profile.picture || undefined,
        emailVerified: true,
      });
    }

    const customToken = await adminAuth.createCustomToken(firebaseUid, {
      email: profile.email,
      name: profile.name || profile.email.split("@")[0],
      picture: profile.picture || "",
      provider: "google",
    });

    // Clear the state cookie and redirect to auth callback page
    const response = NextResponse.redirect(
      `${resolvedAppUrl}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
    );
    response.cookies.delete("google_oauth_state");
    
    // [SECURITY L-4] Pass the Firebase custom token via a secure, short-lived, httpOnly cookie
    // instead of a query parameter to avoid URL token leakage in logs/history.
    response.cookies.set("firebase_custom_token", customToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60, // 1 minute is plenty for consumption
      path: "/",
    });
    return response;

  } catch (err: any) {
    console.error("[OAuth Callback] Unexpected error:", err?.message || err);
    const fallbackUrl = getAppUrl(request);
    return NextResponse.redirect(`${fallbackUrl}/signin?error=server_error`);
  }
}
