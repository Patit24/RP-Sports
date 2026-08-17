"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Scale, Trash2, ShoppingCart, ArrowLeft, Star, Check, Plus } from "lucide-react";

export default function ComparePage() {
  const { compareList, products, toggleCompare, clearCompare, addToCart } = useStore();

  const comparedProducts = products.filter((p) => compareList.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-20 md:pt-28 pb-28 md:pb-10 px-4 px-4 sm:px-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs mb-2">
            <Scale className="w-4 h-4" /> Bat Specification Comparison
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-[#111111] uppercase">
            Compare Cricket Bats
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Analyze willow grade, grain count, edge size, sweet spot profile, and weight side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="flex items-center gap-2 border border-gray-300 hover:border-[#CC0000] text-gray-700 hover:text-[#CC0000] font-display font-bold uppercase text-xs tracking-wider px-4 py-2.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
          <Link
            href="/shop"
            className="btn-primary text-xs flex items-center gap-2 font-display font-bold uppercase tracking-wider px-5 py-2.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {comparedProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center max-w-lg mx-auto my-12 rounded-lg shadow-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4 text-[#CC0000]">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-display font-bold uppercase text-[#111111] mb-2">
            No Bats Selected For Comparison
          </h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Click the <Scale className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> icon on any bat card in the shop to compare specs side-by-side.
          </p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Select Bats From Shop
          </Link>
        </div>
      ) : (
        /* Comparison Table */
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-4 w-48 text-xs font-display font-bold uppercase tracking-widest text-gray-400">
                  Feature / Spec
                </th>
                {comparedProducts.map((prod) => (
                  <th key={prod.id} className="p-4 w-64 border-l border-gray-200 align-top relative">
                    <button
                      onClick={() => toggleCompare(prod.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="aspect-[4/5] bg-gray-100 mb-3 rounded overflow-hidden flex items-center justify-center p-2">
                      <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <p className="text-[10px] text-[#CC0000] font-display font-bold uppercase tracking-widest">{prod.brand}</p>
                    <h4 className="font-display font-black text-[#111111] uppercase text-base leading-tight line-clamp-2 mb-2">
                      {prod.name}
                    </h4>
                    <p className="text-xl font-display font-black text-[#CC0000] mb-3">
                      ₹{prod.price.toLocaleString()}
                    </p>
                    <button
                      onClick={() => addToCart({ product: prod, quantity: 1, selectedSize: prod.sizes[0] })}
                      className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-display font-bold uppercase tracking-wider text-xs py-2 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              
              {/* Rating */}
              <tr>
                <td className="p-4 font-display font-bold uppercase tracking-wider text-xs text-gray-500 bg-gray-50/50">
                  Rating
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-gray-100">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-800">{p.rating}</span>
                      <span className="text-xs text-gray-400">({p.reviewsCount})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Willow Type */}
              <tr>
                <td className="p-4 font-display font-bold uppercase tracking-wider text-xs text-gray-500 bg-gray-50/50">
                  Willow Type
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-gray-100 font-semibold text-gray-800">
                    {p.specifications["Willow Type"] || (p.name.includes("English") ? "Grade-1 English Willow" : "Premium Kashmir Willow")}
                  </td>
                ))}
              </tr>

              {/* Handle Type */}
              <tr>
                <td className="p-4 font-display font-bold uppercase tracking-wider text-xs text-gray-500 bg-gray-50/50">
                  Handle Type
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-gray-100 text-gray-700">
                    {p.specifications["Handle Type"] || "Sarawak Multi-piece Cane"}
                  </td>
                ))}
              </tr>

              {/* Sweet Spot */}
              <tr>
                <td className="p-4 font-display font-bold uppercase tracking-wider text-xs text-gray-500 bg-gray-50/50">
                  Sweet Spot
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-gray-100 text-gray-700">
                    {p.specifications["Sweet Spot"] || "Mid to Low Rebound Profile"}
                  </td>
                ))}
              </tr>

              {/* Weight */}
              <tr>
                <td className="p-4 font-display font-bold uppercase tracking-wider text-xs text-gray-500 bg-gray-50/50">
                  Weight
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-gray-100 font-medium text-gray-800">
                    {p.weight || "1.18 - 1.22 kg"}
                  </td>
                ))}
              </tr>

              {/* Edge Size */}
              <tr>
                <td className="p-4 font-display font-bold uppercase tracking-wider text-xs text-gray-500 bg-gray-50/50">
                  Edge Thickness
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-gray-100 text-gray-700">
                    {p.specifications["Edge Size"] || "38mm - 41mm Power Edges"}
                  </td>
                ))}
              </tr>

              {/* Pre-knocked */}
              <tr>
                <td className="p-4 font-display font-bold uppercase tracking-wider text-xs text-gray-500 bg-gray-50/50">
                  Pre-Knocked
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-gray-100 text-emerald-600 font-semibold">
                    <Check className="w-4 h-4 inline mr-1" /> Ready for Nets
                  </td>
                ))}
              </tr>

              {/* Stock Status */}
              <tr>
                <td className="p-4 font-display font-bold uppercase tracking-wider text-xs text-gray-500 bg-gray-50/50">
                  Stock Status
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-gray-100">
                    {p.stock > 0 ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                        In Stock ({p.stock} units)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
