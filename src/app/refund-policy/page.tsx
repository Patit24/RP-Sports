"use client";

import Link from "next/link";
import { RotateCcw, ArrowLeft, ShieldCheck } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-4 sm:px-8 max-w-4xl mx-auto">
      
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-500 hover:text-[#CC0000] mb-8">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 shadow-md prose max-w-none text-gray-700 space-y-6">
        
        <div className="flex items-center gap-3 text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs mb-2">
          <RotateCcw className="w-4 h-4" /> 7-Day Guarantee
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-[#111111] uppercase leading-none">
          Refund & Replacement Policy
        </h1>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">7-Day Return Window</h3>
        <p className="text-sm">
          If you receive an unused bat or accessory with defect or sizing discrepancy, you can request a replacement or full refund within 7 days of delivery.
        </p>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">Manufacturing Warranty</h3>
        <p className="text-sm">
          Grade-1 English and Kashmir Willow bats carry a 30-day structural warranty against handle breakage or major shoulder cracks, subject to proper knocking & oiling inspection by our master bat technicians in Dumdum.
        </p>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">How to Initiate a Return</h3>
        <p className="text-sm">
          Email your Order ID and photo of the issue to <a href="mailto:returns@rpsports.in" className="text-[#CC0000] font-bold">returns@rpsports.in</a> or visit our Dumdum store.
        </p>

      </div>
    </div>
  );
}
