"use client";

import Link from "next/link";
import { 
  RotateCcw, ArrowLeft, ShieldCheck, CheckCircle2, XCircle,
  AlertTriangle, HelpCircle, Info, Truck, RefreshCw 
} from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] py-16 px-4 sm:px-8 max-w-5xl mx-auto pt-24 sm:pt-32 text-[#111111]">
      
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-500 hover:text-[#CC0000] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-xl prose max-w-none text-gray-700 space-y-8">
        
        {/* Header */}
        <div className="border-b border-gray-150 pb-6">
          <div className="inline-flex items-center gap-2.5 bg-[#CC0000]/10 text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs px-3 py-1 rounded-full mb-3">
            <RotateCcw className="w-4 h-4" /> Store Policies & Guarantee
          </div>
          <h1 
            className="text-3xl sm:text-5xl font-display font-black text-[#111111] uppercase leading-tight"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            Return & Refund Policy
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Last Updated: August 2026 • Applies to all new purchases from RP Sports.
          </p>
        </div>

        {/* Introduction Alert */}
        <div className="bg-red-50 border-l-4 border-[#CC0000] p-4 rounded-r-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-[#CC0000] shrink-0 mt-0.5" />
          <div className="text-xs text-gray-700 leading-relaxed">
            <span className="font-bold">Important Notice:</span> By placing an order with RP Sports, you agree to the conditions outlined below. Our return policy is designed to protect both the quality of our premium cricket gear and the safety of our customers.
          </div>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Return Window */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-250/60 space-y-3">
            <h3 className="text-lg font-display font-bold uppercase text-[#111111] flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <RotateCcw className="w-5 h-5 text-[#CC0000]" /> 1. Return Window
            </h3>
            <p className="text-xs leading-relaxed text-gray-600">
              Customers can request a replacement or return within our standard <span className="font-bold text-gray-900">7-day return window</span>, beginning from the day the item is successfully marked as delivered by our logistics partners.
            </p>
          </div>

          {/* Eligible Returns */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-250/60 space-y-3">
            <h3 className="text-lg font-display font-bold uppercase text-[#111111] flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> 2. Eligible Returns
            </h3>
            <p className="text-xs leading-relaxed text-gray-600">
              To qualify for a refund or exchange, items must be:
            </p>
            <ul className="list-disc pl-4 text-xs text-gray-500 space-y-1">
              <li>Completely unused and in original, brand new condition.</li>
              <li>Packed in all original packaging, with labels and tags intact.</li>
              <li>Accompanied by all accessories, guards, or grips.</li>
              <li>Backed by original proof of purchase or Order ID.</li>
            </ul>
          </div>

          {/* Non-Returnable Items */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-250/60 space-y-3">
            <h3 className="text-lg font-display font-bold uppercase text-[#111111] flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <XCircle className="w-5 h-5 text-[#CC0000]" /> 3. Non-Returnable Items
            </h3>
            <p className="text-xs leading-relaxed text-gray-600">
              The following categories are strictly excluded from returns or refunds:
            </p>
            <ul className="list-disc pl-4 text-xs text-gray-500 space-y-1">
              <li>Used products, custom-oiled, knocked, or gripped bats.</li>
              <li>Products showing sign of field usage or play.</li>
              <li>Customized items (e.g., sublimated jerseys with custom names/numbers, custom laser-engraved trophies).</li>
              <li>Damage resulting from customer misuse, poor handle-knocking, or incorrect storage.</li>
            </ul>
          </div>

          {/* Wrong or Damaged Product */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-250/60 space-y-3">
            <h3 className="text-lg font-display font-bold uppercase text-[#111111] flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <AlertTriangle className="w-5 h-5 text-amber-500" /> 4. Wrong or Damaged Product
            </h3>
            <p className="text-xs leading-relaxed text-gray-600">
              If you receive an incorrect product, sizing mistake, or item damaged in transit, please contact us immediately:
            </p>
            <ol className="list-decimal pl-4 text-xs text-gray-500 space-y-1">
              <li>Email <a href="mailto:returns@rpsports.in" className="text-[#CC0000] font-bold">returns@rpsports.in</a> within 48 hours.</li>
              <li>Provide your Order ID and photos or unboxing videos.</li>
              <li>Our master bat technicians will verify the defect or packing error.</li>
              <li>Upon verification, we will issue a free courier pickup and schedule a replacement.</li>
            </ol>
          </div>

          {/* Exchange Policy */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-250/60 space-y-3">
            <h3 className="text-lg font-display font-bold uppercase text-[#111111] flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <RefreshCw className="w-5 h-5 text-blue-600" /> 5. Exchange Policy
            </h3>
            <p className="text-xs leading-relaxed text-gray-600">
              We support exchanges for size adjustments (e.g. shoes or jerseys) or bat weight preferences, provided the products remain in 100% brand-new, unused condition. Simply visit our physical outlet at Dumdum Metro Gate 2, Kolkata, or request a return pickup through our support line.
            </p>
          </div>

          {/* Refund Issuance */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-250/60 space-y-3">
            <h3 className="text-lg font-display font-bold uppercase text-[#111111] flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> 6. Refund Processing
            </h3>
            <p className="text-xs leading-relaxed text-gray-600">
              Approved refunds are initiated within 3–5 business days after the returned item arrives at our warehouse and passes QA checks. Refunds are issued directly to the original payment method (bank account, card, or UPI wallet). Processing times may vary depending on your bank.
            </p>
          </div>

          {/* Return Shipping Fees */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-250/60 space-y-3">
            <h3 className="text-lg font-display font-bold uppercase text-[#111111] flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <Truck className="w-5 h-5 text-indigo-600" /> 7. Return Shipping Costs
            </h3>
            <p className="text-xs leading-relaxed text-gray-600">
              - <span className="font-bold text-gray-900">Store-Bears Cost:</span> RP Sports will provide a prepaid pickup label and pay all return shipping charges for damaged, defective, or incorrect items.
            </p>
            <p className="text-xs leading-relaxed text-gray-600">
              - <span className="font-bold text-gray-900">Customer-Bears Cost:</span> For size exchanges due to order preference mistakes or change of mind, the return shipping charge (flat ₹250) will be paid by the customer or deducted from the refund amount.
            </p>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-250/60 space-y-3">
            <h3 className="text-lg font-display font-bold uppercase text-[#111111] flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <HelpCircle className="w-5 h-5 text-teal-600" /> 8. Cancellation Policy
            </h3>
            <p className="text-xs leading-relaxed text-gray-600">
              Orders can be cancelled free of charge before they enter the <span className="font-bold text-gray-900">Packed</span> or <span className="font-bold text-gray-900">Shipped</span> state. Once an order is handed over to the courier partner (Shiprocket/Delhivery/Blue Dart) and an AWB tracking number is generated, cancellation is no longer allowed.
            </p>
          </div>

        </div>

        {/* Structural Warranty */}
        <div className="bg-[#CC0000]/5 border border-[#CC0000]/20 p-6 rounded-2xl space-y-2">
          <h4 className="font-display font-bold uppercase text-sm text-[#CC0000] flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            🏏 Exclusive Structural Bat Warranty
          </h4>
          <p className="text-xs leading-relaxed text-gray-600">
            Premium bats carry an additional 30-day warranty protecting specifically against handle snap cracks or major shoulder breaks. All claims are assessed on-site at our Dumdum store. General face dents, edge chipping, or normal willow wear and tear are not covered.
          </p>
        </div>

      </div>
    </div>
  );
}
