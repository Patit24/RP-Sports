"use client";

import Link from "next/link";
import { Truck, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-4 sm:px-8 max-w-4xl mx-auto">
      
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-500 hover:text-[#CC0000] mb-8">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 shadow-md prose max-w-none text-gray-700 space-y-6">
        
        <div className="flex items-center gap-3 text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs mb-2">
          <Truck className="w-4 h-4" /> Delivery Guidelines
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-[#111111] uppercase leading-none">
          Shipping & Delivery Policy
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="p-4 bg-red-50 border border-red-100 rounded">
            <h4 className="font-bold text-[#CC0000] text-sm uppercase">Kolkata Local Express</h4>
            <p className="text-xs text-gray-600 mt-1">Same day or 24-hour delivery across Dumdum, Salt Lake, New Town & South Kolkata.</p>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
            <h4 className="font-bold text-[#111111] text-sm uppercase">Pan-India Express Shipping</h4>
            <p className="text-xs text-gray-600 mt-1">3 to 5 business days via Bluedart, Delhivery & Speed Post with live tracking.</p>
          </div>
        </div>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">Shipping Charges</h3>
        <p className="text-sm">
          • Orders above ₹5,000 qualify for <strong>FREE PAN-INDIA SHIPPING</strong>.<br />
          • Flat ₹250 shipping fee applies for standard orders under ₹5,000.
        </p>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">Bat Protection Packaging</h3>
        <p className="text-sm">
          Every bat is packed with padded bubble wrap, toe guards, and heavy-duty corrugated box sleeves to protect the willow against damage during transport.
        </p>

      </div>
    </div>
  );
}
