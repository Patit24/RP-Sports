"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, KeyRound, AlertCircle, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, showToast } = useStore();

  const [form, setForm] = useState({
    email: "admin@rpsports.com",
    password: "adminpassword",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your admin email and password.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    if (form.password.length < 6) {
      setError("Invalid password. Minimum 6 characters required.");
      return;
    }

    const isSuper = form.email.includes("super") || form.email.includes("admin");
    const name = isSuper ? "Master Chief (Admin)" : "RP Store Manager";
    const role = isSuper ? "super_admin" : "admin";

    login(form.email, name, role, ["all_permissions"]);
    showToast(`Authenticated as ${name}`, "success");
    router.push("/admin");
  };

  const handleQuickLogin = (email: string, name: string, role: "admin" | "super_admin") => {
    login(email, name, role, ["all_permissions"]);
    showToast(`Authenticated as ${name}`, "success");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#CC0000]/10 border border-[#CC0000]/30 text-[#CC0000] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[#CC0000] text-xs font-display font-bold uppercase tracking-widest block mb-1">
            RP Sports Security Portal
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Admin Management Login
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">
            Sign in with authorized administrator credentials to manage products, orders, inventory & Shiprocket logistics.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 bg-red-950/50 border border-red-500/30 px-4 py-3 mb-6 rounded-xl text-left">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-400 font-bold">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-300 mb-2">
              Admin Email / Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@rpsports.com"
                className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CC0000] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full h-12 pl-10 pr-12 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-[#CC0000] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-display font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 h-12 rounded-xl transition-all shadow-lg shadow-[#CC0000]/30 cursor-pointer"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            {loading ? (
              <span>Authenticating Admin...</span>
            ) : (
              <>
                <span>Sign In to Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Profile Selector Buttons */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center mb-3">
            Quick Admin Identity Access:
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@rpsports.com", "Master Chief (Admin)", "super_admin")}
              className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold text-white uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#CC0000]" /> Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("catalog@rpsports.com", "Catalog Manager", "admin")}
              className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold text-white uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Catalog Manager
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-white font-medium hover:underline">
            ← Return to Store Frontpage
          </Link>
        </div>

      </div>
    </div>
  );
}
