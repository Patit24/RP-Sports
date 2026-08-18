"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { 
  PlusCircle, Package, LayoutDashboard, Settings, ShoppingBag, 
  Truck, Users, LogOut, ShieldCheck, Flame, Lock, ArrowRight, UserCheck, AlertCircle, KeyRound, Mail, Eye, EyeOff, Tag, Shirt, X
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

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

  const currentNav = navItems.find((item) => item.href === pathname) || { label: "Admin Center", icon: ShieldCheck };
  const CurrentIcon = currentNav.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Admin Header Bar */}
      <header className="md:hidden bg-[#111111] text-white border-b border-white/10 px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Toggle Admin Navigation Menu"
          >
            {mobileDrawerOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <div className="flex flex-col gap-1 w-4">
                <span className="h-0.5 w-full bg-white rounded-full"></span>
                <span className="h-0.5 w-3/4 bg-[#CC0000] rounded-full"></span>
                <span className="h-0.5 w-full bg-white rounded-full"></span>
              </div>
            )}
          </button>
          
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-base uppercase tracking-wider text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                RP<span className="text-[#CC0000]">SPORTS</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider bg-[#CC0000] text-white px-1.5 py-0.5 rounded shadow-sm">
                ADMIN
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <CurrentIcon className="w-3 h-3 text-[#CC0000]" /> {currentNav.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-[11px] font-bold text-gray-300 hover:text-white px-2.5 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg border border-white/10 transition-colors"
            title="View Live Store"
          >
            Store ↗
          </Link>
          <Link
            href="/admin/add-product"
            className="bg-[#CC0000] hover:bg-red-700 active:scale-95 text-white text-[11px] font-display font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md shadow-red-600/30 transition-all"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            <PlusCircle className="w-3.5 h-3.5" /> <span>Add</span>
          </Link>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation Backdrop & Sheet */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 max-w-[280px] w-full bg-[#111111] text-white border-r border-white/10 z-50 flex flex-col p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#CC0000]" />
                <span className="font-display font-black text-lg uppercase tracking-wider" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  RP Admin
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Admin Profile Info */}
            {currentUser && (
              <div className="p-3 mb-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#CC0000]/20 text-[#CC0000] flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">{currentUser.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (item.highlight) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-display font-bold uppercase tracking-wider bg-[#CC0000] text-white rounded-xl shadow-md shadow-red-600/30"
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
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-xl transition-colors ${
                      isActive
                        ? "bg-white/15 text-white font-black"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#CC0000]" : "text-gray-500"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-300 font-bold uppercase tracking-wider"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                ← View Live Store
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                <LogOut className="w-4 h-4" /> Sign Out Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-[#111111] text-white border-r border-slate-800 flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        
        {/* Admin Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-display font-black uppercase text-white tracking-wider flex items-center" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              RP<span className="text-[#CC0000]">SPORTS</span>
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#CC0000] text-white px-2 py-0.5 rounded shadow-sm">
              ADMIN
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">Store Operations & Equipment Suite</p>
          {currentUser && (
            <div className="flex items-center gap-2 mt-3 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-[#CC0000]/20 text-[#CC0000] flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-gray-200 truncate">
                {currentUser.name}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
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
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-display font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors whitespace-nowrap mt-4 cursor-pointer"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-3 sm:p-5 md:p-8 w-full max-w-full overflow-x-hidden pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Quick Navigation Dock */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#111111]/95 backdrop-blur-lg border-t border-white/10 z-30 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <Link
          href="/admin"
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            pathname === "/admin" ? "text-[#CC0000]" : "text-gray-400 hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Home</span>
        </Link>

        <Link
          href="/admin/products"
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            pathname === "/admin/products" ? "text-[#CC0000]" : "text-gray-400 hover:text-white"
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Products</span>
        </Link>

        {/* Center Prominent Add Button */}
        <Link
          href="/admin/add-product"
          className="flex flex-col items-center -mt-4 bg-[#CC0000] hover:bg-red-700 text-white w-12 h-12 rounded-full items-center justify-center shadow-lg shadow-red-600/40 border-2 border-[#111111] transition-transform active:scale-95"
        >
          <PlusCircle className="w-6 h-6" />
        </Link>

        <Link
          href="/admin/orders"
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            pathname === "/admin/orders" ? "text-[#CC0000]" : "text-gray-400 hover:text-white"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Orders</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center py-1 px-2.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex flex-col gap-1 w-4 my-1">
            <span className="h-0.5 w-full bg-current rounded-full"></span>
            <span className="h-0.5 w-full bg-current rounded-full"></span>
            <span className="h-0.5 w-full bg-current rounded-full"></span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">More</span>
        </button>
      </div>

    </div>
  );
}
