"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Trash2, Edit3, PlusCircle, Search } from "lucide-react";

export default function ManageProductsPage() {
  const { products, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase text-primary tracking-tight">Manage Products</h1>
          <p className="text-slate-500 mt-2 font-medium">View and edit your store's catalog.</p>
        </div>
        <Link href="/admin/add-product" className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-accent transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap">
          <PlusCircle className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                        <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="font-bold text-primary truncate max-w-[200px] sm:max-w-[300px]">{prod.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{prod.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-bold uppercase text-xs tracking-wider">{prod.category}</td>
                  <td className="p-4 font-bold text-accent">₹{prod.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${prod.stock < 10 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {prod.stock} Units
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 shrink-0">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteProduct(prod.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
