"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { listenToOrders } from "@/lib/firestoreService";
import { Package, PlusCircle, Users, ShoppingBag, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { products, orders, setOrders, currentUser } = useStore();

  useEffect(() => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
      return;
    }
    // Listen to orders from Cloud Firestore in real-time
    const unsubscribe = listenToOrders((dbOrders) => {
      setOrders(dbOrders);
    });
    return () => unsubscribe();
  }, [currentUser, setOrders]);

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return null;
  }

  const totalRevenue = orders
    .filter(o => o.paymentStatus === "Success" && o.status !== "Cancelled")
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000]">
            RP Admin Control Panel
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-primary tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Welcome back, <strong className="text-primary">{currentUser.name}</strong>. Manage catalog, orders, and delivery dispatches.
          </p>
        </div>

        <Link 
          href="/admin/add-product" 
          className="px-6 py-3 bg-[#CC0000] text-white font-display font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[#990000] transition-colors flex items-center gap-2 shadow-lg shadow-[#CC0000]/20 self-start cursor-pointer"
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          <PlusCircle className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-slate-500">Products</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-50 text-[#CC0000] flex items-center justify-center">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-primary font-display">{products.length}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-slate-500">Orders</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-primary font-display">{orders.length}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-slate-500">Revenue</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-emerald-600 font-display truncate">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-slate-500">Role</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-sm sm:text-xl font-bold uppercase text-primary font-display truncate">
            {currentUser.role}
          </p>
        </div>
      </div>

      {/* Quick Action Shortcuts Grid */}
      <h2 className="text-lg font-display font-black uppercase text-[#111111] mb-4 tracking-wide" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
        Quick Management Modules
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Link 
          href="/admin/products"
          className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#CC0000] transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-display font-bold text-base text-primary uppercase mb-0.5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Products Catalog
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Edit inventory, stock & prices.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#CC0000] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>

        <Link 
          href="/admin/orders"
          className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#CC0000] transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-display font-bold text-base text-primary uppercase mb-0.5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Orders & Dispatches
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Process orders & Shiprocket AWB.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#CC0000] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>

        <Link 
          href="/admin/bulk-enquiries"
          className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#CC0000] transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-display font-bold text-base text-primary uppercase mb-0.5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Bulk Jersey Enquiries
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Manage team quotes & WhatsApp.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#CC0000] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>

        <Link 
          href="/admin/coupons"
          className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#CC0000] transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-display font-bold text-base text-primary uppercase mb-0.5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Coupons & Discounts
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Create promotional vouchers.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#CC0000] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>

        <Link 
          href="/admin/shipping"
          className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#CC0000] transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-display font-bold text-base text-primary uppercase mb-0.5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Shiprocket Logistics
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Test pincodes & sync courier.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#CC0000] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>

        <Link 
          href="/admin/settings"
          className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#CC0000] transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-display font-bold text-base text-primary uppercase mb-0.5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Store Settings
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Dumdum store contact & config.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#CC0000] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>
      </div>

    </div>
  );
}
