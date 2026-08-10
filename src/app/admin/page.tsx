"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Package, PlusCircle, Users, ShoppingBag } from "lucide-react";

export default function AdminDashboardPage() {
  const { products, orders } = useStore();

  const totalRevenue = orders
    .filter(o => o.paymentStatus === "Success" && o.status !== "Cancelled")
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase text-primary tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2 font-medium">Welcome back to the RP Sports control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600">Total Products</h3>
            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-primary">{products.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600">Total Orders</h3>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-primary">{orders.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600">Total Customers</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-primary">3,291</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-600">Revenue (All Time)</h3>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <span className="font-bold">₹</span>
            </div>
          </div>
          <p className="text-3xl font-black text-primary">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-primary mb-6 flex items-center justify-between">
            <span>Quick Actions</span>
            <span className="text-xs font-mono font-bold bg-red-50 text-[#CC0000] border border-red-200 px-2.5 py-1 rounded">
              ⚡ Shiprocket Logged In
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/add-product" className="p-4 rounded-xl border border-slate-100 hover:border-accent hover:bg-accent/5 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-accent/10 flex items-center justify-center text-primary group-hover:text-accent transition-colors">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary">Add Product</h3>
                <p className="text-sm text-slate-500">Create new listing</p>
              </div>
            </Link>
            <Link href="/admin/products" className="p-4 rounded-xl border border-slate-100 hover:border-accent hover:bg-accent/5 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-accent/10 flex items-center justify-center text-primary group-hover:text-accent transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary">Manage Products</h3>
                <p className="text-sm text-slate-500">Edit or remove</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-primary mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center text-sm p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="font-bold text-primary block">{order.id}</span>
                  <span className="text-slate-500 font-medium text-xs">{order.shippingAddress.fullName} · {order.items.length} items</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-accent block">₹{order.total.toLocaleString()}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-white rounded text-slate-600 mt-1 inline-block border border-slate-200 uppercase">{order.status}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-medium">
                No recent orders to display.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
