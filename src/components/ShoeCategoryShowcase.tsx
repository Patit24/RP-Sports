"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Search, ChevronLeft, ChevronRight, ShoppingBag, Eye, Heart } from "lucide-react";

export default function ShoeCategoryShowcase() {
  const { products, addToCart, setQuickView, wishlist, toggleWishlist } = useStore();

  // Extract all shoe products from store dynamically (both mock & admin added)
  const shoeProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const sub = (p.subcategory || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      return cat.includes("shoe") || cat.includes("footwear") || sub.includes("shoe") || sub.includes("spike") || name.includes("shoe") || name.includes("spike");
    });
  }, [products]);

  // Extract unique subcategories for dynamic tabs
  const tabs = useMemo(() => {
    const setTabs = new Set<string>();
    setTabs.add("All Shoes");
    shoeProducts.forEach((p) => {
      if (p.subcategory) setTabs.add(p.subcategory);
    });
    return Array.from(setTabs);
  }, [shoeProducts]);

  const [activeTab, setActiveTab] = useState("All Shoes");
  const [scrollIdx, setScrollIdx] = useState(0);

  // Filter products by selected active tab
  const filteredProducts = useMemo(() => {
    if (activeTab === "All Shoes") return shoeProducts;
    return shoeProducts.filter((p) => (p.subcategory || "").toLowerCase() === activeTab.toLowerCase());
  }, [shoeProducts, activeTab]);

  const displayedProducts = filteredProducts.slice(scrollIdx, scrollIdx + 4);

  const handleNext = () => {
    if (scrollIdx + 4 < filteredProducts.length) {
      setScrollIdx(scrollIdx + 1);
    }
  };

  const handlePrev = () => {
    if (scrollIdx > 0) {
      setScrollIdx(scrollIdx - 1);
    }
  };

  return (
    <section className="bg-white py-12 md:py-20 px-4 md:px-8 border-t border-gray-100 relative">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Bar with Dynamic Tabs */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-gray-200 pb-5 mb-8 gap-4">
          <div>
            <span className="text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs block mb-1">
              Performance Athletic Footwear
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase text-[#111111] tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Sports Shoes Collection ({filteredProducts.length})
            </h2>
          </div>

          {/* Filter Tabs matching scssports.in header */}
          <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setScrollIdx(0);
                  }}
                  className={`text-xs md:text-sm font-display font-bold uppercase tracking-wider transition-all whitespace-nowrap pb-1 relative cursor-pointer ${
                    isActive
                      ? "text-[#111111] font-extrabold"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111111] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Carousel Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-sm font-medium">No shoes listed under "{activeTab}" yet.</p>
            <p className="text-xs text-gray-400 mt-1">Admin can add new products in this category from the Admin Panel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {displayedProducts.map((product) => {
              const discount = product.mrp > product.price 
                ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                : 0;

              const isWishlisted = wishlist.includes(product.id);

              return (
                <div 
                  key={product.id}
                  className="group bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Image Frame */}
                  <div className="relative aspect-square bg-[#F6F6F6] rounded-xl overflow-hidden p-3 md:p-6 flex items-center justify-center">
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#CC0000] text-white text-[9px] md:text-[10px] font-display font-bold uppercase px-1.5 md:px-2.5 py-0.5 md:py-1 rounded shadow-sm z-10">
                        -{discount}%
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 md:bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#CC0000] hover:border-[#CC0000] transition-colors z-10 cursor-pointer shadow-sm"
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isWishlisted ? "fill-[#CC0000] text-[#CC0000]" : ""}`} />
                    </button>

                    {/* Shoe Image */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                    />

                    {/* Hover Quick View Overlay (Desktop) */}
                    <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-3">
                      <button
                        onClick={() => setQuickView(product)}
                        className="w-10 h-10 rounded-full bg-white text-[#111111] hover:bg-[#CC0000] hover:text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                        title="Quick View"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToCart({ product, quantity: 1 })}
                        className="px-4 h-10 bg-[#111111] hover:bg-[#CC0000] text-white rounded-full text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>

                  {/* Card Content Footer */}
                  <div className="p-2.5 md:p-4 text-center flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] md:text-[10px] font-display font-bold uppercase tracking-widest text-gray-400 block mb-0.5 md:mb-1">
                        {product.brand}
                      </span>
                      <h3 className="font-display font-bold text-xs md:text-base text-[#111111] leading-snug line-clamp-2 hover:text-[#CC0000] transition-colors" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                        <Link href={`/product/${product.id}`}>
                          {product.name}
                        </Link>
                      </h3>
                    </div>

                    <div className="mt-3">
                      {/* Price Section */}
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-display font-black text-base text-[#CC0000]">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-gray-400 line-through font-medium">
                            ₹{product.mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {/* Color Swatch Circles */}
                      <div className="flex items-center justify-center gap-1.5 mt-2.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-gray-200 border border-gray-300 shadow-inner inline-block" title="Option 1" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#111111] border border-gray-400 inline-block" title="Option 2" />
                        {product.colors && product.colors.length > 2 && (
                          <span className="text-[9px] text-gray-400 font-bold">+{product.colors.length - 2}</span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Progress Line & Prev/Next Arrows */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex-1 max-w-xs bg-gray-200 h-1 rounded-full overflow-hidden mr-4">
            <div
              className="bg-[#111111] h-full transition-all duration-300"
              style={{
                width: `${Math.min(100, ((scrollIdx + 4) / Math.max(1, filteredProducts.length)) * 100)}%`,
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={scrollIdx === 0}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={scrollIdx + 4 >= filteredProducts.length}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
