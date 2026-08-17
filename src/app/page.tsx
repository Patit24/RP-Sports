"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  ArrowRight, Star, ShoppingCart, MapPin, Phone, Clock, ChevronRight,
  ShieldCheck, Truck, RotateCcw, Award, Users, Package, Zap, Trophy
} from "lucide-react";
import { mockProducts, CATEGORIES, BRANDS } from "@/lib/mockData";
import DualFeatureBanners from "@/components/DualFeatureBanners";
import ShoeCategoryShowcase from "@/components/ShoeCategoryShowcase";
import CustomerTestimonialsVideo from "@/components/CustomerTestimonialsVideo";




const FEATURED_CATEGORIES = [
  { id: "cricket",   name: "Cricket",    image: "/products/cat_cricket.jpg",   desc: "Bats, Pads, Helmets, Gloves & More" },
  { id: "football",  name: "Football",   image: "/products/cat_football.jpg",  desc: "Balls, Boots, Shin Guards & More" },
  { id: "badminton", name: "Badminton",  image: "/products/cat_badminton.jpg", desc: "Rackets, Shuttlecocks & Accessories" },
  { id: "jerseys",   name: "Jerseys",    image: "/products/cat_jerseys.jpg",   desc: "Custom Kits, Team Wear & Apparel" },
  { id: "shoes",     name: "Sports Shoes", image: "/products/rp_screenshot_2.png", desc: "Cricket Spikes, Football Boots & More" },
  { id: "awards",    name: "Trophies",   image: "/products/generated_trophy.jpg", desc: "Awards, Medals & Engraving" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% Authentic", sub: "Genuine Products Only" },
  { icon: Truck,       label: "Quick Delivery", sub: "Pan India Shipping" },
  { icon: RotateCcw,   label: "Easy Returns",   sub: "7-Day Return Policy" },
  { icon: Award,       label: "Best Price",      sub: "Price Match Guarantee" },
];

const STATS = [
  { value: "5000+", label: "Happy Customers" },
  { value: "500+",  label: "Products In Stock" },
  { value: "15+",   label: "Top Brands" },
  { value: "10Yrs", label: "Serving Kolkata" },
];

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { products, categories } = useStore();
  const [activeProductTab, setActiveProductTab] = useState<"featured" | "bestseller" | "trending" | "new">("featured");

  const displayedProducts = useMemo(() => {
    const list = products || [];
    if (activeProductTab === "bestseller") {
      const filtered = list.filter((p: any) => p.isBestSeller || p.badge === "Bestseller");
      return filtered.length > 0 ? filtered.slice(0, 8) : list.slice(0, 4);
    }
    if (activeProductTab === "trending") {
      const filtered = list.filter((p: any) => p.badge === "Trending" || p.rating >= 4.8 || p.badge === "Pro Edition");
      return filtered.length > 0 ? filtered.slice(0, 8) : list.slice(0, 4);
    }
    if (activeProductTab === "new") {
      const filtered = list.filter((p: any) => p.isNew || p.badge === "New Arrival" || p.badge === "New");
      return filtered.length > 0 ? filtered.slice(0, 8) : list.slice(0, 4);
    }
    return list.filter((p: any) => p.featured).slice(0, 8);
  }, [products, activeProductTab]);

  const activeFeaturedCategories = categories && categories.length > 0
    ? categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        image: c.banner || "/category_cricket_1783225297200.jpg",
        desc: c.subcategories ? c.subcategories.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ") : "Explore items"
      }))
    : FEATURED_CATEGORIES;

  const SLIDES = [
    {
      image: "/products/hero_slide_1.jpg",
      eyebrow: "Kolkata's #1 Cricket Store • Dumdum",
      title: "CRAFTED FOR\nMAXIMUM POWER.",
      sub: "Grade-1 English & Kashmir Willow Cricket Bats. Hand-selected, custom-pressed & pre-knocked for explosive boundaries.",
      cta1: { label: "Shop Bats", href: "/shop?category=cricket" },
      cta2: { label: "View Collection", href: "/shop" },
      badge: "Grade-1 Willow"
    },
    {
      image: "/products/hero_slide_2.jpg",
      eyebrow: "Pro Series • Player Grade Willow",
      title: "DOMINATE THE\nMATCH DAY.",
      sub: "Used by first-class and league players across Bengal. Experience unmatched balance, sweet-spot ping, and lightweight pickup.",
      cta1: { label: "Explore Pro Bats", href: "/shop?category=cricket" },
      cta2: { label: "Custom Knocking", href: "/contact" },
      badge: "Pro Player Series"
    },
    {
      image: "/products/hero_slide_3.jpg",
      eyebrow: "Handcrafted Willow Selection",
      title: "FIND YOUR\nPERFECT BAT.",
      sub: "Explore our extensive range of RP Elite, 7070, AA & KD Cricket Bats. Tested for quality and built for run-machines.",
      cta1: { label: "View All Bats", href: "/shop" },
      cta2: { label: "Visit Dumdum Shop", href: "/contact" },
      badge: "Handcrafted Range"
    },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">

      {/* ─── HERO CAROUSEL ─── */}
      <section className="relative w-full h-[88vh] min-h-[580px] max-h-[800px] overflow-hidden bg-[#0A0A0A]">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              idx === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
            }`}
          >
            {/* Dark studio vignette gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 z-10" />
            
            <img
              src={slide.image}
              alt={slide.title}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-10000 ease-out ${
                idx === currentSlide ? "scale-105" : "scale-100"
              }`}
            />

            {/* Slide content container */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
              <div className="max-w-2xl">
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 bg-[#CC0000]/15 border border-[#CC0000]/40 px-3.5 py-1.5 rounded-full mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#CC0000] animate-pulse"></span>
                  <span className="text-[#FF3333] font-display font-bold uppercase tracking-widest text-xs" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {slide.eyebrow}
                  </span>
                </div>

                {/* Main Headline */}
                <h1
                  className="text-white font-black uppercase tracking-tight mb-6 drop-shadow-2xl whitespace-pre-line"
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
                    lineHeight: 0.94,
                    fontWeight: 900,
                  }}
                >
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-white/80 text-base md:text-lg font-normal mb-8 max-w-xl leading-relaxed">
                  {slide.sub}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link href={slide.cta1.href} className="btn-primary text-sm shadow-lg shadow-[#CC0000]/30 hover:scale-105 transition-transform">
                    {slide.cta1.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={slide.cta2.href}
                    className="btn-outline text-sm border-white/30 text-white hover:border-[#CC0000] hover:bg-[#CC0000] hover:text-white transition-all"
                  >
                    {slide.cta2.label}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Bottom Bar Controls & Info */}
        <div className="absolute bottom-6 left-6 md:left-16 lg:left-24 right-6 md:right-16 z-30 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
          
          {/* Slide Navigation & Indicator */}
          <div className="flex items-center gap-4">
            <span className="text-white/40 font-display font-bold text-sm tracking-wider" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              0{currentSlide + 1} <span className="text-white/20">/</span> 0{SLIDES.length}
            </span>
            <div className="flex gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    idx === currentSlide ? "w-10 bg-[#CC0000]" : "w-4 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Location & Store Info Badge */}
          <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md border border-white/15 px-4 py-2 text-white text-xs font-medium">
            <MapPin className="w-4 h-4 text-[#CC0000] flex-shrink-0" />
            <span>Dumdum, Kolkata — Visit Store Near Station</span>
          </div>

        </div>
      </section>


      {/* ─── TRUST STRIP ─── */}
      <div className="bg-secondary text-white py-4 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-white/10">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 px-0 md:px-8 first:pl-0 last:pr-0">
              <Icon className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-display font-bold uppercase tracking-wide">{label}</p>
                <p className="text-xs text-white/50">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="py-16 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary font-display font-bold uppercase tracking-widest text-sm mb-2">Explore</p>
            <h2 className="section-heading text-4xl md:text-6xl text-secondary">Shop By<br/>Category</h2>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-sm font-display font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors">
            All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {activeFeaturedCategories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="group relative aspect-square overflow-hidden bg-muted"
            >
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-white font-display font-extrabold uppercase text-lg leading-none">{cat.name}</h3>
                <p className="text-white/60 text-[10px] mt-1 leading-snug hidden sm:block">{cat.desc}</p>
              </div>
              <div className="absolute top-3 right-3 w-7 h-7 bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── DUAL FEATURE BANNERS (PRO OPTICS & LEGACY HEADWEAR) ─── */}
      <DualFeatureBanners />

      {/* ─── DYNAMIC SHOES & FOOTWEAR SHOWCASE ─── */}
      <ShoeCategoryShowcase />


      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-16 px-6 md:px-12 bg-muted stripe-bg">

        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary font-display font-bold uppercase tracking-widest text-sm mb-2">Hand-picked</p>
              <h2 className="section-heading text-4xl md:text-6xl text-secondary">Featured<br/>Products</h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-sm font-display font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tab Selector buttons */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-8 border-b border-slate-200/80 pb-4">
            <button
              onClick={() => setActiveProductTab("featured")}
              className={`px-4 py-2 text-sm font-display font-bold uppercase tracking-wider transition-all duration-300 border-b-2 cursor-pointer ${
                activeProductTab === "featured"
                  ? "border-[#CC0000] text-[#CC0000]"
                  : "border-transparent text-slate-500 hover:text-secondary"
              }`}
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveProductTab("bestseller")}
              className={`px-4 py-2 text-sm font-display font-bold uppercase tracking-wider transition-all duration-300 border-b-2 cursor-pointer ${
                activeProductTab === "bestseller"
                  ? "border-[#CC0000] text-[#CC0000]"
                  : "border-transparent text-slate-500 hover:text-secondary"
              }`}
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              Best Selling
            </button>
            <button
              onClick={() => setActiveProductTab("trending")}
              className={`px-4 py-2 text-sm font-display font-bold uppercase tracking-wider transition-all duration-300 border-b-2 cursor-pointer ${
                activeProductTab === "trending"
                  ? "border-[#CC0000] text-[#CC0000]"
                  : "border-transparent text-slate-500 hover:text-secondary"
              }`}
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              Trending Products
            </button>
            <button
              onClick={() => setActiveProductTab("new")}
              className={`px-4 py-2 text-sm font-display font-bold uppercase tracking-wider transition-all duration-300 border-b-2 cursor-pointer ${
                activeProductTab === "new"
                  ? "border-[#CC0000] text-[#CC0000]"
                  : "border-transparent text-slate-500 hover:text-secondary"
              }`}
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              New Arrivals
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {displayedProducts.map((product: any) => (
              <Link key={product.id} href={`/product/${product.id}`} className="product-card group">
                {/* Image */}
                <div className="relative aspect-square bg-white overflow-hidden hover-zoom-container">
                  <img src={product.images[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                  {product.badge && (
                    <span className={`absolute top-2 left-2 text-[10px] font-display font-bold uppercase tracking-wider px-2.5 py-1 z-10 ${
                      product.badge === "Sale" || product.badge === "Special Sale" ? "badge-sale" :
                      product.badge === "New" || product.badge === "New Arrival" ? "badge-new" : "badge-limited"
                    }`}>
                      {product.badge}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <button className="w-full bg-[#CC0000] text-white font-display font-bold uppercase text-xs tracking-wider py-2.5 flex items-center justify-center gap-2">
                      <ShoppingCart className="w-3.5 h-3.5" /> Quick Add
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3 md:p-4">
                  <p className="text-[10px] text-[#CC0000] font-display font-bold uppercase tracking-widest mb-1">{product.brand}</p>
                  <h4 className="font-semibold text-secondary text-sm leading-tight mb-2 line-clamp-2">{product.name}</h4>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({product.reviewsCount || product.reviewCount || 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#CC0000] font-display font-extrabold text-lg">₹{product.price.toLocaleString("en-IN")}</span>
                      {product.mrp > product.price && (
                        <span className="text-gray-400 text-xs line-through ml-2">₹{product.mrp.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                    {product.mrp > product.price && (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5">
                        {Math.round((1 - product.price / product.mrp) * 100)}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop" className="btn-primary inline-flex">
              Browse All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PROMO BANNER – PRO MATCH GEAR ─── */}
      <section className="py-16 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="relative overflow-hidden bg-secondary rounded-none" style={{minHeight: '420px'}}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40 z-10" />
          <img src="/hero-banner.jpg" alt="RP Sports Match Gear" className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative z-20 p-10 md:p-16 lg:p-20 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-primary font-display font-bold uppercase tracking-widest text-xs mb-6">
              <span className="w-6 h-0.5 bg-primary"></span> Professional Gear
            </span>
            <h2 className="font-display font-black text-white uppercase text-5xl md:text-7xl leading-none mb-6">
              PRO MATCH EQUIPMENT
            </h2>
            <p className="text-white/75 text-base md:text-lg mb-10 leading-relaxed">
              Explore hand-crafted Grade-1 English Willow cricket bats, professional tournament balls, spike shoes and genuine athletic gear directly from Kolkata&apos;s trusted sports hub.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop?category=cricket" className="btn-primary">
                Shop Cricket Bats <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="https://wa.me/919876543210?text=Hi%20RP%20Sports%2C%20I%20want%20to%20enquire%20about%20Bulk%20Team%20Orders"
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-outline border-white/40 text-white hover:border-primary hover:bg-primary"
              >
                Bulk Team Orders (WhatsApp)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT / BRAND AMBASSADOR ─── */}
      <section className="py-20 px-6 md:px-12 bg-secondary text-white">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="relative flex gap-4 md:gap-6">
            <div className="absolute -inset-4 bg-primary/10 -z-10 skew-y-2"></div>
            <div className="flex-1 overflow-hidden" style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)" }}>
              <img src="/owner-1.jpg" alt="Raj Paswan — RP Sports" className="w-full h-full object-cover aspect-[3/4] hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="flex-1 overflow-hidden mt-10" style={{ clipPath: "polygon(0 8%, 100% 0, 100% 100%, 0 92%)" }}>
              <img src="/owner-2.jpg" alt="Raj Paswan — RP Sports" className="w-full h-full object-cover aspect-[3/4] hover:scale-105 transition-transform duration-700" />
            </div>
            {/* Red accent */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary flex items-center justify-center">
              <div className="text-center">
                <div className="font-display font-black text-2xl leading-none">10+</div>
                <div className="text-[10px] uppercase tracking-wider text-white/70">Years</div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <span className="inline-flex items-center gap-2 text-primary font-display font-bold uppercase tracking-widest text-sm mb-6">
              <span className="w-6 h-0.5 bg-primary"></span> Meet The Founder
            </span>
            <h2 className="font-display font-black text-white uppercase text-5xl md:text-6xl leading-none mb-6">
              RAJ PASWAN<br/><span className="text-primary">RP SPORTS</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg mb-4 leading-relaxed">
              Born and raised in Dumdum, Kolkata, Raj Paswan started RP Sports with one mission — to give every aspiring athlete in North Kolkata access to professional-grade sports equipment at fair prices.
            </p>
            <p className="text-white/70 text-base mb-8 leading-relaxed">
              From a small shop near Dumdum station to Kolkata's most trusted sports destination, the journey of RP Sports is a testament to the passion and pride of every sportsperson in the city of joy.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10 border-t border-white/10 pt-8">
              {STATS.map(({ value, label }) => (
                <div key={label} className="stat-box">
                  <p className="font-display font-black text-3xl text-primary leading-none">{value}</p>
                  <p className="text-white/60 text-xs uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-primary inline-flex">
              Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── REAL CUSTOMER TESTIMONIAL VIDEOS ─── */}
      <CustomerTestimonialsVideo />

      {/* ─── VISIT US / STORE INFO ─── */}
      <section className="py-16 px-6 md:px-12 bg-white border-y border-gray-100">

        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 md:divide-x divide-gray-100">
            <div className="flex items-start gap-5 md:pr-8">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-extrabold uppercase text-lg text-secondary mb-1">Store Location</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Near Dumdum Metro Station,<br/>Dumdum, Kolkata – 700028<br/>West Bengal, India</p>
              </div>
            </div>
            <div className="flex items-start gap-5 md:px-8">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-extrabold uppercase text-lg text-secondary mb-1">Store Hours</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Mon – Sat: 10:00 AM – 9:00 PM<br/>Sunday: 11:00 AM – 7:00 PM<br/>Public Holidays: Call ahead</p>
              </div>
            </div>
            <div className="flex items-start gap-5 md:pl-8">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-extrabold uppercase text-lg text-secondary mb-1">Contact Us</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  <a href="tel:+919876543210" className="text-primary font-semibold hover:underline">+91 98765 43210</a><br/>
                  <a href="mailto:info@rpsports.in" className="hover:text-primary transition-colors">info@rpsports.in</a><br/>
                  WhatsApp orders welcome
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BRAND MARQUEE ─── */}
      <section className="py-8 bg-muted border-b border-gray-200 overflow-hidden">
        <div className="flex overflow-x-hidden">
          <div className="animate-marquee flex items-center gap-12 md:gap-20">
            {[...BRANDS, "SS", "SG", "MRF", "Kookaburra", "Gray-Nicolls", "GM", "Nike", "Adidas", ...BRANDS, "SS", "SG", "MRF", "Kookaburra", "Gray-Nicolls", "GM", "Nike", "Adidas"].map((b, i) => (
              <span key={i} className="text-sm font-display font-extrabold uppercase tracking-widest text-gray-400 whitespace-nowrap flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE RP SPORTS ─── */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-display font-bold uppercase tracking-widest text-sm mb-2">Why Us</p>
            <h2 className="section-heading text-4xl md:text-5xl text-secondary">Why Kolkata Trusts<br/>RP Sports</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award,   title: "Genuine Products",      desc: "Every product is 100% original sourced directly from brands and authorized distributors." },
              { icon: Users,   title: "Serving Since 2015",    desc: "Over 10 years of serving cricketers, footballers and athletes across North Kolkata." },
              { icon: Package, title: "Huge Selection",        desc: "500+ products covering cricket, football, badminton, footwear, trophies and custom jerseys." },
              { icon: Zap,     title: "Expert Guidance",       desc: "Our staff are athletes themselves — we help you choose the right gear for your level and game." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 border border-gray-100 hover:border-primary transition-colors group">
                <div className="w-12 h-12 bg-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-extrabold uppercase text-lg text-secondary mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
