"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Product } from "@/lib/mockData";
import {
  Users, Shirt, MapPin, Phone, User, MessageSquare,
  Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck,
  Truck, Award, Clock, ChevronRight, Send, HelpCircle, Flame
} from "lucide-react";

const ADMIN_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "919876543210";
const MIN_BULK_QUANTITY = 10;

function BulkOrdersContent() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get("product");
  const storeProducts = useStore((state) => state.products);

  // Filter available jerseys / apparel
  const availableJerseys = useMemo(() => {
    const list = storeProducts || [];
    const jerseys = list.filter(
      (p) =>
        p.category === "jerseys" ||
        p.category === "apparel" ||
        p.name.toLowerCase().includes("jersey") ||
        p.subcategory?.includes("jersey") ||
        p.enableJerseyCustomization
    );
    return jerseys.length > 0 ? jerseys : list.slice(0, 10);
  }, [storeProducts]);

  // Selected product
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || availableJerseys[0]?.id || ""
  );

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    } else if (availableJerseys.length > 0 && !selectedProductId) {
      setSelectedProductId(availableJerseys[0].id);
    }
  }, [initialProductId, availableJerseys, selectedProductId]);

  const activeProduct = useMemo(() => {
    return (
      storeProducts.find((p) => p.id === selectedProductId) ||
      availableJerseys[0] ||
      storeProducts[0]
    );
  }, [storeProducts, selectedProductId, availableJerseys]);

  // Order Details
  const [quantity, setQuantity] = useState<number>(25);
  const [printingOption, setPrintingOption] = useState<string>("Player Name + Number + Team Logo");
  const [otherPrintingNotes, setOtherPrintingNotes] = useState<string>("");

  // Sizes breakdown
  const [sizes, setSizes] = useState<{ [key: string]: number }>({
    S: 5,
    M: 10,
    L: 10,
    XL: 0,
    XXL: 0,
  });
  const [noSizeBreakdownYet, setNoSizeBreakdownYet] = useState<boolean>(false);

  // Customer Information
  const [customerName, setCustomerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [deliveryCity, setDeliveryCity] = useState<string>("Kolkata");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [tournamentDate, setTournamentDate] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string>("");
  const [enquiryReference, setEnquiryReference] = useState<string>("");

  // Calculate size total
  const totalSizesEntered = Object.values(sizes).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  const isSizeSumMatched = noSizeBreakdownYet || totalSizesEntered === quantity;

  const handleSizeChange = (sizeKey: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setSizes((prev) => ({ ...prev, [sizeKey]: num }));
  };

  // Wholesale tiered pricing calculation
  const unitPrice = activeProduct?.price || 899;
  const wholesaleDiscountPercentage = useMemo(() => {
    if (quantity >= 100) return 35;
    if (quantity >= 50) return 25;
    if (quantity >= 25) return 20;
    if (quantity >= 10) return 15;
    return 0;
  }, [quantity]);

  const estimatedUnitPrice = Math.round(unitPrice * (1 - wholesaleDiscountPercentage / 100));
  const estimatedTotalPrice = estimatedUnitPrice * quantity;
  const standardTotalPrice = unitPrice * quantity;
  const estimatedSavings = standardTotalPrice - estimatedTotalPrice;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit WhatsApp phone number.");
      return;
    }

    if (quantity < MIN_BULK_QUANTITY) {
      setErrorMessage(`Bulk team orders start from a minimum of ${MIN_BULK_QUANTITY} jerseys.`);
      return;
    }

    if (!noSizeBreakdownYet && totalSizesEntered !== quantity) {
      setErrorMessage(
        `Your size breakdown total (${totalSizesEntered}) does not match your total quantity (${quantity}). Adjust the sizes or check 'Decide sizes later'.`
      );
      return;
    }

    if (!deliveryCity.trim()) {
      setErrorMessage("Please enter your delivery city.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit lead to server CRM endpoint
      const response = await fetch("/api/enquiries/bulk-jersey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: activeProduct?.id || "jersey-general",
          productName: activeProduct?.name || "Match Jersey",
          productSku: activeProduct?.sku || activeProduct?.id || "RP-JSY",
          quantity,
          printingOption,
          customPrintingNotes: printingOption === "Other" ? otherPrintingNotes : "",
          sizeBreakdown: noSizeBreakdownYet ? {} : sizes,
          noSizeBreakdownYet,
          customerName: customerName.trim(),
          phone: cleanPhone,
          email: email.trim() || undefined,
          teamName: teamName.trim() || undefined,
          deliveryCity: deliveryCity.trim(),
          deliveryAddress: deliveryAddress.trim() || undefined,
          additionalNotes: [
            tournamentDate ? `Tournament/Deadline Date: ${tournamentDate}` : "",
            additionalNotes.trim()
          ].filter(Boolean).join(" | ") || undefined,
        }),
      });

      const resData = await response.json();
      const refId = resData.enquiryId || `BQ-${Math.floor(1000 + Math.random() * 9000)}`;
      setEnquiryReference(refId);

      // 2. Generate Structured WhatsApp Message with Product Details
      let sizeBreakdownText = "To be confirmed with team lineup";
      if (!noSizeBreakdownYet) {
        const sizeParts = Object.entries(sizes)
          .filter(([_, qty]) => qty > 0)
          .map(([sz, qty]) => `${sz}: ${qty}`);
        if (sizeParts.length > 0) {
          sizeBreakdownText = sizeParts.join(", ");
        }
      }

      const finalPrinting =
        printingOption === "Other" && otherPrintingNotes.trim()
          ? `Other (${otherPrintingNotes.trim()})`
          : printingOption;

      const rawMessage = 
`🏏 *BULK TEAM JERSEY ORDER ENQUIRY* [${refId}]

👕 *Selected Jersey / Product:* ${activeProduct?.name || "Match Jersey"}
📦 *Product SKU / ID:* ${activeProduct?.sku || activeProduct?.id || "RP-JSY"}
🔢 *Total Quantity:* ${quantity} Jerseys
💰 *Estimated Rate:* ~₹${estimatedUnitPrice}/jersey (Wholesale ${wholesaleDiscountPercentage}% Off)

🏆 *Team / Club / Academy:* ${teamName.trim() || "Not specified"}
🎨 *Customization / Printing:* ${finalPrinting}
📐 *Size Breakdown:*
${sizeBreakdownText}

👤 *Contact Name:* ${customerName.trim()}
📱 *WhatsApp Phone:* ${cleanPhone}
${email.trim() ? `✉️ *Email:* ${email.trim()}\n` : ""}📍 *Delivery City:* ${deliveryCity.trim()}
${deliveryAddress.trim() ? `🏢 *Delivery Address:* ${deliveryAddress.trim()}\n` : ""}${tournamentDate.trim() ? `📅 *Match / Tournament Deadline:* ${tournamentDate.trim()}\n` : ""}${additionalNotes.trim() ? `📝 *Special Notes:* ${additionalNotes.trim()}\n` : ""}
_Please share final wholesale quotation, digital jersey mockups & delivery timeline._`;

      const encodedText = encodeURIComponent(rawMessage);
      const cleanAdminPhone = ADMIN_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanAdminPhone}?text=${encodedText}`;

      setGeneratedWhatsAppUrl(waUrl);
      setIsSuccess(true);

      // Open WhatsApp in a new tab
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      console.error("Bulk enquiry error:", err);
      setErrorMessage("Could not submit enquiry automatically, but you can still contact our workshop admin directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F1F2F4] text-[#111111] min-h-screen font-sans pb-16">

      {/* ── Breadcrumb & Page Header ── */}
      <section className="bg-neutral-950 text-white py-10 sm:py-14 border-b border-neutral-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#CC0000] font-bold">Bulk Team Jersey Order</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-display font-black tracking-widest uppercase bg-[#CC0000] text-white mb-3 shadow-sm">
                <Users className="w-3.5 h-3.5" /> Wholesale & Club Pricing
              </span>
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight leading-none"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                BULK TEAM JERSEY ORDERS
              </h1>
              <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
                Direct workshop wholesale pricing for cricket clubs, football academies, school teams, and corporate tournaments. Free digital design mockups &amp; sublimation printing.
              </p>
            </div>

            {/* Quick stats pill */}
            <div className="flex items-center gap-3 bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-2xl shrink-0">
              <div className="text-center px-3 border-r border-neutral-800">
                <span className="text-xs text-neutral-400 uppercase font-mono block">Min Quantity</span>
                <span className="text-xl font-display font-black text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>10 Pcs</span>
              </div>
              <div className="text-center px-3 border-r border-neutral-800">
                <span className="text-xs text-neutral-400 uppercase font-mono block">Max Discount</span>
                <span className="text-xl font-display font-black text-amber-400" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>35% OFF</span>
              </div>
              <div className="text-center px-3">
                <span className="text-xs text-neutral-400 uppercase font-mono block">Dispatch</span>
                <span className="text-xl font-display font-black text-emerald-400" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>5-7 Days</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Main Form & Live Calculator Section ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6">

        {isSuccess ? (
          /* ── SUCCESS STATE VIEW ── */
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-1">
              Enquiry Reference: #{enquiryReference}
            </span>
            <h2 
              className="text-3xl sm:text-4xl font-display font-black uppercase text-neutral-900 mb-3"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              Order Details Formatted!
            </h2>

            <p className="text-neutral-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              We&apos;ve logged your request in our CRM and created a pre-filled WhatsApp message for <strong className="text-neutral-900">{customerName} ({quantity}x {activeProduct?.name})</strong>.
            </p>

            <div className="p-4 bg-neutral-50 rounded-xl border border-slate-200 text-left text-xs font-mono mb-6 space-y-1.5 text-neutral-700">
              <div><strong>Jersey:</strong> {activeProduct?.name}</div>
              <div><strong>Quantity:</strong> {quantity} jerseys</div>
              <div><strong>Customization:</strong> {printingOption}</div>
              <div><strong>Delivery City:</strong> {deliveryCity}</div>
              <div><strong>Estimated Total:</strong> ~₹{estimatedTotalPrice.toLocaleString("en-IN")} ({wholesaleDiscountPercentage}% Tier Discount)</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generatedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Admin WhatsApp Now</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setErrorMessage(null);
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* ── MAIN 2-COLUMN FORM & CALCULATOR ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: Summary & Live Price Tier Card (4 Cols) ── */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              
              {/* Product Preview Card */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#CC0000] block mb-2">
                  Selected Jersey Template
                </span>

                <div className="aspect-[4/3] bg-gradient-to-b from-neutral-50 via-neutral-100/50 to-neutral-50 rounded-xl p-4 flex items-center justify-center overflow-hidden mb-4 border border-slate-100">
                  <img
                    src={activeProduct?.images[0] || "/products/cat_jerseys.jpg"}
                    alt={activeProduct?.name || "Jersey Preview"}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <h3 
                  className="font-display font-bold text-xl text-neutral-900 leading-snug mb-1"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  {activeProduct?.name}
                </h3>
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-4">
                  SKU: {activeProduct?.sku || activeProduct?.id}
                </span>

                {/* Wholesale Tier Discount Calculator */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-medium">Standard Retail Price:</span>
                    <span className="font-mono text-neutral-500 line-through">₹{unitPrice} / pc</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-700 font-bold">Wholesale Tier Discount:</span>
                    <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {wholesaleDiscountPercentage}% OFF ({quantity} Pcs)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-700 font-bold">Estimated Rate:</span>
                    <span className="font-display font-black text-base text-neutral-950" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      ₹{estimatedUnitPrice} / pc
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">Est. Batch Total</span>
                      <span className="text-2xl font-display font-black text-[#CC0000]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                        ₹{estimatedTotalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {estimatedSavings > 0 && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                        Save ₹{estimatedSavings.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Wholesale Tier Ladder */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                    Tiered Volume Discounts
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className={`p-2 rounded-lg border ${quantity >= 10 && quantity < 25 ? "bg-red-50 border-red-200 text-[#CC0000] font-bold" : "bg-neutral-50 border-slate-200 text-neutral-600"}`}>
                      10–24 Pcs: <strong>15% Off</strong>
                    </div>
                    <div className={`p-2 rounded-lg border ${quantity >= 25 && quantity < 50 ? "bg-red-50 border-red-200 text-[#CC0000] font-bold" : "bg-neutral-50 border-slate-200 text-neutral-600"}`}>
                      25–49 Pcs: <strong>20% Off</strong>
                    </div>
                    <div className={`p-2 rounded-lg border ${quantity >= 50 && quantity < 100 ? "bg-red-50 border-red-200 text-[#CC0000] font-bold" : "bg-neutral-50 border-slate-200 text-neutral-600"}`}>
                      50–99 Pcs: <strong>25% Off</strong>
                    </div>
                    <div className={`p-2 rounded-lg border ${quantity >= 100 ? "bg-red-50 border-red-200 text-[#CC0000] font-bold" : "bg-neutral-50 border-slate-200 text-neutral-600"}`}>
                      100+ Pcs: <strong>35% Off</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Guarantees Box */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#CC0000] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-display font-bold uppercase text-neutral-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      Premium Interlock &amp; Poly Mesh Fabric
                    </h4>
                    <p className="text-[11px] text-neutral-500">180 GSM high-grade sweat-wicking dry-fit poly fabric.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-display font-bold uppercase text-neutral-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      Non-Fading Sublimation Inks
                    </h4>
                    <p className="text-[11px] text-neutral-500">Korean HD sublimation printing guaranteed for 100+ washes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-display font-bold uppercase text-neutral-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      Doorstep Courier Dispatch
                    </h4>
                    <p className="text-[11px] text-neutral-500">Direct delivery across Kolkata &amp; all districts in India.</p>
                  </div>
                </div>
              </div>

            </div>


            {/* ── RIGHT COLUMN: Comprehensive Interactive Form (8 Cols) ── */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200">
              
              <form onSubmit={handleFormSubmit} className="space-y-8">
                
                {/* 1. SELECT JERSEY TEMPLATE */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                      <Shirt className="w-4 h-4 text-[#CC0000]" />
                      <span>1. Choose Jersey Model / Template *</span>
                    </label>
                    <span className="text-[11px] text-neutral-400">{availableJerseys.length} models available</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1 border border-slate-200 rounded-xl bg-neutral-50">
                    {availableJerseys.map((jersey) => {
                      const isSelected = jersey.id === selectedProductId;
                      return (
                        <div
                          key={jersey.id}
                          onClick={() => setSelectedProductId(jersey.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-white border-[#CC0000] ring-2 ring-red-500/20 shadow-sm"
                              : "bg-white/70 border-slate-200 hover:border-neutral-400 hover:bg-white"
                          }`}
                        >
                          <div className="aspect-square bg-neutral-100 rounded-lg p-2 flex items-center justify-center overflow-hidden mb-1.5">
                            <img
                              src={jersey.images[0]}
                              alt={jersey.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <span className="text-[11px] font-display font-bold text-neutral-900 line-clamp-1 leading-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                            {jersey.name}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">₹{jersey.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>


                {/* 2. ORDER QUANTITY & TIER SELECTOR */}
                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 mb-2">
                    <Users className="w-4 h-4 text-[#CC0000]" />
                    <span>2. Order Quantity (Min {MIN_BULK_QUANTITY} Pcs) *</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-neutral-50">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(MIN_BULK_QUANTITY, q - 5))}
                        className="px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold transition-colors cursor-pointer"
                      >
                        -5
                      </button>
                      <input
                        type="number"
                        min={MIN_BULK_QUANTITY}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || MIN_BULK_QUANTITY))}
                        className="w-20 text-center py-2 text-base font-display font-black text-neutral-950 bg-white outline-none"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 5)}
                        className="px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold transition-colors cursor-pointer"
                      >
                        +5
                      </button>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      {[15, 25, 50, 100, 200].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setQuantity(preset)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                            quantity === preset
                              ? "bg-neutral-950 text-white shadow-sm"
                              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-slate-200"
                          }`}
                        >
                          {preset} Pcs
                        </button>
                      ))}
                    </div>
                  </div>
                </div>


                {/* 3. PRINTING & CUSTOMIZATION OPTIONS */}
                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-[#CC0000]" />
                    <span>3. Customization &amp; Printing Options *</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      "Player Name + Number + Team Logo",
                      "Full Front + Back Sublimation with Sponsors",
                      "Embroidery Logo + Number Only",
                      "No Printing (Plain Match Jerseys)",
                      "Other",
                    ].map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                          printingOption === opt
                            ? "bg-red-50/60 border-[#CC0000] text-neutral-950 font-bold"
                            : "bg-white border-slate-200 hover:border-neutral-400 text-neutral-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="printingOption"
                          value={opt}
                          checked={printingOption === opt}
                          onChange={(e) => setPrintingOption(e.target.value)}
                          className="accent-[#CC0000] w-4 h-4 cursor-pointer"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>

                  {printingOption === "Other" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={otherPrintingNotes}
                        onChange={(e) => setOtherPrintingNotes(e.target.value)}
                        placeholder="Describe your specific printing requirements (e.g. Sleeve sponsors, collar text)..."
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#CC0000] outline-none"
                      />
                    </div>
                  )}
                </div>


                {/* 4. SIZE DISTRIBUTION BREAKDOWN */}
                <div className="p-4 sm:p-5 bg-neutral-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                      4. Size Distribution Breakdown
                    </label>

                    <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={noSizeBreakdownYet}
                        onChange={(e) => setNoSizeBreakdownYet(e.target.checked)}
                        className="accent-[#CC0000] w-4 h-4 cursor-pointer rounded"
                      />
                      <span>Decide sizes later with team roster</span>
                    </label>
                  </div>

                  {!noSizeBreakdownYet && (
                    <>
                      <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {["S", "M", "L", "XL", "XXL"].map((sz) => (
                          <div key={sz} className="text-center">
                            <span className="text-[11px] font-mono font-bold text-neutral-500 block mb-1">
                              {sz}
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={sizes[sz] || 0}
                              onChange={(e) => handleSizeChange(sz, e.target.value)}
                              className="w-full text-center py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-neutral-900 focus:border-[#CC0000] outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Validator Tally */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-mono text-neutral-600">
                          Sizes Total: <strong className={isSizeSumMatched ? "text-emerald-700" : "text-rose-600"}>{totalSizesEntered}</strong> / {quantity}
                        </span>

                        {!isSizeSumMatched && (
                          <span className="font-mono font-bold text-rose-600 text-[11px]">
                            Difference: {quantity - totalSizesEntered > 0 ? `+${quantity - totalSizesEntered} left` : `${quantity - totalSizesEntered} excess`}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>


                {/* 5. CONTACT & DELIVERY INFORMATION */}
                <div className="space-y-4 pt-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#CC0000]" />
                    <span>5. Contact &amp; Delivery Information *</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rahul Sen / Coach Debashis"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#CC0000] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                        WhatsApp Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98300 12345"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#CC0000] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                        Team / Club / Academy Name
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Dumdum United CC / Royal Strikers"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#CC0000] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                        Delivery City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        placeholder="e.g. Kolkata / Howrah / Siliguri"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#CC0000] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                        Tournament / Match Deadline Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={tournamentDate}
                        onChange={(e) => setTournamentDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#CC0000] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. captain@gmail.com"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#CC0000] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                      Special Requirements / Sponsor Logo Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Mention collar type (Polo/Round), sleeve stripes, player roster list, or sponsor logo details..."
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#CC0000] outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-display font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 cursor-pointer"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>
                      {isSubmitting
                        ? "Submitting & Formatting WhatsApp Message..."
                        : `Send Team Order to Admin WhatsApp (${quantity} Jerseys)`}
                    </span>
                  </button>
                  <p className="text-[11px] text-neutral-400 text-center mt-2.5">
                    Opens WhatsApp with pre-filled team order details directly to RP Sports Kolkata workshop admin.
                  </p>
                </div>

              </form>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default function BulkOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F1F2F4]">
          <div className="p-8 bg-white rounded-2xl shadow-md text-center">
            <span className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#CC0000] animate-spin inline-block mb-3" />
            <p className="font-display font-bold uppercase tracking-wider text-sm text-neutral-800" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Loading Wholesale Order Portal...
            </p>
          </div>
        </div>
      }
    >
      <BulkOrdersContent />
    </Suspense>
  );
}
