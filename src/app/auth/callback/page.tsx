"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useStore } from "@/lib/store";
import { saveUser } from "@/lib/firestoreService";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, showToast } = useStore();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const redirectTo = searchParams.get("redirect") || "/";
    const error = searchParams.get("error");

    if (error) {
      const messages: Record<string, string> = {
        google_cancelled: "Google sign-in was cancelled.",
        invalid_callback: "Invalid authentication callback.",
        invalid_state: "Security state mismatch. Please try again.",
        state_mismatch: "Security check failed. Please try again.",
        token_exchange_failed: "Failed to complete Google sign-in. Please try again.",
        profile_fetch_failed: "Could not fetch Google profile. Please try again.",
        server_error: "A server error occurred. Please try again.",
      };
      setErrorMsg(messages[error] || "Sign-in failed. Please try again.");
      setStatus("error");
      setTimeout(() => router.push("/signin"), 3000);
      return;
    }

    if (!token) {
      setErrorMsg("Missing authentication token. Redirecting...");
      setStatus("error");
      setTimeout(() => router.push("/signin"), 2000);
      return;
    }

    // Sign in to Firebase with the custom token
    signInWithCustomToken(auth, token)
      .then(async (result) => {
        const user = result.user;
        const name = user.displayName || user.email?.split("@")[0] || "RP Athlete";
        const email = user.email || `${user.uid}@google.com`;

        // Save user profile to Firestore
        await saveUser(user.uid, {
          uid: user.uid,
          email,
          name,
          role: "customer",
        });

        // Update Zustand store
        login(email, name, "customer", [], user.uid);
        useStore.setState({
          currentUser: {
            uid: user.uid,
            email,
            name,
            role: "customer",
            addresses: [],
            rewardPoints: 100,
          },
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
  }, [searchParams, router, login, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
      <div className="text-center space-y-4 p-8">
        {status === "loading" ? (
          <>
            {/* Spinner */}
            <div className="w-14 h-14 mx-auto border-4 border-gray-200 border-t-[#CC0000] rounded-full animate-spin" />
            <p className="text-[#111111] font-display font-bold text-lg uppercase tracking-wider">
              Signing you in...
            </p>
            <p className="text-gray-500 text-sm">
              Completing Google authentication, please wait.
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
