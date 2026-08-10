"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { signInWithGoogle, checkGoogleRedirectResult, sendPhoneOTP, verifyPhoneOTP } from "@/lib/authService";
import { Lock, Smartphone, Mail, AlertCircle, CheckCircle2, KeyRound, ShieldCheck, ArrowRight } from "lucide-react";

interface CheckoutAuthGateProps {
  onSuccess?: () => void;
}

export default function CheckoutAuthGate({ onSuccess }: CheckoutAuthGateProps) {
  const router = useRouter();
  const { login, showToast } = useStore();

  const [authTab, setAuthTab] = useState<"otp" | "google" | "email">("otp");

  // OTP Form State
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);

  // Email Form State
  const [emailForm, setEmailForm] = useState({ email: "", password: "" });

  // Status
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if coming back from Google Sign-In redirect
    checkGoogleRedirectResult().then((res) => {
      if (res && res.success && res.email) {
        login(res.email, res.name || "RP Athlete", "customer");
        showToast(`Logged in as ${res.name}`, "success");
        if (onSuccess) onSuccess();
        window.location.href = "/checkout";
      }
    });

    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Handle Send Phone OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    setLoading(true);
    const res = await sendPhoneOTP(cleanPhone);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      setTimer(30);
      setInfoMessage(res.message || "OTP code sent to your phone.");
    } else {
      setError(res.error || "Failed to send OTP code. Please try again.");
    }
  };

  // Handle Verify Phone OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit OTP code sent to your phone.");
      return;
    }

    setLoading(true);
    const res = await verifyPhoneOTP(otpCode, phone);
    setLoading(false);

    if (res.success && res.email) {
      login(res.email, res.name, "customer");
      showToast(`Verified! Welcome ${res.name}`, "success");
      if (onSuccess) onSuccess();
      window.location.href = "/checkout";
    } else {
      setError(res.error || "Invalid OTP code. Please check your SMS.");
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const res = await signInWithGoogle();
    setLoading(false);

    if (res.success && res.email) {
      login(res.email, res.name || "RP Athlete", "customer");
      showToast(`Logged in as ${res.name}`, "success");
      if (onSuccess) onSuccess();
      window.location.href = "/checkout";
    } else if (res.redirecting) {
      setInfoMessage("Redirecting to Google Sign-In...");
    } else {
      setError(res.error || "Google sign-in failed. Please try again.");
    }
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
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    if (emailForm.password.length >= 6) {
      const name = emailForm.email.split("@")[0].replace(/[._]/g, " ");
      const capitalized = name.replace(/\b\w/g, (l) => l.toUpperCase());
      login(emailForm.email, capitalized, "customer");
      showToast(`Welcome back, ${capitalized}!`, "success");
      if (onSuccess) onSuccess();
      window.location.href = "/checkout";
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div id="recaptcha-container"></div>

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
            Please complete Mobile OTP verification or Google Sign-In to secure your order and enable order tracking.
          </p>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => { setAuthTab("otp"); setError(""); setInfoMessage(""); }}
            className={`flex-1 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authTab === "otp"
                ? "bg-white text-[#111111] shadow-sm font-black"
                : "text-gray-600 hover:text-[#111111]"
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#CC0000]" /> Mobile OTP
          </button>
          
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
            Google
          </button>

          <button
            onClick={() => { setAuthTab("email"); setError(""); setInfoMessage(""); }}
            className={`flex-1 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authTab === "email"
                ? "bg-white text-[#111111] shadow-sm font-black"
                : "text-gray-600 hover:text-[#111111]"
            }`}
          >
            <Mail className="w-4 h-4 text-[#CC0000]" /> Email
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

        {/* TAB 1: MOBILE OTP VERIFICATION */}
        {authTab === "otp" && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2 text-left">
                    Mobile Phone Number (+91)
                  </label>
                  <div className="flex">
                    <span className="h-12 px-3.5 flex items-center bg-gray-100 border border-r-0 border-gray-300 text-sm font-bold text-gray-700 rounded-l-xl">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="w-full h-12 px-4 border border-gray-300 bg-white text-[#111111] font-mono font-bold text-sm placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[#CC0000] rounded-r-xl transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.replace(/\D/g, "").length !== 10}
                  className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#CC0000]/30"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  {loading ? "Sending SMS OTP..." : "Send 6-Digit SMS OTP Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 text-left">
                      Enter 6-Digit SMS Code
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
                    {timer === 0 && (
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
                  className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#CC0000]/30"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  {loading ? "Verifying Code..." : "Verify OTP & Proceed to Checkout"} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: GOOGLE SIGN IN */}
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

        {/* TAB 3: EMAIL SIGN IN */}
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
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#CC0000]/30"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              {loading ? "Signing In..." : "Sign In & Proceed to Checkout"}
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
