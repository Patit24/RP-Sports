"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { CheckCircle2, Package, Truck, ArrowRight, Printer, MapPin, Phone } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const { orders } = useStore();
  const order = orders.find((o) => o.id === orderId) || orders[0];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-4 sm:px-8 max-w-4xl mx-auto">
      
      {/* Top Banner Card */}
      <div className="bg-[#111111] text-white p-8 md:p-12 rounded-t-xl text-center relative overflow-hidden shadow-xl">
        <div className="w-20 h-20 bg-[#CC0000]/20 border-2 border-[#CC0000] rounded-full flex items-center justify-center mx-auto mb-6 text-[#CC0000] animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-[#FF3333] font-display font-bold uppercase tracking-widest text-xs mb-2 block">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl md:text-5xl font-display font-black uppercase text-white mb-3">
          Thank You For Your Order!
        </h1>
        <p className="text-white/70 text-base max-w-lg mx-auto leading-relaxed">
          We have received your order. Our team in Dumdum, Kolkata is preparing your handcrafted cricket gear for dispatch.
        </p>

        {/* Order Details Badge */}
        {order && (
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-6 text-sm">
            <div>
              <span className="text-white/40 block text-xs uppercase tracking-widest">Order ID</span>
              <strong className="text-white font-mono text-base">{order.id}</strong>
            </div>
            <div>
              <span className="text-white/40 block text-xs uppercase tracking-widest">Tracking Number</span>
              <strong className="text-[#FF3333] font-mono text-base">{order.trackingNumber || "TRK-9847294"}</strong>
            </div>
            <div>
              <span className="text-white/40 block text-xs uppercase tracking-widest">Est. Delivery</span>
              <strong className="text-emerald-400 font-semibold">3 - 4 Business Days</strong>
            </div>
          </div>
        )}
      </div>

      {/* Main Order Receipt Details */}
      {order && (
        <div className="bg-white border border-t-0 border-gray-200 p-6 md:p-10 rounded-b-xl shadow-md space-y-8">
          
          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <Link
              href={`/track-order?orderId=${order.id}`}
              className="btn-primary text-xs flex items-center gap-2 font-display font-bold uppercase tracking-widest px-5 py-3"
            >
              <Truck className="w-4 h-4" /> Track Live Delivery Status
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="border border-gray-300 hover:border-[#CC0000] text-gray-700 hover:text-[#CC0000] font-display font-bold uppercase text-xs tracking-wider px-4 py-2.5 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <Link
                href="/shop"
                className="border border-gray-300 hover:border-black text-gray-800 font-display font-bold uppercase text-xs tracking-wider px-4 py-2.5 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h3 className="font-display font-bold uppercase text-lg text-[#111111] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#CC0000]" /> Order Summary Items ({order.items.length})
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center gap-4 bg-gray-50/50">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded bg-white p-1 border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] text-[#CC0000] font-display font-bold uppercase tracking-widest">
                      {item.product.brand}
                    </p>
                    <h4 className="font-bold text-[#111111] text-sm leading-tight mb-1">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-[#CC0000] text-base">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address & Payment Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Address */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h4 className="font-display font-bold uppercase text-xs tracking-widest text-[#111111] mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#CC0000]" /> Delivery Address
              </h4>
              <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">
                {order.shippingAddress.addressLine}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
              </p>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {order.shippingAddress.phone}
              </p>
            </div>

            {/* Price Total */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-2 text-sm">
              <h4 className="font-display font-bold uppercase text-xs tracking-widest text-[#111111] mb-3">
                Payment Details
              </h4>
              <div className="flex justify-between text-gray-600">
                <span>Payment Method</span>
                <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Status</span>
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-200">
                <span>Grand Total</span>
                <span className="font-display font-black text-xl text-[#CC0000]">
                  ₹{order.total.toLocaleString()}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-8">
          <div className="w-8 h-8 rounded-full border-t-2 border-[#CC0000] border-r-2 border-gray-300 animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
