"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, AlertCircle, Check, Smartphone, CheckCircle2, KeyRound } from "lucide-react";
import { useStore } from "@/lib/store";
import { addSubscriber } from "@/lib/firestoreService";
import { signInWithGoogle, sendPhoneOTP, verifyPhoneOTP } from "@/lib/authService";

export default function SignUpPage() {
  const router = useRouter();
  const { login, showToast } = useStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // OTP Verification Mode
  const [useOtpVerification, setUseOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: score, label: "Weak", color: "#CC0000" };
    if (score === 2) return { level: score, label: "Fair", color: "#FF6B00" };
    if (score === 3) return { level: score, label: "Good", color: "#F59E0B" };
    return { level: score, label: "Strong", color: "#22C55E" };
  };

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email.";
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) newErrors.phone = "Enter a valid 10-digit phone.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!form.agreeTerms) newErrors.agreeTerms = "You must agree to the terms to continue.";
    return newErrors;
  };

  // Google OAuth Sign Up
  const handleGoogleSignUp = async () => {
    setLoading(true);
    const res = await signInWithGoogle();
    setLoading(false);

    if (res.success && res.email) {
      login(res.email, res.name || "RP Athlete", "customer");
      addSubscriber(res.email).catch(console.error);
      showToast(`Account created! Welcome, ${res.name}`, "success");
      router.push("/");
    } else {
      setErrors({ google: res.error || "Google Sign-Up failed." });
    }
  };

  // Send OTP for Phone Sign Up
  const handleSendPhoneOTP = async () => {
    if (!form.phone || form.phone.replace(/\D/g, "").length !== 10) {
      setErrors({ ...errors, phone: "Please enter a valid 10-digit phone number first." });
      return;
    }
    setLoading(true);
    const res = await sendPhoneOTP(form.phone);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      setTimer(30);
      showToast("OTP sent to " + form.phone, "info");
    } else {
      setErrors({ ...errors, phone: "Failed to send OTP to number." });
    }
  };

  // Main Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    // If user chose OTP verification mode and entered OTP code
    if (useOtpVerification && otpSent) {
      const otpRes = await verifyPhoneOTP(otpCode, form.phone);
      if (!otpRes.success) {
        setErrors({ ...errors, otp: otpRes.error || "Invalid OTP code." });
        setLoading(false);
        return;
      }
    } else {
      await new Promise((r) => setTimeout(r, 600));
    }

    login(form.email, form.name, "customer");
    addSubscriber(form.email).catch(console.error);
    showToast(`Welcome to RP Sports, ${form.name}!`, "success");
    router.push("/");
  };

  const PERKS = [
    "Exclusive member-only discounts",
    "Early access to new arrivals",
    "Track orders & manage returns easily",
    "Earn loyalty points on every purchase",
  ];

  return (
    <div className="min-h-screen flex bg-[#F9F9F9]">
      <div id="recaptcha-container"></div>

      {/* ── Left Panel: Brand Visual ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#111111]">
        <img
          src="/hero-banner.jpg"
          alt="RP Sports"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-[#CC0000]/20" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <Link href="/">
            <span className="font-display font-black text-3xl text-white uppercase tracking-tight">
              RP <span className="text-[#CC0000]">SPORTS</span>
            </span>
          </Link>

          <div>
            <div className="w-12 h-1 bg-[#CC0000] mb-8" />
            <h2
              className="text-white font-black uppercase leading-none mb-6"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "clamp(2.5rem, 4vw, 4rem)",
              }}
            >
              JOIN THE<br />
              <span className="text-[#CC0000]">RP SPORTS</span><br />
              FAMILY
            </h2>
            <p className="text-white/60 text-base mb-10 leading-relaxed max-w-sm">
              Create your free account with Google, Phone OTP or Email in seconds.
            </p>

            <ul className="space-y-4">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#CC0000] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/70 text-sm font-medium">{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="text-white/40 text-sm">📍 Near Dumdum Metro Station, Kolkata – 700028</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 py-10 overflow-y-auto">
        <div className="lg:hidden mb-8">
          <Link href="/">
            <span className="font-display font-black text-2xl text-[#111111] uppercase">
              RP <span className="text-[#CC0000]">SPORTS</span>
            </span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="mb-8">
            <div className="w-10 h-1 bg-[#CC0000] mb-4" />
            <h1
              className="text-[#111111] font-black uppercase leading-none mb-2"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
              }}
            >
              Create Account
            </h1>
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link href="/signin" className="text-[#CC0000] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* GOOGLE SIGN UP BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-12 border-2 border-gray-200 hover:border-[#CC0000] bg-white text-sm font-bold text-gray-700 hover:text-[#CC0000] transition-all rounded-lg cursor-pointer shadow-sm mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Sign Up with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">or register with form</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Raj Paswan"
                autoComplete="name"
                className={`w-full h-12 px-4 border-2 bg-white text-[#111111] text-sm placeholder:text-gray-400 focus:outline-none rounded-lg transition-colors ${
                  errors.name ? "border-[#CC0000]" : "border-gray-200 focus:border-[#CC0000]"
                }`}
              />
              {errors.name && <p className="text-xs text-[#CC0000] mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full h-12 px-4 border-2 bg-white text-[#111111] text-sm placeholder:text-gray-400 focus:outline-none rounded-lg transition-colors ${
                  errors.email ? "border-[#CC0000]" : "border-gray-200 focus:border-[#CC0000]"
                }`}
              />
              {errors.email && <p className="text-xs text-[#CC0000] mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Phone Number with optional SMS OTP toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#111111]">
                  Phone Number
                </label>
                <button
                  type="button"
                  onClick={() => setUseOtpVerification(!useOtpVerification)}
                  className="text-xs text-[#CC0000] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  {useOtpVerification ? "Disable Mobile OTP" : "Verify with Mobile OTP"}
                </button>
              </div>

              <div className="flex">
                <span className="h-12 px-3 flex items-center bg-gray-100 border-2 border-r-0 border-gray-200 text-sm text-gray-600 font-bold rounded-l-lg">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="98765 43210"
                  maxLength={10}
                  autoComplete="tel"
                  className={`w-full h-12 px-4 border-2 bg-white text-[#111111] text-sm placeholder:text-gray-400 focus:outline-none rounded-r-lg transition-colors ${
                    errors.phone ? "border-[#CC0000]" : "border-gray-200 focus:border-[#CC0000]"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-[#CC0000] mt-1 font-medium">{errors.phone}</p>}

              {/* OTP Code Box if enabled */}
              {useOtpVerification && (
                <div className="mt-3 p-3 bg-gray-100 border border-gray-300 rounded-lg space-y-2">
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendPhoneOTP}
                      className="w-full py-2 bg-black text-white text-xs font-display font-bold uppercase tracking-widest rounded cursor-pointer"
                    >
                      Send 6-Digit SMS OTP
                    </button>
                  ) : (
                    <div>
                      <span className="text-xs font-bold text-gray-700 block mb-1">Enter 6-Digit OTP Code</span>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="123456"
                          maxLength={6}
                          className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded text-sm font-mono font-bold"
                        />
                      </div>
                      {errors.otp && <p className="text-xs text-[#CC0000] mt-1 font-medium">{errors.otp}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className={`w-full h-12 px-4 pr-12 border-2 bg-white text-[#111111] text-sm placeholder:text-gray-400 focus:outline-none rounded-lg transition-colors ${
                    errors.password ? "border-[#CC0000]" : "border-gray-200 focus:border-[#CC0000]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CC0000]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i <= strength.level ? strength.color : "#E5E7EB",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label} password
                  </p>
                </div>
              )}
              {errors.password && <p className="text-xs text-[#CC0000] mt-1 font-medium">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`w-full h-12 px-4 pr-12 border-2 bg-white text-[#111111] text-sm placeholder:text-gray-400 focus:outline-none rounded-lg transition-colors ${
                    errors.confirmPassword ? "border-[#CC0000]" : "border-gray-200 focus:border-[#CC0000]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CC0000]"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[#CC0000] mt-1 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 accent-[#CC0000]"
                />
                <span className="text-sm text-gray-500 leading-relaxed">
                  I agree to RP Sports'{" "}
                  <Link href="#" className="text-[#CC0000] hover:underline font-medium">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="#" className="text-[#CC0000] hover:underline font-medium">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-[#CC0000] mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.agreeTerms}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all rounded-lg disabled:opacity-60 cursor-pointer mt-2"
              style={{ height: "50px", fontFamily: "Barlow Condensed, sans-serif" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create My Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
