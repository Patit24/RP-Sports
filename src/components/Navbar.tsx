"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { 
  ShoppingBag, Heart, Search, Menu, X, User, 
  LogOut, Plus, Minus, ChevronDown, ArrowRight, Scale 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist, compareList, currentUser, login, logout, updateCartQuantity, removeFromCart } = useStore();
  
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


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMockLogin = () => {
    login("admin@rpsports.com", "RP Admin", "super_admin");
    setUserDropdownOpen(false);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const categories = [
    { name: "Cricket", links: ["Bats", "Balls", "Pads", "Gloves", "Helmets", "Kits"] },
    { name: "Football", links: ["Footballs", "Cleats", "Shin Guards", "Goalie Gloves", "Training Gear"] },
    { name: "Badminton", links: ["Rackets", "Shuttlecocks", "Nets", "Grips", "Shoes"] },
    { name: "Apparel", links: ["Jerseys", "Shorts", "Trackpants", "Socks", "Jackets"] },
    { name: "Footwear", links: ["Running", "Training", "Football Boots", "Cricket Spikes", "Court Shoes"] },
  ];

  return (
    <>
      {/* Sticky Header Wrapper */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#111111]/95 backdrop-blur-md shadow-xl shadow-black/20' : 'bg-[#111111]'}`}>
        
        {/* Top Bar: Logo, Search, Icons */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 h-18 md:h-20 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 z-50">
            <span className="font-display font-black text-2xl md:text-3xl tracking-tight text-white whitespace-nowrap uppercase">
              RP <span className="text-primary">SPORTS</span>
            </span>
          </Link>

          {/* Massive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-2xl relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Kashmir willow, English willow, 7070, RP Elite bats..." 
              className="w-full h-11 pl-5 pr-14 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-[#CC0000] font-medium text-sm placeholder:text-gray-400"
            />
            <button type="submit" className="absolute right-0 top-0 h-11 w-12 bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors cursor-pointer">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-4 md:gap-6 z-50 flex-shrink-0">
            {/* Mobile Search Icon */}
            <Link href="/search" className="md:hidden p-2 text-white/80 hover:text-white transition-colors cursor-pointer">
              <Search className="w-6 h-6" />
            </Link>

            {/* Compare */}
            <Link href="/compare" className="hidden md:flex flex-col items-center text-white/80 hover:text-white transition-colors relative cursor-pointer group">
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
                        <Link href="/orders" className="block text-foreground hover:text-accent transition-colors mb-3 font-semibold text-sm">Order History</Link>
                        {currentUser.role !== "customer" && (
                          <Link href="/admin" className="block text-accent hover:text-primary transition-colors mb-4 font-bold text-sm">Admin Panel</Link>
                        )}
                        <button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-foreground transition-colors font-bold text-xs uppercase tracking-wider py-2 rounded-sm cursor-pointer">
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
                <ShoppingBag className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#CC0000] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">{cartCount}</span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Cart</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="md:hidden p-1 text-white/80 hover:text-white cursor-pointer transition-colors"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Categories (Desktop Only) */}
        <div className="hidden md:block w-full bg-secondary/20">
          <div className="max-w-[1600px] mx-auto px-8 flex items-center gap-8 h-12">
            {categories.map((cat) => (
              <div 
                key={cat.name}
                className="h-full flex items-center"
                onMouseEnter={() => setActiveCategory(cat.name)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link href={`/shop?category=${cat.name.toLowerCase()}`} className="h-full flex items-center text-white/90 hover:text-white font-semibold text-sm gap-1 cursor-pointer relative group">
                  {cat.name}
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeCategory === cat.name ? 'rotate-180' : ''}`} />
                  <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-primary transform origin-left transition-transform duration-300 ${activeCategory === cat.name ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </Link>
                
                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {activeCategory === cat.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-secondary/10 origin-top"
                    >
                      <div className="max-w-[1600px] mx-auto p-8 grid grid-cols-5 gap-8">
                        <div className="col-span-1">
                          <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-secondary/20 pb-2">{cat.name}</h3>
                          <ul className="space-y-3">
                            {cat.links.map((link) => (
                              <li key={link}>
                                <Link href={`/shop?category=${cat.name.toLowerCase()}`} className="text-sm font-medium text-secondary hover:text-accent hover:translate-x-1 inline-block transition-transform">
                                  {link}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-span-1">
                          <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-secondary/20 pb-2">Top Brands</h3>
                          <ul className="space-y-3">
                            <li><Link href="/shop" className="text-sm font-medium text-secondary hover:text-accent hover:translate-x-1 inline-block transition-transform">RP Elite</Link></li>
                            <li><Link href="/shop" className="text-sm font-medium text-secondary hover:text-accent hover:translate-x-1 inline-block transition-transform">Titanium Pro</Link></li>
                            <li><Link href="/shop" className="text-sm font-medium text-secondary hover:text-accent hover:translate-x-1 inline-block transition-transform">CarbonX</Link></li>
                            <li><Link href="/shop" className="text-sm font-medium text-secondary hover:text-accent hover:translate-x-1 inline-block transition-transform">Velocity</Link></li>
                          </ul>
                        </div>
                        <div className="col-span-3 grid grid-cols-2 gap-4">
                          <Link href="/shop" className="group relative h-48 rounded-sm overflow-hidden bg-background">
                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                            <img src="/products/generated_football.jpg" alt="Promo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                            <div className="absolute bottom-4 left-4 z-20">
                              <span className="bg-white text-primary text-xs font-bold px-3 py-1.5 uppercase tracking-widest shadow-md">New Arrivals</span>
                            </div>
                          </Link>
                          <Link href="/shop" className="group relative h-48 rounded-sm overflow-hidden bg-background">
                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                            <img src="/products/generated_bat.jpg" alt="Promo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                            <div className="absolute bottom-4 left-4 z-20">
                              <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 uppercase tracking-widest shadow-md">Up to 40% Off</span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            <div className="ml-auto flex gap-6 border-l border-white/20 pl-6 h-6 items-center">
              <Link href="/jersey-builder" className="text-primary hover:text-white font-bold text-sm tracking-wide transition-colors">Custom Jerseys</Link>
              <Link href="/lookbook" className="text-white/80 hover:text-white font-medium text-sm tracking-wide transition-colors">Lookbook</Link>
            </div>
          </div>
        </div>
      </header>

      {/* spacer to prevent content from jumping due to fixed header */}
      <div className="h-20 md:h-32"></div>

      {/* Luxury Cart Drawer (Kept mostly intact, updated colors) */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col text-foreground"
            >
              <div className="p-6 md:p-8 border-b border-secondary/10 flex items-center justify-between bg-background">
                <h3 className="text-2xl font-display font-bold tracking-wide">
                  Shopping Cart <span className="text-secondary/60 text-lg">({cartCount})</span>
                </h3>
                <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-secondary/10 rounded-full transition-colors cursor-pointer text-secondary">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag className="w-16 h-16 text-secondary/30 mb-4" />
                    <p className="font-serif text-xl text-secondary mb-6">Your cart is feeling light.</p>
                    <Link href="/shop" onClick={() => setCartOpen(false)} className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors text-center rounded-sm">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group pb-6 border-b border-secondary/10 last:border-0">
                      <div className="w-24 h-24 bg-background rounded-sm overflow-hidden shrink-0 relative border border-secondary/10">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-sm text-primary line-clamp-2 leading-snug">{item.product.name}</h4>
                            <p className="font-bold text-sm text-primary shrink-0">₹{item.product.price.toLocaleString()}</p>
                          </div>
                          
                          {(item.selectedSize || item.selectedColor) && (
                            <div className="mt-1 text-xs text-secondary flex gap-3">
                              {item.selectedSize && <span>Size: <strong className="text-primary">{item.selectedSize}</strong></span>}
                              {item.selectedColor && <span>Color: <strong className="text-primary">{item.selectedColor}</strong></span>}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-secondary/20 rounded-sm">
                            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-secondary hover:bg-secondary/10 hover:text-primary transition-colors cursor-pointer"><Minus className="w-3 h-3" /></button>
                            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-secondary hover:bg-secondary/10 hover:text-primary transition-colors cursor-pointer"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-xs uppercase font-bold text-secondary hover:text-red-500 underline underline-offset-4 cursor-pointer transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 md:p-8 bg-background border-t border-secondary/10">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm text-secondary">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-secondary/10">
                      <span className="text-base font-bold uppercase tracking-wider text-primary">Subtotal</span>
                      <span className="font-serif font-bold text-2xl text-primary">₹{cartSubtotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link href="/checkout" onClick={() => setCartOpen(false)} className="block w-full py-4 bg-accent hover:bg-accent/90 text-white text-center font-bold uppercase tracking-widest text-sm rounded-sm transition-colors shadow-lg shadow-accent/20">
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
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
            <div className="p-6 border-b border-white/10">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full h-12 pl-4 pr-12 rounded-sm bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="absolute right-0 top-0 h-12 w-12 text-white/50 hover:text-white flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-grow px-6 py-8 gap-6">
              {categories.map(cat => (
                <Link key={cat.name} href={`/shop?category=${cat.name.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold tracking-wide border-b border-white/10 pb-4 flex justify-between items-center">
                  {cat.name}
                  <ArrowRight className="w-5 h-5 text-accent" />
                </Link>
              ))}
              <Link href="/jersey-builder" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold tracking-wide text-accent mt-4">Custom Jerseys</Link>
              
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
                    <Link href="/dashboard" className="text-sm font-bold uppercase tracking-wider text-white/70 py-2">My Account</Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-sm font-bold uppercase tracking-wider text-white/70 py-2">Sign Out</button>
                  </>
                ) : (
                  <button onClick={() => { handleMockLogin(); setMobileMenuOpen(false); }} className="w-full bg-white text-primary font-bold text-sm py-4 uppercase tracking-widest rounded-sm">
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
