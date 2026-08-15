import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawRedirect = searchParams.get("redirect") || "/";
  // [SECURITY C-2] Validate redirect is a relative path to prevent open redirect attacks.
  // An attacker could craft ?redirect=https://evil.com to steal Firebase tokens post-login.
  const redirectTo = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.includes("://")
    ? rawRedirect
    : "/";

  // Guard: ensure required env vars are present
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.NEXT_PUBLIC_APP_URL) {
    console.error("Missing required env vars: GOOGLE_CLIENT_ID or NEXT_PUBLIC_APP_URL");
    const base = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    return NextResponse.redirect(`${base}/signin?error=oauth_not_configured`);
  }

  // Generate a random state value to prevent CSRF
  const state = crypto.randomBytes(16).toString("hex");

  // Build the Google OAuth URL
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: JSON.stringify({ state, redirectTo }),
    access_type: "offline",
    prompt: "select_account",
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  // Redirect to Google
  const response = NextResponse.redirect(googleAuthUrl);

  // Store state in a short-lived cookie (server-side, no sessionStorage needed)
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}
