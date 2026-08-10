"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Truck, Search, CheckCircle2, Clock, MapPin, Package, ArrowLeft, AlertCircle } from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";

  const { orders } = useStore();
  const [searchId, setSearchId] = useState(initialOrderId);
  const [searched, setSearched] = useState(Boolean(initialOrderId));

  const currentOrder = orders.find(
    (o) => o.id.toLowerCase() === searchId.trim().toLowerCase() || o.trackingNumber === searchId.trim()
  ) || (searched && orders.length > 0 ? orders[0] : null);

  const STEPS = [
    { key: "Pending", label: "Order Received", desc: "Your bat order is logged in our Dumdum system." },
    { key: "Confirmed", label: "Order Confirmed", desc: "Willow grade & specification verified by experts." },
    { key: "Packed", label: "Pre-Knocked & Packed", desc: "Double layer padded bubble wrapping applied." },
    { key: "Shipped", label: "Dispatched", desc: "In transit with courier partner (Bluedart/Delhivery)." },
    { key: "Delivered", label: "Delivered", desc: "Handed over at your doorstep." },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Pending": return 0;
      case "Confirmed": return 1;
      case "Packed": return 2;
      case "Shipped":
      case "Out for Delivery": return 3;
      case "Delivered": return 4;
      default: return 1;
    }
  };

  const activeIndex = currentOrder ? getStepIndex(currentOrder.status) : 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-4 sm:px-8 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8 text-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-500 hover:text-[#CC0000] mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-5xl font-display font-black text-[#111111] uppercase mb-2">
          Track Your Shipment
        </h1>
        <p className="text-gray-500 text-sm">
          Enter your Order ID (e.g. ORD-839201) or Courier Tracking Code to view real-time delivery status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm mb-10 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order ID (e.g. ORD-123456)..."
            className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 focus:border-[#CC0000] text-sm text-[#111111] font-semibold outline-none transition-colors rounded"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button
          type="submit"
          className="btn-primary h-12 px-6 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-xs"
        >
          <Truck className="w-4 h-4" /> Track Status
        </button>
      </form>

      {/* Active Order Tracker Visual */}
      {currentOrder ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-md space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <div>
              <span className="text-xs font-display font-bold uppercase text-[#CC0000] tracking-widest block mb-1">
                RP Sports Order #{currentOrder.id}
              </span>
              <h2 className="text-xl font-bold text-[#111111]">
                Status: <span className="text-[#CC0000]">{currentOrder.status}</span>
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 block uppercase tracking-widest">Shiprocket AWB Code</span>
              <span className="font-mono font-bold text-gray-900 text-sm bg-gray-100 border border-gray-200 px-2.5 py-1 rounded inline-block mt-0.5">
                ⚡ {currentOrder.trackingNumber || "SR84920194"} (BlueDart Express)
              </span>
            </div>
          </div>


          {/* 5-Step Visual Timeline */}
          <div className="relative py-4">
            {/* Progress line */}
            <div className="absolute top-7 left-6 right-6 h-1 bg-gray-200 -z-0 hidden md:block">
              <div
                className="h-full bg-[#CC0000] transition-all duration-700"
                style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
              {STEPS.map((step, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={step.key} className="flex md:flex-col items-start md:items-center gap-4 md:gap-2 text-left md:text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                        isPassed
                          ? "bg-[#CC0000] border-[#CC0000] text-white shadow-lg shadow-red-500/20"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`text-xs font-display font-bold uppercase tracking-wider ${isPassed ? "text-[#111111]" : "text-gray-400"}`}>
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-tight mt-0.5 hidden md:block">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Accordion */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-display font-bold uppercase text-xs tracking-widest text-[#111111] mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#CC0000]" /> Destination Address
              </h4>
              <p className="font-bold text-gray-900">{currentOrder.shippingAddress.fullName}</p>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">
                {currentOrder.shippingAddress.addressLine}, {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} – {currentOrder.shippingAddress.pincode}
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold uppercase text-xs tracking-widest text-[#111111] mb-2 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#CC0000]" /> Shipment Contents
              </h4>
              <ul className="space-y-1 text-xs text-gray-700">
                {currentOrder.items.map((item, i) => (
                  <li key={i} className="flex justify-between font-medium">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span className="font-bold text-[#CC0000]">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      ) : searched ? (
        <div className="bg-white border border-gray-200 p-8 rounded-xl text-center max-w-md mx-auto shadow-sm">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#111111] mb-1">Order Not Found</h3>
          <p className="text-xs text-gray-500 mb-4">Please check the Order ID format (e.g. ORD-123456) and try again.</p>
        </div>
      ) : null}

    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-8">
          <div className="w-8 h-8 rounded-full border-t-2 border-[#CC0000] border-r-2 border-gray-300 animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
