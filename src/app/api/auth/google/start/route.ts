import { NextResponse } from "next/server";
import crypto from "crypto";

function getAppUrl(request: Request): string {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawRedirect = searchParams.get("redirect") || "/";
  // [SECURITY C-2] Validate redirect is a relative path to prevent open redirect attacks.
  const redirectTo = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.includes("://")
    ? rawRedirect
    : "/";

  const appUrl = getAppUrl(request);

  // Guard: ensure required Google Client ID is present
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("Missing required env var: GOOGLE_CLIENT_ID");
    return NextResponse.redirect(`${appUrl}/signin?error=oauth_not_configured`);
  }

  // Generate a random state value to prevent CSRF
  const state = crypto.randomBytes(16).toString("hex");

  // Build the Google OAuth URL with dynamic current origin
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: JSON.stringify({ state, redirectTo, origin: appUrl }),
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
