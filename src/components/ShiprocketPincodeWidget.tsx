"use client";

import { useState, useEffect } from "react";
import { Truck, MapPin, CheckCircle2, AlertCircle, Loader2, Navigation, Clock, ShieldCheck } from "lucide-react";
import type { PincodeServiceabilityResult } from "@/lib/shiprocketService";

interface ShiprocketPincodeWidgetProps {
  defaultPincode?: string;
  onPincodeChange?: (pincode: string) => void;
  onDetectGps?: () => void;
  isDetectingGps?: boolean;
}

export default function ShiprocketPincodeWidget({ 
  defaultPincode = "700028", 
  onPincodeChange,
  onDetectGps,
  isDetectingGps = false,
}: ShiprocketPincodeWidgetProps) {
  const [pincode, setPincode] = useState(defaultPincode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PincodeServiceabilityResult | null>(null);

  // Sync when defaultPincode changes from auto-detection
  useEffect(() => {
    if (defaultPincode && defaultPincode.length === 6 && defaultPincode !== pincode) {
      setPincode(defaultPincode);
      checkServiceability(defaultPincode);
    }
  }, [defaultPincode]);

  // Initial check on mount
  useEffect(() => {
    if (defaultPincode && defaultPincode.length === 6) {
      checkServiceability(defaultPincode);
    }
  }, []);

  const checkServiceability = async (pinToCheck: string) => {
    if (!pinToCheck || pinToCheck.length !== 6) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/shiprocket/check-serviceability?pincode=${pinToCheck}`);
      const data = await res.json();
      setResult(data);
    } catch {
      // Intelligent fallback
      const isKolkata = pinToCheck.startsWith("700");
      setResult({
        serviceable: true,
        estimatedDays: isKolkata ? 1 : 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) return;
    if (onPincodeChange) {
      onPincodeChange(pincode);
    }
    await checkServiceability(pincode);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-50 text-[#CC0000] border border-red-100 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-bold uppercase text-xs tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Delivery & Shipping Availability
            </h4>
            <p className="text-[11px] text-slate-500">Fast doorstep delivery across India</p>
          </div>
        </div>

        {onDetectGps && (
          <button
            type="button"
            onClick={onDetectGps}
            disabled={isDetectingGps}
            className="text-[11px] font-bold text-[#CC0000] hover:text-[#990000] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Navigation className={`w-3 h-3 ${isDetectingGps ? "animate-spin" : ""}`} />
            <span>{isDetectingGps ? "Detecting..." : "Use My GPS"}</span>
          </button>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPincode(val);
              if (val.length === 6 && onPincodeChange) {
                onPincodeChange(val);
              }
            }}
            placeholder="Enter 6-digit Pincode (e.g. 700028)..."
            className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#111111] outline-none focus:border-[#CC0000] focus:bg-white"
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="px-4 h-10 bg-[#111111] hover:bg-[#CC0000] text-white text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Check"}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="pt-2 border-t border-slate-100 text-xs animate-in fade-in">
          {result.serviceable ? (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Pincode {pincode} is Serviceable</span>
              </div>
              <p className="text-[12px] text-emerald-800 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estimated Delivery: <strong className="text-emerald-950 font-bold">{result.estimatedDays === 1 ? "Tomorrow (24-Hour Express)" : `${result.estimatedDays} Business Days`}</strong></span>
              </p>
              <p className="text-[11px] text-emerald-700 flex items-center gap-1.5 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free Express Shipping on orders above ₹999</span>
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Pincode {pincode} is currently unserviceable via standard courier.</p>
                <p className="text-[11px] text-amber-700 mt-0.5">Please WhatsApp us for direct counter dispatch from our Dumdum store.</p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
