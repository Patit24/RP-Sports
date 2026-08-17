"use client";

import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-20 md:pt-28 pb-28 md:pb-10 px-4 px-4 sm:px-8 max-w-4xl mx-auto">
      
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-500 hover:text-[#CC0000] mb-8">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 shadow-md prose max-w-none text-gray-700">
        
        <div className="flex items-center gap-3 text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs mb-2">
          <ShieldCheck className="w-4 h-4" /> RP Sports Legal
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-[#111111] uppercase mb-6 leading-none">
          Privacy Policy
        </h1>

        <p className="text-xs text-gray-400 mb-8">Effective Date: June 2026 • RP Sports Kolkata</p>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">1. Information We Collect</h3>
        <p className="text-sm">
          At RP Sports (Dumdum, Kolkata), we collect your name, email address, phone number, shipping address, and payment transaction IDs solely to process cricket bat orders, arrange courier delivery, and provide customer support.
        </p>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">2. How We Use Your Data</h3>
        <p className="text-sm">
          Your personal details are used exclusively for order fulfillment, sending shipping status tracking updates via SMS/WhatsApp, and notifying you about exclusive store offers or new willow arrivals. We NEVER sell or trade your data.
        </p>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">3. Data Security & Payment Protection</h3>
        <p className="text-sm">
          All payment card transactions and UPI payments are processed securely via encrypted gateways (Razorpay/UPI). Your full banking credentials are never stored on our local servers.
        </p>

        <h3 className="text-xl font-display font-bold uppercase text-[#111111]">4. Contact Us</h3>
        <p className="text-sm">
          If you have questions regarding this Privacy Policy, visit our store at Dumdum Metro Station, Kolkata – 700028 or email <a href="mailto:info@rpsports.in" className="text-[#CC0000] font-bold">info@rpsports.in</a>.
        </p>

      </div>
    </div>
  );
}
