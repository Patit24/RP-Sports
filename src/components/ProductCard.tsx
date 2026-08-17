"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { Heart, Star, ShoppingCart, Eye, Scale } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart, compareList, toggleCompare, setQuickView } = useStore();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product,
      quantity: 1,
      selectedColor: product.colors?.[0],
      selectedSize: product.sizes?.[0],
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickView(product);
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-neutral-900/80 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 cursor-pointer"
    >
      {/* ── Top Badges & Status ── */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.stock === 0 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-display font-black tracking-widest uppercase bg-neutral-950/90 text-rose-300 border border-rose-500/30 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            OUT OF STOCK
          </span>
        ) : product.badge ? (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-display font-black uppercase tracking-widest shadow-sm ${
              product.badge === "Sale"
                ? "bg-[#CC0000] text-white"
                : product.badge === "New" || product.badge === "New Arrival"
                ? "bg-neutral-950 text-white"
                : product.badge === "Bestseller" || product.badge === "Trending"
                ? "bg-amber-500 text-neutral-950 font-black"
                : "bg-neutral-900 text-white"
            }`}
          >
            {product.badge}
          </span>
        ) : null}

        {discount > 0 && product.stock > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight bg-emerald-600 text-white shadow-sm self-start">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* ── Top Floating Action Buttons (Wishlist & Compare) ── */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleWishlist}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm ${
            isWishlisted
              ? "text-[#CC0000] bg-red-50 border-red-200 scale-105"
              : "text-neutral-500 bg-white/90 backdrop-blur-md border-slate-200/80 hover:text-[#CC0000] hover:bg-white hover:border-neutral-400 hover:scale-110 active:scale-95"
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        <button
          type="button"
          onClick={handleCompare}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm ${
            isCompared
              ? "text-blue-600 bg-blue-50 border-blue-200 scale-105"
              : "text-neutral-500 bg-white/90 backdrop-blur-md border-slate-200/80 hover:text-blue-600 hover:bg-white hover:border-neutral-400 hover:scale-110 active:scale-95"
          }`}
          title={isCompared ? "Remove from compare" : "Add to compare"}
          aria-label="Compare"
        >
          <Scale className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Product Image Showcase Canvas ── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-neutral-50/90 via-neutral-100/50 to-neutral-50/90 p-6 border-b border-slate-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-contain mix-blend-multiply transition-all duration-700 ease-out ${
            hovered && product.images[1] ? "scale-108 opacity-0" : "scale-100 group-hover:scale-108 opacity-100"
          }`}
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-contain mix-blend-multiply p-6 transition-all duration-700 ease-out ${
              hovered ? "scale-108 opacity-100" : "scale-95 opacity-0"
            }`}
          />
        )}

        {/* Floating Quick View Bar on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 z-10">
          <button
            type="button"
            onClick={handleQuickView}
            className="w-full bg-neutral-950/90 hover:bg-[#CC0000] text-white font-display font-black uppercase text-[11px] tracking-widest py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-black/20 backdrop-blur-md cursor-pointer"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* ── Product Information & Specs ── */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow bg-white">
        {/* Brand & Subcategory Kicker */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest truncate">
            {product.brand}
          </span>
          {product.subcategory && (
            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded shrink-0">
              {product.subcategory.replace(/-/g, " ")}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 
          className="font-display font-bold text-[15px] sm:text-base text-neutral-900 leading-snug line-clamp-2 group-hover:text-[#CC0000] transition-colors duration-300 mb-2"
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          {product.name}
        </h3>

        {/* Ratings Pill */}
        <div className="flex items-center gap-2 mb-3.5">
          <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-900 font-mono">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{(product.rating || 4.8).toFixed(1)}</span>
          </div>
          <span className="text-[11px] font-medium text-neutral-400">
            ({product.reviewsCount || product.reviewCount || 0} reviews)
          </span>
        </div>

        {/* ── Price & CTA Action Footer ── */}
        <div className="mt-auto flex items-end justify-between pt-3 border-t border-slate-100 gap-2">
          <div className="flex flex-col min-w-0">
            {product.mrp > product.price && (
              <span className="text-[11px] font-mono font-medium line-through text-neutral-400 mb-0.5">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span 
                className="text-lg sm:text-xl font-display font-black text-neutral-950 tracking-tight"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {product.stock === 0 ? (
            <span className="h-9 px-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-400 font-display font-black text-[11px] uppercase tracking-wider flex items-center justify-center cursor-not-allowed shrink-0" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Out of Stock
            </span>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-9.5 px-4 rounded-xl bg-neutral-950 hover:bg-[#CC0000] text-white font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm hover:shadow-md hover:shadow-red-600/20 shrink-0"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
