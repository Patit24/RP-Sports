"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { CATEGORIES, BRANDS } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";
import { 
  Filter, Grid, List, Search, SlidersHorizontal, 
  ArrowUpDown, RefreshCw, X, Star, ShoppingCart, Heart
} from "lucide-react";
import Link from "next/link";

export default function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, categories, addToCart, toggleWishlist, wishlist } = useStore();

  // States
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(30000);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active category list
  const activeCategories = categories && categories.length > 0 ? categories : CATEGORIES;

  // Read URL params
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");

  useEffect(() => {
    if (categoryParam) {
      setSelectedSport(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    } else {
      setSelectedSubcategory("");
    }
  }, [subcategoryParam]);

  // Clean all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSport("");
    setSelectedSubcategory("");
    setSelectedBrand("");
    setPriceRange(30000);
    setSelectedRating(null);
    setOnlyInStock(false);
    setSortBy("popular");
    router.replace("/shop");
  };

  const handleSportChange = (sportId: string) => {
    setSelectedSport(sportId);
    setSelectedSubcategory("");
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesName = prod.name.toLowerCase().includes(q);
          const matchesDesc = prod.description.toLowerCase().includes(q);
          const matchesSku = prod.sku.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesSku) return false;
        }
        if (selectedSport && prod.category !== selectedSport) return false;
        if (selectedSubcategory && prod.subcategory !== selectedSubcategory) return false;
        if (selectedBrand && prod.brand !== selectedBrand) return false;
        if (prod.price > priceRange) return false;
        if (selectedRating && prod.rating < selectedRating) return false;
        if (onlyInStock && prod.stock <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return a.id.localeCompare(b.id); 
        return b.reviewsCount - a.reviewsCount;
      });
  }, [products, searchQuery, selectedSport, selectedSubcategory, selectedBrand, priceRange, selectedRating, onlyInStock, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 text-foreground pb-28 md:pb-10 pt-20 md:pt-32">
      
      {/* Banner / Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <div className="flex gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <span className="text-primary">Shop</span>
              {selectedSport && (
                <>
                  <span>/</span>
                  <span className="text-primary">{activeCategories.find(c => c.id === selectedSport)?.name || selectedSport}</span>
                </>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-primary tracking-tight">
              {selectedSport ? activeCategories.find(c => c.id === selectedSport)?.name : "All Products"}
            </h1>
            {selectedSubcategory && (
              <span className="inline-block mt-2 bg-slate-100 border border-slate-200 text-xs font-bold font-mono tracking-widest text-[#CC0000] px-3 py-1 rounded">
                TAG: {selectedSubcategory.toUpperCase()}
              </span>
            )}
            <p className="text-secondary mt-2 text-sm md:text-base">Showing {filteredProducts.length} items</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-accent outline-none rounded-lg pl-9 pr-3 py-2.5 text-sm font-medium transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-primary">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-bold uppercase tracking-wider text-primary shadow-sm"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR FILTERS (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24 shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-sm tracking-widest text-primary uppercase flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold uppercase text-accent hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Department */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-primary uppercase mb-3">Categories</h4>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 text-sm font-medium cursor-pointer group">
                    <input
                      type="radio"
                      name="sportRadio"
                      checked={selectedSport === ""}
                      onChange={() => handleSportChange("")}
                      className="w-4 h-4 text-accent border-slate-300 focus:ring-accent"
                    />
                    <span className={selectedSport === "" ? "text-primary font-bold" : "text-slate-600 group-hover:text-primary"}>All Categories</span>
                  </label>
                  {activeCategories.map((cat) => (
                    <div key={cat.id} className="space-y-1.5">
                      <label className="flex items-center gap-3 text-sm font-medium cursor-pointer group">
                        <input
                          type="radio"
                          name="sportRadio"
                          checked={selectedSport === cat.id}
                          onChange={() => handleSportChange(cat.id)}
                          className="w-4 h-4 text-accent border-slate-300 focus:ring-accent"
                        />
                        <span className={selectedSport === cat.id ? "text-primary font-bold" : "text-slate-600 group-hover:text-primary"}>{cat.name}</span>
                      </label>

                      {/* Accordion Subcategories List */}
                      {selectedSport === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-7 pr-2 py-1 space-y-1 flex flex-col border-l border-slate-200 ml-2">
                          <button
                            onClick={() => setSelectedSubcategory("")}
                            className={`text-left text-xs py-1 transition-colors cursor-pointer ${
                              selectedSubcategory === "" ? "text-accent font-bold" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            All {cat.name}
                          </button>
                          {cat.subcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => setSelectedSubcategory(sub)}
                              className={`text-left text-xs py-1 transition-colors font-mono uppercase tracking-wider cursor-pointer ${
                                selectedSubcategory === sub ? "text-accent font-bold" : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              - {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="mb-6 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-primary uppercase mb-3">Brands</h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  <label className="flex items-center gap-3 text-sm font-medium cursor-pointer group">
                    <input
                      type="radio"
                      name="brandRadio"
                      checked={selectedBrand === ""}
                      onChange={() => setSelectedBrand("")}
                      className="w-4 h-4 text-accent border-slate-300 focus:ring-accent"
                    />
                    <span className={selectedBrand === "" ? "text-primary font-bold" : "text-slate-600 group-hover:text-primary"}>All Brands</span>
                  </label>
                  {BRANDS.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 text-sm font-medium cursor-pointer group">
                      <input
                        type="radio"
                        name="brandRadio"
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                        className="w-4 h-4 text-accent border-slate-300 focus:ring-accent"
                      />
                      <span className={selectedBrand === brand ? "text-primary font-bold" : "text-slate-600 group-hover:text-primary"}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-primary uppercase">Price Range</h4>
                  <span className="text-xs font-bold text-primary bg-slate-100 px-2 py-1 rounded">Up to ₹{priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={30000}
                  step={500}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-accent h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Rating Filter */}
              <div className="mb-6 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-primary uppercase mb-3">Customer Rating</h4>
                <div className="space-y-1">
                  {[4.5, 4, 3].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedRating(selectedRating === val ? null : val)}
                      className={`flex items-center gap-2 text-sm font-medium w-full text-left cursor-pointer transition-colors px-2 py-1.5 rounded-md ${
                        selectedRating === val ? "bg-slate-100 text-primary font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${selectedRating === val ? "text-yellow-400 fill-current" : "text-slate-300 fill-current"}`} />
                      <span>{val.toFixed(1)} & Up</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <label className="text-xs font-bold text-primary uppercase cursor-pointer select-none">
                  In Stock Only
                </label>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-11 h-6 bg-slate-200 rounded-full appearance-none cursor-pointer border-transparent checked:bg-accent transition-colors peer focus:ring-0"
                  />
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 peer-checked:translate-x-5 transition-transform pointer-events-none shadow-sm" />
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 rounded-xl p-3 mb-6 shadow-sm gap-4">
              <span className="text-sm font-medium text-slate-500 hidden sm:block px-2">
                Showing {filteredProducts.length} results
              </span>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-sm font-medium text-primary rounded-lg py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-accent outline-none cursor-pointer"
                  >
                    <option value="popular">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rating</option>
                    <option value="newest">Latest Arrivals</option>
                  </select>
                </div>
                
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-primary"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-primary"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid / List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">No products found</h3>
                <p className="text-slate-500 max-w-sm mb-6">
                  We couldn't find anything matching your current filters. Try adjusting them or searching for something else.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-accent transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {filteredProducts.map((product) => {
                  const isDiscounted = product.mrp > product.price;
                  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
                  const isWishlisted = wishlist.includes(product.id);

                  return (
                    <div 
                      key={product.id}
                      className="group flex flex-col sm:flex-row gap-6 p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-neutral-900/80 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-500 cursor-pointer relative overflow-hidden"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      {/* Image Canvas */}
                      <div className="w-full sm:w-52 aspect-square sm:aspect-auto bg-gradient-to-b from-neutral-50 via-neutral-100/50 to-neutral-50 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center p-4 border border-slate-100">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-all duration-700 ease-out"
                        />
                        {/* Top Badge */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
                          {product.stock === 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-display font-black tracking-widest uppercase bg-neutral-950/90 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                              <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                              OUT OF STOCK
                            </span>
                          ) : product.badge ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-display font-black uppercase tracking-widest bg-neutral-950 text-white shadow-sm">
                              {product.badge}
                            </span>
                          ) : null}
                          {isDiscounted && product.stock > 0 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-600 text-white self-start">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            {product.brand}
                          </span>
                          {product.subcategory && (
                            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                              {product.subcategory.replace(/-/g, " ")}
                            </span>
                          )}
                        </div>

                        <h3 
                          className="font-display font-bold text-lg sm:text-xl text-neutral-900 leading-snug mb-1.5 group-hover:text-[#CC0000] transition-colors duration-300"
                          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                        >
                          {product.name}
                        </h3>

                        <p className="text-neutral-500 text-xs line-clamp-2 max-w-2xl mb-3 leading-relaxed">
                          {product.shortDescription || product.description}
                        </p>
                        
                        {/* Rating Pill */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-900 font-mono">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{(product.rating || 4.8).toFixed(1)}</span>
                          </div>
                          <span className="text-xs font-medium text-neutral-400">
                            ({product.reviewsCount || product.reviewCount || 0} reviews)
                          </span>
                        </div>
                        
                        {/* Price & Action */}
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 gap-4">
                          <div className="flex items-baseline gap-2">
                            <span 
                              className="text-2xl font-display font-black text-neutral-950 tracking-tight"
                              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                            >
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {isDiscounted && (
                              <span className="text-xs font-mono font-medium line-through text-neutral-400">
                                ₹{product.mrp.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                toggleWishlist(product.id); 
                              }}
                              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                isWishlisted 
                                  ? "text-[#CC0000] bg-red-50 border-red-200" 
                                  : "text-neutral-400 border-slate-200 hover:text-[#CC0000] hover:border-neutral-400 hover:bg-neutral-50"
                              }`}
                              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                              aria-label="Wishlist"
                            >
                              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                            </button>

                            {product.stock === 0 ? (
                              <span 
                                className="h-9.5 px-4 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-400 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center cursor-not-allowed"
                                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                              >
                                Out of Stock
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  addToCart({
                                    product,
                                    quantity: 1,
                                    selectedColor: product.colors?.[0],
                                    selectedSize: product.sizes?.[0],
                                  });
                                }}
                                className="h-9.5 px-5 rounded-xl bg-neutral-950 hover:bg-[#CC0000] text-white font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm hover:shadow-md hover:shadow-red-600/20"
                                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                              >
                                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm cursor-pointer" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[85vw] max-w-sm bg-white h-full z-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100">
              <h3 className="font-black text-lg uppercase tracking-wide text-primary">Filters</h3>
              <button onClick={() => setSidebarOpen(false)} className="p-2 cursor-pointer bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {/* Similar filter contents as desktop, omitted for brevity, but could be duplicated here */}
              {/* Department */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase mb-3 tracking-widest">Categories</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
                    <input type="radio" name="sportRadioMob" checked={selectedSport === ""} onChange={() => handleSportChange("")} className="w-4 h-4 text-accent border-slate-300 focus:ring-accent" />
                    <span className="text-slate-700">All Categories</span>
                  </label>
                  {activeCategories.map((cat) => (
                    <div key={cat.id} className="space-y-2">
                      <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
                        <input type="radio" name="sportRadioMob" checked={selectedSport === cat.id} onChange={() => handleSportChange(cat.id)} className="w-4 h-4 text-accent border-slate-300 focus:ring-accent" />
                        <span className="text-slate-700">{cat.name}</span>
                      </label>

                      {/* Accordion Subcategories List Mobile */}
                      {selectedSport === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-6 space-y-1.5 flex flex-col border-l border-slate-200 ml-2">
                          <button
                            onClick={() => { setSelectedSubcategory(""); setSidebarOpen(false); }}
                            className={`text-left text-xs py-1 transition-colors ${
                              selectedSubcategory === "" ? "text-accent font-bold" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            All {cat.name}
                          </button>
                          {cat.subcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => { setSelectedSubcategory(sub); setSidebarOpen(false); }}
                              className={`text-left text-xs py-1 transition-colors font-mono uppercase tracking-wider ${
                                selectedSubcategory === sub ? "text-accent font-bold" : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              - {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Price Range</h4>
                  <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">Up to ₹{priceRange.toLocaleString()}</span>
                </div>
                <input type="range" min={1000} max={30000} step={500} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-accent h-1.5 bg-slate-200 rounded-lg appearance-none" />
              </div>
              
              {/* Stock */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">In Stock Only</label>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-5 h-5 rounded text-accent border-slate-300 focus:ring-accent"
                />
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-slate-100 flex gap-3">
              <button onClick={() => { resetFilters(); setSidebarOpen(false); }} className="flex-1 py-3 bg-slate-100 text-primary text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-slate-200 transition-colors">
                Reset
              </button>
              <button onClick={() => setSidebarOpen(false)} className="flex-1 py-3 bg-primary text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
