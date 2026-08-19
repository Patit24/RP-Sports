"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useStore } from "@/lib/store";
import { saveUser, getUser } from "@/lib/firestoreService";

// Inner component uses useSearchParams — must be inside <Suspense>
function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, showToast } = useStore();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [loadingStep, setLoadingStep] = useState<"signin" | "account" | "checkout">("signin");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const rawRedirect = searchParams.get("redirect") || "/";
    const redirectTo = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.includes("://")
      ? rawRedirect
      : "/";
    const error = searchParams.get("error");
    const fallback = searchParams.get("fallback");
    const fallbackEmail = searchParams.get("email");
    const fallbackName = searchParams.get("name");
    const fallbackUid = searchParams.get("uid");

    if (error) {
      const messages: Record<string, string> = {
        google_cancelled: "Google sign-in was cancelled.",
        invalid_callback: "Invalid authentication callback.",
        invalid_state: "Security state mismatch. Please try again.",
        state_mismatch: "Security check failed. Please try again.",
        token_exchange_failed: "Failed to complete Google sign-in. Please try again.",
        profile_fetch_failed: "Could not fetch Google profile. Please try again.",
        server_error: "A server error occurred. Please try again.",
        oauth_not_configured: "Google Sign-In is being configured. Please use Email login for now.",
      };
      setErrorMsg(messages[error] || "Sign-in failed. Please try again.");
      setStatus("error");
      setTimeout(() => router.push("/signin"), 3000);
      return;
    }

    // Fallback mode — Firebase Admin not configured yet, use profile info directly
    if (fallback === "1" && fallbackEmail && fallbackName && fallbackUid) {
      setLoadingStep("account");
      const email = decodeURIComponent(fallbackEmail).toLowerCase().trim();
      const name = decodeURIComponent(fallbackName);
      const uid = decodeURIComponent(fallbackUid);

      const isAdminEmail = (e: string) => {
        const norm = e.toLowerCase().trim();
        return norm === "admin@rpsports.com" || 
               norm === "superadmin@colortrade.app" || 
               norm === "admin@colortrade.app" ||
               norm === "patitroy29@gmail.com";
      };

      getUser(uid).then(async (profile) => {
        const role = profile?.role || (isAdminEmail(email) ? (email.includes("superadmin") ? "super_admin" : "admin") : "customer");
        const userProfile = { uid, email, name, role, rewardPoints: profile?.rewardPoints ?? 100, addresses: profile?.addresses || [] };
        
        await saveUser(uid, userProfile).catch(console.error);
        if (email && email !== uid) {
          await saveUser(email, userProfile).catch(console.error);
        }

        setLoadingStep("checkout");
        login(email, name, role, [], uid);
        useStore.setState({
          currentUser: { uid, email, name, role, addresses: profile?.addresses || [], rewardPoints: profile?.rewardPoints ?? 100 },
          orders: [],
        });
        showToast(`Welcome, ${name}!`, "success");
        router.push(redirectTo);
      }).catch(async (err) => {
        console.error("Fallback getUser failed:", err);
        const userProfile = { uid, email, name, role: "customer" as const, rewardPoints: 100, addresses: [] };
        await saveUser(uid, userProfile).catch(console.error);
        if (email && email !== uid) {
          await saveUser(email, userProfile).catch(console.error);
        }

        setLoadingStep("checkout");
        login(email, name, "customer", [], uid);
        useStore.setState({
          currentUser: { uid, email, name, role: "customer", addresses: [], rewardPoints: 100 },
          orders: [],
        });
        showToast(`Welcome, ${name}!`, "success");
        router.push(redirectTo);
      });
      return;
    }

    async function authenticate() {
      setLoadingStep("signin");
      let token = searchParams.get("token");
      if (!token) {
        try {
          const res = await fetch("/api/auth/token");
          const data = await res.json();
          if (data.token) {
            token = data.token;
          }
        } catch (err) {
          console.warn("Could not retrieve token from cookie:", err);
        }
      }

      if (!token) {
        setErrorMsg("Missing authentication token. Redirecting...");
        setStatus("error");
        setTimeout(() => router.push("/signin"), 2000);
        return;
      }

      const isAdminEmail = (e: string) => {
        const norm = e.toLowerCase().trim();
        return norm === "admin@rpsports.com" || 
               norm === "superadmin@colortrade.app" || 
               norm === "admin@colortrade.app" ||
               norm === "patitroy29@gmail.com";
      };

      // Sign in to Firebase with the custom token
      signInWithCustomToken(auth, token)
        .then(async (result) => {
          setLoadingStep("account");
          const user = result.user;
          const name = user.displayName || user.email?.split("@")[0] || "RP Athlete";
          const email = (user.email || `${user.uid}@google.com`).toLowerCase().trim();

          // Check if user already exists in DB to preserve their role
          const profile = await getUser(user.uid);
          const role = profile?.role || (isAdminEmail(email) ? (email.includes("superadmin") ? "super_admin" : "admin") : "customer");

          const userProfile = {
            uid: user.uid,
            email,
            name,
            role,
            addresses: profile?.addresses || [],
            rewardPoints: profile?.rewardPoints ?? 100,
          };

          // Save user profile to Firestore under both UID and email
          await saveUser(user.uid, userProfile).catch(console.error);
          if (email && email !== user.uid) {
            await saveUser(email, userProfile).catch(console.error);
          }

          setLoadingStep("checkout");
          // Update Zustand store and reset orders
          login(email, name, role, [], user.uid);
          useStore.setState({
            currentUser: userProfile,
            orders: [],
          });

          showToast(`Welcome, ${name}!`, "success");
          router.push(redirectTo);
        })
        .catch((err) => {
          console.error("Custom token sign-in failed:", err);
          setErrorMsg("Failed to complete sign-in. Please try again.");
          setStatus("error");
          setTimeout(() => router.push("/signin"), 3000);
        });
    }

    authenticate();
  }, [searchParams, router, login, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
      <div className="text-center space-y-4 p-8">
        {status === "loading" ? (
          <>
            <div className="w-14 h-14 mx-auto border-4 border-gray-200 border-t-[#CC0000] rounded-full animate-spin" />
            <p className="text-[#111111] font-display font-bold text-lg uppercase tracking-wider">
              {loadingStep === "signin" && "Signing you in..."}
              {loadingStep === "account" && "Creating your account..."}
              {loadingStep === "checkout" && "Preparing your checkout..."}
            </p>
            <p className="text-gray-500 text-sm">
              {loadingStep === "signin" && "Completing authentication and establishing secure session."}
              {loadingStep === "account" && "Synchronizing customer profile databases."}
              {loadingStep === "checkout" && "Restoring your active checkout cart state."}
            </p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-[#CC0000] text-2xl">✕</span>
            </div>
            <p className="text-[#CC0000] font-bold text-base">{errorMsg}</p>
            <p className="text-gray-500 text-sm">Redirecting to sign-in page...</p>
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback shown while the inner component is being hydrated
function AuthCallbackFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
      <div className="text-center space-y-4 p-8">
        <div className="w-14 h-14 mx-auto border-4 border-gray-200 border-t-[#CC0000] rounded-full animate-spin" />
        <p className="text-[#111111] font-display font-bold text-lg uppercase tracking-wider">
          Signing you in...
        </p>
      </div>
    </div>
  );
}

// Page export wraps inner component in Suspense — required by Next.js for useSearchParams
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackInner />
    </Suspense>
  );
}
