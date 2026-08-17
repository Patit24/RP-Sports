"use client";

import { useState } from "react";
import { Product } from "@/lib/mockData";
import { X, Send, CheckCircle2, AlertCircle, Users, Shirt, MapPin, Phone, User, MessageSquare, ExternalLink, Sparkles } from "lucide-react";

interface BulkJerseyOrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "919876543210";
const MIN_BULK_QUANTITY = 10;

export default function BulkJerseyOrderModal({ product, isOpen, onClose }: BulkJerseyOrderModalProps) {
  const [quantity, setQuantity] = useState<number>(25);
  const [printingOption, setPrintingOption] = useState<string>("Name + Number + Team Logo");
  const [otherPrintingNotes, setOtherPrintingNotes] = useState<string>("");

  // Sizes breakdown
  const [sizes, setSizes] = useState<{ [key: string]: number }>({
    S: 5,
    M: 8,
    L: 8,
    XL: 4,
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
      setErrorMessage(`Bulk orders start from ${MIN_BULK_QUANTITY} jerseys. For smaller quantities, please use the normal custom jersey option.`);
      return;
    }

    if (!noSizeBreakdownYet && totalSizesEntered !== quantity) {
      setErrorMessage(`Size quantities total ${totalSizesEntered}, but your order quantity is ${quantity}. Please adjust the breakdown or check 'I don't know the final size breakdown yet'.`);
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
          productId: product.id,
          productName: product.name,
          productSku: product.sku || product.id,
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

      // 2. Generate Structured WhatsApp Message
      let sizeBreakdownText = "To be confirmed with team";
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
`🏏 *BULK JERSEY ORDER ENQUIRY* [${refId}]

👕 *Product:* ${product.name}
📦 *Product ID / SKU:* ${product.sku || product.id}
🔢 *Requested Quantity:* ${quantity} Jerseys

📐 *Size Breakdown:*
${sizeBreakdownText}

🎨 *Customization / Printing:*
${finalPrinting}

🏆 *Team / Club:* ${teamName.trim() || "Not specified"}
👤 *Customer Name:* ${customerName.trim()}
📱 *WhatsApp:* ${cleanPhone}
${email.trim() ? `✉️ *Email:* ${email.trim()}\n` : ""}📍 *Delivery City:* ${deliveryCity.trim()}
${deliveryAddress.trim() ? `🏢 *Delivery Address:* ${deliveryAddress.trim()}\n` : ""}${additionalNotes.trim() ? `📝 *Additional Requirements:* ${additionalNotes.trim()}\n` : ""}
_Please share bulk discounted pricing, design proofing & delivery schedule._`;

      const encodedText = encodeURIComponent(rawMessage);
      const cleanAdminPhone = ADMIN_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanAdminPhone}?text=${encodedText}`;

      setGeneratedWhatsAppUrl(waUrl);
      setIsSuccess(true);

      // Open WhatsApp safely in a new window
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
                  Direct WhatsApp Quotation
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-display font-black uppercase text-white leading-tight mt-0.5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Bulk Jersey / Team Order
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
                  Bulk Order Request Prepared ✓
                </h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                  We've prepared your custom jersey enquiry message for WhatsApp. Please send it to our production team to discuss bulk pricing, player name/number lists, and final design proofs.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-1.5 max-w-md mx-auto text-slate-700">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Jersey Model:</span>
                  <strong className="text-slate-900">{product.name}</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Total Quantity:</span>
                  <strong className="text-slate-900 font-mono">{quantity} Jerseys</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Customization:</span>
                  <strong className="text-slate-900">{printingOption}</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Delivery Destination:</span>
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
                  <MessageSquare className="w-4 h-4" /> Open WhatsApp Again
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-display font-bold uppercase text-sm px-6 py-3.5 rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Bulk Order Form */
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Product Context Banner */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <img
                  src={product.images[0] || product.image || "/products/generated_jersey.jpg"}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-xl bg-white border border-slate-200 p-1"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-[#CC0000] uppercase tracking-wider block">
                    {product.brand} • SKU: {product.sku || product.id}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm truncate">{product.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Minimum bulk quantity: <strong className="text-slate-800 font-bold">{MIN_BULK_QUANTITY} jerseys</strong>
                  </p>
                </div>
              </div>

              {/* Quantity & Printing Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Total Quantity * <span className="text-slate-400 font-normal">(Min {MIN_BULK_QUANTITY})</span>
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
                      Bulk orders start from {MIN_BULK_QUANTITY} jerseys.
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
                    placeholder="e.g. Kolkata Cricket Club"
                  />
                </div>
              </div>

              {/* Printing Options */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Printing & Customization Required?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Player Name + Number",
                    "Player Name + Number + Team Logo",
                    "Team / Club Logo Only",
                    "No Printing (Plain Team Jerseys)",
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
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={otherPrintingNotes}
                      onChange={(e) => setOtherPrintingNotes(e.target.value)}
                      placeholder="Describe custom printing requirements (e.g. sponsor patch, chest text)..."
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#CC0000]"
                    />
                  </div>
                )}
              </div>

              {/* Size Breakdown */}
              <div className="bg-slate-50 border border-slate-200 p-4 md:p-5 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Approximate Size Breakdown
                    </h5>
                    <span className="text-[11px] text-slate-500">
                      Specify jersey count per size (exact player list can be shared later)
                    </span>
                  </div>

                  {!noSizeBreakdownYet && (
                    <div className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                      isSizeSumMatched
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}>
                      Sizes: {totalSizesEntered} / {quantity} {isSizeSumMatched ? "✓" : "⚠️"}
                    </div>
                  )}
                </div>

                {!noSizeBreakdownYet && (
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {["S", "M", "L", "XL", "XXL"].map((sz) => (
                      <div key={sz} className="text-center">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">{sz}</span>
                        <input
                          type="number"
                          min="0"
                          value={sizes[sz] !== undefined ? sizes[sz] : ""}
                          onChange={(e) => handleSizeChange(sz, e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 pt-1">
                  <input
                    type="checkbox"
                    checked={noSizeBreakdownYet}
                    onChange={(e) => setNoSizeBreakdownYet(e.target.checked)}
                    className="w-4 h-4 rounded text-[#CC0000] focus:ring-[#CC0000]"
                  />
                  <span>I don't know the final size breakdown yet (discuss with team on WhatsApp)</span>
                </label>
              </div>

              {/* Customer Contact Information */}
              <div className="space-y-3 pt-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#CC0000]" /> Contact & Delivery Details
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                      placeholder="e.g. Patit Roy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                      placeholder="e.g. +91 98300 12345"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Delivery City *
                    </label>
                    <input
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                      placeholder="e.g. Kolkata, Dumdum, Howrah"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                      placeholder="e.g. club@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Delivery Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                    placeholder="e.g. 12/B Park Street, Kolkata, West Bengal"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Additional Requirements / Deadline / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                    placeholder="e.g. Tournament date 25th September, need collar pattern, sponsor logos on sleeves..."
                  />
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Pricing Notice */}
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Bulk pricing & wholesale discount</strong> will be confirmed directly by our Kolkata workshop team via WhatsApp. No payment is charged at this step.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-display font-bold uppercase text-base tracking-wider rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                {isSubmitting ? (
                  <span>Preparing WhatsApp Enquiry...</span>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    <span>Send Bulk Order on WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
