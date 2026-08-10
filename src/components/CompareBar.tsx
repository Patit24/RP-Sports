"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";

export default function CompareBar() {
  const { compareList, products, toggleCompare, clearCompare } = useStore();

  if (compareList.length === 0) return null;

  const comparedProducts = products.filter((p) => compareList.includes(p.id));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[980] bg-[#111111]/95 border-t-2 border-[#CC0000] backdrop-blur-md text-white shadow-2xl px-4 py-3 sm:px-8">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#CC0000]/20 border border-[#CC0000] flex items-center justify-center text-[#CC0000]">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <p className="font-display font-bold uppercase tracking-wider text-sm leading-none">
              Compare Products ({compareList.length}/4)
            </p>
            <p className="text-[10px] text-white/50 hidden sm:block">Select up to 4 bats to compare specs & ping</p>
          </div>
        </div>

        {/* Selected Items Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {comparedProducts.map((prod) => (
            <div
              key={prod.id}
              className="relative group bg-white/5 border border-white/10 p-1 flex items-center gap-2 pr-3 rounded-sm flex-shrink-0"
            >
              <img src={prod.images[0]} alt={prod.name} className="w-8 h-8 object-cover rounded-sm bg-white" />
              <span className="text-xs font-medium max-w-[100px] truncate">{prod.name}</span>
              <button
                onClick={() => toggleCompare(prod.id)}
                className="text-white/40 hover:text-red-400 transition-colors p-0.5"
                title="Remove from comparison"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1 uppercase font-bold tracking-wider px-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>

          <Link
            href="/compare"
            className="btn-primary text-xs py-2 px-5 shadow-md flex items-center gap-2 uppercase tracking-widest font-display font-bold"
          >
            Compare Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
