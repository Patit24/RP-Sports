"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, AlertCircle, Smartphone, Mail, KeyRound, CheckCircle2, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { signInWithGoogle, checkGoogleRedirectResult, sendPhoneOTP, verifyPhoneOTP } from "@/lib/authService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignInPage() {
  const router = useRouter();
  const { currentUser, login, showToast } = useStore();

  // Auth Modes: 'email' | 'otp'
  const [authMode, setAuthMode] = useState<"email" | "otp">("email");

  // Email form state
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // OTP form state
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // General Status
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      window.location.href = "/";
    }
  }, [currentUser]);

  useEffect(() => {
    // Real-time Firebase Auth listener for Google OAuth / Phone Auth tokens
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const name = user.displayName || user.email.split("@")[0] || "RP Athlete";
        login(user.email, name, "customer");
        showToast(`Signed in successfully as ${name}`, "success");
        window.location.href = "/";
      }
    });

    checkGoogleRedirectResult().then((res) => {
      if (res && res.success && res.email) {
        login(res.email, res.name || "RP Athlete", "customer");
        showToast(`Signed in successfully as ${res.name || 'RP Athlete'}`, "success");
        window.location.href = "/";
      } else if (res && res.error) {
        setError(res.error);
      }
    });

    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => {
      unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [otpSent, timer, login, showToast]);

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
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    if (form.password.length >= 6) {
      const name = form.email.split("@")[0].replace(/[._]/g, " ");
      const capitalized = name.replace(/\b\w/g, (l) => l.toUpperCase());
      login(form.email, capitalized, "customer");
      showToast(`Welcome back, ${capitalized}!`, "success");
      window.location.href = "/";
    } else {
      setError("Invalid email or password.");
    }
  };

  // Handle Google OAuth Sign In / Sign Up
  const handleGoogleSignIn = async () => {
    setError("");
    setInfoMessage("");
    setLoading(true);

    const res = await signInWithGoogle();
    setLoading(false);
    
    if (res.success && res.email) {
      login(res.email, res.name || "RP Athlete", "customer");
      showToast(`Signed in successfully as ${res.name || 'RP Athlete'}`, "success");
      window.location.href = "/";
    } else if (res.redirecting) {
      setInfoMessage("Redirecting to Google Sign-In...");
    } else {
      setError(res.error || "Google Sign-In failed. Please try again.");
    }
  };

  // Handle Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    const res = await sendPhoneOTP(cleanPhone);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      setTimer(30);
      setCanResend(false);
      setInfoMessage(res.message || "OTP code sent to your phone.");
    } else {
      setError(res.error || "Failed to send OTP. Please check your phone number.");
    }
  };

  // Handle Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    setLoading(true);
    const res = await verifyPhoneOTP(otpCode, phone);
    setLoading(false);

    if (res.success && res.email) {
      const displayName = res.name || "RP Athlete";
      login(res.email, displayName, "customer");
      showToast(`Verified! Welcome to RP Sports, ${displayName}`, "success");
      window.location.href = "/";
    } else {
      setError(res.error || "Invalid OTP code. Please enter the 6-digit SMS code sent to your phone.");
    }
  };


  return (
    <div className="min-h-screen flex bg-[#F9F9F9]">
      
      {/* Invisible Recaptcha Container */}
      <div id="recaptcha-container"></div>

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
              Sign in with Google or Phone OTP to track orders, save wishlists, and get exclusive discounts.
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 pt-28 md:pt-32">
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

          {/* Auth Method Switcher Tabs */}
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button
              onClick={() => { setAuthMode("email"); setError(""); setInfoMessage(""); }}
              className={`flex-1 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "email"
                  ? "bg-white text-[#111111] shadow-sm font-black"
                  : "text-gray-600 hover:text-[#111111]"
              }`}
            >
              <Mail className="w-4 h-4 text-[#CC0000]" /> Email & Password
            </button>
            <button
              onClick={() => { setAuthMode("otp"); setError(""); setInfoMessage(""); }}
              className={`flex-1 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "otp"
                  ? "bg-white text-[#111111] shadow-sm font-black"
                  : "text-gray-600 hover:text-[#111111]"
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#CC0000]" /> Mobile OTP Login
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl text-left">
              <AlertCircle className="w-4 h-4 text-[#CC0000] flex-shrink-0" />
              <p className="text-xs text-[#CC0000] font-bold">{error}</p>
            </div>
          )}

          {/* Info Banner */}
          {infoMessage && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-700 font-bold">{infoMessage}</p>
            </div>
          )}

          {/* ── MODE 1: EMAIL & PASSWORD FORM ── */}
          {authMode === "email" && (
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
                {loading ? "Authenticating..." : "Sign In with Email"}
              </button>
            </form>
          )}

          {/* ── MODE 2: MOBILE SMS OTP FORM ── */}
          {authMode === "otp" && (
            <div className="space-y-5">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div>
                    <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2 text-left">
                      Mobile Phone Number (+91)
                    </label>
                    <div className="flex">
                      <span className="h-12 px-4 flex items-center bg-gray-100 border border-r-0 border-gray-300 text-sm font-bold text-gray-700 rounded-l-xl">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        maxLength={10}
                        className="w-full h-12 px-4 border border-gray-300 bg-[#FFFFFF] text-[#111111] font-mono font-bold text-sm placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[#CC0000] rounded-r-xl transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5 text-left font-medium">
                      We will send a 6-digit SMS OTP code for instant verification.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phone.replace(/\D/g, "").length !== 10}
                    className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-[#CC0000]/30 transition-transform disabled:opacity-50 cursor-pointer"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {loading ? "Sending SMS OTP..." : "Send 6-Digit OTP Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 text-left">
                        Enter 6-Digit OTP Code
                      </label>
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtpCode(""); }}
                        className="text-xs text-[#CC0000] font-bold hover:underline"
                      >
                        Change Number ({phone})
                      </button>
                    </div>

                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        autoFocus
                        className="w-full h-12 pl-10 pr-4 border-2 border-[#CC0000] bg-white text-[#111111] font-mono font-black text-lg tracking-widest placeholder:text-gray-300 focus:outline-none rounded-xl"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-gray-500 font-medium">
                        {timer > 0 ? `Resend in ${timer}s` : "Didn't receive code?"}
                      </span>
                      {canResend && (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          className="text-[#CC0000] font-bold hover:underline cursor-pointer"
                        >
                          Resend Code
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-[#CC0000]/30 transition-transform disabled:opacity-50 cursor-pointer"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {loading ? "Verifying..." : "Verify OTP & Sign In"}
                  </button>
                </form>
              )}
            </div>
          )}

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
            <span>Sign In with Google</span>
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
