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
      className="group flex flex-col bg-white rounded-lg border border-gray-200 hover:border-[#CC0000] overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.badge && (
          <span
            className={`text-[10px] font-display font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm ${
              product.badge === "Sale"
                ? "bg-[#CC0000] text-white"
                : product.badge === "New"
                ? "bg-[#111111] text-white"
                : "bg-amber-600 text-white"
            }`}
          >
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="text-[10px] font-display font-bold bg-green-700 text-white px-2.5 py-1 rounded shadow-sm self-start">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Top Action Buttons (Wishlist & Compare) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleWishlist}
          className={`p-2 rounded-full border transition-all duration-300 cursor-pointer ${
            isWishlisted
              ? "text-[#CC0000] bg-red-50 border-red-200"
              : "text-gray-400 bg-white/90 backdrop-blur-sm border-gray-200 hover:text-[#CC0000] hover:bg-white"
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        <button
          type="button"
          onClick={handleCompare}
          className={`p-2 rounded-full border transition-all duration-300 cursor-pointer ${
            isCompared
              ? "text-blue-600 bg-blue-50 border-blue-200"
              : "text-gray-400 bg-white/90 backdrop-blur-sm border-gray-200 hover:text-blue-600 hover:bg-white"
          }`}
          title={isCompared ? "Remove from compare" : "Add to compare"}
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden flex items-center justify-center bg-gray-50 p-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ${
            hovered && product.images[1] ? "scale-105 opacity-0" : "scale-100 opacity-100"
          }`}
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4 transition-transform duration-700 ${
              hovered ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          />
        )}

        {/* Hover Quick View Overlay Button */}
        <div className="absolute inset-x-0 bottom-3 px-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleQuickView}
            className="w-full bg-[#111111]/90 hover:bg-[#CC0000] text-white font-display font-bold uppercase text-xs tracking-wider py-2.5 flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        <span className="text-[10px] font-display font-bold text-[#CC0000] uppercase tracking-widest mb-1 block">
          {product.brand}
        </span>
        <h3 className="font-semibold text-sm text-[#111111] leading-tight line-clamp-2 group-hover:text-[#CC0000] transition-colors mb-2">
          {product.name}
        </h3>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating) ? "fill-current text-amber-400" : "text-gray-200 fill-current"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-500 ml-1">({product.reviewsCount})</span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-end justify-between pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            {product.mrp > product.price && (
              <span className="text-xs font-medium line-through text-gray-400 mb-0.5">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-lg font-display font-black text-[#CC0000]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="h-9 px-3 rounded bg-[#CC0000] hover:bg-[#990000] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
