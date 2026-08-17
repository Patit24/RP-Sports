"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { auth } from "@/lib/firebase";
import { 
  ShoppingBag, Heart, Search, Menu, X, User, 
  LogOut, Plus, Minus, ChevronDown, ArrowRight, Scale 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { listenToProducts, listenToCategories, listenToTestimonials } from "@/lib/firestoreService";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    cart, wishlist, compareList, currentUser, login, logout, showToast, 
    updateCartQuantity, removeFromCart, setProducts, setCategories, setTestimonials 
  } = useStore();
  
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const compareCount = compareList.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await auth.signOut();
      }
    } catch (err) {
      console.warn("Firebase sign out notice:", err);
    }
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    showToast("Signed out successfully", "info");
    // Redirect to home page on sign out
    window.location.href = "/";
  };

  // Real-time Database Snapshot Subscriptions
  useEffect(() => {
    // 1. Sync Catalog Products
    const unsubscribeProducts = listenToProducts((dbProducts) => {
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
      }
    });

    // 2. Sync Taxonomy Categories & Subcategories
    const unsubscribeCategories = listenToCategories((dbCategories) => {
      if (dbCategories && dbCategories.length > 0) {
        setCategories(dbCategories);
      }
    });

    // 3. Sync Testimonial Videos
    const unsubscribeTestimonials = listenToTestimonials((dbTestimonials) => {
      if (dbTestimonials && dbTestimonials.length > 0) {
        setTestimonials(dbTestimonials);
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeTestimonials();
    };
  }, [setProducts, setCategories, setTestimonials]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Load categories dynamically from store, with static fallback for first-load
  const dbCategories = useStore((state) => state.categories);
  const categories = dbCategories && dbCategories.length > 0 
    ? dbCategories.map(c => ({
        id: c.id,
        name: c.name,
        sub: c.subcategories.map(s => s.charAt(0).toUpperCase() + s.slice(1))
      }))
    : [
        { id: "cricket", name: "Cricket", sub: ["Bats", "Balls", "Pads & Gloves", "Helmets", "Protection"] },
        { id: "football", name: "Football", sub: ["Footballs", "Boots", "Shin Guards", "Goalkeeper Gloves"] },
        { id: "badminton", name: "Badminton", sub: ["Rackets", "Shuttlecocks", "Grips", "Kit Bags"] },
        { id: "apparel", name: "Apparel", sub: ["Match Jerseys", "Tracksuits", "Training Tees", "Caps"] },
        { id: "footwear", name: "Footwear", sub: ["Spikes", "Turf Shoes", "Running Shoes"] },
      ];


  return (
    <>
      {/* Top Banner Bar */}
      <div className="bg-[#CC0000] text-white text-[11px] font-bold tracking-widest uppercase py-1.5 px-4 text-center">
        ⚡ FREE EXPRESS SHIPPING ON ALL CRICKET & APPAREL ORDERS OVER ₹2,999 | MADE IN KOLKATA
      </div>

      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'bg-[#111111]/95 backdrop-blur-md border-b border-white/10 shadow-xl' : 'bg-[#111111]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="text-white hover:text-white/80 p-2 cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white flex items-center" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                RP<span className="text-[#CC0000] group-hover:text-red-400 transition-colors ml-1">SPORTS</span>
              </div>
            </Link>

            {/* Global Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kashmir willow, English willow, 7070, RP Elite bats..."
                className="w-full bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-l-sm focus:outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-[#CC0000] hover:bg-[#990000] text-white px-4 flex items-center justify-center rounded-r-sm transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Nav Icons Right */}
            <div className="flex items-center gap-4 sm:gap-6">
              
              {/* Compare Icon */}
              <Link href="/compare" className="hidden lg:flex flex-col items-center text-white/80 hover:text-white transition-colors relative cursor-pointer group">
                <div className="relative">
                  <Scale className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                  {compareCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">{compareCount}</span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Compare</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative hidden md:block" onMouseEnter={() => setUserDropdownOpen(true)} onMouseLeave={() => setUserDropdownOpen(false)}>
                <div className="flex flex-col items-center cursor-pointer text-white/80 hover:text-white transition-colors group h-full justify-center">
                  <User className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{currentUser ? 'Account' : 'Login'}</span>
                </div>
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-1/2 translate-x-1/2 top-full mt-2 w-64 bg-white shadow-2xl rounded-sm p-4 z-50 text-sm border border-secondary/10"
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-secondary/10"></div>
                      {currentUser ? (
                        <>
                          <div className="mb-4 pb-4 border-b border-secondary/10">
                            <p className="font-bold text-foreground capitalize text-lg">{currentUser.name}</p>
                            <p className="text-xs text-secondary">{currentUser.email}</p>
                          </div>
                          <Link href="/dashboard" className="block text-foreground hover:text-accent transition-colors mb-3 font-semibold text-sm">My Dashboard</Link>
                          <Link href="/dashboard" className="block text-foreground hover:text-accent transition-colors mb-3 font-semibold text-sm">Order History</Link>
                          {currentUser.role !== "customer" && (
                            <Link href="/admin" className="block text-accent hover:text-primary transition-colors mb-4 font-bold text-sm">Admin Panel</Link>
                          )}
                          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-foreground transition-colors font-bold text-xs uppercase tracking-wider py-2 rounded-sm cursor-pointer">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="mb-4">
                            <h4 className="font-bold text-foreground text-base mb-1">Welcome Back</h4>
                            <p className="text-xs text-gray-500">Sign in to access orders, wishlist & exclusive deals.</p>
                          </div>
                          <Link
                            href="/signin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-bold text-sm py-3 transition-colors cursor-pointer mb-2 flex items-center justify-center"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/signup"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full border-2 border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white font-bold text-sm py-2.5 transition-colors cursor-pointer flex items-center justify-center"
                          >
                            Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link href="/dashboard" className="hidden md:flex flex-col items-center text-white/80 hover:text-white transition-colors relative cursor-pointer group">
                <div className="relative">
                  <Heart className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#CC0000] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">{wishlistCount}</span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Wishlist</span>
              </Link>

              {/* Cart */}
              <button 
                onClick={() => setCartOpen(true)} 
                className="flex flex-col items-center text-white/80 hover:text-white transition-colors relative cursor-pointer group"
              >
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform text-white" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-5 h-5 bg-[#CC0000] text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Cart</span>
              </button>

            </div>

          </div>

          {/* Desktop Categories Menu Bar */}
          <nav className="hidden md:flex items-center justify-between border-t border-white/10 py-3 text-xs font-bold uppercase tracking-wider text-white/80">
            <div className="flex items-center gap-8">
              {categories.map((cat) => (
                <div 
                  key={cat.name} 
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(cat.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link 
                    href={`/shop?category=${cat.id}`}
                    className="hover:text-white flex items-center gap-1 py-1 transition-colors"
                  >
                    {cat.name}
                    <ChevronDown className="w-3 h-3 text-white/50 group-hover:text-white transition-transform group-hover:rotate-180" />
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {activeCategory === cat.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-1 w-48 bg-white shadow-2xl rounded-sm py-2 z-50 text-foreground border border-secondary/10"
                      >
                        {cat.sub.map((subItem) => (
                          <Link
                            key={subItem}
                            href={`/shop?category=${cat.id}&subcategory=${subItem.toLowerCase().replace(/ & /g, "-")}`}
                            className="block px-4 py-2 hover:bg-secondary/10 hover:text-accent font-semibold transition-colors normal-case text-sm"
                          >
                            {subItem}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <Link href="/shop" className="hover:text-white transition-colors font-bold uppercase tracking-wider text-xs">All Products</Link>
              <Link href="/lookbook" className="hover:text-white transition-colors font-bold uppercase tracking-wider text-xs">Lookbook</Link>
            </div>
          </nav>

        </div>
      </header>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 bg-primary text-white flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-accent" />
                  <h3 className="font-display font-bold text-xl uppercase tracking-wider">Your Equipment Bag ({cartCount})</h3>
                </div>
                <button onClick={() => setCartOpen(false)} className="text-white/70 hover:text-white p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium text-sm">Your cart is currently empty.</p>
                    <button onClick={() => setCartOpen(false)} className="mt-4 text-xs font-bold uppercase tracking-wider text-accent border-b-2 border-accent pb-0.5">Explore Products</button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4">
                      <img src={item.product.image || item.product.images?.[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-sm bg-slate-50" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm line-clamp-1">{item.product.name}</h4>
                        {item.selectedSize && <p className="text-xs text-slate-500">Size: {item.selectedSize}</p>}
                        {item.selectedColor && <p className="text-xs text-slate-500">Color: {item.selectedColor}</p>}
                        <div className="font-bold text-sm text-primary mt-1">₹{item.product.price.toLocaleString("en-IN")}</div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-slate-200 rounded-sm">
                            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-slate-100"><Minus className="w-3 h-3" /></button>
                            <span className="px-3 text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-slate-100"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Subtotal:</span>
                    <span className="text-primary">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-xs text-slate-500">Taxes & shipping calculated at checkout.</p>
                  <Link 
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="w-full bg-[#CC0000] hover:bg-[#990000] text-white font-bold py-4 text-center rounded-sm uppercase tracking-widest text-sm block transition-colors shadow-lg shadow-[#CC0000]/20"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-slate-900 z-[100] flex flex-col text-white overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <span className="font-serif font-bold text-2xl">RP SPORTS</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white hover:text-white/70">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="p-6 border-b border-white/10">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..." 
                  className="w-full h-12 pl-4 pr-12 rounded-sm bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button type="submit" className="absolute right-0 top-0 h-12 w-12 text-white/50 hover:text-white flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="flex flex-col flex-grow px-6 py-8 gap-6">
              {categories.map(cat => (
                <Link key={cat.name} href={`/shop?category=${cat.id}`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold tracking-wide border-b border-white/10 pb-4 flex justify-between items-center">
                  {cat.name}
                  <ArrowRight className="w-5 h-5 text-accent" />
                </Link>
              ))}
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold tracking-wide text-accent mt-4">All Products</Link>
              
              <div className="mt-auto pt-8 flex flex-col gap-4">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">{currentUser.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-sm">{currentUser.name}</p>
                        <p className="text-xs text-white/50">{currentUser.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-wider text-white/70 py-2">My Account</Link>
                    <button onClick={handleLogout} className="text-left text-sm font-bold uppercase tracking-wider text-white/70 py-2">Sign Out</button>
                  </>
                ) : (
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="w-full bg-white text-primary font-bold text-sm py-4 uppercase tracking-widest rounded-sm text-center">
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
