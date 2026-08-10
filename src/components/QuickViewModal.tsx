"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { X, Star, ShoppingCart, Heart, ArrowRight, ShieldCheck, Truck, Zap } from "lucide-react";

export default function QuickViewModal() {
  const router = useRouter();
  const { quickViewProduct, setQuickView, addToCart, toggleWishlist, wishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart({
      product: quickViewProduct,
      quantity: 1,
      selectedSize: selectedSize || quickViewProduct.sizes?.[0],
    });
    setQuickView(null);
  };

  const handleBuyNow = () => {
    addToCart({
      product: quickViewProduct,
      quantity: 1,
      selectedSize: selectedSize || quickViewProduct.sizes?.[0],
    });
    setQuickView(null);
    router.push("/checkout");
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
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="relative aspect-square md:aspect-auto bg-black flex items-center justify-center p-6">
          <img
            src={quickViewProduct.image || quickViewProduct.images?.[0]}
            alt={quickViewProduct.name}
            className="w-full h-full object-contain max-h-[420px]"
          />
          {quickViewProduct.badge && (
            <span className="absolute top-4 left-4 bg-[#CC0000] text-white text-xs font-bold uppercase tracking-widest px-3 py-1">
              {quickViewProduct.badge}
            </span>
          )}
        </div>

        {/* Right: Details & CTAs */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000] block mb-1">
              {quickViewProduct.brand}
            </span>
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-white mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {quickViewProduct.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4 text-xs">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(quickViewProduct.rating) ? "fill-current" : "opacity-30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400 font-bold">({quickViewProduct.reviewsCount || quickViewProduct.reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-black text-[#CC0000]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                ₹{quickViewProduct.price.toLocaleString()}
              </span>
              {(quickViewProduct.mrp || quickViewProduct.originalPrice) > quickViewProduct.price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{(quickViewProduct.mrp || quickViewProduct.originalPrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-gray-300 leading-relaxed mb-6 font-medium">
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
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
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

          {/* Action CTAs: Add to Cart & Buy Now */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="h-12 bg-white/10 hover:bg-white/20 text-white font-display font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-lg"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="h-12 bg-[#CC0000] hover:bg-[#990000] text-white font-display font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-lg shadow-lg shadow-[#CC0000]/30"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                <Zap className="w-4 h-4 fill-current" /> Buy Now
              </button>
            </div>

            <div className="flex justify-between items-center text-xs">
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                  isWishlisted ? "text-[#CC0000]" : "text-white/70 hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#CC0000]" : ""}`} />
                <span>{isWishlisted ? "In Wishlist" : "Add to Wishlist"}</span>
              </button>

              <Link
                href={`/product/${quickViewProduct.id}`}
                onClick={() => setQuickView(null)}
                className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
              >
                Full Product Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
