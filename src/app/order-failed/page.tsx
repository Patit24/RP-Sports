"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw, Phone, ArrowLeft, ShieldAlert } from "lucide-react";

export default function OrderFailedPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] py-16 px-4 sm:px-8 max-w-xl mx-auto flex flex-col justify-center">
      
      <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 text-center shadow-lg">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto mb-6 text-[#CC0000]">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <span className="text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs mb-2 block">
          Payment Process Interrupted
        </span>
        <h1 className="text-3xl font-display font-black text-[#111111] uppercase mb-4">
          Order Payment Unsuccessful
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          We were unable to process your payment for this transaction. No funds were debited. Please try placing your order again using UPI, Credit Card, or Cash on Delivery.
        </p>

        {/* Retry CTAs */}
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Retry Checkout & Payment
          </Link>
          
          <Link
            href="/cart"
            className="w-full border-2 border-gray-200 hover:border-gray-900 text-gray-700 font-display font-bold uppercase tracking-widest text-xs py-3 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Cart
          </Link>
        </div>

        {/* Support Help */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          Need assistance with your payment? Call our Dumdum team:{" "}
          <a href="tel:+919876543210" className="text-[#CC0000] font-semibold hover:underline inline-flex items-center gap-1 ml-1">
            <Phone className="w-3 h-3" /> +91 98765 43210
          </a>
        </div>
      </div>

    </div>
  );
}
