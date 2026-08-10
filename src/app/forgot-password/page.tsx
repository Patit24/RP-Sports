"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white border border-gray-200 p-8 sm:p-10 rounded-xl shadow-lg">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#CC0000]">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#111111] uppercase mb-2">
            Reset Password
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Enter your registered email address and we'll send you an instant link to reset your account password.
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-center gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Reset Email Sent!</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  We've sent password recovery instructions to <strong className="text-emerald-900">{email}</strong>. Check your inbox & spam folder.
                </p>
              </div>
            </div>

            <Link
              href="/reset-password"
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-xs"
            >
              Set New Password Directly <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>

            <Link href="/signin" className="block text-xs font-semibold text-gray-500 hover:text-[#CC0000] pt-2">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 pl-11 pr-4 border-2 border-gray-200 bg-white text-sm text-[#111111] font-medium outline-none focus:border-[#CC0000] transition-colors rounded"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#CC0000] hover:bg-[#990000] text-white font-display font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {loading ? "Sending Reset Instructions..." : "Send Password Reset Link"}
            </button>

            <div className="text-center pt-2">
              <Link href="/signin" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#CC0000]">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
