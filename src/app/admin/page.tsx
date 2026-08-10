"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Package, PlusCircle, Users, ShoppingBag, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { products, orders, currentUser } = useStore();

  useEffect(() => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
      router.push("/signin");
    }
  }, [currentUser, router]);

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Verifying admin credentials...</p>
      </div>
    );
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Total Products</h3>
            <div className="w-10 h-10 rounded-full bg-red-50 text-[#CC0000] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-primary font-display">{products.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Total Orders</h3>
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-primary font-display">{orders.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Total Revenue</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 font-display">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">System Role</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold uppercase text-primary font-display mt-1">
            {currentUser.role}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/admin/products"
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#CC0000] transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-display font-bold text-lg text-primary uppercase mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Manage Product Catalog
            </h3>
            <p className="text-xs text-slate-500 font-medium">Edit inventory, update prices, and delete products.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#CC0000] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link 
          href="/admin/settings"
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#CC0000] transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-display font-bold text-lg text-primary uppercase mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Store Settings & Logistics
            </h3>
            <p className="text-xs text-slate-500 font-medium">Configure Shiprocket API, Dumdum store address & delivery rules.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#CC0000] group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

    </div>
  );
}
