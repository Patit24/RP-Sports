"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showToast } = useStore();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    showToast("Password updated successfully! Please sign in.", "success");
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col justify-center pt-20 md:pt-24 pb-28 md:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white border border-gray-200 p-8 sm:p-10 rounded-xl shadow-lg">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#CC0000]">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#111111] uppercase mb-2">
            Set New Password
          </h1>
          <p className="text-xs text-gray-500">
            Please enter and confirm your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full h-12 px-4 pr-12 border-2 border-gray-200 bg-white text-sm text-[#111111] font-medium outline-none focus:border-[#CC0000] transition-colors rounded"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CC0000]"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
              Confirm New Password
            </label>
            <input
              type={showPwd ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              className="w-full h-12 px-4 border-2 border-gray-200 bg-white text-sm text-[#111111] font-medium outline-none focus:border-[#CC0000] transition-colors rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#CC0000] hover:bg-[#990000] text-white font-display font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-2"
          >
            {loading ? "Updating Password..." : "Update Password & Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}
