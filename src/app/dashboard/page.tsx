"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { getOrdersByUser } from "@/lib/firestoreService";
import { 
  User, Package, Heart, MapPin, Gift, 
  ArrowUpRight, Clock, ShieldCheck, Download, LogOut 
} from "lucide-react";
import Link from "next/link";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { currentUser, orders, setOrders, wishlist, products, logout } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "addresses" | "profile">("orders");

  useEffect(() => {
    if (!currentUser || !currentUser.email) return;

    getOrdersByUser(currentUser.email)
      .then((dbOrders) => {
        if (dbOrders) {
          setOrders(dbOrders);
        }
      })
      .catch((err) => console.error("Error loading user orders:", err));
  }, [currentUser, setOrders]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Filter wishlisted products from our database
  const wishlistedItems = products.filter((p) => wishlist.includes(p.id));

  // Simulated invoice download
  const handleDownloadInvoice = (orderId: string) => {
    alert(`Generating invoice for ${orderId}. Downloading PDF...`);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="p-12 neumorphic rounded-[24px] text-center max-w-sm">
          <ShieldCheck className="w-12 h-12 text-warm-gray mx-auto mb-4" />
          <h2 className="text-lg font-black uppercase text-foreground tracking-widest">Access Denied</h2>
          <p className="text-warm-gray text-xs font-medium mt-2 mb-8">You must be logged in to access the customer dashboard.</p>
          <Link href="/login" className="btn-luxury w-full">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Welcome Dashboard Banner */}
        <div className="relative rounded-[24px] neumorphic p-8 md:p-12 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-16 h-16 rounded-full neumorphic-inset flex items-center justify-center font-bold text-electric-blue text-3xl">
              {currentUser.name[0]}
            </div>
            <div>
              <span className="text-warm-gray font-bold text-[10px] tracking-widest uppercase block mb-1">CUSTOMER PORTAL</span>
              <h1 className="text-3xl font-black uppercase text-foreground tracking-tighter">
                WELCOME BACK, {currentUser.name}
              </h1>
              <p className="text-warm-gray text-xs mt-1 truncate font-medium">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 neumorphic-inset p-5 rounded-2xl z-10 self-start md:self-auto">
            <Gift className="w-8 h-8 text-electric-blue" />
            <div>
              <span className="text-[10px] font-bold tracking-widest text-warm-gray uppercase block mb-1">REWARD BALANCE</span>
              <span className="text-2xl font-black text-foreground">{currentUser.rewardPoints} POINTS</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR CONTROLLER */}
          <aside className="lg:col-span-3 p-4 neumorphic-inset rounded-[24px] space-y-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === "orders" 
                  ? "neumorphic text-electric-blue" 
                  : "text-warm-gray hover:text-foreground"
              }`}
            >
              <Package className="w-4 h-4" /> My Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === "wishlist" 
                  ? "neumorphic text-electric-blue" 
                  : "text-warm-gray hover:text-foreground"
              }`}
            >
              <Heart className="w-4 h-4" /> My Wishlist ({wishlistedItems.length})
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === "addresses" 
                  ? "neumorphic text-electric-blue" 
                  : "text-warm-gray hover:text-foreground"
              }`}
            >
              <MapPin className="w-4 h-4" /> Saved Addresses
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === "profile" 
                  ? "neumorphic text-electric-blue" 
                  : "text-warm-gray hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" /> Edit Profile
            </button>
            
            <div className="border-t border-foreground/10 pt-4 mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-foreground/5 transition-colors cursor-pointer"
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
                <h3 className="font-black text-lg uppercase mb-4 text-foreground tracking-widest">ORDER TRACKING HISTORY</h3>
                {orders.length === 0 ? (
                  <div className="p-16 neumorphic-inset rounded-[24px] text-center flex flex-col items-center justify-center">
                    <Clock className="w-12 h-12 text-warm-gray mb-4 animate-spin-slow" />
                    <h4 className="font-bold text-foreground uppercase tracking-widest text-sm">No orders recorded yet</h4>
                    <p className="text-warm-gray text-xs mt-2 max-w-xs font-medium">
                      Ready to start shopping? Place an order and trace its status here.
                    </p>
                    <Link
                      href="/shop"
                      className="mt-8 btn-luxury inline-block"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="p-8 neumorphic rounded-[24px] space-y-6"
                    >
                      {/* Order Header details */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-foreground/10 pb-4 gap-4 text-[10px] font-bold uppercase tracking-widest text-warm-gray">
                        <div>
                          <span>ORDER ID: <strong className="text-foreground">{order.id}</strong></span>
                          <span className="mx-2">·</span>
                          <span>DATE: {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest ${
                            order.status === "Delivered" 
                              ? "neumorphic-inset text-electric-blue" 
                              : order.status === "Cancelled" 
                              ? "neumorphic-inset text-red-500"
                              : "neumorphic border border-electric-blue text-electric-blue"
                          }`}>
                            {order.status}
                          </span>
                          <button
                            onClick={() => handleDownloadInvoice(order.id)}
                            className="text-warm-gray hover:text-electric-blue flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> INVOICE
                          </button>
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-6 items-center">
                            <div className="w-16 h-16 neumorphic-inset rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                              <img src={item.product.images[0]} alt="product" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-sm font-bold text-foreground truncate">{item.product.name}</h4>
                              <p className="text-xs text-warm-gray mt-1 font-medium">
                                Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ""}
                              </p>
                            </div>
                            <span className="font-bold text-sm text-foreground">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="border-t border-foreground/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium">
                        <div className="text-warm-gray">
                          <span>Tracking: </span>
                          <strong className="text-foreground">{order.trackingNumber || "PENDING SHIPPING"}</strong>
                        </div>
                        <div className="flex items-center gap-2 font-black text-foreground text-sm">
                          <span className="text-warm-gray text-xs uppercase tracking-widest">Total Paid:</span>
                          <span>₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === "wishlist" && (
              <div>
                <h3 className="font-black text-lg uppercase mb-6 text-foreground tracking-widest">MY WISHLIST</h3>
                {wishlistedItems.length === 0 ? (
                  <div className="p-16 neumorphic-inset rounded-[24px] text-center flex flex-col items-center justify-center">
                    <Heart className="w-12 h-12 text-warm-gray mb-4 animate-pulse" />
                    <h4 className="font-bold text-foreground uppercase tracking-widest text-sm">Your wishlist is empty</h4>
                    <p className="text-warm-gray text-xs mt-2 max-w-xs font-medium">
                      Tap the heart icon on any product cards to add them to your wish list.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistedItems.map((prod) => (
                      <div key={prod.id} className="relative group neumorphic rounded-[24px] p-4 transition-transform hover:-translate-y-2">
                        <Link href={`/product/${prod.id}`}>
                          <div className="aspect-square neumorphic-inset rounded-[16px] overflow-hidden mb-4 flex items-center justify-center p-6">
                            <img src={prod.images[0]} alt="wishlist" className="max-h-[85%] object-contain mix-blend-multiply transition-transform group-hover:scale-110 duration-500" />
                          </div>
                          <span className="text-[9px] font-bold text-warm-gray uppercase tracking-widest">{prod.brand}</span>
                          <h4 className="font-bold text-sm text-foreground truncate mt-1 group-hover:text-electric-blue transition-colors">{prod.name}</h4>
                          <p className="font-black text-sm text-foreground mt-2">₹{prod.price.toLocaleString()}</p>
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
                <h3 className="font-black text-lg uppercase mb-4 text-foreground tracking-widest">ADDRESS BOOK</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentUser.addresses.map((address, idx) => (
                    <div key={idx} className="p-8 neumorphic rounded-[24px] space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-foreground/10">
                        <span className="text-[10px] font-bold text-electric-blue tracking-widest uppercase">PRIMARY ADDRESS</span>
                        <span className="text-[10px] text-warm-gray font-bold tracking-widest">INDEX {idx + 1}</span>
                      </div>
                      <div className="text-sm text-warm-gray space-y-1 font-medium">
                        <p className="font-black text-foreground uppercase tracking-widest text-xs mb-2">{address.fullName}</p>
                        <p>{address.addressLine}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p className="pt-3 font-bold text-foreground text-xs">{address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="p-8 neumorphic rounded-[24px] space-y-8">
                <h3 className="font-black text-lg uppercase text-foreground tracking-widest pb-4 border-b border-foreground/10">
                  EDIT PROFILE DETAILS
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-warm-gray uppercase block mb-2">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.name}
                      className="w-full neumorphic-inset border-none text-sm px-6 py-4 rounded-full text-foreground/50 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-warm-gray uppercase block mb-2">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full neumorphic-inset border-none text-sm px-6 py-4 rounded-full text-foreground/50 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div className="p-6 neumorphic-inset rounded-[24px] flex gap-4 text-xs text-warm-gray leading-relaxed font-medium">
                  <ShieldCheck className="w-5 h-5 text-electric-blue shrink-0" />
                  <p>
                    Account roles and customer emails are locked during this mock enterprise sandbox session.
                  </p>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
