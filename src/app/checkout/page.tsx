"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ShieldCheck, Lock, CreditCard, ChevronRight, CheckCircle2, AlertCircle, MapPin, Phone, User as UserIcon, Building, Hash, ArrowLeft, Truck, Tag } from "lucide-react";
import confetti from "canvas-confetti";
import CheckoutAuthGate from "@/components/CheckoutAuthGate";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, currentUser, activeCoupon, clearCart, removeCoupon } = useStore();

  // Step state
  const [isMounted, setIsMounted] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Step state
  const [step, setStep] = useState<"address" | "payment" | "processing">("address");

  // Address inputs default to Dumdum, Kolkata for authentic local store experience
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("Flat 405, Carbon Towers, Sports City Road");
  const [city, setCity] = useState("Kolkata");
  const [stateName, setStateName] = useState("West Bengal");
  const [pincode, setPincode] = useState("700028");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Razorpay" | "Card" | "COD">("Razorpay");
  const [formError, setFormError] = useState("");

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
  const cartSubtotal = Math.round(totalInclusive / 1.18);
  const gstTax = totalInclusive - cartSubtotal;
  const FREE_DELIVERY_THRESHOLD = 999;
  const shipping = totalInclusive >= FREE_DELIVERY_THRESHOLD || totalInclusive === 0 ? 0 : 250;
  
  const discountPercent = activeCoupon ? activeCoupon.discountPercent : 0;
  const couponDiscount = Math.round((totalInclusive * discountPercent) / 100);
  const grandTotal = totalInclusive + shipping - couponDiscount;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim() || !phone.trim() || !addressLine.trim() || !city.trim() || !stateName.trim() || !pincode.trim()) {
      setFormError("Please fill out all required delivery fields.");
      return;
    }

    setStep("payment");
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

          {/* Stepper Bar */}
          <div className="flex items-center gap-3 text-xs font-display font-bold uppercase tracking-widest">
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded ${step === "address" ? "bg-[#CC0000] text-white" : "bg-emerald-100 text-emerald-800"}`}>
              1. Delivery Address
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded ${step === "payment" ? "bg-[#CC0000] text-white" : "bg-gray-200 text-gray-500"}`}>
              2. Payment Method
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="px-3 py-1.5 rounded bg-gray-200 text-gray-400">
              3. Order Confirmation
            </span>
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

        {/* STEP 1: ADDRESS DETAILS */}
        {step === "address" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Address Form */}
            <form onSubmit={handleAddressSubmit} className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
              
              <div className="pb-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-display font-black text-xl uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Shipping & Delivery Address
                </h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 1 of 2</span>
              </div>

              {formError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-3.5 rounded text-xs text-red-600 font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-12 pl-11 pr-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm text-[#111111] font-semibold outline-none focus:border-[#CC0000] focus:bg-white transition-colors"
                  />
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Contact Number & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-2">
                    Mobile Number (For Delivery SMS) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-12 pl-11 pr-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm text-[#111111] font-semibold outline-none focus:border-[#CC0000] focus:bg-white transition-colors"
                    />
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-2">
                    Pincode *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 700028"
                      className="w-full h-12 pl-11 pr-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm text-[#111111] font-semibold outline-none focus:border-[#CC0000] focus:bg-white transition-colors"
                    />
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-2">
                  Street Address & Flat / House No. *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="House No., Building Name, Street Name"
                    className="w-full h-12 pl-11 pr-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm text-[#111111] font-semibold outline-none focus:border-[#CC0000] focus:bg-white transition-colors"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-2">
                    City *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kolkata"
                      className="w-full h-12 pl-11 pr-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm text-[#111111] font-semibold outline-none focus:border-[#CC0000] focus:bg-white transition-colors"
                    />
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-display font-bold tracking-wider text-gray-700 uppercase block mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="West Bengal"
                    className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm text-[#111111] font-semibold outline-none focus:border-[#CC0000] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#CC0000]/30 hover:scale-[1.01] transition-transform"
                >
                  Save & Proceed to Payment <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Right: Cart Summary Sidebar */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h4 className="font-display font-black uppercase tracking-wider text-base text-[#111111] pb-3 border-b border-gray-200" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Cart Items ({cart.length})
              </h4>
              
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs pb-3 border-b border-gray-100">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-contain bg-gray-50 rounded p-1 border" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#111111] truncate">{item.product.name}</p>
                      <p className="text-gray-400 text-[10px]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-[#CC0000]">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-gray-900">₹{gstTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-bold text-emerald-600">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                {totalInclusive >= FREE_DELIVERY_THRESHOLD ? (
                  <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200/80 text-[11px] font-bold flex items-center gap-1.5 my-1">
                    <span>🎉 You’ve unlocked FREE DELIVERY</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-200/80 text-[11px] font-semibold my-1">
                    Add <span className="font-bold">₹{(FREE_DELIVERY_THRESHOLD - totalInclusive).toLocaleString("en-IN")}</span> more to get <span className="font-bold">FREE DELIVERY</span>
                  </div>
                )}
                {activeCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded">
                    <span>Coupon ({activeCoupon.code})</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-display font-black text-[#CC0000] text-xl pt-3 border-t border-gray-200">
                  <span className="text-xs uppercase tracking-widest text-gray-500 self-center">Grand Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === "payment" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Options List */}
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm space-y-8">
              
              <div className="pb-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-xl uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Select Payment Gateway
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Encrypted via Razorpay 256-bit SSL certificate</p>
                </div>
                <span className="text-xs font-bold text-[#CC0000] uppercase tracking-widest">Step 2 of 2</span>
              </div>

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
                    className={`p-5 rounded-xl text-left border-2 flex items-start gap-4 transition-all cursor-pointer ${
                      paymentMethod === opt.id
                        ? "border-[#CC0000] bg-red-50/40 shadow-sm"
                        : "border-gray-200 bg-gray-50/50 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-3xl">{opt.logo}</span>
                    <div>
                      <p className="font-display font-bold text-sm text-[#111111]">{opt.label}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#CC0000]/30 hover:scale-[1.01] transition-transform"
                >
                  <Lock className="w-4 h-4" /> PAY ₹{grandTotal.toLocaleString()} & PLACE ORDER
                </button>

                <p className="text-[11px] text-gray-500 text-center leading-relaxed font-medium pt-1 px-4">
                  By placing your order, you agree to our{" "}
                  <Link href="/terms" target="_blank" className="text-[#CC0000] underline font-bold hover:text-[#990000]">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/refund-policy" target="_blank" className="text-[#CC0000] underline font-bold hover:text-[#990000]">
                    Return & Refund Policy
                  </Link>
                  .
                </p>

                <button
                  type="button"
                  onClick={() => setStep("address")}
                  className="w-full text-center text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-[#CC0000] transition-colors py-2"
                >
                  ← Edit Delivery Address Details
                </button>
              </div>

            </div>

            {/* Sum Side Pane */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5 text-xs">
              <h4 className="font-display font-bold uppercase tracking-wider text-gray-700 pb-3 border-b border-gray-200">
                Delivery Details
              </h4>
              <div className="space-y-1.5 text-gray-600">
                <p className="font-bold text-[#111111] text-sm">{fullName}</p>
                <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#CC0000]" /> {phone}</p>
                <p className="flex items-start gap-1"><MapPin className="w-3.5 h-3.5 text-[#CC0000] shrink-0 mt-0.5" /> {addressLine}, {city}, {stateName} – {pincode}</p>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline font-display font-black text-xl text-[#CC0000]">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-normal">Total Amount</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
