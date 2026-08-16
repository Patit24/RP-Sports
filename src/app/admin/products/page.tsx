"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Trash2, PlusCircle, Search, Layers, X, Loader2, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { auth } from "@/lib/firebase";
import type { Product } from "@/lib/mockData";

export default function ManageProductsPage() {
  const { products, deleteProduct, updateInventoryStock, showToast, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Stock edit modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockInput, setStockInput] = useState<string>("");
  const [stockReason, setStockReason] = useState<string>("");
  const [isUpdatingStock, setIsUpdatingStock] = useState<boolean>(false);
  const [stockError, setStockError] = useState<string | null>(null);

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return null;
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openStockModal = (product: Product) => {
    setSelectedProduct(product);
    setStockInput(String(product.stock ?? 0));
    setStockReason("");
    setStockError(null);
  };

  const closeStockModal = () => {
    if (isUpdatingStock) return;
    setSelectedProduct(null);
    setStockInput("");
    setStockReason("");
    setStockError(null);
  };

  const handleQuickDelta = (delta: number) => {
    const current = Number(stockInput) || 0;
    const nextVal = Math.max(0, current + delta);
    setStockInput(String(nextVal));
    setStockError(null);
  };

  const handleStockUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const trimmed = stockInput.trim();
    if (trimmed === "" || isNaN(Number(trimmed))) {
      setStockError("Please enter a valid numeric stock quantity.");
      return;
    }

    const newQty = Number(trimmed);
    if (!Number.isInteger(newQty)) {
      setStockError("Stock must be a whole number.");
      return;
    }

    if (newQty < 0) {
      setStockError("Stock quantity cannot be negative.");
      return;
    }

    if (newQty > 100000) {
      setStockError("Stock quantity cannot exceed 100,000 units.");
      return;
    }

    try {
      setIsUpdatingStock(true);
      setStockError(null);

      // Get Firebase Auth ID Token or fallback token for admin
      let idToken = "mock_admin_bypass_token";
      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken();
      }

      const res = await fetch("/api/admin/products/update-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          stock: newQty,
          reason: stockReason.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update product stock.");
      }

      // Update in local store
      updateInventoryStock(selectedProduct.id, newQty);
      showToast(`Stock for '${selectedProduct.name}' updated to ${newQty} units.`, "success");
      closeStockModal();
    } catch (err: any) {
      setStockError(err.message || "Failed to update stock. Please try again.");
    } finally {
      setIsUpdatingStock(false);
    }
  };

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
          <p className="text-slate-500 mt-1 text-sm font-medium">View, search, edit stock levels, and manage products in the RP Sports database.</p>
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
                        p.stock > 10 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : p.stock > 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openStockModal(p)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#111111] text-slate-700 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                          title="Quick update stock"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#CC0000]" />
                          <span>Edit Stock</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete product "${p.name}" from store catalog?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EDIT STOCK MODAL ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#CC0000]/20 border border-[#CC0000]/40 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-[#CC0000]" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase tracking-wider text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Edit Product Stock
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">SKU: {selectedProduct.sku || selectedProduct.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeStockModal}
                disabled={isUpdatingStock}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleStockUpdateSubmit} className="p-6 space-y-5">
              
              {/* Product Info Card */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <img 
                  src={selectedProduct.image || selectedProduct.images?.[0] || "/cricket_bat_studio.jpg"} 
                  alt={selectedProduct.name}
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0" 
                />
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{selectedProduct.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-semibold">Current Stock:</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedProduct.stock > 10 ? "bg-emerald-100 text-emerald-800" : selectedProduct.stock > 0 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                    }`}>
                      {selectedProduct.stock} units
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Notice */}
              {stockError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs font-bold text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{stockError}</span>
                </div>
              )}

              {/* Stock Input & Quick Adjustments */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  New Stock Quantity <span className="text-[#CC0000]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    step="1"
                    value={stockInput}
                    onChange={(e) => {
                      setStockInput(e.target.value);
                      setStockError(null);
                    }}
                    placeholder="Enter new stock count..."
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-lg font-black text-slate-900 focus:outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20 font-mono"
                    disabled={isUpdatingStock}
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase text-slate-400">
                    Units
                  </div>
                </div>

                {/* Quick Deltas */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Quick Add:</span>
                  {[+5, +10, +25, +50].map((delta) => (
                    <button
                      key={delta}
                      type="button"
                      onClick={() => handleQuickDelta(delta)}
                      disabled={isUpdatingStock}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      +{delta}
                    </button>
                  ))}
                  {[-5, -10].map((delta) => (
                    <button
                      key={delta}
                      type="button"
                      onClick={() => handleQuickDelta(delta)}
                      disabled={isUpdatingStock}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      {delta}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason for Adjustment (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Update Reason / Note <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  placeholder="e.g. New Kolkata workshop batch / inventory audit"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#CC0000]"
                  disabled={isUpdatingStock}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeStockModal}
                  disabled={isUpdatingStock}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStock}
                  className="px-6 py-2.5 bg-[#CC0000] hover:bg-[#990000] disabled:bg-slate-300 text-white font-display font-bold uppercase tracking-wider text-sm rounded-xl transition-all shadow-md shadow-[#CC0000]/20 flex items-center gap-2 cursor-pointer"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  {isUpdatingStock ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Stock...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Save Stock
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
