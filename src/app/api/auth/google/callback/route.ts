import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK (server-side only)
function getAdminAuth() {
  if (!getApps().length) {
    // Vercel stores env vars with real newlines; .env.local uses \n escape sequences
    // Handle both formats reliably
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
    const privateKey = rawKey.includes("\\n")
      ? rawKey.replace(/\\n/g, "\n")
      : rawKey;

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
  return getAuth();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const returnedStateRaw = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // Handle user-denied consent
  if (error) {
    return NextResponse.redirect(`${appUrl}/signin?error=google_cancelled`);
  }

  if (!code || !returnedStateRaw) {
    return NextResponse.redirect(`${appUrl}/signin?error=invalid_callback`);
  }

  // Validate state cookie to prevent CSRF
  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;

  let parsedState: { state: string; redirectTo: string } | null = null;
  try {
    parsedState = JSON.parse(returnedStateRaw);
  } catch {
    return NextResponse.redirect(`${appUrl}/signin?error=invalid_state`);
  }

  if (!savedState || savedState !== parsedState?.state) {
    return NextResponse.redirect(`${appUrl}/signin?error=state_mismatch`);
  }

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${appUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.redirect(`${appUrl}/signin?error=token_exchange_failed`);
    }

    // Fetch Google user profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileRes.json();

    if (!profile.id || !profile.email) {
      return NextResponse.redirect(`${appUrl}/signin?error=profile_fetch_failed`);
    }

    // Create a Firebase custom token for this Google user
    const adminAuth = getAdminAuth();
    const firebaseUid = `google_${profile.id}`;

    const customToken = await adminAuth.createCustomToken(firebaseUid, {
      email: profile.email,
      name: profile.name || profile.email.split("@")[0],
      picture: profile.picture || "",
      provider: "google",
    });

    // Also ensure the user exists in Firebase Auth
    try {
      await adminAuth.getUser(firebaseUid);
    } catch {
      // Create the Firebase user if they don't exist
      await adminAuth.createUser({
        uid: firebaseUid,
        email: profile.email,
        displayName: profile.name || profile.email.split("@")[0],
        photoURL: profile.picture || undefined,
        emailVerified: true,
      });
    }

    // Clear the state cookie
    const response = NextResponse.redirect(
      `${appUrl}/auth/callback?token=${encodeURIComponent(customToken)}&redirect=${encodeURIComponent(parsedState.redirectTo || "/")}`
    );

    response.cookies.delete("google_oauth_state");
    return response;

  } catch (err: any) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(`${appUrl}/signin?error=server_error`);
  }
}
