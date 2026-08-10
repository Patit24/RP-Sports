"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, ArrowLeft, RefreshCw } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Text search query matching
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.highlights.some((h) => h.toLowerCase().includes(q))
      );
    }

    // Brand filter
    if (selectedBrand !== "all") {
      result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchTerm, selectedBrand, sortBy]);

  const brands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-4 sm:px-8 max-w-[1600px] mx-auto">
      
      {/* Header & Search Bar Input */}
      <div className="mb-10">
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-500 hover:text-[#CC0000] mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-display font-black text-[#111111] uppercase mb-6">
          Search Results
        </h1>

        {/* Live Input Field */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cricket bats, willow grades, brands (RP Elite, 7070, AA)..."
            className="w-full h-14 pl-12 pr-4 bg-white border-2 border-gray-200 focus:border-[#CC0000] text-sm text-[#111111] font-medium outline-none transition-colors rounded-lg shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold uppercase text-gray-400 hover:text-[#CC0000]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
          <SlidersHorizontal className="w-4 h-4 text-[#CC0000]" />
          <span>
            Found <strong className="text-[#111111] font-bold">{filteredProducts.length}</strong> matching bats
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Brand Selector */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="h-10 px-3 bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-wider text-[#111111] outline-none rounded cursor-pointer"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-wider text-[#111111] outline-none rounded cursor-pointer"
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty Search Results State */
        <div className="bg-white border border-gray-200 p-12 text-center max-w-lg mx-auto rounded-lg shadow-sm my-8">
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#CC0000] flex items-center justify-center mx-auto mb-4 border border-red-100">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-display font-bold uppercase text-[#111111] mb-2">
            No Matching Bats Found
          </h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            We couldn't find any products matching "<span className="text-[#111111] font-semibold">{searchTerm}</span>". Try searching for "English Willow", "7070", or "Kashmir".
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedBrand("all");
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reset Search Filters
          </button>
        </div>
      )}

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-8">
          <div className="w-8 h-8 rounded-full border-t-2 border-[#CC0000] border-r-2 border-gray-300 animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
