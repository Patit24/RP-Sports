"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { 
  X, Send, CheckCircle2, AlertCircle, Users, Shirt, MapPin, Phone, User, MessageSquare, 
  ChevronDown, Sparkles 
} from "lucide-react";

interface BulkJerseyOrderModalProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "919876543210";
const MIN_BULK_QUANTITY = 10;

export default function BulkJerseyOrderModal({ product: initialProduct, isOpen, onClose }: BulkJerseyOrderModalProps) {
  const storeProducts = useStore((state) => state.products);

  // Available jersey products in the catalog
  const availableJerseys = useMemo(() => {
    const jerseys = storeProducts.filter(
      (p) =>
        p.category === "jerseys" ||
        p.category === "apparel" ||
        p.name.toLowerCase().includes("jersey") ||
        p.subcategory?.includes("jersey") ||
        p.enableJerseyCustomization
    );
    return jerseys.length > 0 ? jerseys : storeProducts;
  }, [storeProducts]);

  // Selected product state
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProduct?.id || availableJerseys[0]?.id || "rp-jsy-india"
  );

  const activeProduct = useMemo(() => {
    return (
      storeProducts.find((p) => p.id === selectedProductId) ||
      initialProduct ||
      availableJerseys[0] ||
      storeProducts[0]
    );
  }, [storeProducts, selectedProductId, initialProduct, availableJerseys]);

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
  const [additionalNotes, setAdditionalNotes] = useState<string>("");

  // Form State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string>("");
  const [enquiryReference, setEnquiryReference] = useState<string>("");

  if (!isOpen) return null;

  // Calculate size total
  const totalSizesEntered = Object.values(sizes).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  const isSizeSumMatched = noSizeBreakdownYet || totalSizesEntered === quantity;

  const handleSizeChange = (sizeKey: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setSizes((prev) => ({ ...prev, [sizeKey]: num }));
  };

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
      setErrorMessage("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    if (quantity < MIN_BULK_QUANTITY) {
      setErrorMessage(`Bulk team orders start from a minimum of ${MIN_BULK_QUANTITY} jerseys.`);
      return;
    }

    if (!noSizeBreakdownYet && totalSizesEntered !== quantity) {
      setErrorMessage(`Size breakdown adds up to ${totalSizesEntered}, but your requested quantity is ${quantity}. Please adjust the sizes or check 'Decide sizes later'.`);
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
          additionalNotes: additionalNotes.trim() || undefined,
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

      const finalPrinting = printingOption === "Other" && otherPrintingNotes.trim()
        ? `Other (${otherPrintingNotes.trim()})`
        : printingOption;

      const rawMessage = 
`🏏 *BULK TEAM JERSEY ORDER ENQUIRY* [${refId}]

👕 *Selected Jersey / Product:* ${activeProduct?.name || "Match Jersey"}
📦 *Product SKU / ID:* ${activeProduct?.sku || activeProduct?.id || "RP-JSY"}
🔢 *Total Quantity:* ${quantity} Jerseys

🏆 *Team / Club / Academy:* ${teamName.trim() || "Not specified"}
🎨 *Customization / Printing:* ${finalPrinting}
📐 *Size Breakdown:*
${sizeBreakdownText}

👤 *Contact Name:* ${customerName.trim()}
📱 *WhatsApp Phone:* ${cleanPhone}
${email.trim() ? `✉️ *Email:* ${email.trim()}\n` : ""}📍 *Delivery City:* ${deliveryCity.trim()}
${deliveryAddress.trim() ? `🏢 *Delivery Address:* ${deliveryAddress.trim()}\n` : ""}${additionalNotes.trim() ? `📝 *Special Notes / Deadline:* ${additionalNotes.trim()}\n` : ""}
_Please share wholesale discounted quotation, jersey mockups & delivery timeline._`;

      const encodedText = encodeURIComponent(rawMessage);
      const cleanAdminPhone = ADMIN_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanAdminPhone}?text=${encodedText}`;

      setGeneratedWhatsAppUrl(waUrl);
      setIsSuccess(true);

      // Open WhatsApp in a new tab
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      console.error("Bulk enquiry error:", err);
      setErrorMessage("Could not save enquiry, but you can still contact our team directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="bg-[#111111] text-white p-5 md:p-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CC0000] flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#CC0000] bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
                  Wholesale WhatsApp Enquiry
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-display font-black uppercase text-white leading-tight mt-0.5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Bulk Team Jersey Order
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-grow">
          
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-[#CC0000] uppercase tracking-widest block mb-1">
                  Enquiry ID: {enquiryReference}
                </span>
                <h4 className="text-2xl font-display font-black uppercase text-slate-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Bulk Order Enquiry Ready ✓
                </h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                  We&apos;ve formatted your team order details for WhatsApp. Please send the message to our admin team to finalize bulk pricing, name/number list, and production proofs.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto text-slate-700">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Selected Jersey:</span>
                  <strong className="text-slate-900 text-right truncate max-w-[200px]">{activeProduct?.name}</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Total Quantity:</span>
                  <strong className="text-slate-900 font-mono">{quantity} Jerseys</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Team / Club:</span>
                  <strong className="text-slate-900">{teamName || "General Order"}</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Printing:</span>
                  <strong className="text-slate-900">{printingOption}</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Delivery City:</span>
                  <strong className="text-slate-900">{deliveryCity}</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
                <a
                  href={generatedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold uppercase text-sm px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Open WhatsApp Chat
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-display font-bold uppercase text-sm px-6 py-3.5 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Bulk Order Form */
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Product Selection Dropdown / Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Select Jersey / Product Model *
                </label>
                <div className="relative">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-xs md:text-sm font-bold text-slate-900 appearance-none focus:outline-none focus:border-[#CC0000] focus:bg-white cursor-pointer"
                  >
                    {availableJerseys.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name} ({j.sku || j.id}) — ₹{j.price.toLocaleString("en-IN")}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Selected Product Preview Card */}
                {activeProduct && (
                  <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200 p-3 rounded-xl mt-2">
                    <img
                      src={activeProduct.images?.[0] || activeProduct.image || "/hero-banner.jpg"}
                      alt={activeProduct.name}
                      className="w-12 h-12 object-cover rounded-lg bg-white border border-slate-200 p-1"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#CC0000] uppercase tracking-wider block">
                        {activeProduct.brand || "RP Sports"} • SKU: {activeProduct.sku || activeProduct.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs truncate">{activeProduct.name}</h4>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Team Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Total Quantity * <span className="text-slate-400 font-normal">(Min {MIN_BULK_QUANTITY} jerseys)</span>
                  </label>
                  <input
                    type="number"
                    min={MIN_BULK_QUANTITY}
                    max={5000}
                    value={quantity || ""}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                    placeholder="25"
                    required
                  />
                  {quantity < MIN_BULK_QUANTITY && (
                    <span className="text-[11px] text-[#CC0000] font-medium block mt-1">
                      Bulk team pricing applies for {MIN_BULK_QUANTITY}+ jerseys.
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Team / Club / Academy Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                    placeholder="e.g. Dumdum Titans CC"
                  />
                </div>
              </div>

              {/* Printing Options */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Printing & Customization Requirement
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Player Name + Number",
                    "Player Name + Number + Team Logo",
                    "Team / Club Logo Only",
                    "Full Sublimation (Front & Back Sponsor Print)",
                    "No Printing (Plain Match Jerseys)",
                    "Other",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        printingOption === opt
                          ? "bg-red-50 border-[#CC0000] text-[#CC0000] shadow-sm"
                          : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="printingOption"
                        checked={printingOption === opt}
                        onChange={() => setPrintingOption(opt)}
                        className="text-[#CC0000] focus:ring-[#CC0000]"
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
                      placeholder="Specify your custom printing requirements..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#CC0000]"
                    />
                  </div>
                )}
              </div>

              {/* Size Breakdown Breakdown */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Size Distribution Breakdown
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noSizeBreakdownYet}
                      onChange={(e) => setNoSizeBreakdownYet(e.target.checked)}
                      className="rounded border-slate-300 text-[#CC0000] focus:ring-[#CC0000]"
                    />
                    <span>Decide sizes later</span>
                  </label>
                </div>

                {!noSizeBreakdownYet && (
                  <div>
                    <div className="grid grid-cols-5 gap-2">
                      {["S", "M", "L", "XL", "XXL"].map((sz) => (
                        <div key={sz} className="text-center">
                          <span className="block text-[11px] font-bold text-slate-500 mb-1">{sz}</span>
                          <input
                            type="number"
                            min={0}
                            value={sizes[sz] || 0}
                            onChange={(e) => handleSizeChange(sz, e.target.value)}
                            className="w-full py-2 px-1 text-center bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs mt-2.5 pt-2 border-t border-slate-200">
                      <span className="text-slate-500">Sizes Total: <strong className="font-mono text-slate-800">{totalSizesEntered}</strong> / {quantity}</span>
                      {totalSizesEntered !== quantity && (
                        <span className="text-[#CC0000] font-bold">
                          Difference: {quantity - totalSizesEntered > 0 ? `+${quantity - totalSizesEntered} left` : `${totalSizesEntered - quantity} extra`}
                        </span>
                      )}
                      {totalSizesEntered === quantity && (
                        <span className="text-emerald-600 font-bold">✓ Matches total</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#CC0000]" />
                  <span>Contact & Delivery Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Patit Roy"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98300 12345"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Delivery City *
                    </label>
                    <input
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      placeholder="e.g. Kolkata, Dumdum"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Special Requirements / Tournament Date <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Mention custom sponsor logos, tournament deadline date, collar preferences, etc."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-[#CC0000] rounded-xl text-xs font-bold animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#1EBE5D] active:scale-[0.99] text-white rounded-xl font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50 transition-all"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>
                    {isSubmitting ? "Generating WhatsApp Enquiry..." : `Send Team Order to Admin WhatsApp (${quantity} Jerseys)`}
                  </span>
                </button>

                <p className="text-[10px] text-slate-400 text-center mt-2.5">
                  Opens WhatsApp with pre-filled team order details directly to RP Sports Kolkata workshop admin.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
