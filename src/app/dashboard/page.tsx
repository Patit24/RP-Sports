"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, Order } from "@/lib/store";
import { listenToUserOrders, listenToOrders } from "@/lib/firestoreService";
import { 
  User, Package, Heart, MapPin, Gift, 
  ArrowUpRight, Clock, ShieldCheck, Download, LogOut, 
  Truck, Clipboard, CheckCircle, ExternalLink, Calendar,
  CreditCard, Compass, Printer
} from "lucide-react";
import Link from "next/link";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { currentUser, orders, setOrders, wishlist, products, logout, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "addresses" | "profile">("orders");
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";
  const userEmail = (currentUser?.email || "").toLowerCase().trim();

  // Strict email filtering so users never see cross-account orders
  const userOrders = isAdmin
    ? orders
    : orders.filter((o) => {
        const oEmail = (o.userEmail || o.shippingAddress?.email || "").toLowerCase().trim();
        return oEmail === userEmail;
      });

  // Real-time listener for orders: Admin sees all, regular user sees their own
  useEffect(() => {
    if (!currentUser || !currentUser.email) return;

    // Reset local orders on mount or user switch to avoid flashing stale account data
    if (!isAdmin) {
      setOrders([]);
    }

    const normalizedEmail = currentUser.email.toLowerCase().trim();
    let unsubscribe: () => void;

    if (isAdmin) {
      // Admin sees all orders to easily test/view tracking of any customer order
      unsubscribe = listenToOrders((dbOrders) => {
        setOrders(dbOrders);
      });
    } else {
      // Regular customer sees only their own orders in real-time
      unsubscribe = listenToUserOrders(normalizedEmail, (dbOrders) => {
        setOrders(dbOrders);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser?.email, currentUser?.role, isAdmin, setOrders]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(id);
    showToast("Tracking code copied to clipboard", "success");
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Filter wishlisted products from our database
  const wishlistedItems = products.filter((p) => wishlist.includes(p.id));

  // Tax invoice modal state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const handleDownloadInvoice = (order: Order) => {
    setSelectedInvoiceOrder(order);
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Pending": return 0;
      case "Placed":
      case "Confirmed": return 1;
      case "Packed": return 2;
      case "Shipped":
      case "Out for Delivery": return 3;
      case "Delivered": return 4;
      default: return 1;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8">
        <div className="p-10 bg-neutral-900 border border-neutral-800 rounded-3xl text-center max-w-sm w-full">
          <ShieldCheck className="w-12 h-12 text-[#CC0000] mx-auto mb-4" />
          <h2 className="text-xl font-black uppercase text-white tracking-widest" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Access Denied
          </h2>
          <p className="text-neutral-400 text-xs font-medium mt-2 mb-8">You must be logged in to access the customer dashboard.</p>
          <Link href="/signin" className="btn-primary w-full py-4 text-center justify-center">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-20 md:pt-28 pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Welcome Dashboard Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950/20 border border-neutral-800 p-8 md:p-10 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
          
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#CC0000] flex items-center justify-center font-bold text-white text-2xl" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {currentUser.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 font-bold text-[9px] tracking-widest uppercase block">
                  CUSTOMER PORTAL
                </span>
                {isAdmin && (
                  <span className="bg-[#CC0000] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                    Admin Mode
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-black uppercase text-white tracking-wider mt-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                WELCOME BACK, {currentUser.name}
              </h1>
              <p className="text-neutral-400 text-xs font-mono mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-neutral-950/50 border border-neutral-850 p-4 rounded-2xl z-10 self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#CC0000]" />
            </div>
            <div>
              <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase block mb-0.5">REWARD BALANCE</span>
              <span className="text-lg font-black text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {currentUser.rewardPoints || 0} POINTS
              </span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-amber-950/30 border border-amber-900/40 rounded-2xl p-4 mb-8 flex items-center gap-3 text-xs text-amber-300 font-medium">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <p>
              <strong>Admin override enabled:</strong> You are seeing all orders placed in the system to simplify testing and tracking verification.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR CONTROLLER */}
          <aside className="lg:col-span-3 bg-neutral-900/60 border border-neutral-800 p-4 rounded-3xl space-y-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === "orders" 
                  ? "bg-[#CC0000] text-white" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
              }`}
            >
              <Package className="w-4 h-4" /> My Orders ({userOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === "wishlist" 
                  ? "bg-[#CC0000] text-white" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
              }`}
            >
              <Heart className="w-4 h-4" /> My Wishlist ({wishlistedItems.length})
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === "addresses" 
                  ? "bg-[#CC0000] text-white" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
              }`}
            >
              <MapPin className="w-4 h-4" /> Saved Addresses
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === "profile" 
                  ? "bg-[#CC0000] text-white" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
              }`}
            >
              <User className="w-4 h-4" /> Edit Profile
            </button>
            
            <div className="border-t border-neutral-800 pt-3 mt-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#CC0000] hover:bg-[#CC0000]/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </aside>

          {/* RIGHT DETAILED SECTION CONTENT */}
          <main className="lg:col-span-9">
            
            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xl uppercase text-white tracking-widest" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    ORDER TRACKING HISTORY
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Total: {userOrders.length} orders
                  </span>
                </div>

                {userOrders.length === 0 ? (
                  <div className="p-16 bg-neutral-900/40 border border-neutral-800 border-dashed rounded-3xl text-center flex flex-col items-center justify-center">
                    <Clock className="w-12 h-12 text-neutral-600 mb-4" />
                    <h4 className="font-bold text-white uppercase tracking-widest text-sm">No orders recorded yet</h4>
                    <p className="text-neutral-500 text-xs mt-2 max-w-xs font-medium">
                      Ready to start shopping? Place an order and trace its status here.
                    </p>
                    <Link
                      href="/shop"
                      className="mt-8 btn-primary inline-flex"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userOrders.map((order) => {
                      const stepIdx = getStepIndex(order.status);
                      const isCancelled = order.status === "Cancelled";

                      return (
                        <div 
                          key={order.id} 
                          className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 hover:border-neutral-750 transition-all"
                        >
                          {/* Order Header details */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-4 gap-4 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                            <div className="flex flex-wrap items-center gap-3">
                              <span>ORDER ID: <strong className="text-white">{order.id}</strong></span>
                              <span>·</span>
                              <span>DATE: {new Date(order.createdAt).toLocaleDateString()}</span>
                              {isAdmin && (
                                <>
                                  <span>·</span>
                                  <span className="text-red-400">EMAIL: {order.userEmail}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-md font-bold uppercase text-[9px] tracking-wider ${
                                order.status === "Delivered" 
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50" 
                                  : order.status === "Cancelled" 
                                  ? "bg-red-950/60 text-red-400 border border-red-900/50"
                                  : "bg-[#CC0000]/10 text-[#CC0000] border border-[#CC0000]/30"
                              }`}>
                                {order.status}
                              </span>
                              <button
                                onClick={() => handleDownloadInvoice(order)}
                                className="text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Printer className="w-3.5 h-3.5" /> TAX INVOICE
                              </button>
                            </div>
                          </div>

                          {/* Items loop */}
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-14 h-14 bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                                  <img src={item.product.images[0]} alt="product" className="w-full h-full object-contain filter brightness-95" />
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h4 className="text-xs md:text-sm font-bold text-white truncate">{item.product.name}</h4>
                                  <p className="text-[10px] text-neutral-400 mt-1 font-mono">
                                    Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ""}
                                  </p>
                                  {item.customization && item.customization.type === "jersey_name_number" && (
                                    <div className="mt-1.5 text-[10px] bg-black/60 border border-neutral-700/80 text-neutral-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-2">
                                      <span className="text-amber-400 font-mono font-black">👕 {item.customization.name}</span>
                                      <span className="text-neutral-300 font-bold">#{item.customization.number}</span>
                                    </div>
                                  )}
                                </div>
                                <span className="font-bold text-xs md:text-sm text-white">
                                  ₹{(item.product.price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* 🚚 Real-time Tracking Info Section */}
                          {!isCancelled && (
                            <div className="bg-neutral-950/50 border border-neutral-850/80 p-4 rounded-2xl space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4 text-[#CC0000]" />
                                  <span className="text-neutral-400">Carrier:</span>
                                  <strong className="text-white font-bold">{order.courier_name || "Delhivery Express"}</strong>
                                </div>
                                <div className="flex items-center gap-2 font-mono">
                                  <span className="text-neutral-400">AWB Tracking Code:</span>
                                  {order.awb_code ? (
                                    <div className="flex items-center gap-2">
                                      <strong className="text-white font-bold">{order.awb_code}</strong>
                                      <button 
                                        onClick={() => handleCopyText(order.awb_code || "", order.id)}
                                        className="text-neutral-400 hover:text-white transition-colors"
                                        title="Copy tracking code"
                                      >
                                        <Clipboard className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <strong className="text-amber-500 font-bold uppercase text-[9px] bg-amber-950/40 px-2 py-0.5 rounded">PENDING SHIPPING</strong>
                                  )}
                                </div>
                              </div>

                              {/* Small visual progress dots */}
                              <div className="relative pt-2 pb-1">
                                <div className="absolute top-4 left-2 right-2 h-0.5 bg-[#222222] -z-0">
                                  <div 
                                    className="h-full bg-[#CC0000] transition-all duration-500"
                                    style={{ width: `${(stepIdx / 4) * 100}%` }}
                                  />
                                </div>

                                <div className="flex justify-between items-center relative z-10 font-mono text-[8px] uppercase tracking-wider text-neutral-400">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[7px] font-bold ${
                                      stepIdx >= 0 ? "bg-[#CC0000] border-[#CC0000] text-white" : "bg-neutral-900 border-neutral-800 text-neutral-600"
                                    }`}>1</div>
                                    <span className="mt-1 block">Received</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[7px] font-bold ${
                                      stepIdx >= 1 ? "bg-[#CC0000] border-[#CC0000] text-white" : "bg-neutral-900 border-neutral-800 text-neutral-600"
                                    }`}>2</div>
                                    <span className="mt-1 block font-bold text-neutral-350">Placed</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[7px] font-bold ${
                                      stepIdx >= 2 ? "bg-[#CC0000] border-[#CC0000] text-white" : "bg-neutral-900 border-neutral-800 text-neutral-600"
                                    }`}>3</div>
                                    <span className="mt-1 block">Packed</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[7px] font-bold ${
                                      stepIdx >= 3 ? "bg-[#CC0000] border-[#CC0000] text-white" : "bg-neutral-900 border-neutral-800 text-neutral-600"
                                    }`}>4</div>
                                    <span className="mt-1 block">Shipped</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[7px] font-bold ${
                                      stepIdx >= 4 ? "bg-[#CC0000] border-[#CC0000] text-white" : "bg-neutral-900 border-neutral-800 text-neutral-600"
                                    }`}>5</div>
                                    <span className="mt-1 block">Delivered</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Order Footer */}
                          <div className="border-t border-neutral-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium">
                            <div className="flex items-center gap-2">
                              {order.awb_code ? (
                                <Link 
                                  href={`/track-order?orderId=${order.id}`}
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#CC0000] hover:underline flex items-center gap-1"
                                >
                                  Trace Shipment Status <ExternalLink className="w-3 h-3" />
                                </Link>
                              ) : (
                                <span className="text-[10px] uppercase font-mono text-neutral-400">Order placement state: {order.status}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 font-black text-white text-sm">
                              <span className="text-neutral-400 text-[10px] uppercase tracking-widest">Total Paid:</span>
                              <span style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-lg">
                                ₹{order.total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <h3 className="font-black text-xl uppercase text-white tracking-widest mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  MY WISHLIST
                </h3>
                {wishlistedItems.length === 0 ? (
                  <div className="p-16 bg-neutral-900/40 border border-neutral-800 border-dashed rounded-3xl text-center flex flex-col items-center justify-center">
                    <Heart className="w-12 h-12 text-neutral-600 mb-4" />
                    <h4 className="font-bold text-white uppercase tracking-widest text-sm">Your wishlist is empty</h4>
                    <p className="text-neutral-500 text-xs mt-2 max-w-xs font-medium">
                      Tap the heart icon on any product cards to add them to your wishlist.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistedItems.map((prod) => (
                      <div key={prod.id} className="relative group bg-neutral-900/60 border border-neutral-800 rounded-3xl p-4 transition-transform hover:-translate-y-1">
                        <Link href={`/product/${prod.id}`}>
                          <div className="aspect-square bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden mb-4 flex items-center justify-center p-4">
                            <img src={prod.images[0]} alt="wishlist" className="max-h-[90%] object-contain filter brightness-95 transition-transform group-hover:scale-105 duration-500" />
                          </div>
                          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">{prod.brand}</span>
                          <h4 className="font-bold text-sm text-white truncate mt-0.5 group-hover:text-[#CC0000] transition-colors">{prod.name}</h4>
                          <p className="font-black text-sm text-white mt-1">₹{prod.price.toLocaleString()}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <h3 className="font-black text-xl uppercase text-white tracking-widest mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  ADDRESS BOOK
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentUser.addresses?.map((address, idx) => (
                    <div key={idx} className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                        <span className="text-[9px] font-bold text-[#CC0000] tracking-wider uppercase font-mono">PRIMARY ADDRESS</span>
                        <span className="text-[9px] text-neutral-400 font-bold tracking-wider font-mono">INDEX {idx + 1}</span>
                      </div>
                      <div className="text-xs text-neutral-300 space-y-1 font-medium">
                        <p className="font-black text-white uppercase tracking-wider text-xs mb-2">{address.fullName}</p>
                        <p>{address.addressLine}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p className="pt-2 font-bold text-white font-mono">{address.phone}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-2 p-10 bg-neutral-900/40 border border-neutral-800 border-dashed rounded-3xl text-center">
                      <MapPin className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-500 text-xs font-semibold">No saved addresses found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="bg-neutral-900/60 border border-neutral-800 p-6 md:p-8 rounded-3xl space-y-6">
                <h3 className="font-black text-xl uppercase text-white tracking-widest pb-3 border-b border-neutral-800" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  EDIT PROFILE DETAILS
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase block mb-1.5 font-mono">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.name}
                      className="w-full bg-neutral-950 border border-neutral-850 text-xs px-5 py-3.5 rounded-xl text-neutral-400 cursor-not-allowed font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase block mb-1.5 font-mono">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full bg-neutral-950 border border-neutral-850 text-xs px-5 py-3.5 rounded-xl text-neutral-400 cursor-not-allowed font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="p-5 bg-neutral-950/60 border border-neutral-850/80 rounded-2xl flex gap-3 text-xs text-neutral-400 leading-relaxed font-medium">
                  <ShieldCheck className="w-5 h-5 text-[#CC0000] shrink-0" />
                  <p>
                    Your authentication details are secured by Google Firebase Auth. Profile updates and security parameters are managed through safe verification procedures.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* TAX INVOICE MODAL */}
      {selectedInvoiceOrder && (
        <TaxInvoiceModal
          order={selectedInvoiceOrder}
          isOpen={Boolean(selectedInvoiceOrder)}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
