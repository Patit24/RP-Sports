"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { X, Star, ShoppingCart, Heart, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export default function QuickViewModal() {
  const { quickViewProduct, setQuickView, addToCart, toggleWishlist, wishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart({
      product: quickViewProduct,
      quantity: 1,
      selectedSize: selectedSize || quickViewProduct.sizes[0],
    });
    setQuickView(null);
  };

  return (
    <div className="fixed inset-0 z-[990] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickView(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#111111] text-white border border-white/10 shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setQuickView(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="relative aspect-square md:aspect-auto bg-black flex items-center justify-center p-6">
          <img
            src={quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            className="w-full h-full object-contain max-h-[420px]"
          />
          {quickViewProduct.badge && (
            <span className="absolute top-4 left-4 text-xs font-display font-bold uppercase tracking-wider px-3 py-1 bg-[#CC0000] text-white">
              {quickViewProduct.badge}
            </span>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div>
            <p className="text-xs text-[#CC0000] font-display font-bold uppercase tracking-widest mb-1">
              {quickViewProduct.brand} • {quickViewProduct.category}
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase text-white leading-tight mb-3">
              {quickViewProduct.name}
            </h2>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(quickViewProduct.rating) ? "fill-amber-400 text-amber-400" : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                {quickViewProduct.rating} ({quickViewProduct.reviewsCount} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-display font-black text-[#CC0000]">
                ₹{quickViewProduct.price.toLocaleString()}
              </span>
              {quickViewProduct.mrp > quickViewProduct.price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{quickViewProduct.mrp.toLocaleString()}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              {quickViewProduct.shortDescription || quickViewProduct.description}
            </p>

            {/* Sizes selector */}
            {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Select Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                        (selectedSize || quickViewProduct.sizes[0]) === sz
                          ? "border-[#CC0000] bg-[#CC0000] text-white"
                          : "border-white/20 text-white/70 hover:border-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-[#CC0000] hover:bg-[#990000] text-white font-display font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`w-12 h-12 border flex items-center justify-center transition-colors ${
                  isWishlisted
                    ? "border-[#CC0000] bg-[#CC0000]/20 text-[#CC0000]"
                    : "border-white/20 hover:border-white text-white"
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#CC0000]" : ""}`} />
              </button>
            </div>

            <Link
              href={`/product/${quickViewProduct.id}`}
              onClick={() => setQuickView(null)}
              className="block text-center text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors py-2"
            >
              View Full Product Details <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
