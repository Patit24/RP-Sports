"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  ArrowRight, Star, ShoppingCart, MapPin, ChevronRight, ChevronLeft,
  ShieldCheck, Truck, RotateCcw, Award, Users, Zap, Trophy,
  Flame, Sparkles, Eye, Glasses, Shirt, Navigation, X
} from "lucide-react";
import { CATEGORIES } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";
import DualFeatureBanners from "@/components/DualFeatureBanners";
import ShoeCategoryShowcase from "@/components/ShoeCategoryShowcase";
import CustomerTestimonialsVideo from "@/components/CustomerTestimonialsVideo";
import { useCustomerLocation } from "@/lib/useCustomerLocation";

// ── Flipkart Style Category Icon Navigation Data ──
const STORY_CATEGORIES = [
  { id: "for-you", name: "For You", icon: "⭐", href: "/shop", isHighlight: true },
  { id: "cricket", name: "Cricket Bats", icon: "🏏", href: "/shop?category=cricket&subcategory=bats" },
  { id: "football", name: "Football & Boots", icon: "⚽", href: "/shop?category=football" },
  { id: "badminton", name: "Badminton Gear", icon: "🏸", href: "/shop?category=badminton" },
  { id: "jerseys", name: "Custom Jerseys", icon: "👕", href: "/shop?category=jerseys" },
  { id: "caps", name: "Sports Caps", icon: "🧢", href: "/shop?category=jerseys&subcategory=caps" },
  { id: "sunglasses", name: "Sports Optics", icon: "🕶️", href: "/shop?category=cricket&subcategory=sunglasses" },
  { id: "shoes", name: "Footwear & Turf", icon: "👟", href: "/shop?category=football&subcategory=boots" },
  { id: "trophies", name: "Trophies & Awards", icon: "🏆", href: "/shop?category=trophies" },
  { id: "wholesale", name: "Bulk Wholesale", icon: "👥", href: "/bulk-orders" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% Authentic Gear", sub: "Handpicked Genuine Products" },
  { icon: Truck, label: "24-Hour Express Shipping", sub: "Kolkata & Pan-India Dispatch" },
  { icon: RotateCcw, label: "7-Day Easy Returns", sub: "Hassle-Free Replacement" },
  { icon: Award, label: "Free Bat Knocking", sub: "Pre-Pressed & Machine Oiled" },
];

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualPinInput, setManualPinInput] = useState("");
  
  const { products, categories } = useStore();
  const [activeProductTab, setActiveProductTab] = useState<string>("all");
  const browsingCarouselRef = useRef<HTMLDivElement>(null);

  // Customer Location Hook
  const { 
    city: customerCity, 
    pincode: customerPincode, 
    formattedAddress: customerAddress, 
    setPincodeManual, 
    detectGpsLocation, 
    isLoading: isLocLoading 
  } = useCustomerLocation();

  // ── Hero Carousel Slides ──
  const HERO_SLIDES = [
    {
      image: "/products/hero_slide_1.jpg",
      tag: "Kolkata Match Season 2026",
      title: "CRAFTED FOR MAXIMUM\nSWEET-SPOT POWER.",
      sub: "Grade-1 English & Kashmir Willow Cricket Bats. Hand-selected, custom-pressed & pre-knocked for explosive boundaries.",
      ctaPrimary: { label: "Explore Cricket Bats", href: "/shop?category=cricket" },
      ctaSecondary: { label: "Custom Jersey Builder", href: "/jersey-builder" },
      badge: "Grade-1 Willow",
      badgeColor: "bg-[#CC0000]"
    },
    {
      image: "/products/cricket_jersey_premium.jpg",
      tag: "Custom Team Kits & Academy Orders",
      title: "MATCH-READY CUSTOM\nTEAM JERSEYS.",
      sub: "Sublimated full-color team jerseys with player names, sponsor logos, and breathable moisture-wicking poly.",
      ctaPrimary: { label: "Order Team Kits", href: "/jersey-builder" },
      ctaSecondary: { label: "Bulk Wholesale Page", href: "/bulk-orders" },
      badge: "Min 10 Jerseys",
      badgeColor: "bg-emerald-600"
    },
    {
      image: "/products/category_badminton.jpg",
      tag: "Tournament Pro Series",
      title: "EXPLOSIVE SMASHES &\nCOURT SPEED.",
      sub: "RP SmashVolt 99 & NanoBlade 700 High-Modulus Carbon Rackets supporting up to 32 lbs high string tension.",
      ctaPrimary: { label: "Shop Badminton", href: "/shop?category=badminton" },
      ctaSecondary: { label: "View All Gear", href: "/shop" },
      badge: "High-Modulus Carbon",
      badgeColor: "bg-amber-600"
    },
    {
      image: "/products/shoe_turf.jpg",
      tag: "Pro Football Footwear",
      title: "PRECISION GRIP ON\nTURF & NATURAL GRASS.",
      sub: "Engineered with micro-textured 3D strike skins and conical stud geometry for rapid acceleration on pitch.",
      ctaPrimary: { label: "Shop Football Boots", href: "/shop?category=football" },
      ctaSecondary: { label: "Explore Footwear", href: "/shop" },
      badge: "FG & Turf Cleats",
      badgeColor: "bg-blue-600"
    }
  ];

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [HERO_SLIDES.length]);

  // Filtered Products for Suggested Section
  const filteredSuggestedProducts = useMemo(() => {
    const list = products || [];
    if (activeProductTab === "cricket") {
      return list.filter((p) => p.category === "cricket").slice(0, 8);
    }
    if (activeProductTab === "football") {
      return list.filter((p) => p.category === "football").slice(0, 8);
    }
    if (activeProductTab === "badminton") {
      return list.filter((p) => p.category === "badminton").slice(0, 8);
    }
    if (activeProductTab === "jerseys") {
      return list.filter((p) => p.category === "jerseys").slice(0, 8);
    }
    if (activeProductTab === "sunglasses") {
      return list.filter((p) => p.subcategory === "sunglasses" || p.subcategory === "caps").slice(0, 8);
    }
    return list.slice(0, 12);
  }, [products, activeProductTab]);

  // Continue browsing products (curated spotlight items)
  const continueBrowsingProducts = useMemo(() => {
    const list = products || [];
    return list.slice(0, 10);
  }, [products]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (browsingCarouselRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      browsingCarouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#F1F2F4] text-[#111111] min-h-screen font-sans">

      {/* ─── 1. FLIPKART STYLE TOP SUB-BRAND & QUICK SERVICE PILLS BAR ─── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 overflow-x-auto custom-scrollbar">
          
          {/* Sub-brand / Service Pills (Left) */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#CC0000] text-white font-display font-black text-xs uppercase tracking-wider shadow-sm transition-all hover:bg-red-700"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>RP Sports</span>
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-display font-bold text-xs uppercase tracking-wider transition-colors"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <Truck className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>24H Express Kolkata</span>
            </Link>

            <Link
              href="/jersey-builder"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-display font-bold text-xs uppercase tracking-wider transition-colors"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <Shirt className="w-3.5 h-3.5 text-blue-600" />
              <span>Custom Kits</span>
            </Link>

            <Link
              href="/bulk-orders"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-display font-bold text-xs uppercase tracking-wider transition-colors"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bulk / Academy</span>
            </Link>

            <Link
              href="/shop?category=cricket&subcategory=sunglasses"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-display font-bold text-xs uppercase tracking-wider transition-colors"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <Glasses className="w-3.5 h-3.5 text-amber-600" />
              <span>Pro Optics</span>
            </Link>
          </div>

          {/* Location Delivery & RP Rewards Pill (Right) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-neutral-700 hover:text-[#CC0000] font-semibold bg-neutral-50 hover:bg-red-50/50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#CC0000] shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-[280px]">
                Deliver to: <span className="font-bold text-neutral-900">{customerCity} ({customerPincode})</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </button>

            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>250 RP Coins</span>
            </div>
          </div>

        </div>
      </section>


      {/* ─── 2. FLIPKART STYLE HORIZONTAL CATEGORY ICON STRIP ─── */}
      <section className="bg-white border-b border-slate-200/90 shadow-sm sticky top-20 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar no-scrollbar">
            {STORY_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="flex flex-col items-center gap-1.5 group shrink-0 px-2.5 py-1 rounded-xl hover:bg-neutral-50 transition-colors min-w-[72px]"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 group-hover:scale-105 shadow-sm border ${
                  cat.isHighlight
                    ? "bg-red-50 text-[#CC0000] border-red-200 group-hover:bg-[#CC0000] group-hover:text-white"
                    : "bg-neutral-100 group-hover:bg-[#CC0000] text-neutral-800 group-hover:text-white border-slate-200/80"
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-[11px] font-bold text-center leading-tight whitespace-nowrap transition-colors ${
                  cat.isHighlight ? "text-[#CC0000]" : "text-neutral-700 group-hover:text-[#CC0000]"
                }`}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ─── 3. FLIPKART STYLE 3-COLUMN HERO SECTION ─── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* LEFT COLUMN: Feature Promo Card (3 Cols) */}
          <div className="lg:col-span-3">
            <Link
              href="/shop?category=cricket"
              className="group relative h-full min-h-[300px] lg:min-h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#CC0000] via-[#990000] to-[#111111] p-6 text-white flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-500 block border border-red-500/20"
            >
              {/* Background texture & accent circles */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/40 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-amber-300 text-[10px] font-display font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-white/10">
                  <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
                  Kashmir Willow Power Days
                </div>

                <h2 
                  className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white leading-none mb-2"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  EXPLORE GRADE-1\nHANDCRAFTED BATS
                </h2>

                <p className="text-white/80 text-xs sm:text-sm font-medium line-clamp-3">
                  Pre-knocked, oiled & balanced for explosive sweet-spot punch. Starting from ₹2,499.
                </p>
              </div>

              {/* Product preview & bottom CTA */}
              <div className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/70 block">Starting At</span>
                    <span className="text-2xl font-display font-black text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      ₹2,499
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-white text-[#CC0000] font-display font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl group-hover:bg-amber-300 group-hover:text-black transition-colors shadow-sm" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Shop Bats <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </div>


          {/* CENTER COLUMN: Main Carousel Banner (6 Cols) */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[340px] lg:min-h-[420px] rounded-2xl overflow-hidden bg-neutral-950 shadow-md border border-slate-200">
              {HERO_SLIDES.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                    idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
                  />
                  {/* Studio Dark Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-10" />

                  {/* Slide Content */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 sm:p-10 max-w-xl">
                    <span className={`inline-flex items-center self-start text-white text-[10px] font-display font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-md ${slide.badgeColor}`}>
                      {slide.tag}
                    </span>

                    <h2 
                      className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white tracking-tight leading-[0.95] mb-3 whitespace-pre-line drop-shadow-md"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                    >
                      {slide.title}
                    </h2>

                    <p className="text-white/80 text-xs sm:text-sm mb-6 line-clamp-2 max-w-md">
                      {slide.sub}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={slide.ctaPrimary.href}
                        className="bg-[#CC0000] hover:bg-red-700 text-white font-display font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                      >
                        {slide.ctaPrimary.label} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={slide.ctaSecondary.href}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-display font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all backdrop-blur-md"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                      >
                        {slide.ctaSecondary.label}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Slider Dots & Navigation Controls */}
              <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlide ? "w-8 bg-[#CC0000]" : "w-2 bg-white/40 hover:bg-white/80"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>


          {/* RIGHT COLUMN: Spotlight Deals Card (3 Cols) */}
          <div className="lg:col-span-3">
            <Link
              href="/shop?category=cricket&subcategory=sunglasses"
              className="group relative h-full min-h-[300px] lg:min-h-[420px] rounded-2xl overflow-hidden bg-neutral-950 p-6 text-white flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-500 block border border-slate-800"
            >
              <img
                src="/images/feature_sunglasses.jpg"
                alt="Pro Sports Sunglasses"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

              <div className="relative z-20">
                <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-display font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-sm">
                  Limited Season Drop
                </div>

                <h2 
                  className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white leading-none mb-2"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  PRO OPTICS &\nSUNGLASSES
                </h2>

                <p className="text-white/80 text-xs sm:text-sm font-medium line-clamp-3">
                  UV400 polarized mirrored sunglasses for high-velocity ball tracking and outfield glare control.
                </p>
              </div>

              <div className="relative z-20 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Up To 40% Off</span>
                    <span className="text-2xl font-display font-black text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      From ₹1,199
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-[#CC0000] text-white font-display font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl group-hover:bg-red-700 transition-colors shadow-sm" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Shop Optics <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </section>


      {/* ─── 4. FLIPKART STYLE VIBRANT HORIZONTAL CAROUSEL: "STILL LOOKING FOR THESE?" ─── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-gradient-to-r from-[#CC0000] via-[#B30000] to-[#800000] rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
          
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Flame className="w-4 h-4 fill-current text-amber-300" />
              </div>
              <div>
                <h3 
                  className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white leading-none"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  Still looking for these?
                </h3>
                <p className="text-white/80 text-[11px] font-medium hidden sm:block">
                  Trending matchday equipment & fan favorites across Kolkata
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                href="/shop" 
                className="text-xs font-display font-bold uppercase tracking-wider text-white hover:text-amber-300 transition-colors"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                View All →
              </Link>
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCarousel("left")}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel("right")}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Scrolling Product Tiles */}
          <div 
            ref={browsingCarouselRef}
            className="flex items-stretch gap-3.5 overflow-x-auto custom-scrollbar no-scrollbar pb-1"
          >
            {continueBrowsingProducts.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="group flex-shrink-0 w-44 sm:w-52 bg-white rounded-xl p-3.5 text-neutral-900 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="aspect-square bg-gradient-to-b from-neutral-50 to-neutral-100/60 rounded-lg p-3 flex items-center justify-center overflow-hidden mb-2.5 relative border border-slate-100">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500"
                  />
                  {p.stock === 0 ? (
                    <span className="absolute top-1.5 left-1.5 text-[8px] font-display font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-950 text-rose-300">
                      Out of Stock
                    </span>
                  ) : p.badge ? (
                    <span className="absolute top-1.5 left-1.5 text-[8px] font-display font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#CC0000] text-white">
                      {p.badge}
                    </span>
                  ) : null}
                </div>

                <div>
                  <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block truncate">
                    {p.brand}
                  </span>
                  <h4 
                    className="font-display font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1 group-hover:text-[#CC0000] transition-colors mb-1"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {p.name}
                  </h4>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-display font-black text-sm text-neutral-950" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    {p.mrp > p.price && (
                      <span className="text-[10px] font-mono text-neutral-400 line-through">
                        ₹{p.mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>


      {/* ─── 5. SUGGESTED FOR YOU / DEALS OF THE DAY WITH TAB FILTER ─── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-[#CC0000]" />
              <span className="text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Hand-Picked Recommendations
              </span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl font-display font-black uppercase text-neutral-950 tracking-tight leading-none"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              Suggested For You
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar no-scrollbar pb-1">
            {[
              { id: "all", label: "All Gear" },
              { id: "cricket", label: "🏏 Cricket" },
              { id: "football", label: "⚽ Football" },
              { id: "badminton", label: "🏸 Badminton" },
              { id: "jerseys", label: "👕 Jerseys & Caps" },
              { id: "sunglasses", label: "🕶️ Sunglasses" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveProductTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-black uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer ${
                  activeProductTab === tab.id
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-black border border-slate-200"
                }`}
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid using Ultra-Premium ProductCard component */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredSuggestedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-950 hover:text-white text-neutral-900 border border-slate-300 px-8 py-3.5 rounded-xl font-display font-black text-sm uppercase tracking-wider transition-all shadow-sm"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            Explore Complete Sports Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>


      {/* ─── 6. DUAL FEATURE BANNERS (PRO OPTICS & LEGACY HEADWEAR) ─── */}
      <DualFeatureBanners />


      {/* ─── 7. SHOE & FOOTWEAR SHOWCASE ─── */}
      <ShoeCategoryShowcase />


      {/* ─── 8. TEAM ACADEMY & BULK WHATSAPP BANNER ─── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-neutral-950 via-neutral-900 to-[#111111] rounded-2xl border border-neutral-800 p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-amber-400 font-display font-bold uppercase tracking-widest text-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Wholesale & Club Quotations
            </span>
            
            <h2 
              className="font-display font-black text-white uppercase text-3xl sm:text-5xl leading-none mb-4"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              ORDERING FOR A TEAM, CLUB OR ACADEMY?
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base mb-8 leading-relaxed">
              Get tiered bulk discounts, custom player name & number sublimation, multi-sponsor badge embroidery, and direct WhatsApp quotations within minutes.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/bulk-orders"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 hover:scale-105"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                <Users className="w-4 h-4" />
                <span>Bulk WhatsApp Quotation Page</span>
              </Link>

              <Link
                href="/jersey-builder"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-display font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all backdrop-blur-md"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                <span>3D Jersey Builder</span>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ─── 9. TRUST BADGES STRIP ─── */}
      <section className="bg-white border-y border-slate-200 py-6 my-6">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x divide-slate-100">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3.5 px-0 md:px-6 first:pl-0 last:pr-0">
                <div className="w-11 h-11 rounded-xl bg-red-50 text-[#CC0000] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 
                    className="text-sm font-display font-black uppercase text-neutral-900 tracking-wide"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {label}
                  </h4>
                  <p className="text-xs text-neutral-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─── 10. CUSTOMER TESTIMONIALS & REVIEWS ─── */}
      <CustomerTestimonialsVideo />


      {/* ─── LOCATION CHANGER MODAL ─── */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-black text-lg uppercase text-neutral-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Select Delivery Location
              </h3>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Enter your 6-digit delivery pincode to check exact express shipping timelines and stock availability.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={manualPinInput}
                onChange={(e) => setManualPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit pincode (e.g. 700028)..."
                className="flex-1 px-3.5 py-2 bg-neutral-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-neutral-900 outline-none focus:border-[#CC0000] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (manualPinInput.length === 6) {
                    setPincodeManual(manualPinInput);
                    setIsLocationModalOpen(false);
                    setManualPinInput("");
                  }
                }}
                disabled={manualPinInput.length !== 6}
                className="px-4 py-2 bg-[#CC0000] hover:bg-red-700 text-white font-display font-black text-xs uppercase rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                Apply
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  detectGpsLocation();
                  setIsLocationModalOpen(false);
                }}
                disabled={isLocLoading}
                className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-display font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                <Navigation className={`w-3.5 h-3.5 text-[#CC0000] ${isLocLoading ? "animate-spin" : ""}`} />
                <span>Use Current Live GPS Location</span>
              </button>
            </div>

            {/* Popular Kolkata Pincodes */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Popular Kolkata & Bengal Areas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "Dum Dum", pin: "700028" },
                  { name: "Belghoria", pin: "700056" },
                  { name: "Salt Lake", pin: "700091" },
                  { name: "New Town", pin: "700156" },
                  { name: "Howrah", pin: "711101" },
                  { name: "Barasat", pin: "700124" },
                ].map((item) => (
                  <button
                    key={item.pin}
                    type="button"
                    onClick={() => {
                      setPincodeManual(item.pin);
                      setIsLocationModalOpen(false);
                    }}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      customerPincode === item.pin
                        ? "bg-red-50 text-[#CC0000] border-red-300"
                        : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-slate-200"
                    }`}
                  >
                    {item.name} ({item.pin})
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
