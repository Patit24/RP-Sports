"use client";

import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-4 sm:px-8 max-w-4xl mx-auto">
      
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-500 hover:text-[#CC0000] mb-8">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 shadow-md prose max-w-none text-gray-700">
        
        <div className="flex items-center gap-3 text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs mb-2">
          <FileText className="w-4 h-4" /> RP Sports Legal
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-[#111111] uppercase mb-6 leading-none">
          Terms & Conditions
        </h1>

        <p className="text-xs text-gray-400 mb-8">Effective Date: June 2026 • RP Sports Kolkata</p>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">1. Website Usage</h3>
        <p className="text-sm">
          By accessing or placing an order on rpsports.in, you agree to comply with our commercial terms and store guidelines.
        </p>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">2. Product Specifications & Willow Grains</h3>
        <p className="text-sm">
          Cricket bats are handcrafted from natural wood (English & Kashmir Willow). Natural wood grain counts, pin marks, and slight weight variations (±15g) are inherent characteristics of real willow bats.
        </p>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">3. Order Acceptance & Pricing</h3>
        <p className="text-sm">
          RP Sports reserves the right to verify or cancel orders in cases of pricing errors or inventory stock-outs. Full refunds will be issued immediately in such events.
        </p>

      </div>
    </div>
  );
}
