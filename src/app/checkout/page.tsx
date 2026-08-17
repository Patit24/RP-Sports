"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ShieldCheck, Lock, CreditCard, ChevronRight, CheckCircle2, AlertCircle, MapPin, Phone, User as UserIcon, Building, Hash, ArrowLeft, Truck, Tag, Star, ArrowRight, Plus, Minus } from "lucide-react";
import confetti from "canvas-confetti";
import CheckoutAuthGate from "@/components/CheckoutAuthGate";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, currentUser, activeCoupon, applyCoupon, clearCart, removeCoupon, updateCartQuantity, removeFromCart } = useStore();

  // Step state
  const [isMounted, setIsMounted] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Step state
  const [step, setStep] = useState<"address" | "summary" | "payment" | "processing">("address");

  // Address inputs default to Dumdum, Kolkata for authentic local store experience
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("Flat 405, Carbon Towers, Sports City Road");
  const [city, setCity] = useState("Kolkata");
  const [stateName, setStateName] = useState("West Bengal");
  const [pincode, setPincode] = useState("700028");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Razorpay" | "Card" | "COD">("Razorpay");
  const [formError, setFormError] = useState("");

  // Coupon state in checkout
  const [checkoutCouponInput, setCheckoutCouponInput] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [checkoutCouponError, setCheckoutCouponError] = useState<string | null>(null);

  // 1. Sync & verify active Firebase Auth session on mount
  useEffect(() => {
    setIsMounted(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && firebaseUser.email) {
          // Verify customer profile exists in DB
          const { getUser } = await import("@/lib/firestoreService");
          const profile = await getUser(firebaseUser.uid);
          const name = profile?.name || firebaseUser.displayName || firebaseUser.email.split("@")[0] || "RP Athlete";
          const rewardPoints = profile?.rewardPoints ?? 100;
          const addresses = profile?.addresses ?? [];
          const role = profile?.role || (firebaseUser.email === "admin@rpsports.com" ? "admin" : "customer");

          // Sync verified state to store
          useStore.setState({
            currentUser: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name,
              role,
              addresses,
              rewardPoints,
            }
          });
        }
      } catch (err) {
        console.warn("Secure checkout session verification skipped:", err);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Synchronize address form fields when authentication resolves or currentUser changes
  useEffect(() => {
    if (!authLoading && currentUser) {
      const defaultAddress = currentUser.addresses?.[0];
      setFullName((prev) => prev || defaultAddress?.fullName || currentUser.name || "");
      setPhone((prev) => {
        // Clear phone if it is still empty or has copy-pasted email address
        if (!prev || prev.includes("@")) {
          return defaultAddress?.phone || "";
        }
        return prev;
      });
      if (defaultAddress) {
        setAddressLine((prev) => prev === "Flat 405, Carbon Towers, Sports City Road" ? (defaultAddress.addressLine || prev) : prev);
        setCity((prev) => prev === "Kolkata" ? (defaultAddress.city || prev) : prev);
        setStateName((prev) => prev === "West Bengal" ? (defaultAddress.state || prev) : prev);
        setPincode((prev) => prev === "700028" ? (defaultAddress.pincode || prev) : prev);
      }
    }
  }, [authLoading, currentUser]);

  const totalInclusive = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const mrpTotal = cart.reduce((acc, item) => acc + (item.product.mrp || item.product.price) * item.quantity, 0);
  const productDiscount = mrpTotal - totalInclusive;
  const cartSubtotal = Math.round(totalInclusive / 1.18);
  const gstTax = totalInclusive - cartSubtotal;
  const FREE_DELIVERY_THRESHOLD = 999;
  const shipping = totalInclusive >= FREE_DELIVERY_THRESHOLD || totalInclusive === 0 ? 0 : 250;
  
  // Calculate discount based on activeCoupon (store-wide or specific products)
  let couponDiscount = 0;
  if (activeCoupon) {
    const isSpecific = activeCoupon.appliesTo === "specific" && Array.isArray(activeCoupon.productIds);
    let eligibleSubtotal = 0;

    for (const item of cart) {
      if (!isSpecific || (activeCoupon.productIds && activeCoupon.productIds.includes(item.product.id))) {
        eligibleSubtotal += item.product.price * item.quantity;
      }
    }

    const val = activeCoupon.discountValue || activeCoupon.discountPercent || 0;
    if (activeCoupon.discountType === "fixed") {
      couponDiscount = Math.min(val, eligibleSubtotal);
    } else {
      couponDiscount = Math.round((eligibleSubtotal * val) / 100);
      if (activeCoupon.maximumDiscount && activeCoupon.maximumDiscount > 0) {
        couponDiscount = Math.min(couponDiscount, activeCoupon.maximumDiscount);
      }
    }
    couponDiscount = Math.max(0, Math.min(couponDiscount, eligibleSubtotal));
  }

  const totalDiscount = productDiscount + couponDiscount;
  const grandTotal = Math.max(0, totalInclusive + shipping - couponDiscount);

  const handleApplyCheckoutCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeToApply = checkoutCouponInput.trim().toUpperCase();
    if (!codeToApply) return;

    try {
      setIsValidatingCoupon(true);
      setCheckoutCouponError(null);

      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToApply,
          items: cart,
          userEmail: currentUser?.email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        throw new Error(data.message || "Invalid coupon code.");
      }

      applyCoupon(codeToApply, data.coupon);
      setCheckoutCouponInput("");
    } catch (err: any) {
      setCheckoutCouponError(err.message || "Failed to apply coupon.");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim() || !phone.trim() || !addressLine.trim() || !city.trim() || !stateName.trim() || !pincode.trim()) {
      setFormError("Please fill out all required delivery fields.");
      return;
    }

    setStep("summary");
  };


  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#CC0000", "#111111", "#FFD700"]
      });
    } catch {
      // fallback
    }
  };

  const handleProcessPayment = async () => {
    setStep("processing");
    setFormError("");

    try {
      // Get Firebase Auth ID Token for secure user verification on the server
      let token = "";
      try {
        const { auth } = await import("@/lib/firebase");
        if (auth.currentUser) {
          token = await auth.currentUser.getIdToken();
        }
      } catch (tokenErr) {
        console.warn("Could not retrieve Auth ID token:", tokenErr);
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers,
        body: JSON.stringify({
          items: cart,
          shippingAddress: {
            fullName,
            phone,
            addressLine,
            city,
            state: stateName,
            pincode,
          },
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "Pending" : "Success",
          couponCode: activeCoupon?.code || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Clear cart locally on checkout success
        clearCart();
        removeCoupon();


        setTimeout(() => {
          triggerConfetti();
          router.push(`/order-success?orderId=${data.orderId}`);
        }, 1200);
      } else {
        setStep("payment");
        setFormError(data.message || "Failed to process payment and place order securely.");
      }
    } catch (err: any) {
      setStep("payment");
      setFormError(err.message || "An unexpected error occurred during checkout.");
    }
  };


  if (!isMounted || authLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6 text-[#111111] pt-32">
        <div className="text-center bg-white border border-gray-200 p-12 rounded-2xl max-w-md shadow-sm space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-gray-200 border-t-[#CC0000] rounded-full animate-spin" />
          <h2 className="text-xl font-display font-bold uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Verifying Secure Session...
          </h2>
          <p className="text-gray-500 text-xs font-medium">Please wait while we confirm your authentication details and load your profile.</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step !== "processing") {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6 text-[#111111] pt-32">
        <div className="text-center bg-white border border-gray-200 p-12 rounded-2xl max-w-md shadow-sm">
          <AlertCircle className="w-12 h-12 text-[#CC0000] mx-auto mb-4" />
          <h2 className="text-2xl font-display font-black uppercase text-[#111111]">No Active Checkout</h2>
          <p className="text-gray-500 text-xs mt-2 font-medium">Your gearbag is empty. Add cricket bats before proceeding to checkout.</p>
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
    <div className="min-h-screen bg-[#F9F9F9] text-[#111111] pt-28 md:pt-32 pb-20">

      {/* AUTHENTICATION GATE FOR UNLOGGED USERS */}
      {!currentUser && <CheckoutAuthGate />}

      <div className="max-w-[1600px] mx-auto px-4 md:px-8">

        
        {/* Step Progress Tracker Header */}
        <div className="mb-10 pb-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#CC0000]/10 border border-[#CC0000]/30 px-3 py-1 rounded-full mb-2">
                <span className="w-2 h-2 rounded-full bg-[#CC0000] animate-pulse"></span>
                <span className="text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Secure SSL Checkout
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Complete Your Order
              </h1>
            </div>

            <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-500 hover:text-[#CC0000]">
              <ArrowLeft className="w-4 h-4" /> Edit Gearbag
            </Link>
          </div>

          {/* Stepper Bar Progress (Flipkart style) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-center gap-2 md:gap-4 font-display font-black text-[10px] md:text-xs uppercase tracking-widest text-[#111] shadow-sm">
            {/* Step 1: Address */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => (step === "summary" || step === "payment") && setStep("address")}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${step !== "address" ? "bg-emerald-100 text-emerald-800" : "bg-blue-600 text-white"}`}>
                {step !== "address" ? "✓" : "1"}
              </div>
              <span className={step !== "address" ? "text-slate-400 font-bold" : "text-blue-600 font-black"}>Address</span>
            </div>
            <div className="w-10 md:w-20 h-0.5 bg-slate-200"></div>
            
            {/* Step 2: Order Summary */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => step === "payment" && setStep("summary")}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${step === "summary" ? "bg-blue-600 text-white" : (step === "payment" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400")}`}>
                {step === "payment" ? "✓" : "2"}
              </div>
              <span className={step === "summary" ? "text-blue-600 font-black" : (step === "payment" ? "text-slate-400 font-bold" : "text-slate-400 font-bold")}>Order Summary</span>
            </div>
            <div className="w-10 md:w-20 h-0.5 bg-slate-200"></div>

            {/* Step 3: Payment */}
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${step === "payment" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                3
              </div>
              <span className={step === "payment" ? "text-blue-600 font-black" : "text-slate-400 font-bold"}>Payment</span>
            </div>
          </div>
        </div>

        {/* PROCESSING SCREEN */}
        {step === "processing" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 md:p-16 text-center max-w-xl mx-auto shadow-lg space-y-6 animate-pulse my-8">
            <div className="w-16 h-16 rounded-full border-4 border-t-[#CC0000] border-r-transparent border-gray-200 animate-spin mx-auto" />
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase text-[#111111] tracking-wider" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Processing Payment & Order
            </h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              Verifying transaction details and registering your cricket equipment in our Dumdum database...
            </p>
          </div>
        )}

        {/* STEP 1, 2, 3 LAYOUT BODY */}
        {step !== "processing" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-6">
            
            {/* LEFT PANEL: Steps Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* MINIMIZED COMPLETED ADDRESS CARD */}
              {step !== "address" && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span className="bg-blue-100 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">✓</span>
                      <span>Delivery Address</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setStep("address")} 
                      className="text-xs font-bold uppercase tracking-wider text-blue-600 border border-blue-250 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                    >
                      Change
                    </button>
                  </div>
                  <div className="text-xs space-y-1 text-slate-600">
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{fullName}</span>
                      <span className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase px-1.5 py-0.5 rounded">HOME</span>
                    </p>
                    <p className="font-medium text-slate-700 leading-relaxed max-w-xl">{addressLine}, {city}, {stateName} - {pincode}</p>
                    <p className="font-semibold text-slate-900 mt-1">{phone}</p>
                  </div>
                </div>
              )}

              {/* STEP 1 ACTIVE: Address Form */}
              {step === "address" && (
                <form id="address-form" onSubmit={handleAddressSubmit} className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-display font-black text-lg uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      1. Delivery Address Details
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 1 of 3</span>
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-3.5 rounded text-xs text-red-600 font-bold animate-shake">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Patit Roy"
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#111111] font-semibold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9734019005"
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#111111] font-semibold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-1.5">
                      Delivery Address *
                    </label>
                    <textarea
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="Belgoria Roy house, Kolkata, Near Khorgachi Shiv Mandir"
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#111111] font-semibold outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div>
                      <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-1.5">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="743427"
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#111111] font-semibold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Kolkata"
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#111111] font-semibold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="West Bengal"
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#111111] font-semibold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#ffc107] hover:bg-[#ffb300] text-[#111] rounded-lg font-display font-black uppercase tracking-widest text-xs shadow transition-all duration-300"
                    >
                      Save & Continue
                    </button>
                  </div>
                </form>
              )}

              {/* MINIMIZED COMPLETED ORDER SUMMARY CARD */}
              {step === "payment" && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span className="bg-blue-100 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">✓</span>
                    <span>Order Summary ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setStep("summary")} 
                    className="text-xs font-bold uppercase tracking-wider text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                  >
                    View / Edit
                  </button>
                </div>
              )}

              {/* STEP 2 ACTIVE: Order Summary Listing */}
              {step === "summary" && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                  <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-display font-black text-lg uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      2. Order Summary
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 2 of 3</span>
                  </div>

                  {/* Cart Items List */}
                  <div className="divide-y divide-slate-100">
                    {cart.map((item) => {
                      const prod = item.product;
                      const originalMrp = prod.mrp || Math.round(prod.price * 1.4);
                      const discountPercentage = Math.round(((originalMrp - prod.price) / originalMrp) * 100);
                      
                      return (
                        <div key={item.product.id + (item.selectedSize || "")} className="py-4 flex gap-4">
                          <div className="w-20 h-24 shrink-0 bg-slate-50 border border-slate-150 rounded-lg p-2 flex items-center justify-center mix-blend-multiply">
                            <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-contain" />
                          </div>
                          
                          <div className="flex-grow space-y-1.5">
                            <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{prod.name}</h4>
                            
                            {item.selectedSize && (
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Size/Weight: <span className="text-slate-700">{item.selectedSize}</span></p>
                            )}

                            {item.customization && item.customization.type === "jersey_name_number" && (
                              <div className="bg-slate-900 text-white border border-slate-700 px-2.5 py-1.5 rounded-lg text-[10px] space-y-0.5 my-1">
                                <div className="font-mono font-black text-amber-400 uppercase tracking-wider">
                                  👕 PLAYER: {item.customization.name}
                                </div>
                                <div className="text-slate-300 font-bold">
                                  JERSEY #{item.customization.number} {item.selectedSize ? `• SIZE: ${item.selectedSize}` : ""}
                                  {item.customization.fee !== undefined && item.customization.fee > 0 ? ` • +₹${item.customization.fee} Print Fee` : ""}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                              <span>Brand: {prod.brand || "RP Sports"}</span>
                              <span>•</span>
                              <div className="flex items-center gap-0.5 bg-[#388e3c] text-white px-1.5 py-0.2 rounded text-[9px] font-black">
                                <span>{prod.rating || "4.5"}</span>
                                <Star className="w-2.5 h-2.5 fill-current text-white" />
                              </div>
                            </div>

                            <div className="flex items-baseline gap-2 pt-1">
                              <span className="text-sm font-black text-slate-900">₹{prod.price.toLocaleString("en-IN")}</span>
                              {originalMrp > prod.price && (
                                <>
                                  <span className="text-xs line-through text-slate-400">₹{originalMrp.toLocaleString("en-IN")}</span>
                                  <span className="text-[11px] font-bold text-green-600">{discountPercentage}% Off</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qty:</span>
                              <div className="flex items-center border border-slate-200 rounded-md bg-white shadow-sm">
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      updateCartQuantity(item.id, item.quantity - 1);
                                    } else {
                                      removeFromCart(item.id);
                                    }
                                  }}
                                  className="px-2.5 py-1 text-slate-500 hover:text-[#CC0000] transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-black text-slate-800 min-w-[20px] text-center">{item.quantity}</span>
                                <button 
                                  type="button" 
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="px-2.5 py-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-[10px] font-black text-[#CC0000] hover:underline uppercase tracking-wider cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-[10px] text-[#388e3c] font-black flex items-center gap-1 justify-end">
                              <Truck className="w-3.5 h-3.5" />
                              <span>EXPRESS Delivery in 2 days</span>
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium mt-0.5">Direct dispatch from Dumdum Store</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Use GST Invoice Options Checkbox */}
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" />
                    <span>Use GST Invoice (Claim 18% Input Tax Credit on this order)</span>
                  </label>

                  {/* Open Box Delivery Notice */}
                  <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-3 text-xs">
                    <span className="text-lg">📦</span>
                    <div>
                      <p className="font-bold text-slate-800 mb-0.5">Rest assured with Open Box Delivery</p>
                      <p className="text-slate-500 leading-relaxed font-medium">Delivery agent will open the package so you can check for correct product, weight matching, or transport damage before sharing the OTP.</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep("payment")}
                      className="px-8 py-3 bg-[#ffc107] hover:bg-[#ffb300] text-[#111] rounded-lg font-display font-black uppercase tracking-widest text-xs shadow transition-all duration-300"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 ACTIVE: Payment Selector */}
              {step === "payment" && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                  <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-black text-lg uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                        3. Select Payment Gateway
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">Securely processed through Razorpay 256-bit SSL encryption</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 3 of 3</span>
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-3.5 rounded text-xs text-red-600 font-bold animate-shake">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "Razorpay", label: "Razorpay (Credit/Debit/Cards)", logo: "💳", desc: "Visa, Mastercard, RuPay Cards" },
                      { id: "UPI", label: "Instant UPI Payment", logo: "📱", desc: "GPay, PhonePe, Paytm, BHIM" },
                      { id: "Card", label: "Net Banking & Wallets", logo: "🏦", desc: "All Indian Banks Supported" },
                      { id: "COD", label: "Cash on Delivery (COD)", logo: "💵", desc: "Pay cash upon delivery in Kolkata" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id as any)}
                        className={`p-4 rounded-xl text-left border-2 flex items-start gap-4 transition-all cursor-pointer ${
                          paymentMethod === opt.id
                            ? "border-blue-600 bg-blue-50/40 shadow-sm"
                            : "border-gray-200 bg-gray-50/50 hover:border-gray-400"
                        }`}
                      >
                        <span className="text-2xl">{opt.logo}</span>
                        <div>
                          <p className="font-bold text-xs text-[#111111]">{opt.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <button
                      type="button"
                      onClick={handleProcessPayment}
                      className="w-full py-4 bg-[#ffc107] hover:bg-[#ffb300] text-[#111] rounded-xl font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-1.5 shadow"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                    >
                      <Lock className="w-4 h-4 text-[#111]" />
                      <span>Confirm & Pay ₹{grandTotal.toLocaleString()}</span>
                    </button>

                    <p className="text-[10px] text-gray-400 text-center leading-relaxed font-medium pt-1 px-4">
                      By placing your order, you agree to our{" "}
                      <Link href="/terms" target="_blank" className="text-blue-600 underline font-bold hover:underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/refund-policy" target="_blank" className="text-blue-600 underline font-bold hover:underline">
                        Return & Refund Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT PANEL: Price Details Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="font-display font-black text-sm uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Price Details
                </h4>
                <div className="space-y-3.5 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between">
                    <span>MRP (incl. of all taxes)</span>
                    <span className="font-semibold text-slate-800">₹{mrpTotal.toLocaleString("en-IN")}</span>
                  </div>
                  
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-[#388e3c] font-semibold">
                      <span>Discounts</span>
                      <span>-₹{totalDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={shipping === 0 ? "text-[#388e3c] font-bold" : "text-slate-800"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (18% Tax Included)</span>
                    <span className="font-semibold text-slate-800">
                      ₹{gstTax.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Active Coupon or Apply Form */}
                  <div className="pt-3 border-t border-slate-100">
                    {activeCoupon ? (
                      <div className="flex items-center justify-between text-[#388e3c] font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Tag className="w-3.5 h-3.5 shrink-0" />
                          <div className="truncate">
                            <span className="font-mono font-black">{activeCoupon.code}</span>
                            <span className="text-[10px] block text-emerald-700 font-normal truncate">{activeCoupon.description}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-black">-₹{couponDiscount.toLocaleString("en-IN")}</span>
                          <button
                            type="button"
                            onClick={removeCoupon}
                            className="text-[10px] text-red-600 font-bold hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCheckoutCoupon} className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Have a coupon?
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Enter promo code"
                            value={checkoutCouponInput}
                            onChange={(e) => {
                              setCheckoutCouponInput(e.target.value.toUpperCase());
                              setCheckoutCouponError(null);
                            }}
                            disabled={isValidatingCoupon}
                            className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 uppercase placeholder:text-slate-400 focus:outline-none focus:border-[#CC0000]"
                          />
                          <button
                            type="submit"
                            disabled={isValidatingCoupon || !checkoutCouponInput.trim()}
                            className="px-3 py-2 bg-[#111111] hover:bg-[#CC0000] disabled:bg-slate-200 text-white font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
                          >
                            {isValidatingCoupon ? "..." : "Apply"}
                          </button>
                        </div>
                        {checkoutCouponError && (
                          <p className="text-[10px] font-bold text-red-600 bg-red-50 p-1.5 rounded border border-red-200">
                            {checkoutCouponError}
                          </p>
                        )}
                      </form>
                    )}
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 flex justify-between font-display font-black text-base text-slate-900">
                    <span>Total Amount</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {totalDiscount > 0 && (
                  <div className="bg-emerald-50 text-[#388e3c] p-2.5 rounded-xl border border-emerald-200/80 text-[11px] font-bold text-center">
                    🎉 You will save ₹{totalDiscount.toLocaleString("en-IN")} on this order
                  </div>
                )}

                <div className="pt-2">
                  {step === "address" && (
                    <button 
                      type="button" 
                      onClick={() => {
                        const formEl = document.getElementById("address-form") as HTMLFormElement;
                        if (formEl) formEl.requestSubmit();
                      }}
                      className="w-full py-3.5 bg-[#ffc107] hover:bg-[#ffb300] text-[#111] rounded-xl font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-1.5 shadow"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                    >
                      <span>Deliver to this Address</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  
                  {step === "summary" && (
                    <button 
                      type="button" 
                      onClick={() => setStep("payment")}
                      className="w-full py-3.5 bg-[#ffc107] hover:bg-[#ffb300] text-[#111] rounded-xl font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-1.5 shadow"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {step === "payment" && (
                    <button 
                      type="button" 
                      onClick={handleProcessPayment}
                      className="w-full py-3.5 bg-[#ffc107] hover:bg-[#ffb300] text-[#111] rounded-xl font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-1.5 shadow"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                    >
                      <Lock className="w-4 h-4 text-[#111]" />
                      <span>Pay ₹{grandTotal.toLocaleString()} & Confirm</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Policy assurances banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider space-y-2 text-center">
                <p>🔒 256-Bit SSL Encrypted checkout</p>
                <p>🛡️ RP Sports Authenticity Verified</p>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
