"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, AlertCircle, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser } from "@/lib/firestoreService";

function SignInPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, login, showToast } = useStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Show error from OAuth callback (e.g. ?error=google_cancelled)
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      const messages: Record<string, string> = {
        google_cancelled: "Google sign-in was cancelled.",
        invalid_callback: "Invalid authentication callback.",
        state_mismatch: "Security check failed. Please try again.",
        token_exchange_failed: "Failed to complete Google sign-in. Please try again.",
        server_error: "A server error occurred. Please try again.",
        oauth_not_configured: "Google Sign-In is being set up. Please use Email & Password login for now.",
      };
      setError(messages[oauthError] || "Google Sign-In failed. Please try again.");
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  useEffect(() => {
    // Real-time Firebase Auth listener for email auth
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

          showToast(`Welcome back, ${name}!`, "success");
          router.push("/");
        } catch (err: any) {
          console.error("Error loading user profile:", err);
          const name = user.displayName || user.email.split("@")[0] || "RP Athlete";
          login(user.email, name, "customer", [], user.uid);
          router.push("/");
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [login, showToast, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle Standard Email/Password Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
    } catch (err: any) {
      console.error("Sign-in error:", err);
      let errMsg = "Invalid email or password.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errMsg = "Invalid email or password.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Please enter a valid email address.";
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth Sign In — direct server-side OAuth (no popup, no Firebase redirect)
  const handleGoogleSignIn = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/api/auth/google/start?redirect=${encodeURIComponent(currentPath === "/signin" ? "/" : currentPath)}`;
  };

  return (
    <div className="min-h-screen flex bg-[#F9F9F9]">
      {/* ── Left Panel: Brand Visual ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#111111]">
        <img
          src="/hero-banner.jpg"
          alt="RP Sports"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-[#CC0000]/30" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Logo */}
          <Link href="/" className="inline-block">
            <span className="font-display font-black text-3xl text-white uppercase tracking-tight">
              RP <span className="text-[#CC0000]">SPORTS</span>
            </span>
          </Link>

          {/* Center Quote */}
          <div>
            <div className="w-12 h-1 bg-[#CC0000] mb-8" />
            <h2
              className="text-4xl xl:text-5xl font-display font-black uppercase text-white tracking-tight leading-tight mb-4"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              YOUR GAME.<br />
              <span className="text-[#CC0000]">YOUR GEAR.</span>
            </h2>
            <p className="text-gray-300 text-sm max-w-md leading-relaxed font-medium">
              Sign in with your email or Google account to track orders, save wishlists, and view rewards.
            </p>
          </div>

          {/* Footer Badge */}
          <div className="flex items-center gap-3 pt-6 border-t border-white/10 text-xs text-gray-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Near Dumdum Metro Station, Kolkata – 700028
          </div>
        </div>
      </div>

      {/* ── Right Panel: Auth Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 pt-20 md:pt-12 pb-28 md:pb-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#CC0000]/10 border border-[#CC0000]/30 px-3 py-1 rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CC0000]" />
              <span className="text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Secure Member Authentication
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-[#111111] tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Account Sign In
            </h1>
            <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#CC0000] font-bold hover:underline">
                Sign Up Free
              </Link>
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl text-left">
              <AlertCircle className="w-4 h-4 text-[#CC0000] flex-shrink-0" />
              <p className="text-xs text-[#CC0000] font-bold">{error}</p>
            </div>
          )}

          {/* Email & Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2 text-left">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full h-12 px-4 border border-gray-300 bg-white text-[#111111] font-medium text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#CC0000] rounded-xl transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 text-left">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-bold text-[#CC0000] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-4 pr-11 border border-gray-300 bg-white text-[#111111] font-medium text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#CC0000] rounded-xl transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-[#CC0000]/30 hover:scale-[1.01] transition-transform disabled:opacity-50 cursor-pointer"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Signing In..." : "Sign In with Email"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#F9F9F9] px-4 text-gray-400 font-mono tracking-widest">
                Or Continue With
              </span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-12 border border-gray-300 bg-white text-xs font-display font-bold uppercase tracking-wider text-gray-700 hover:text-[#CC0000] hover:border-[#CC0000] transition-all rounded-xl cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Terms Note */}
          <p className="text-[11px] text-gray-400 text-center font-medium pt-4">
            By signing in, you agree to RP Sports'{" "}
            <Link href="/terms" className="text-gray-600 underline hover:text-[#CC0000]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-gray-600 underline hover:text-[#CC0000]">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]"><div className="w-10 h-10 border-4 border-gray-200 border-t-[#CC0000] rounded-full animate-spin" /></div>}>
      <SignInPageInner />
    </Suspense>
  );
}
