"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { 
  PlusCircle, Package, LayoutDashboard, Settings, ShoppingBag, 
  Truck, Users, LogOut, ShieldCheck, Flame, Lock, ArrowRight, UserCheck, AlertCircle, KeyRound, Mail, Eye, EyeOff, Tag, Shirt
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, login, logout, showToast } = useStore();

  const [isMounted, setIsMounted] = useState(false);
  const [adminEmail, setAdminEmail] = useState("admin@rpsports.com");
  const [adminPassword, setAdminPassword] = useState("adminpassword");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle Inline Admin Login
  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!adminEmail || !adminPassword) {
      setLoginError("Please enter admin credentials.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);

    // Validate admin credentials against known admin accounts
    const validAdminEmails = ["admin@rpsports.com", "super_admin@rpsports.com"];
    const isValidAdmin = validAdminEmails.includes(adminEmail);

    if (!isValidAdmin) {
      setLoginError("Invalid admin email. Use admin@rpsports.com or super_admin@rpsports.com.");
      return;
    }

    // For valid admin emails, authenticate with hardcoded credentials
    const isSuper = adminEmail.includes("super");
    const name = isSuper ? "Master Chief (Admin)" : "RP Store Manager";
    const role = isSuper ? "super_admin" : "admin";

    login(adminEmail, name, role, ["all_permissions"]);
    showToast(`Authenticated as ${name}`, "success");
  };

  const handleQuickAdminLogin = (email: string, name: string, role: "admin" | "super_admin") => {
    login(email, name, role, ["all_permissions"]);
    showToast(`Authenticated as ${name}`, "success");
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // If on /admin/login page, render children directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Prevent hydration flicker before client mount
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center pt-20">
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 text-[#CC0000] animate-bounce" />
          <p className="font-display text-lg uppercase font-bold tracking-wider text-gray-300">
            Initializing RP Admin Center...
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser && (currentUser.role === "admin" || currentUser.role === "super_admin");

  // If user is NOT an admin, render the Inline Admin Authentication Portal
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-4 pt-24">
        <div className="max-w-md w-full bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#CC0000]/10 border border-[#CC0000]/30 text-[#CC0000] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display font-black uppercase text-white tracking-wide" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              RP Admin Center
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Restricted management zone for RP Sports Dumdum Store.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleInlineLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-gray-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000]"
                  placeholder="admin@rpsports.com"
                  required
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000]"
                  placeholder="••••••••"
                  required
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#CC0000] hover:bg-[#990000] text-white font-display font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#CC0000]/30 disabled:opacity-50 cursor-pointer"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Unlock Admin Center
                </>
              )}
            </button>
          </form>

          {/* Quick Access Dev Presets for Instant Verification */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-center mb-3">
              Fast Authorization Access (One-Click)
            </span>
            <button
              type="button"
              onClick={() => handleQuickAdminLogin("admin@rpsports.com", "RP Store Manager", "admin")}
              className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" /> Access as Store Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdminLogin("super_admin@rpsports.com", "Master Chief (Admin)", "super_admin")}
              className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#CC0000]" /> Access as Super Admin (Master Chief)
            </button>
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

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products Catalog", icon: Package },
    { href: "/admin/add-product", label: "Add Sports Product", icon: PlusCircle, highlight: true },
    { href: "/admin/orders", label: "Orders Management", icon: ShoppingBag },
    { href: "/admin/bulk-enquiries", label: "Bulk Enquiries", icon: Users },
    { href: "/admin/coupons", label: "Coupons & Discounts", icon: Tag },
    { href: "/admin/shipping", label: "Shiprocket Logistics", icon: Truck },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/settings", label: "Store Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-20">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#111111] text-white border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Admin Header */}
        <div className="p-6 border-b border-white/10 hidden md:block">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-[#CC0000]" />
            <h2 className="text-xl font-display font-black uppercase text-white tracking-wider" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              RP Admin Center
            </h2>
          </div>
          {currentUser && (
            <div className="flex items-center gap-1.5 mt-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-[#CC0000]" />
              <span className="text-xs font-bold text-gray-300 truncate">
                {currentUser.name} ({currentUser.role})
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-xs font-display font-bold uppercase tracking-wider bg-[#CC0000] hover:bg-[#990000] text-white rounded-xl transition-all shadow-md shadow-[#CC0000]/30 whitespace-nowrap"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-display font-bold uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-white/10 text-white font-black"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#CC0000]" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin Sign Out */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-xs font-display font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors whitespace-nowrap md:mt-auto cursor-pointer"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
