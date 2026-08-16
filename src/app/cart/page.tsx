"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore, VALID_COUPONS } from "@/lib/store";
import { Trash2, Plus, Minus, ShieldCheck, Ticket, ShoppingBag, ArrowRight, Truck, CheckCircle2, Tag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, activeCoupon, applyCoupon, removeCoupon } = useStore();
  const [couponCodeInput, setCouponCodeInput] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const gstTax = Math.round(subtotal * 0.18);
  const freeShippingThreshold = 999;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 250;
  
  const discountPercent = activeCoupon ? activeCoupon.discountPercent : 0;
  const couponDiscount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = subtotal + gstTax + shipping - couponDiscount;

  const handleApplyCouponForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInput.trim()) {
      applyCoupon(couponCodeInput);
      setCouponCodeInput("");
    }
  };

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#111111] pt-28 md:pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-gray-200 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#CC0000]/10 border border-[#CC0000]/30 px-3 py-1 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#CC0000] animate-pulse"></span>
              <span className="text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Kolkata's Premier Cricket Hub • Shopping Cart
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Your Gearbag ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Review your equipment specifications, sizes, and knocking options before proceeding to checkout.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-600 hover:text-[#CC0000] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Empty Cart State */}
        {cart.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 md:p-16 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="w-20 h-20 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#CC0000]">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase text-[#111111] mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Your Gearbag Is Empty
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              You haven't added any cricket bats or sports gear to your bag yet. Explore our handcrafted Grade-1 English & Kashmir willow selection!
            </p>
            <Link
              href="/shop"
              className="btn-primary text-sm inline-flex items-center gap-2 font-display font-bold uppercase tracking-widest px-8 py-4 shadow-lg shadow-[#CC0000]/30"
            >
              Explore Cricket Bats Range <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: CART ITEMS LIST */}
            <div className="lg:col-span-8 space-y-6">

              {/* Free Shipping Progress Indicator */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Truck className="w-4 h-4 text-[#CC0000]" />
                    {subtotal >= freeShippingThreshold ? (
                      <strong className="text-emerald-600">🎉 Congratulations! You have UNLOCKED FREE DELIVERY</strong>
                    ) : (
                      <span>Add <strong className="text-[#CC0000]">₹{(freeShippingThreshold - subtotal).toLocaleString("en-IN")}</strong> more for FREE Delivery!</span>
                    )}
                  </span>
                  <span className="text-gray-400 font-mono">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#CC0000] to-red-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
                {cart.map((item) => (
                  <div 
                    key={item.id}
                    className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-24 h-28 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-2">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Info details */}
                    <div className="flex-grow min-w-0">
                      <span className="text-[10px] font-display font-bold text-[#CC0000] uppercase tracking-widest block">
                        {item.product.brand} • {item.product.category}
                      </span>
                      <h3 className="font-display font-black text-lg md:text-xl text-[#111111] uppercase leading-tight mt-0.5 truncate" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                        <Link href={`/product/${item.product.id}`} className="hover:text-[#CC0000] transition-colors">
                          {item.product.name}
                        </Link>
                      </h3>

                      {/* Specs badges */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {item.selectedSize && (
                          <span className="text-[10px] font-bold bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-0.5 rounded">
                            SIZE: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="text-[10px] font-bold bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-0.5 rounded">
                            COLOR: {item.selectedColor}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Pre-Knocked Included
                        </span>
                      </div>

                      {item.customJersey && (
                        <div className="mt-2 text-[11px] text-[#CC0000] bg-red-50 border border-red-100 p-2 rounded font-mono font-bold">
                          Team: {item.customJersey.teamName} | Player: {item.customJersey.playerName} (#{item.customJersey.playerNumber})
                        </div>
                      )}
                      {item.customTrophy && (
                        <div className="mt-2 text-[11px] text-gray-700 bg-gray-100 border border-gray-200 p-2 rounded font-mono font-bold">
                          Engraved: "{item.customTrophy.engravingText}" | Size: {item.customTrophy.size}
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls & Total Price */}
                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 gap-4">
                      
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400 font-medium">₹{item.product.price.toLocaleString()} each</span>
                        <span className="text-xl font-display font-black text-[#CC0000]">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Quantity Buttons */}
                        <div className="flex items-center border border-gray-300 rounded bg-gray-50 overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold w-8 text-center text-[#111111]">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove item */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-md space-y-6">
                
                <h3 className="font-display font-black text-xl uppercase tracking-wider pb-4 border-b border-gray-200 text-[#111111] flex items-center justify-between" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  <span>Order Summary</span>
                  <ShoppingBag className="w-5 h-5 text-[#CC0000]" />
                </h3>

                {/* Sub-costs list */}
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Bag Subtotal</span>
                    <span className="font-bold text-[#111111]">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 text-xs">
                    <span>GST (18% Goods & Services Tax)</span>
                    <span className="font-semibold text-gray-800">₹{gstTax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 text-xs">
                    <span>Courier Delivery Charge</span>
                    <span className="font-bold text-emerald-600">
                      {shipping === 0 ? "FREE DELIVERY" : `₹${shipping}`}
                    </span>
                  </div>
                  
                  {activeCoupon && (
                    <div className="flex justify-between text-emerald-600 text-xs font-bold bg-emerald-50 p-2.5 rounded border border-emerald-200">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> Coupon ({activeCoupon.code})
                      </span>
                      <span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Promo Code Form */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-2">
                    Have a Promo Code?
                  </label>
                  
                  {activeCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded text-xs">
                      <div>
                        <strong className="text-emerald-900 block font-mono">{activeCoupon.code}</strong>
                        <span className="text-emerald-700 text-[11px]">{activeCoupon.description}</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCouponForm} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. RPBAT20"
                          value={couponCodeInput}
                          onChange={(e) => setCouponCodeInput(e.target.value)}
                          className="flex-grow bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-[#CC0000] text-[#111111] uppercase font-bold placeholder:text-gray-400"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-[#111111] hover:bg-[#CC0000] text-white text-xs font-display font-bold uppercase tracking-wider rounded transition-colors"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Sample Available Coupons */}
                      <div className="pt-2">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">
                          Available Offer Coupons:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {VALID_COUPONS.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => applyCoupon(c.code)}
                              className="text-[10px] font-mono font-bold bg-red-50 text-[#CC0000] border border-red-200 px-2 py-0.5 rounded hover:bg-[#CC0000] hover:text-white transition-colors"
                            >
                              {c.code} ({c.discountPercent}%)
                            </button>
                          ))}
                        </div>
                      </div>
                    </form>
                  )}
                </div>

                {/* Grand Total & Checkout Action */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="font-display font-bold text-gray-500 uppercase tracking-widest text-xs">Grand Total</span>
                    <span className="text-3xl font-display font-black text-[#CC0000]">
                      ₹{grandTotal.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#CC0000]/30 hover:scale-[1.02] transition-transform"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>

              {/* Guarantees */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3.5 shadow-sm text-xs text-gray-600">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#CC0000] shrink-0" />
                  <span><strong>100% Authentic Guarantee:</strong> Directly from master bat makers.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#CC0000] shrink-0" />
                  <span><strong>Free Pre-Knocking Included:</strong> Machine knocked & hand oiled.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-[#CC0000] shrink-0" />
                  <span><strong>7-Day Returns:</strong> Easy exchange policy across India.</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
