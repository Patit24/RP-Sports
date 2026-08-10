"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Trash2, Edit3, PlusCircle, Search } from "lucide-react";

export default function ManageProductsPage() {
  const router = useRouter();
  const { products, deleteProduct, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return null;
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000]">
            Catalog Management
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-primary tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Manage Store Products
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">View, search, edit, and manage products in the RP Sports database.</p>
        </div>
        <Link 
          href="/admin/add-product" 
          className="px-6 py-3 bg-[#CC0000] text-white font-display font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[#990000] transition-colors flex items-center gap-2 shadow-lg shadow-[#CC0000]/20 whitespace-nowrap cursor-pointer"
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          <PlusCircle className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products by title, category or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#CC0000] text-sm font-medium"
            />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
            {filteredProducts.length} Items Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Product Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-slate-500 font-bold">
                    No products found matching "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img 
                        src={p.image || p.images?.[0] || "/cricket_bat_studio.jpg"} 
                        alt={p.name} 
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" 
                      />
                      <div>
                        <p className="font-bold text-primary">{p.name}</p>
                        <p className="text-xs text-slate-400 font-mono">SKU: {p.sku || p.id}</p>
                      </div>
                    </td>
                    <td className="p-4 capitalize">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-primary">
                      ₹{p.price.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        p.stock > 10 ? "bg-emerald-50 text-emerald-700" : p.stock > 0 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                      }`}>
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete product "${p.name}" from store catalog?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
