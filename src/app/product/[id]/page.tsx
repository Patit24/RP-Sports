"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { 
  Star, ShieldCheck, Heart, Truck, Plus, Minus, ArrowRight, ShoppingCart, Share2, Zap,
  MapPin, ChevronDown, ChevronUp, RefreshCw, IndianRupee, CheckCircle2, Award, Users, Navigation 
} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORIES } from "@/lib/mockData";
import ShiprocketPincodeWidget from "@/components/ShiprocketPincodeWidget";
import ProductAccordionSection from "@/components/ProductAccordionSection";
import BulkJerseyOrderModal from "@/components/BulkJerseyOrderModal";
import { useCustomerLocation } from "@/lib/useCustomerLocation";



if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const products = useStore((state) => state.products);
  const { addToCart, wishlist, toggleWishlist } = useStore();

  const container = useRef<HTMLDivElement>(null);
  const addToCartRef = useRef<HTMLButtonElement>(null);

  // Find product
  const product = useMemo(() => {
    return products.find((p) => p.id === id) || products[0];
  }, [products, id]);

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const isWishlisted = wishlist.includes(product.id);

  // States
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [peaceOpen, setPeaceOpen] = useState(true);
  const [highlightsOpen, setHighlightsOpen] = useState(true);

  // Customer Current Location (Auto-detected via IP/GPS & Postal Directory)
  const {
    pincode: customerPincode,
    formattedAddress: customerAddress,
    city: customerCity,
    isLoading: isLocLoading,
    isGpsAccurate,
    detectGpsLocation,
    setPincodeManual,
  } = useCustomerLocation();

  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [manualPinInput, setManualPinInput] = useState("");

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const isJerseyOrApparel = Boolean(
    product.category === "jerseys" || 
    product.category === "apparel" || 
    product.subcategory?.includes("jersey") || 
    product.name.toLowerCase().includes("jersey") ||
    product.enableJerseyCustomization
  );

  const activePrice = product.price;
  const activeMrp = product.mrp || product.originalPrice || product.price;
  const activeDiscount = Math.round(((activeMrp - activePrice) / activeMrp) * 100);

  // Zoom state
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      selectedColor: selectedColor || product.colors?.[0],
      selectedSize: selectedSize || product.sizes?.[0],
    });
  };

  const handleBuyNow = () => {
    if (product.stock === 0) return;
    addToCart({
      product,
      quantity,
      selectedColor: selectedColor || product.colors?.[0],
      selectedSize: selectedSize || product.sizes?.[0],
    });
    router.push("/checkout");
  };

  useGSAP(() => {
    gsap.fromTo(".fade-up", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: container });

  // Intersection Observer for Sticky Bar
  useEffect(() => {
    if (!addToCartRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when the main add to cart button is out of view (scrolled past)
        setShowStickyBar(entry.boundingClientRect.top < 0 && !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    
    observer.observe(addToCartRef.current);
    
    return () => observer.disconnect();
  }, []);

  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  const productHighlights = useMemo(() => {
    const nameLower = product.name.toLowerCase();
    
    if (product.category === "cricket" || nameLower.includes("bat")) {
      return [
        { label: "Material", text: "Grade-1 premium English Willow" },
        { label: "Weight Status", text: "Optimal weight under 980 grams for light pickup" },
        { label: "Profile", text: "Thick 40mm edges with deep sweetspot spine" },
        { label: "Knocking", text: "Pre-knocked 10,000+ strokes & oiled with linseed oil" },
      ];
    }
    if (product.category === "badminton" || nameLower.includes("racket") || nameLower.includes("shuttle")) {
      return [
        { label: "Material", text: "High modulus carbon graphite frame" },
        { label: "Tension", text: "Pre-strung at high tension (28-30 lbs) for smash power" },
        { label: "Weight", text: "Ultralight aerodynamic shaft & perfect balance" },
        { label: "Inclusions", text: "Includes padded heavy-duty thermal head cover" },
      ];
    }
    if (nameLower.includes("jersey") || nameLower.includes("t-shirt") || nameLower.includes("wear")) {
      return [
        { label: "Fabric", text: "100% Dry-Fit honeycomb breathable active polyester" },
        { label: "Print Quality", text: "Dye-sublimation fade-resistant rich colors" },
        { label: "Fit & Feel", text: "Athletic cut fit with skin-friendly flatlock seams" },
        { label: "Customization", text: "Supports custom names & team numbers" },
      ];
    }
    return [
      { label: "Authenticity", text: "100% genuine RP Sports brand certified" },
      { label: "Design", text: "Professional-grade sports engineering" },
      { label: "Quality Check", text: "Hand-inspected by Kolkata Dumdum hub before dispatch" },
      { label: "Inclusions", text: "Secure original box packaging with instructions" },
    ];
  }, [product]);

  const categoryName = CATEGORIES.find(c => c.id === product.category)?.name || product.category;

  return (
    <div ref={container} className="min-h-screen bg-slate-50 text-primary pb-20 pt-24 md:pt-32">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mb-6 hidden md:block">
        <div className="flex gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-accent transition-colors">{categoryName}</Link>
          <span>/</span>
          <span className="text-primary">{product.name}</span>
        </div>
      </div>

      {/* 50/50 SPLIT LAYOUT */}
      <div className="max-w-[1600px] mx-auto px-0 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white md:rounded-2xl md:shadow-sm md:border border-slate-200 overflow-hidden relative">
          
          {/* LEFT: Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col relative bg-white lg:border-r border-slate-100">
            
            <div className="md:hidden absolute top-4 left-4 z-20">
              <Link href="/shop" className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm border border-slate-200">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </Link>
            </div>
            
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
              <button onClick={() => toggleWishlist(product.id)} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 shadow-sm border border-slate-200 transition-colors">
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </button>
              <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-primary shadow-sm border border-slate-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 md:left-8 z-10 flex flex-col gap-2 pointer-events-none">
              {product.badge && (
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-sm bg-accent text-white">
                  {product.badge}
                </span>
              )}
            </div>

            {/* FLIPKART-STYLE IMAGE GRID (DESKTOP) */}
            <div className="hidden lg:grid grid-cols-2 gap-4 p-6 bg-slate-50">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="aspect-[4/5] bg-white rounded-2xl overflow-hidden border border-slate-200 p-6 flex items-center justify-center relative group shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <img 
                    src={img} 
                    alt={`${product.name} view ${idx + 1}`} 
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-md group-hover:scale-105 transition-transform duration-500" 
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-3 left-3 bg-[#CC0000] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
                      RP ORIGINAL
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile View Slider */}
            <div className="lg:hidden">
              <div 
                className="w-full aspect-square flex items-center justify-center p-8 relative overflow-hidden border-b border-slate-100"
              >
                <img 
                  src={product.images[activeImgIdx]} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 p-4 overflow-x-auto custom-scrollbar">
                {product.images.map((img, idx) => (
                  <button type="button"
                    key={idx}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-16 h-16 shrink-0 bg-slate-50 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImgIdx === idx ? "border-accent shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain p-1.5 mix-blend-multiply" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 xl:p-12 flex flex-col h-full bg-white">
            
            <div className="space-y-6 flex-grow">
              
              <div className="fade-up">
                <Link href={`/shop?brand=${product.brand}`} className="text-sm font-bold uppercase tracking-wider text-accent mb-1.5 inline-block hover:underline">
                  {product.brand}
                </Link>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-primary leading-tight mb-3">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 bg-[#388e3c] text-white px-2.5 py-0.5 rounded text-xs font-bold">
                    <span>{product.rating || "4.5"}</span>
                    <Star className="w-3 h-3 fill-current text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 underline cursor-pointer">{product.reviewsCount || "142"} Ratings & Reviews</span>
                  <span className="text-xs font-black text-emerald-600 tracking-wider">IN STOCK</span>
                </div>

                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-black text-primary">₹{activePrice.toLocaleString('en-IN')}</span>
                  {activeMrp > activePrice && (
                    <>
                      <span className="text-lg line-through text-slate-400 mb-0.5">₹{activeMrp.toLocaleString('en-IN')}</span>
                      <span className="text-sm font-bold text-green-600 mb-0.5">({activeDiscount}% OFF)</span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">Inclusive of all taxes</p>
              </div>

              {/* Delivery Address & Pincode Checker (Customer Live Location) */}
              <div className="fade-up bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 min-w-0">
                    <MapPin className="w-4 h-4 text-[#CC0000] mt-0.5 shrink-0 animate-bounce" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-slate-400 text-[11px] block uppercase tracking-wider font-bold">
                          Deliver To (Your Location)
                        </span>
                        {isGpsAccurate && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                            GPS Verified
                          </span>
                        )}
                      </div>
                      <span className="text-[#111] font-bold text-xs leading-snug block break-words">
                        {isLocLoading ? "Detecting your current location..." : customerAddress}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsChangingLocation(!isChangingLocation)}
                      className="text-[11px] font-bold text-[#CC0000] hover:underline px-2 py-1 rounded bg-red-50 hover:bg-red-100 border border-red-200/50 cursor-pointer"
                    >
                      {isChangingLocation ? "Close" : "Change"}
                    </button>
                    <button
                      type="button"
                      onClick={detectGpsLocation}
                      disabled={isLocLoading}
                      title="Detect Exact GPS"
                      className="text-[11px] font-bold text-slate-700 hover:text-black flex items-center gap-1 bg-white hover:bg-slate-100 px-2.5 py-1 rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Navigation className={`w-3 h-3 text-[#CC0000] ${isLocLoading ? "animate-spin" : ""}`} />
                      <span className="hidden sm:inline">{isLocLoading ? "Detecting..." : "GPS"}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Location / Pincode Selector Drawer */}
                {isChangingLocation && (
                  <div className="bg-white p-3.5 rounded-xl border border-red-200/80 shadow-inner space-y-2.5 animate-fadeIn">
                    <span className="text-[11px] font-bold text-slate-800 block uppercase tracking-wider">
                      Enter your delivery pincode or select city:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={manualPinInput}
                        onChange={(e) => setManualPinInput(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter 6-digit Pincode (e.g. 700028)..."
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-[#CC0000] focus:bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (manualPinInput.length === 6) {
                            setPincodeManual(manualPinInput);
                            setIsChangingLocation(false);
                            setManualPinInput("");
                          }
                        }}
                        disabled={manualPinInput.length !== 6}
                        className="px-3.5 py-1.5 bg-[#CC0000] hover:bg-[#AA0000] text-white text-xs font-bold uppercase rounded-lg disabled:opacity-50 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        { name: "Dum Dum", pin: "700028" },
                        { name: "Salt Lake", pin: "700091" },
                        { name: "New Town", pin: "700156" },
                        { name: "Howrah", pin: "711101" },
                        { name: "Barasat", pin: "700124" },
                        { name: "Girish Park", pin: "700006" },
                      ].map((item) => (
                        <button
                          key={item.pin}
                          type="button"
                          onClick={() => {
                            setPincodeManual(item.pin);
                            setIsChangingLocation(false);
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                            customerPincode === item.pin
                              ? "bg-red-50 text-[#CC0000] border-[#CC0000]"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {item.name} ({item.pin})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-slate-800 text-xs font-bold bg-white px-3 py-2 rounded-lg border border-slate-150">
                  <Truck className="w-4 h-4 text-[#388e3c] shrink-0" />
                  <span>
                    Estimated Delivery to {customerCity}:{" "}
                    <span className="text-[#388e3c] uppercase font-black tracking-wide">
                      {customerPincode?.startsWith("700") ? "Next-Day Express (24 Hours)" : "Express 2-3 Days"}
                    </span>
                  </span>
                </div>
                
                <div className="pt-1">
                  <ShiprocketPincodeWidget 
                    defaultPincode={customerPincode}
                    onPincodeChange={setPincodeManual}
                    onDetectGps={detectGpsLocation}
                    isDetectingGps={isLocLoading}
                  />
                </div>
              </div>

              {/* Shop with Peace of Mind (Accordion Drawer) */}
              <div className="fade-up border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                  type="button" 
                  onClick={() => setPeaceOpen(!peaceOpen)} 
                  className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 text-left cursor-pointer"
                >
                  <span className="text-xs font-display font-black uppercase tracking-wider text-slate-800" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Shop with Peace of Mind
                  </span>
                  {peaceOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                
                {peaceOpen && (
                  <div className="p-4 space-y-3.5 bg-white text-xs text-slate-600 transition-all duration-300">
                    <div className="flex items-center gap-3 p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                      <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="font-bold text-emerald-800 leading-tight">1 Year Brand Warranty & Free Knocking Support Included</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                      <div className="flex flex-col items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <RefreshCw className="w-5 h-5 text-[#CC0000]" />
                        <span className="text-[10px] font-bold text-slate-700 leading-tight">7-day return support</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <IndianRupee className="w-5 h-5 text-emerald-600" />
                        <span className="text-[10px] font-bold text-slate-700 leading-tight">Cash on Delivery</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <span className="text-[10px] font-bold text-slate-700 leading-tight">RP Assured</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Highlights (Accordion Drawer) */}
              <div className="fade-up border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                  type="button" 
                  onClick={() => setHighlightsOpen(!highlightsOpen)} 
                  className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 text-left cursor-pointer"
                >
                  <span className="text-xs font-display font-black uppercase tracking-wider text-slate-800" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Product Highlights
                  </span>
                  {highlightsOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                
                {highlightsOpen && (
                  <div className="p-4 bg-white space-y-3 transition-all duration-300">
                    <ul className="space-y-2.5 text-xs">
                      {productHighlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-700">
                          <span className="text-[#CC0000] font-black text-sm leading-none">•</span>
                          <div>
                            <span className="font-bold text-slate-900 mr-1.5">{item.label}:</span>
                            <span className="text-slate-600 font-medium">{item.text}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Configurator */}
              <div className="space-y-5 fade-up pt-2">
                
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select Color</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {product.colors.map((c) => (
                        <button type="button"
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border-2 transition-colors cursor-pointer ${
                            selectedColor === c 
                              ? "bg-primary text-white border-primary" 
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex justify-between items-center">
                      <span>Select Jersey Size *</span>
                      <button type="button" className="text-accent underline text-[11px] cursor-pointer font-bold">Size Guide</button>
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {product.sizes.map((s) => (
                        <button type="button"
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                            selectedSize === s 
                              ? "bg-[#CC0000] text-white border-[#CC0000] shadow-md shadow-[#CC0000]/30" 
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-primary"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Quantity</h4>
                  <div className="flex items-center gap-4 border-2 border-slate-200 rounded-lg px-3 py-1.5 w-28 bg-white shadow-sm">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-500 hover:text-[#CC0000] cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-sm font-bold flex-grow text-center">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(quantity + 1)} className="text-slate-500 hover:text-[#CC0000] cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now (Flipkart Style Colors) */}
              <div className="pt-6 fade-up grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100">
                <button 
                  ref={addToCartRef}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full py-4 bg-white border border-slate-300 hover:bg-slate-50 text-[#111] rounded-xl font-display font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer transition-colors"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                </button>

                <button 
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-full py-4 bg-[#ffc107] hover:bg-[#ffb300] text-[#111] rounded-xl font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow shadow-amber-200/50 disabled:opacity-50 cursor-pointer transition-colors"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  <Zap className="w-4 h-4 fill-current text-[#111]" />
                  <span>{product.stock === 0 ? "Out of Stock" : `Buy Now at ₹${activePrice.toLocaleString("en-IN")}`}</span>
                </button>
              </div>

              {/* Bulk / Team Order Direct WhatsApp Option */}
              {isJerseyOrApparel && (
                <div className="pt-4 fade-up">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#111111] text-white border border-slate-700/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🏏</span>
                        <span className="font-display font-black text-sm uppercase tracking-wider text-amber-400" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                          Ordering for a Team, Club or Academy?
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Get bulk wholesale discounts, custom sponsor logos, and instant WhatsApp quotation. (Min 10 jerseys)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsBulkModalOpen(true)}
                      className="shrink-0 w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-display font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                    >
                      <Users className="w-4 h-4" />
                      <span>Bulk / Team Order on WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 fade-up">
                <p className="text-[11px] text-slate-500 font-medium">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* EXPANDABLE SPECIFICATIONS ACCORDION SECTION */}
        <ProductAccordionSection product={product} />

      </div>

      {/* MORE LIKE THIS */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 py-16 bg-white border-t border-slate-200">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-10 text-primary">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} className="group block bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all duration-300 hover:shadow-xl p-4">
                  <div className="aspect-[4/5] bg-slate-50 rounded-lg overflow-hidden mb-4 relative p-4 flex items-center justify-center mix-blend-multiply">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="font-bold text-sm text-primary line-clamp-1 mb-1 group-hover:text-accent transition-colors">{p.name}</h4>
                  <p className="font-black text-primary">₹{p.price.toLocaleString('en-IN')}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STICKY BUY BAR */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 transition-transform duration-500 ease-in-out flex justify-center ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-full max-w-[1600px] px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4">
            <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-contain bg-slate-50 rounded border border-slate-100" />
            <div>
              <p className="text-sm font-bold text-primary line-clamp-1">{product.name}</p>
              <p className="text-lg font-black text-primary">₹{product.price.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          <div className="flex-1 md:flex-none flex items-center gap-4 justify-between md:justify-end">
            <div className="flex flex-col md:hidden">
              <span className="text-xs text-slate-500">Total Price</span>
              <span className="text-lg font-black text-primary">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-accent transition-colors flex items-center gap-2 shadow-md"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* BULK JERSEY / TEAM ORDER MODAL */}
      <BulkJerseyOrderModal
        product={product}
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />

    </div>
  );
}
