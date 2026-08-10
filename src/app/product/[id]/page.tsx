"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Star, ShieldCheck, Heart, Truck, Plus, Minus, ArrowRight, ShoppingCart, Share2, Zap } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORIES } from "@/lib/mockData";
import ShiprocketPincodeWidget from "@/components/ShiprocketPincodeWidget";
import ProductAccordionSection from "@/components/ProductAccordionSection";



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
      selectedColor,
      selectedSize
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
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 bg-white md:rounded-2xl md:shadow-sm md:border border-slate-200 overflow-hidden relative">
          
          {/* LEFT: Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col relative bg-white">
            
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

            <div 
              className="w-full aspect-square lg:aspect-auto lg:h-[700px] flex items-center justify-center p-8 md:p-16 relative group cursor-crosshair overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-100"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={product.images[activeImgIdx]} 
                alt={product.name} 
                className={`w-full h-full object-contain mix-blend-multiply drop-shadow-xl ${
                  showZoom ? 'transition-none' : 'transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-105'
                }`}
                style={
                  showZoom 
                    ? {
                        transform: 'scale(2.5)',
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                      }
                    : {}
                }
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 p-4 md:p-6 overflow-x-auto custom-scrollbar border-t border-slate-100 lg:border-t-0 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:bg-gradient-to-t lg:from-white lg:to-transparent lg:pb-8 lg:border-r">
              {product.images.map((img, idx) => (
                <button type="button"
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-20 h-20 shrink-0 bg-slate-50 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImgIdx === idx ? "border-accent shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain p-2 mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="w-full lg:w-1/2 p-6 md:p-12 xl:p-16 flex flex-col h-full bg-white">
            
            <div className="space-y-6 flex-grow">
              
              <div className="fade-up">
                <Link href={`/shop?brand=${product.brand}`} className="text-sm font-bold uppercase tracking-wider text-accent mb-2 inline-block hover:underline">
                  {product.brand}
                </Link>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary leading-tight mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                    <span className="text-sm font-bold">{product.rating}</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </div>
                  <span className="text-sm font-medium text-slate-500 underline cursor-pointer">{product.reviewsCount} Ratings & Reviews</span>
                </div>

                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-black text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.mrp > product.price && (
                    <>
                      <span className="text-xl line-through text-slate-400 mb-1">₹{product.mrp.toLocaleString('en-IN')}</span>
                      <span className="text-lg font-bold text-green-600 mb-1">({discount}% OFF)</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">Inclusive of all taxes</p>
              </div>

              <div className="fade-up py-6 border-y border-slate-100">
                <p className="text-base text-slate-600 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Configurator */}
              <div className="space-y-6 fade-up">
                
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-primary mb-3">Select Color</h4>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((c) => (
                        <button type="button"
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider border-2 transition-colors cursor-pointer ${
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
                    <h4 className="text-sm font-bold text-primary mb-3 flex justify-between items-center">
                      <span>Select Size</span>
                      <button type="button" className="text-accent underline text-xs cursor-pointer">Size Guide</button>
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((s) => (
                        <button type="button"
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold uppercase tracking-wider border-2 transition-colors cursor-pointer ${
                            selectedSize === s 
                              ? "bg-primary text-white border-primary" 
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
                  <h4 className="text-sm font-bold text-primary mb-3">Quantity</h4>
                  <div className="flex items-center gap-6 border-2 border-slate-200 rounded-lg px-4 py-2 w-32 bg-white">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-500 hover:text-primary cursor-pointer"><Minus className="w-4 h-4" /></button>
                    <span className="text-base font-bold flex-grow text-center">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(quantity + 1)} className="text-slate-500 hover:text-primary cursor-pointer"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="pt-6 fade-up grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  ref={addToCartRef}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-display font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer transition-colors"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                </button>

                <button 
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-full py-4 bg-[#CC0000] hover:bg-[#990000] text-white rounded-xl font-display font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#CC0000]/30 disabled:opacity-50 cursor-pointer transition-colors"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>{product.stock === 0 ? "Out of Stock" : "Buy Now"}</span>
                </button>
              </div>

              {/* Shiprocket Delivery Pincode Checker */}
              <div className="pt-6 fade-up">
                <ShiprocketPincodeWidget />
              </div>

              <div className="pt-6 fade-up space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-primary mb-1">100% Original Guarantee</h4>
                    <p className="text-slate-500 text-xs font-medium font-mono">Handcrafted Grade-1 willow directly from Dumdum, Kolkata store.</p>
                  </div>
                </div>
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

    </div>
  );
}
