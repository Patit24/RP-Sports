"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { 
  PlusCircle, Package, LayoutDashboard, Settings, ShoppingBag, 
  Truck, Users, LogOut, ShieldCheck, Flame
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useStore();

  // If on admin login page, render children cleanly without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products Catalog", icon: Package },
    { href: "/admin/add-product", label: "Add Sports Product", icon: PlusCircle, highlight: true },
    { href: "/admin/orders", label: "Orders Management", icon: ShoppingBag },
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
