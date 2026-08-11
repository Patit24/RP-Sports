"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Lock, Mail, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { getUser } from "@/lib/firestoreService";

interface CheckoutAuthGateProps {
  onSuccess?: () => void;
}

export default function CheckoutAuthGate({ onSuccess }: CheckoutAuthGateProps) {
  const { login, showToast } = useStore();

  const [authTab, setAuthTab] = useState<"google" | "email">("google");

  // Email Form State
  const [emailForm, setEmailForm] = useState({ email: "", password: "" });

  // Status
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for real-time Firebase Auth state change (handles email login)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        setLoading(true);
        try {
          const profile = await getUser(user.uid);
          const name = profile?.name || user.displayName || user.email.split("@")[0] || "RP Athlete";
          const rewardPoints = profile?.rewardPoints ?? 100;
          const addresses = profile?.addresses ?? [];
          const role = profile?.role || (user.email === "admin@rpsports.com" ? "admin" : "customer");

          login(user.email, name, role, [], user.uid);

          useStore.setState({
            currentUser: {
              uid: user.uid,
              email: user.email!,
              name,
              role,
              addresses,
              rewardPoints,
            }
          });

          showToast(`Logged in as ${name}`, "success");
          if (onSuccess) onSuccess();
        } catch (err) {
          console.error("Error loading user profile during checkout gate:", err);
          const name = user.displayName || user.email.split("@")[0] || "RP Athlete";
          const role = user.email === "admin@rpsports.com" ? "admin" : "customer";
          login(user.email, name, role, [], user.uid);
          if (onSuccess) onSuccess();
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [login, showToast, onSuccess]);

  // Handle Google Sign-In — direct server-side OAuth (no popup, no Firebase redirect)
  const handleGoogleSignIn = () => {
    window.location.href = `/api/auth/google/start?redirect=${encodeURIComponent("/checkout")}`;
  };

  // Handle Email Sign-In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailForm.email || !emailForm.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, emailForm.email, emailForm.password);
    } catch (err: any) {
      console.error("Email sign-in error at checkout:", err);
      let errMsg = "Invalid email or password.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errMsg = "Invalid email or password.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Please enter a valid email address.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 md:p-10 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-50 text-[#CC0000] border border-red-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#CC0000]/10 text-[#CC0000] font-display font-bold uppercase tracking-widest text-[11px] px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Authentication Required
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-black uppercase text-[#111111] tracking-tight mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Login to Proceed to Checkout
          </h2>
          <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">
            Please complete Google Sign-In or Email Authentication to secure your order and enable tracking.
          </p>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => { setAuthTab("google"); setError(""); setInfoMessage(""); }}
            className={`flex-1 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authTab === "google"
                ? "bg-white text-[#111111] shadow-sm font-black"
                : "text-gray-600 hover:text-[#111111]"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google Sign-In
          </button>

          <button
            onClick={() => { setAuthTab("email"); setError(""); setInfoMessage(""); }}
            className={`flex-1 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authTab === "email"
                ? "bg-white text-[#111111] shadow-sm font-black"
                : "text-gray-600 hover:text-[#111111]"
            }`}
          >
            <Mail className="w-4 h-4 text-[#CC0000]" /> Email Login
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-4 py-3 mb-6 rounded-xl text-left">
            <AlertCircle className="w-4 h-4 text-[#CC0000] flex-shrink-0" />
            <p className="text-xs text-[#CC0000] font-bold">{error}</p>
          </div>
        )}

        {/* Info Notification */}
        {infoMessage && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-3 mb-6 rounded-xl text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-emerald-700 font-bold">{infoMessage}</p>
          </div>
        )}

        {/* TAB 1: GOOGLE SIGN IN */}
        {authTab === "google" && (
          <div className="space-y-4 py-4">


            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-14 border-2 border-gray-200 hover:border-[#CC0000] bg-white text-sm font-bold text-gray-700 hover:text-[#CC0000] transition-all rounded-xl cursor-pointer shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{loading ? "Connecting Google..." : "1-Click Sign In with Google"}</span>
            </button>
          </div>
        )}

        {/* TAB 2: EMAIL SIGN IN */}
        {authTab === "email" && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2 text-left">
                Email Address
              </label>
              <input
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full h-12 px-4 border border-gray-300 bg-white text-[#111111] text-sm focus:outline-none focus:border-[#CC0000] rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2 text-left">
                Password
              </label>
              <input
                type="password"
                value={emailForm.password}
                onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                placeholder="Enter password"
                className="w-full h-12 px-4 border border-gray-300 bg-white text-[#111111] text-sm focus:outline-none focus:border-[#CC0000] rounded-xl"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#CC0000]/30"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              {loading ? "Signing In..." : "Sign In & Proceed to Checkout"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-medium">
            Protected by 256-Bit SSL Encryption & Firebase Auth.
          </p>
        </div>

      </div>
    </div>
  );
}
