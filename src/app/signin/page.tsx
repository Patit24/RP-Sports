"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, AlertCircle, Smartphone, Mail, KeyRound, CheckCircle2, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { signInWithGoogle, checkGoogleRedirectResult, sendPhoneOTP, verifyPhoneOTP } from "@/lib/authService";

export default function SignInPage() {
  const router = useRouter();
  const { login, showToast } = useStore();

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

  // Countdown timer effect for OTP resend
  useEffect(() => {
    checkGoogleRedirectResult().then((res) => {
      if (res && res.success && res.email) {
        login(res.email, res.name || "RP Athlete", "customer");
        showToast(`Signed in successfully as ${res.name}`, "success");
        window.location.href = "/";
      }
    });

    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

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
    setLoading(true);
    const res = await signInWithGoogle();
    
    if (res.success && res.email) {
      login(res.email, res.name || "RP Athlete", "customer");
      showToast(`Signed in successfully as ${res.name}`, "success");
      window.location.href = "/";
    } else if (res.redirecting) {
      setInfoMessage("Redirecting to Google Sign-In...");
    } else {
      setError(res.error || "Google Sign-In failed. Please try again.");
      setLoading(false);
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
      login(res.email, res.name, "customer");
      showToast(`Verified! Welcome to RP Sports, ${res.name}`, "success");
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
              className="text-white font-black uppercase leading-none mb-6"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              }}
            >
              YOUR GAME.<br />
              YOUR <span className="text-[#CC0000]">GEAR.</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-sm">
              Sign in with Google or Phone OTP to track orders, save wishlists, and get exclusive discounts.
            </p>
          </div>

          {/* Store Info */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-white/40 text-sm font-medium">
              📍 Near Dumdum Metro Station, Kolkata – 700028
            </p>
            <p className="text-white/40 text-sm mt-1">
              📞 +91 98765 43210
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12">
        
        {/* Mobile Logo */}
        <div className="lg:hidden mb-10">
          <Link href="/">
            <span className="font-display font-black text-2xl text-[#111111] uppercase">
              RP <span className="text-[#CC0000]">SPORTS</span>
            </span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          
          {/* Header */}
          <div className="mb-8">
            <div className="w-10 h-1 bg-[#CC0000] mb-4" />
            <h1
              className="text-[#111111] font-black uppercase leading-none mb-2"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
              }}
            >
              Account Sign In
            </h1>
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#CC0000] font-bold hover:underline">
                Sign Up Free
              </Link>
            </p>
          </div>

          {/* Auth Method Switcher Tabs */}
          <div className="flex bg-gray-200 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setAuthMode("email"); setError(""); setInfoMessage(""); }}
              className={`flex-1 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === "email"
                  ? "bg-white text-[#111111] shadow-sm font-black"
                  : "text-gray-600 hover:text-[#111111]"
              }`}
            >
              <Mail className="w-4 h-4 text-[#CC0000]" />
              Email & Password
            </button>
            
            <button
              onClick={() => { setAuthMode("otp"); setError(""); setInfoMessage(""); }}
              className={`flex-1 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === "otp"
                  ? "bg-white text-[#111111] shadow-sm font-black"
                  : "text-gray-600 hover:text-[#111111]"
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#CC0000]" />
              Mobile OTP Login
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-4 py-3 mb-6 rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#CC0000] flex-shrink-0" />
              <p className="text-xs text-[#CC0000] font-bold">{error}</p>
            </div>
          )}

          {/* Info Message */}
          {infoMessage && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-3 mb-6 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-700 font-bold">{infoMessage}</p>
            </div>
          )}

          {/* 1. EMAIL & PASSWORD FORM */}
          {authMode === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full h-12 px-4 border-2 border-gray-200 bg-white text-[#111111] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#CC0000] transition-colors rounded-lg"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#111111]">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-[#CC0000] hover:underline font-bold">
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
                    autoComplete="current-password"
                    className="w-full h-12 px-4 pr-12 border-2 border-gray-200 bg-white text-[#111111] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#CC0000] transition-colors rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CC0000]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 bg-[#CC0000] hover:bg-[#990000] text-white font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all rounded-lg disabled:opacity-60 cursor-pointer mt-2"
                style={{ height: "50px", fontFamily: "Barlow Condensed, sans-serif" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In with Email
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. MOBILE OTP LOGIN FORM */}
          {authMode === "otp" && (
            <div className="space-y-4">
              {!otpSent ? (
                /* STEP 1: Enter Phone Number */
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                      Mobile Phone Number (+91)
                    </label>
                    <div className="flex">
                      <span className="h-12 px-3 flex items-center bg-gray-100 border-2 border-r-0 border-gray-200 text-sm font-bold text-gray-700 rounded-l-lg">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        maxLength={10}
                        className="w-full h-12 px-4 border-2 border-gray-200 bg-white text-[#111111] font-mono font-bold text-sm placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[#CC0000] rounded-r-lg transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5 font-medium">
                      We will send a 6-digit SMS OTP code for instant instant verification.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phone.replace(/\D/g, "").length !== 10}
                    className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all rounded-lg disabled:opacity-50 cursor-pointer"
                    style={{ height: "50px", fontFamily: "Barlow Condensed, sans-serif" }}
                  >
                    {loading ? "Sending OTP..." : "Send 6-Digit OTP Code"}
                  </button>
                </form>
              ) : (
                /* STEP 2: Enter 6-Digit OTP Code */
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#111111]">
                        Enter 6-Digit OTP
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
                        className="w-full h-12 pl-10 pr-4 border-2 border-[#CC0000] bg-white text-[#111111] font-mono font-black text-lg tracking-widest placeholder:text-gray-300 focus:outline-none rounded-lg"
                      />
                    </div>
                    
                    {/* Resend Timer / Demo Hint */}
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
                          Resend OTP Code
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all rounded-lg disabled:opacity-50 cursor-pointer"
                    style={{ height: "50px", fontFamily: "Barlow Condensed, sans-serif" }}
                  >
                    {loading ? "Verifying..." : "Verify OTP & Login"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-12 border-2 border-gray-200 hover:border-[#CC0000] bg-white text-sm font-bold text-gray-700 hover:text-[#CC0000] transition-all rounded-lg cursor-pointer shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Sign In with Google</span>
          </button>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
            By signing in, you agree to RP Sports'{" "}
            <Link href="#" className="text-[#CC0000] font-semibold hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="text-[#CC0000] font-semibold hover:underline">Privacy Policy</Link>.
          </p>

        </div>
      </div>
    </div>
  );
}
