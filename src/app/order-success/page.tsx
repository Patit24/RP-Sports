"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { CheckCircle2, Package, Truck, ArrowRight, Printer, MapPin, Phone, ShieldCheck, AlertCircle } from "lucide-react";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const { orders } = useStore();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    if (!orderId) {
      if (orders && orders.length > 0) {
        setOrder(orders[0]);
      } else {
        setError("No Order ID provided.");
      }
      setLoading(false);
      return;
    }

    // Try finding in Zustand first
    const localOrder = orders.find((o) => o.id === orderId);
    if (localOrder) {
      setOrder(localOrder);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from server database
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/details?id=${orderId}`);
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.message || "Failed to load order.");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, orders]);

  const handlePrint = () => {
    setIsInvoiceOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-8">
        <div className="text-center bg-white border border-gray-200 p-12 rounded-2xl max-w-md shadow-sm space-y-4">
          <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-[#CC0000] rounded-full animate-spin" />
          <h3 className="text-lg font-display font-black uppercase text-[#111] tracking-wider" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Loading Order Details...
          </h3>
          <p className="text-xs text-gray-400 font-medium">Retrieving verified invoice and logistics information from Kolkata server.</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6 text-[#111111] pt-32">
        <div className="text-center bg-white border border-gray-200 p-12 rounded-2xl max-w-md shadow-sm">
          <AlertCircle className="w-12 h-12 text-[#CC0000] mx-auto mb-4" />
          <h2 className="text-xl font-display font-black uppercase text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Order Lookup Failed
          </h2>
          <p className="text-gray-500 text-xs mt-2 font-medium">{error || "The order details could not be found."}</p>
          <Link
            href="/shop"
            className="mt-6 btn-primary inline-flex items-center gap-2 font-display font-bold uppercase tracking-wider text-xs px-6 py-3"
          >
            Browse Cricket Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-20 md:pt-28 pb-28 md:pb-10 px-4 px-4 sm:px-8 max-w-4xl mx-auto">
      
      {/* Top Banner Card */}
      <div className="bg-[#111111] text-white p-8 md:p-12 rounded-t-2xl text-center relative overflow-hidden shadow-2xl">
        <div className="w-20 h-20 bg-[#CC0000]/20 border-2 border-[#CC0000] rounded-full flex items-center justify-center mx-auto mb-6 text-[#CC0000] animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-[#FF3333] font-display font-bold uppercase tracking-widest text-xs mb-2 block" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Order Confirmed & Placed Successfully
        </span>
        <h1 className="text-3xl md:text-5xl font-display font-black uppercase text-white mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Thank You For Your Order!
        </h1>
        <p className="text-white/70 text-base max-w-lg mx-auto leading-relaxed">
          Your order has been recorded and is being prepared for fast express dispatch.
        </p>

        {/* Order Details Badge */}
        {order && (
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-6 text-sm">
            <div>
              <span className="text-white/40 block text-xs uppercase tracking-widest font-mono">Order ID</span>
              <strong className="text-white font-mono text-base">{order.id}</strong>
            </div>
            <div>
              <span className="text-white/40 block text-xs uppercase tracking-widest font-mono">Tracking No.</span>
              <strong className="text-[#FF3333] font-mono text-base">{order.deliveryPartnerInfo?.awbNumber || order.trackingNumber || order.id}</strong>
            </div>
            <div>
              <span className="text-white/40 block text-xs uppercase tracking-widest font-mono">Est. Delivery</span>
              <strong className="text-emerald-400 font-semibold">{order.deliveryPartnerInfo?.estimatedDeliveryDate || "2 - 4 Business Days"}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Main Order Receipt Details */}
      {order && (
        <div className="bg-white border border-t-0 border-gray-200 p-6 md:p-10 rounded-b-2xl shadow-xl space-y-8">
          
          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <Link
              href={`/track-order?orderId=${order.id}`}
              className="btn-primary text-xs flex items-center gap-2 font-display font-bold uppercase tracking-widest px-5 py-3 rounded-xl shadow-md shadow-[#CC0000]/30"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <Truck className="w-4 h-4" /> Track Order Status
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="border border-gray-300 hover:border-[#CC0000] text-gray-700 hover:text-[#CC0000] font-display font-bold uppercase text-xs tracking-wider px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <Link
                href="/shop"
                className="border border-gray-300 hover:border-black text-gray-800 font-display font-bold uppercase text-xs tracking-wider px-4 py-2.5 rounded-xl transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h3 className="font-display font-bold uppercase text-lg text-[#111111] mb-4 flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <Package className="w-5 h-5 text-[#CC0000]" /> Purchased Items ({order.items.length})
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="p-4 flex items-center gap-4 bg-gray-50/50">
                  <img
                    src={item.product.image || item.product.gallery?.[0] || item.product.images?.[0] || "/hero-banner.jpg"}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-white p-1 border border-gray-200"
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
                    <span className="font-display font-bold text-[#CC0000] text-base" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
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
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h4 className="font-display font-bold uppercase text-xs tracking-widest text-[#111111] mb-3 flex items-center gap-1.5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
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
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-2 text-sm">
              <h4 className="font-display font-bold uppercase text-xs tracking-widest text-[#111111] mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Payment & Billing Summary
              </h4>
              <div className="flex justify-between text-gray-600">
                <span>Payment Method</span>
                <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Status</span>
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-200">
                <span>Grand Total</span>
                <span className="font-display font-black text-xl text-[#CC0000]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  ₹{order.total.toLocaleString()}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* GST TAX INVOICE MODAL */}
      {order && (
        <TaxInvoiceModal
          order={order}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
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
